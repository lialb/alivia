"use client";

import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { StateContext } from "../states";
import { PinkButton } from "../PinkButton";
import { getImagePath } from "@/utils";
const Rewards = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const { setState } = useContext(StateContext);

  const images = [
    { src: "/art-1.jpeg", alt: "art 1" },
    { src: "/art-2.jpeg", alt: "art 2" },
    { src: "/art-3.jpeg", alt: "art 3" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500); // Change image every 2.5 seconds

    // Show button after 10 seconds
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="bg-pink-100 min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl h-[70vh] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={getImagePath(image.src)}
              alt={image.alt}
              fill
              style={{ objectFit: "contain" }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {showButton && (
        <div className="mt-8 transition-opacity duration-1000 ease-in-out opacity-100">
          <PinkButton css="h-12 w-24" onClick={() => setState("letter")}>
            Proceed
          </PinkButton>
        </div>
      )}
    </div>
  );
};

export default Rewards;
