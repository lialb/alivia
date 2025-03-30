"use client";
import React, { useState, useEffect, KeyboardEvent, useRef } from "react";

import classNames from "classnames";

import { Cell } from "./cell";
import {
  CROSSWORD_DATA,
  CellData,
  CrosswordData,
  cells,
} from "./crosswordData";

// Create a proper deep copy of cells for React state management
const initializeCells = () => {
  // Deep clone the cells array
  const cellsCopy = JSON.parse(JSON.stringify(cells));

  // Initialize the cells
  CROSSWORD_DATA.words.forEach((word) => {
    const [startCol, startRow] = word.startPosition;
    cellsCopy[startRow][startCol].number = word.id;

    if (word.direction === "across") {
      for (let i = 0; i < word.answer.length; i++) {
        if (startCol + i < CROSSWORD_DATA.width) {
          cellsCopy[startRow][startCol + i].isBlack = false;

          // Preserve any existing down wordId while setting the across wordId
          const existingDown = cellsCopy[startRow][startCol + i].wordIds.down;
          cellsCopy[startRow][startCol + i].wordIds = {
            across: word.id,
            down: existingDown,
          };
        }
      }
    } else {
      // down
      for (let i = 0; i < word.answer.length; i++) {
        if (startRow + i < CROSSWORD_DATA.height) {
          cellsCopy[startRow + i][startCol].isBlack = false;

          // Preserve any existing across wordId while setting the down wordId
          const existingAcross =
            cellsCopy[startRow + i][startCol].wordIds.across;
          cellsCopy[startRow + i][startCol].wordIds = {
            across: existingAcross,
            down: word.id,
          };
        }
      }
    }
  });

  return cellsCopy;
};

