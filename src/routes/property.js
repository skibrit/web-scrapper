import express from "express";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import config from "config";
const { validationResult, check } = require("express-validator");
const router = express.Router();
const scrapeUrl = config.get("scrapeUrl");

let validationRules = [
  check("state", "State is required").not().isEmpty(),
  check("name", "Name is required").not().isEmpty()
];

router.post("/scrape", [validationRules], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { state, name } = req.body;
    const url = scrapeUrl[state];

    if (!url) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid State provided" }] });
    }

    //data list
    const headers = [];
    const propertyList = [];

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
          headers.push($(this).text());
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
          propertyList.push(property);
        });

        for (let k = 0; k < propertyList.length; k++) {
          //go to details page
          let p = propertyList[k];
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

          console.log(`UlList ${ulList.length}`);

          await takeShot(page, k + "_p");
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
          headers.push($(this).text());
        });

        tbody.find("tr").each(function(k) {
          if (k > 0) {
            const tr = $(this);
            const property = {};
            tr.find("td").each(function(i) {
              const td = $(this);
              if (i == 0) {
                property.link = td.find("a").attr("href");
                property[headers[i]] = td.find("a").text().trim();
              } else {
                property[headers[i]] = td.text().trim();
              }
            });
            propertyList.push(property);
          }
        });
      }
    }
    res.json(propertyList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

const takeShot = async (page, title) => {
  await page.screenshot({ path: `browser/${title}.png`, fullPage: true });
};

module.exports = router;
