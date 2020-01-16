import express from "express";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import config from "config";
import Property from "../schemas/Property";
import Multer from "multer";
import aws from "aws-sdk";
import MulterS3 from "multer-s3";
import path from "path";
import { convertAddressToGeoCode } from "../utils/GeoMap";
const { validationResult, check } = require("express-validator");
const router = express.Router();

const scrapeUrl = config.get("scrapeUrl");
const awsConfig = config.get("aws");
const google = config.get("google");

// @ROUTE : GET api/property
// @DESC  : This route will return all the user in the database. Default sort is desc
// @Access : Public
router.get("/", async (req, res) => {
  try {
    const propertyList = await Property.find();
    res.json(propertyList);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
});

// @ROUTE : GET api/property
// @DESC  : This route will return all the user in the database. Default sort is desc
// @Access : Public
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(404).send("Not found");
    }
    console.log("entered");
    const property = await Property.findOne({ _id: code });
    if (!property) {
      return res.status(404).send("Not found");
    }
    res.json({ property, apiKey: google.apiKey });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).send("Not found");
    }
    return res.status(500).send("Server error");
  }
});

// @ROUTE : GET api/property/search
// @DESC  : This route will return all the user in the database. Default sort is desc
// @Access : Public

let validationRules = [
  check("searchTerm", "Search Term is required").not().isEmpty()
];
router.post("/search", validationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { searchTerm } = req.body;
    const reges = new RegExp(`^${searchTerm}$`, "i");
    const property = await Property.find({
      $or: [{ name: reges }, { city: reges }, { state: reges }]
    });
    res.json(property);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

// @ROUTE : GET api/property
// @DESC  : This route will return all the user in the database. Default sort is desc
// @Access : Public

validationRules = [
  check("state", "State is required").not().isEmpty(),
  check("name", "Name is required").not().isEmpty()
];

router.post("/scrape", [validationRules], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const country = `usa`;
    const { state, name } = req.body;
    const url = scrapeUrl[state];

    if (!url) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid State provided" }] });
    }

    //data list
    const headers = [];
    const scrapedPropertyList = [];
    const finalPropertyList = [];

    //create a new page go to the url
    const browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(url);

    if (state == "texas") {
      const tabLinks = await page.$$(".tp3last");
      await tabLinks[0].click();
      await page.type("#searchterm", name);
      const forms = await page.$$("form");
      await forms[1].focus();
      await page.keyboard.press("Enter");

      await page.waitForNavigation({ waitUntil: "networkidle0" });

      let html = await page.evaluate(() => document.body.innerHTML);
      let $ = cheerio.load(html);
      const table = $(".sortabletable");
      const thead = table.find("th");
      const tbody = table.find("tbody");
      if (tbody.length > 0) {
        thead.each(function() {
          headers.push($(this).text().toLowerCase());
        });

        tbody.each(function() {
          const tr = $(this);
          const property = {};
          tr.find("td").each(function(i) {
            const td = $(this);
            if (i == 0) {
              property.link = td.find("a").attr("href");
              property[headers[i]] = td.find("a").text();
            } else {
              property[headers[i]] = td.text();
            }
          });
          scrapedPropertyList.push(property);
        });

        for (let k = 0; k < scrapedPropertyList.length; k++) {
          //go to details page
          let p = scrapedPropertyList[k];
          page = await browser.newPage();
          await page.goto(`${scrapeUrl.texasProperty}${p.link}`);
          html = await page.evaluate(() => document.body.innerHTML);
          $ = cheerio.load(html);

          let contentWrapper = $(".p7tp3-col-wrapper");
          let ulList = contentWrapper.find("li");

          ulList.each(function() {
            let text = $(this).text().toLowerCase();
            if (text.search("bed") > -1) {
              const textArr = text.split(":");
              p.capacity =
                textArr && textArr.length > 1 ? textArr[1].trim() : 0;
            }
          });

          finalPropertyList.push({
            code: p["link"]
              .substring(p["link"].indexOf("prov_no"), p["link"].indexOf("&"))
              .split("=")[1],
            name: p["provider"],
            address: p["address"],
            city: p["city"],
            zipCode: p["zip code"],
            country: p["country"],
            phone: p["phone"],
            type: p["type"],
            capacity: p["capacity"],
            state,
            country
          });
        }
      }
    } else if (state == "florida") {
      await page.select("select", "ALL");
      await page.type("#ctl00_mainContentPlaceHolder_FacilityName", name);
      page.click("#ctl00_mainContentPlaceHolder_SearchButton");
      await page.waitForNavigation({ waitUntil: "networkidle0" });

      const html = await page.evaluate(() => document.body.innerHTML);
      const $ = cheerio.load(html);
      const table = $("#ctl00_mainContentPlaceHolder_dgFacilities");
      const thead = table.find(".tableResultsHead");
      const tbody = table.find("tbody");

      if (tbody.find("tr").length > 1) {
        thead.find("td").each(function() {
          headers.push($(this).text().toLowerCase());
        });

        tbody.find("tr").each(function(k) {
          if (k > 0) {
            const tr = $(this);
            const property = {};
            tr.find("td").each(function(i) {
              const td = $(this);
              property[headers[i]] = td.text().trim();
            });
            scrapedPropertyList.push(property);
          }
        });

        for (let p of scrapedPropertyList) {
          const arr = p["name"].split("-");
          finalPropertyList.push({
            code: arr[1].trim(),
            name: arr[0].trim(),
            address: p["street address"],
            city: p["city"],
            zipCode: p["zip"],
            country: p["country"],
            phone: p["phone number"],
            type: p["type"],
            capacity: p["licensed beds"],
            country,
            state
          });
        }
      }
    }

    res.json(finalPropertyList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @ROUTE : GET api/property
// @DESC  : This route will return all the user in the database. Default sort is desc
// @Access : Public

validationRules = [
  check("state", "State is required").not().isEmpty(),
  check("name", "Name is required").not().isEmpty(),
  check("code", "Code is required").not().isEmpty(),
  check("address", "Address is required").not().isEmpty(),
  check("city", "City is required").not().isEmpty(),
  check("phone", "Phone is required").not().isEmpty(),
  check("type", "Type is required").not().isEmpty(),
  check("capacity", "Capacity is required").not().isEmpty(),
  check("country", "Country is required").not().isEmpty()
];

const s3 = new aws.S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  bucket: awsConfig.bucket
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    console.log(`Error file`);
    cb("Please enter a valid image");
  }
}