const Crossword: React.FC = () => {
  // Store cells in React state
  const [cellsState, setCellsState] = useState<CellData[][]>(() =>
    initializeCells()
  );
  const [crosswordData, setCrosswordData] =
    useState<CrosswordData>(CROSSWORD_DATA);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [currentDirection, setCurrentDirection] = useState<"across" | "down">(
    "across"
  );
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState<boolean>(false);
  const crosswordRef = useRef<HTMLDivElement>(null);

  // Focus the crossword div on mount
  useEffect(() => {
    if (crosswordRef.current) {
      crosswordRef.current.focus();
    }
  }, []);

  // When selected cell changes, update the selected word ID
  useEffect(() => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const cell = cellsState[row][col];

      if (cell.isBlack) {
        setSelectedCell(null);
        setSelectedWordId(null);
        return;
      }

      // If the cell has a word in the current direction, use it
      if (cell.wordIds[currentDirection] !== null) {
        setSelectedWordId(cell.wordIds[currentDirection]);
      } else if (
        cell.wordIds[currentDirection === "across" ? "down" : "across"] !== null
      ) {
        setCurrentDirection(currentDirection === "across" ? "down" : "across");
        setSelectedWordId(
          cell.wordIds[currentDirection === "across" ? "down" : "across"]
        );
      }
      // If no words, deselect
      else {
        setSelectedWordId(null);
      }
    } else {
      setSelectedWordId(null);
    }
  }, [selectedCell, currentDirection, cellsState]);

  // Add an effect to check puzzle completion any time cellsState changes
  useEffect(() => {
    const isComplete = checkPuzzleCompletion();
    setIsPuzzleComplete(isComplete);
  }, [cellsState]);

  // Update the isCellHighlighted function
  const isCellHighlighted = (row: number, col: number): boolean => {
    if (!selectedWordId) return false;

    // Check if this cell belongs to the selected word
    return cellsState[row][col].wordIds[currentDirection] === selectedWordId;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    const cell = cellsState[row][col];

    if (cell.isBlack) {
      return;
    }

    // If already selected, toggle direction
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      const hasAcross = cell.wordIds.across !== null;
      const hasDown = cell.wordIds.down !== null;

      // Only toggle if the cell has words in both directions
      if (hasAcross && hasDown) {
        const newDirection = currentDirection === "across" ? "down" : "across";
        setCurrentDirection(newDirection);

        // Update the selected word ID for the new direction
        setSelectedWordId(cell.wordIds[newDirection]);
      }
    } else {
      // New cell was clicked
      setSelectedCell([row, col]);

      // Try to select a word in the current direction
      if (cell.wordIds[currentDirection] !== null) {
        setSelectedWordId(cell.wordIds[currentDirection]);
      }
      // If there's no word in the current direction, but there is one in the other direction
      else if (
        cell.wordIds[currentDirection === "across" ? "down" : "across"] !== null
      ) {
        const newDirection = currentDirection === "across" ? "down" : "across";
        setCurrentDirection(newDirection);
        setSelectedWordId(cell.wordIds[newDirection]);
      }
    }
  };

  // Check if the puzzle is complete and correct
  const checkPuzzleCompletion = () => {
    // First, check if all non-black cells have values
    const allFilled = cellsState.every((row) =>
      row.every((cell) => cell.isBlack || cell.value !== "")
    );

    console.log("All cells filled:", allFilled);

    if (!allFilled) return false;

    // Check if all words are correct
    const allWordsCorrect = crosswordData.words.every((word) => {
      const [startCol, startRow] = word.startPosition;
      const answer = word.answer.split("");

      const wordCorrect = answer.every((letter, i) => {
        let cellValue;

        if (word.direction === "across") {
          cellValue = cellsState[startRow][startCol + i].value;
        } else {
          // down
          cellValue = cellsState[startRow + i][startCol].value;
        }

        const isMatch = cellValue.toUpperCase() === letter.toUpperCase();

        if (!isMatch) {
          console.log(
            `Mismatch for word ${word.id} (${word.answer}): expected ${letter}, got ${cellValue} at position ${i}`
          );
        }

        return isMatch;
      });

      console.log(`Word ${word.id} (${word.answer}) correct: ${wordCorrect}`);
      return wordCorrect;
    });

    console.log("All words correct:", allWordsCorrect);
    return allWordsCorrect;
  };

  // Handle keyboard input
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;

    // Handle letter input
    if (/^[a-zA-Z]$/.test(e.key)) {
      // Create a proper deep copy of the cells state
      const newCellsState = JSON.parse(JSON.stringify(cellsState));

      // Update the cell value
      newCellsState[row][col].value = e.key.toUpperCase();

      // Update the state with the new cells
      setCellsState(newCellsState);

      // Move to the next cell in the current direction
      moveToNextCell();
    }
    // Handle backspace/delete
    else if (e.key === "Backspace" || e.key === "Delete") {
      // Create a deep copy of the cells state
      const newCellsState = JSON.parse(JSON.stringify(cellsState));

      // If current cell is empty, move back and clear that cell
      if (newCellsState[row][col].value === "" && e.key === "Backspace") {
        moveToPrevCell();
        if (selectedCell) {
          const [newRow, newCol] = selectedCell;
          newCellsState[newRow][newCol].value = "";
          setCellsState(newCellsState);
        }
      } else {
        newCellsState[row][col].value = "";
        setCellsState(newCellsState);
      }

      // Completion will be checked by the useEffect
    }
    // Handle arrow keys
    else if (e.key === "ArrowRight") {
      moveToCell(row, col + 1);
    } else if (e.key === "ArrowLeft") {
      moveToCell(row, col - 1);
    } else if (e.key === "ArrowDown") {
      moveToCell(row + 1, col);
    } else if (e.key === "ArrowUp") {
      moveToCell(row - 1, col);
    }
    // Handle space (toggle direction)
    else if (e.key === " ") {
      e.preventDefault(); // Prevent scrolling
      const cell = cellsState[row][col];
      const hasAcross = cell.wordIds.across !== null;
      const hasDown = cell.wordIds.down !== null;

      if (hasAcross && hasDown) {
        setCurrentDirection(currentDirection === "across" ? "down" : "across");
      }
    }
    // Handle Tab to navigate to next word
    else if (e.key === "Tab") {
      e.preventDefault(); // Prevent focus moving away from the grid
      if (e.shiftKey) {
        // Shift+Tab: Go to previous word
        navigateToPreviousWord();
      } else {
        // Tab: Go to next word
        navigateToNextWord();
      }
    }
  };

  // Move to the next cell in the current direction
  const moveToNextCell = () => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;

    if (currentDirection === "across") {
      moveToCell(row, col + 1);
    } else {
      moveToCell(row + 1, col);
    }
  };

  // Move to the previous cell in the current direction
  const moveToPrevCell = () => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;

    if (currentDirection === "across") {
      moveToCell(row, col - 1);
    } else {
      moveToCell(row - 1, col);
    }
  };

  // Move to a specific cell, accounting for black cells and grid boundaries
  const moveToCell = (newRow: number, newCol: number) => {
    // Check if the new position is within grid boundaries
    if (
      newRow < 0 ||
      newRow >= crosswordData.height ||
      newCol < 0 ||
      newCol >= crosswordData.width
    ) {
      return;
    }

    // Check if the new cell is a black cell
    if (cellsState[newRow][newCol].isBlack) {
      return;
    }

    setSelectedCell([newRow, newCol]);
  };

  // Navigate to the next word in the puzzle
  const navigateToNextWord = () => {
    if (!selectedWordId) {
      // If no word is selected, select the first word
      const firstWord = crosswordData.words[0];
      setCurrentDirection(firstWord.direction);
      setSelectedCell([firstWord.startPosition[1], firstWord.startPosition[0]]);
      setSelectedWordId(firstWord.id);
      return;
    }

    // Find the current word's index
    const currentWordIndex = crosswordData.words.findIndex(
      (word) =>
        word.id === selectedWordId && word.direction === currentDirection
    );

    if (currentWordIndex >= 0) {
      // Move to the next word
      const nextWordIndex = (currentWordIndex + 1) % crosswordData.words.length;
      const nextWord = crosswordData.words[nextWordIndex];

      setCurrentDirection(nextWord.direction);
      setSelectedCell([nextWord.startPosition[1], nextWord.startPosition[0]]);
      setSelectedWordId(nextWord.id);
    }
  };

  // Navigate to the previous word in the puzzle
  const navigateToPreviousWord = () => {
    if (!selectedWordId) {
      // If no word is selected, select the last word
      const lastWord = crosswordData.words[crosswordData.words.length - 1];
      setCurrentDirection(lastWord.direction);
      setSelectedCell([lastWord.startPosition[1], lastWord.startPosition[0]]);
      setSelectedWordId(lastWord.id);
      return;
    }

    // Find the current word's index
    const currentWordIndex = crosswordData.words.findIndex(
      (word) =>
        word.id === selectedWordId && word.direction === currentDirection
    );

    if (currentWordIndex >= 0) {
      // Move to the previous word
      const prevWordIndex =
        (currentWordIndex - 1 + crosswordData.words.length) %
        crosswordData.words.length;
      const prevWord = crosswordData.words[prevWordIndex];

      setCurrentDirection(prevWord.direction);
      setSelectedCell([prevWord.startPosition[1], prevWord.startPosition[0]]);
      setSelectedWordId(prevWord.id);
    }
  };

  // Get the current clue
  const getCurrentClue = (): string => {
    if (!selectedWordId) return "";

    const word = crosswordData.words.find(
      (w) => w.id === selectedWordId && w.direction === currentDirection
    );
    if (!word) return "";

    return `${word.id}. ${word.clue}`;
  };

  // Handle clue click
  const handleClueClick = (word: any) => {
    setCurrentDirection(word.direction);
    setSelectedCell([word.startPosition[1], word.startPosition[0]]);
    setSelectedWordId(word.id);
  };

  return (
    <div
      className="p-4 w-full max-w-screen-xl mx-auto"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={crosswordRef}
    >
      <h1 className="text-2xl mb-4 text-center">
        Olivia & Albert, crossword edition
      </h1>

      {isPuzzleComplete && (
        <div className="mb-4 w-full bg-green-100 p-4 rounded text-center">
          <p className="text-green-800 font-bold text-xl">
            Congratulations! You've solved the puzzle correctly!
          </p>
        </div>
      )}

      {/* Main content - side by side layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left side - Crossword grid and current clue */}
        <div className="md:w-auto flex-shrink-0">
          <div className="mb-4">
            <div className="bg-blue-100 p-2 rounded">
              <p className="font-bold break-words">
                {currentDirection === "across" ? "Across" : "Down"}:{" "}
                {getCurrentClue()}
              </p>
            </div>
          </div>

          <div
            className="grid gap-0 mx-auto w-fit"
            style={{
              gridTemplateColumns: `repeat(${crosswordData.width}, minmax(36px, 40px))`,
              maxWidth: "100%", // Ensure it doesn't overflow on small screens
            }}
          >
            {cellsState.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <Cell
                  key={`${rowIdx}-${colIdx}`}
                  cell={cell}
                  isSelected={
                    selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx
                  }
                  isHighlighted={isCellHighlighted(rowIdx, colIdx)}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right side - Clues */}
        <div className="md:flex-1">
          <div className="bg-gray-50 p-4 rounded-lg h-full overflow-auto">
            <h2 className="text-xl mb-4 font-bold">Clues</h2>

            <div className="mb-6">
              <h3 className="font-bold text-lg border-b pb-1 mb-2">Across</h3>
              <ul>
                {crosswordData.words
                  .filter((word) => word.direction === "across")
                  .map((word) => (
                    <li
                      key={word.id}
                      className={classNames(
                        "cursor-pointer p-1 transition-colors rounded",
                        {
                          "bg-blue-100":
                            selectedWordId === word.id &&
                            currentDirection === "across",
                          "hover:bg-gray-100": !(
                            selectedWordId === word.id &&
                            currentDirection === "across"
                          ),
                        }
                      )}
                      onClick={() => handleClueClick(word)}
                    >
                      <span className="font-medium">{word.id}.</span>{" "}
                      {word.clue}
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg border-b pb-1 mb-2">Down</h3>
              <ul>
                {crosswordData.words
                  .filter((word) => word.direction === "down")
                  .map((word) => (
                    <li
                      key={word.id}
                      className={classNames(
                        "cursor-pointer p-1 transition-colors rounded",
                        {
                          "bg-blue-100":
                            selectedWordId === word.id &&
                            currentDirection === "down",
                          "hover:bg-gray-100": !(
                            selectedWordId === word.id &&
                            currentDirection === "down"
                          ),
                        }
                      )}
                      onClick={() => handleClueClick(word)}
                    >
                      <span className="font-medium">{word.id}.</span>{" "}
                      {word.clue}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Controls section */}
      <div className="mt-8 border-t pt-4">
        <h3 className="font-bold mb-2">Controls:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <ul className="list-disc pl-5">
              <li>Type letters to fill in cells</li>
              <li>Use arrow keys to navigate</li>
            </ul>
          </div>
          <div>
            <ul className="list-disc pl-5">
              <li>Click a cell to select it</li>
              <li>Click a selected cell to toggle between across/down</li>
            </ul>
          </div>
          <div>
            <ul className="list-disc pl-5">
              <li>Press space to toggle direction</li>
              <li>
                Press Tab to go to the next word, Shift+Tab for previous word
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crossword;
