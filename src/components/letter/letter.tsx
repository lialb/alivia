import { useEffect, useState } from "react";

import classNames from "classnames";

const AnimatedLetter = () => {
  // Parse the letter into lines and words
  const LETTER = `
Dearest Olivia,
Wow! A whole year :)
Can you believe it's been this long?
Season 1 was a rollercoaster.
We've been to 4 countries.
Had a lot of adventures.
Eaten so much food. 
(we fat)
I'm so grateful for all the memories we've made together.
Thank you for being so kind. So patient. So understanding.
I love you.
I'm so lucky to have you in my life.
I can't wait for season 2. 
Love,
Albert
`
    .trim()
    .split("\n");

  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [visibleWords, setVisibleWords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Show each line with a 2-second delay
    LETTER.forEach((line, lineIndex) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, lineIndex]);

        // For each word in the line, show it with a small delay
        const words = line.split(" ");
        words.forEach((word, wordIndex) => {
          setTimeout(() => {
            setVisibleWords((prev) => ({
              ...prev,
              [`${lineIndex}-${wordIndex}`]: true,
            }));
          }, wordIndex * 250); // 250ms between each word
        });
      }, lineIndex * 2500); // 2.5 seconds between each line
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-6">
      <div className="max-w-lg bg-white rounded-lg shadow-lg p-8 font-serif">
        {LETTER.map((line, lineIndex) => {
          const words = line.split(" ");
          return (
            <div
              key={lineIndex}
              className={`transition-opacity duration-1000 mb-2 ${
                visibleLines.includes(lineIndex) ? "opacity-100" : "opacity-0"
              }`}
            >
              {words.map((word, wordIndex) => (
                <span
                  key={`${lineIndex}-${wordIndex}`}
                  className={classNames(
                    "transition-opacity duration-500",
                    visibleWords[`${lineIndex}-${wordIndex}`]
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                >
                  {word}{" "}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedLetter;
