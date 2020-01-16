import React from "react";
import { Carousel } from "react-responsive-carousel";
import ImageLoader from "../ImageLoader/ImageLoader";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./slider.scss";

const Slider = ({ images }) => {
  return (
    <Carousel showThumbs={false}>
      {images &&
        images.map(({ key, url }) => {
          return (
            <div key={key} index={key}>
              <ImageLoader src={url} />
            </div>
          );
        })}
    </Carousel>
  );
};

export default Slider;
