import { readAs } from "aoc-util";

const input = readAs<string>({
  parser: ([input]) => input,
  path: './src/level6/input.txt'
});

const isUnique = (input: string[]) => new Set(input).size === input.length;

const findStartSignalIndex = (input: string, size: number): number => {
  let lastChars: string[] = [];
  for (let i = 0; i < input.length; i++) {
    lastChars = [input[i], ...lastChars.slice(0, size - 1)];
    if (lastChars.length === size && isUnique(lastChars)) {
      return i + 1;
    }
  }
  throw new Error('pepsi');
};

console.log(`Level 1: ${findStartSignalIndex(input, 4)}`);
console.log(`Level 2: ${findStartSignalIndex(input, 14)}`);
