"use client";

import React, { useState, useEffect, useContext, useRef } from "react";

import Image from "next/image";
import classNames from "classnames";

import { StateContext } from "@/components/states";
import { PinkButton } from "@/components/PinkButton";

type FloatingImage = {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  src: string;
};

const GirlfriendLandingPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [isCorrectName, setIsCorrectName] = useState<boolean>(false);
  const [showPuzzle, setShowPuzzle] = useState<boolean>(false);
  const [floatingImages, setFloatingImages] = useState<FloatingImage[]>([]);
  const [flowers, setFlowers] = useState<
    { id: number; x: number; y: number; size: number; bloom: number }[]
  >([]);
  // Add state for the exit animation
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const { setState } = useContext(StateContext);

  // Initialize floating images
  useEffect(() => {
    const images: FloatingImage[] = [];
    for (let i = 0; i < 7; i++) {
      images.push({
        id: i,
        x: Math.random() * 80,
        y: Math.random() * 80,
        speedX: Math.random() - 0.9,
        speedY: Math.random() - 0.9,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        src: `/gf-${i}.png`,
      });
    }
    setFloatingImages(images);

    // Animation frame for floating images
    const animateImages = () => {
      setFloatingImages((prevImages) =>
        prevImages.map((img) => {
          let newX = img.x + img.speedX;
          let newY = img.y + img.speedY;
          let newSpeedX = img.speedX;
          let newSpeedY = img.speedY;

          // Bounce off edges
          if (newX < 0 || newX > 90) {
            newSpeedX = -img.speedX;
            newX = newX < 0 ? 0 : 90;
          }
          if (newY < 0 || newY > 90) {
            newSpeedY = -img.speedY;
            newY = newY < 0 ? 0 : 90;
          }

          return {
            ...img,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
            rotation: (img.rotation + img.rotationSpeed) % 360,
          };
        })
      );
      animationFrameId = requestAnimationFrame(animateImages);
    };

    let animationFrameId = requestAnimationFrame(animateImages);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle name submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.toLowerCase() === "olivia") {
      setIsCorrectName(true);
      createFlowers();

      // Show puzzle after flower animation
      setTimeout(() => {
        setShowPuzzle(true);
      }, 3000);
    }
  };

  // Create flowers when correct name is entered
  const createFlowers = () => {
    const newFlowers = [];
    for (let i = 0; i < 30; i++) {
      newFlowers.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 10 + Math.random() * 20,
        bloom: 0,
      });
    }
    setFlowers(newFlowers);

    // Animate flower blooming
    let bloomProgress = 0;
    const bloomInterval = setInterval(() => {
      bloomProgress += 0.05;
      setFlowers((prevFlowers) =>
        prevFlowers.map((flower) => ({
          ...flower,
          bloom: Math.min(1, bloomProgress),
        }))
      );

      if (bloomProgress >= 1) {
        clearInterval(bloomInterval);
      }
    }, 50);
  };

  // Handle transition to puzzle
  const handleProceedToPuzzle = () => {
    // Start exit animation
    setIsExiting(true);

    // Wait for animation to complete before changing state
    setTimeout(() => {
      setState("crossword");
    }, 1000); // Match this duration with the CSS transition time
  };

  return (
    <div
      ref={mainContainerRef}
      className={`relative h-screen w-full overflow-hidden bg-pink-100 transition-all duration-1000 ease-in-out ${
        isExiting ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-pink-300 to-purple-200"></div>

      {/* Floating images */}
      {floatingImages.map((img) => (
        <div
          key={img.id}
          className={`absolute w-32 h-32 rounded-full overflow-hidden shadow-lg transition-all duration-1000 ${
            isExiting ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
          style={{
            left: `${img.x}%`,
            top: `${img.y}%`,
            transform: `rotate(${img.rotation}deg)`,
            transitionDelay: `${img.id * 50}ms`,
            transition:
              "transform 0.2s ease-out, opacity 0.8s ease-in-out, scale 0.8s ease-in-out",
          }}
        >
          <Image alt="girlfriend" src={img.src} width={160} height={160} />
        </div>
      ))}

      {/* Flowers */}
      {isCorrectName &&
        flowers.map((flower) => (
          <div
            key={flower.id}
            className={classNames("absolute transition-opacity duration-800", {
              "opacity-0": isExiting,
              "opacity-100": !isExiting,
            })}
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              zIndex: 20,
              transitionDelay: `${(flower.id % 10) * 30}ms`,
            }}
          >
            <div
              className="transition-all duration-1000 ease-out origin-center"
              style={{
                width: `${flower.size * flower.bloom}px`,
                height: `${flower.size * flower.bloom}px`,
                opacity: flower.bloom,
              }}
            >
              <div className="relative w-full h-full">
                {/* Flower petals */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 bg-pink-300 rounded-full opacity-80"
                    style={{
                      transformOrigin: "center",
                      transform: `rotate(${i * 72}deg) translateY(-50%) scale(${
                        0.7 + flower.bloom * 0.3
                      })`,
                      width: "80%",
                      height: "40%",
                      left: "10%",
                      top: "50%",
                    }}
                  ></div>
                ))}
                {/* Flower center */}
                <div
                  className="absolute rounded-full bg-yellow-300"
                  style={{
                    width: "40%",
                    height: "40%",
                    left: "30%",
                    top: "30%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}

      <div className="relative flex flex-col items-center justify-center h-full z-10">
        <div
          className={classNames(
            "w-full max-w-md p-8 mx-auto bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-1000 ease-in-out",
            {
              "opacity-0 translate-y-20": isExiting,
              "opacity-100 translate-y-0": !isExiting,
            }
          )}
        >
          {!isCorrectName ? (
            <>
              <h1 className="text-4xl font-bold text-center mb-8 text-pink-500 animate-pulse">
                Hello there! 💕
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-medium text-pink-600 mb-2"
                  >
                    What's your name?
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-medium rounded-lg shadow-md hover:from-pink-500 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 transform transition hover:scale-105 cursor-pointer"
                >
                  ✨ Enter ✨
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 text-pink-500">
                Welcome, Olivia! 💖
              </h1>

              {showPuzzle && (
                <div className="mt-6 animate-fadeIn">
                  <p className="text-2xl font-medium text-pink-600 mb-4 animate-bounce">
                    In order to claim your prize,
                  </p>
                  <p className="text-2xl font-bold text-pink-600 animate-pulse">
                    you must solve this puzzle:
                  </p>

                  <div className="py-3">
                    <PinkButton onClick={handleProceedToPuzzle}>
                      Proceed to puzzle
                    </PinkButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .animate-fadeOut {
          animation: fadeOut 1s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default GirlfriendLandingPage;
