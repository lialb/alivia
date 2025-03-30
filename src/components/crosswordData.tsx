// Types
export interface CrosswordData {
  width: number;
  height: number;
  words: Word[];
}

export interface Word {
  id: number;
  clue: string;
  answer: string;
  direction: "across" | "down";
  startPosition: [number, number]; // [row, col]
}

export interface CellData {
  row: number;
  col: number;
  value: string;
  isBlack: boolean;
  number: number | null;
  wordIds: {
    across: number | null;
    down: number | null;
  };
}

export interface CellProps {
  cell: CellData;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}

const WIDTH = 20;
const HEIGHT = 23;

export const CROSSWORD_DATA: CrosswordData = {
  width: WIDTH,
  height: HEIGHT,
  words: [
    // Across clues
    {
      id: 5,
      clue: "Venue of the Center for Wooden Boats, where the first exercise alivia had together",
      answer: "UNION",
      direction: "across",
      startPosition: [9, 3],
    },
    {
      id: 6,
      clue: "Human appendage on Albert's bday cake",
      answer: "COCK",
      direction: "across",
      startPosition: [2, 4],
    },
    {
      id: 7,
      clue: "A sweet treat place Alivia were spotted at, for short",
      answer: "FAJ",
      direction: "across",
      startPosition: [17, 4],
    },
    {
      id: 8,
      clue: "The restaurant that almost killed Albert, for short",
      answer: "KTH",
      direction: "across",
      startPosition: [0, 5],
    },
    {
      id: 9,
      clue: "Informational broadcast spot, abbr. Also a show Alivia were hooked on",
      answer: "PSA",
      direction: "across",
      startPosition: [15, 5],
    },
    {
      id: 11,
      clue: "Nothing ___ can stay. Also what Olivia got for x-mas",
      answer: "GOLD",
      direction: "across",
      startPosition: [3, 7],
    },
    {
      id: 12,
      clue: "City that fell in April 1975. Alivia went here nearly 50 years later",
      answer: "SAIGON",
      direction: "across",
      startPosition: [10, 7],
    },
    {
      id: 15,
      clue: "The first Michelin star restaurant Alivia went to",
      answer: "ANNALENA",
      direction: "across",
      startPosition: [4, 9],
    },
    {
      id: 16,
      clue: "Recent immigrant, insensitively. Also the most visited food spot for Alivia",
      answer: "FOB",
      direction: "across",
      startPosition: [14, 9],
    },
    {
      id: 17,
      clue: "Restaurant in Thailand Olivia took Albert to for bday",
      answer: "KHAO",
      direction: "across",
      startPosition: [4, 11],
    },
    {
      id: 18,
      clue: "The app Albert convinced Olivia to get after the second date",
      answer: "BELI",
      direction: "across",
      startPosition: [12, 11],
    },
    {
      id: 20,
      clue: "Seaweed, aka alivia's second date spot",
      answer: "UMINORI",
      direction: "across",
      startPosition: [12, 13],
    },
    {
      id: 21,
      clue: "Alivia made one of these for the first Asian bachelorette",
      answer: "CAMEO",
      direction: "across",
      startPosition: [14, 15],
    },
    {
      id: 24,
      clue: "What Olivia got for her birthday that was thrown away",
      answer: "CAKE",
      direction: "across",
      startPosition: [11, 17],
    },
    {
      id: 25,
      clue: "Cold invention from 1834, also what Olivia got for her bday",
      answer: "FRIDGE",
      direction: "across",
      startPosition: [9, 20],
    },
    {
      id: 26,
      clue: "An Albert specialty, featured on the third date",
      answer: "LAMB",
      direction: "across",
      startPosition: [15, 21],
    },

    // Down clues
    {
      id: 1,
      clue: "Successor to the 3DS, and Albert's birthday gift",
      answer: "SWITCH",
      direction: "down",
      startPosition: [2, 0],
    },
    {
      id: 2,
      clue: "Salt in Japan. Alivia spent their V-Day here",
      answer: "SHIO",
      direction: "down",
      startPosition: [11, 1],
    },
    {
      id: 3,
      clue: "What Olivia's roommate had in mind for first date",
      answer: "RUNNING",
      direction: "down",
      startPosition: [13, 1],
    },
    {
      id: 4,
      clue: 'A famous "talking machine". Also Alivia\'s first date spot',
      answer: "VICTROLA",
      direction: "down",
      startPosition: [4, 2],
    },
    {
      id: 7,
      clue: "Why Olivia wouldn't sit next to Albert on planes",
      answer: "FART",
      direction: "down",
      startPosition: [17, 4],
    },
    {
      id: 9,
      clue: "First restaurant Alivia went to in San Francisco",
      answer: "PINKONION",
      direction: "down",
      startPosition: [15, 5],
    },
    {
      id: 10,
      clue: "This place shares a name with serving up asian desserts and Thai adult performers. Alivia has been to both",
      answer: "NANA",
      direction: "down",
      startPosition: [11, 6],
    },
    {
      id: 13,
      clue: "Western lake with crystal-clear waters. Olivia was here, right before the first date",
      answer: "TAHOE",
      direction: "down",
      startPosition: [7, 8],
    },
    {
      id: 14,
      clue: "A far east feline, plus a date spot for Alivia",
      answer: "NEKO",
      direction: "down",
      startPosition: [9, 8],
    },
    {
      id: 17,
      clue: "Banchan-accompanied meal, in short. Alivia's first michelin star cuisine in sf",
      answer: "KBBQ",
      direction: "down",
      startPosition: [4, 11],
    },
    {
      id: 19,
      clue: "The only concert venue Alivia has been together",
      answer: "GORGE",
      direction: "down",
      startPosition: [17, 11],
    },
    {
      id: 21,
      clue: "____ room, Olivia's highest ranked place in Seattle on Beli",
      answer: "CHEESE",
      direction: "down",
      startPosition: [14, 15],
    },
    {
      id: 22,
      clue: "A Seadevil, also what Alivia saw on an island",
      answer: "MANTARAY",
      direction: "down",
      startPosition: [16, 15],
    },
    {
      id: 23,
      clue: "Technically the first foreign country Alivia went to",
      answer: "CANADA",
      direction: "down",
      startPosition: [12, 16],
    },
  ],
};

export const cells: CellData[][] = Array(HEIGHT)
  .fill(null)
  .map((_, row) =>
    Array(WIDTH)
      .fill(null)
      .map((_, col) => ({
        row,
        col,
        value: "",
        isBlack: true,
        number: null,
        wordIds: {
          across: null,
          down: null,
        },
      }))
  );
