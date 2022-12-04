import { readAs } from "aoc-util";

const pairs = readAs<number[][]>({
  path: './src/level4/input.txt',
  parser: (file) => file.map(line => {
    const [first, second] = line.split(',');
    return [...first.split('-'), ...second.split('-')].map(Number);
  })
});

const contains = (x1: number, x2: number, y1: number, y2: number): boolean => {
  return y1 >= x1 && y1 <= x2 && y2 >= x1 && y2 <= x2;
};

const overlap = (x1: number, x2: number, y1: number, y2: number): boolean => {
  return (x1 >= y1 && x1 <= y2) || (x2 >= y1 && x2 <= y2);
};

const sumWithFunc = (func): number =>
  pairs.reduce((sum, pair) => {
    const [x1, x2, y1, y2] = pair;
    return sum += (func(x1, x2, y1, y2) || func(y1, y2, x1, x2)) ? 1 : 0;
  }, 0);

console.log(`Level 1: ${sumWithFunc(contains)}`);
console.log(`Level 2: ${sumWithFunc(overlap)}`);