const upload = Multer({
  storage: MulterS3({
    s3: s3,
    bucket: awsConfig.bucket,
    acl: "public-read",
    ContentDisposition: "inline",
    contentType: MulterS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 1000000 }, // In bytes: 1000000 bytes = 1 MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

router.post(
  "/save",
  [upload.array("files"), validationRules],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      console.log(req.body);
      const uploadedImages = req.files;
      console.log(req.body);
      const {
        name,
        code,
        address,
        city,
        phone,
        type,
        capacity,
        state,
        zipCode,
        country
      } = req.body;

      let propertyExist = await Property.findOne({ code, state });
      if (propertyExist) {
        return res
          .status(400)
          .json({ errors: [{ msg: "This property has already been saved" }] });
      }
      const property = new Property({
        name,
        code,
        address,
        city,
        phone,
        type,
        capacity,
        state,
        zipCode,
        country
      });

      const imageFiles = [];

      for (let im of uploadedImages) {
        imageFiles.push({
          key: im.key,
          url: im.location
        });
      }

      property.images = imageFiles;

      const { latitude, longitude } = await convertAddressToGeoCode(address);

      property.latitude = latitude;
      property.longitude = longitude;

      await property.save();

      res.json({ msg: "Property has been saved successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

router.post("/upload", [upload.array("files")], async (req, res) => {
  try {
    var file = req.files;
    console.log(file);
    //  res.send("Successfully uploaded " + req.files.length + " files!");
    res.json({ msg: "Property has been saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

const takeShot = async (page, title) => {
  await page.screenshot({ path: `browser/${title}.png`, fullPage: true });
};

module.exports = router;
