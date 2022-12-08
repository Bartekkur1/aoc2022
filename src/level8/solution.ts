import { readAs } from "aoc-util";

interface Neighbors {
  top: number[];
  bottom: number[];
  right: number[];
  left: number[];
}

interface Tree {
  height: number;
  neighbors: Neighbors;
}

const findVertical = (trees: string[], x: number) => {
  const verticalTrees = [];
  for (let y = 0; y < trees.length; y++) {
    verticalTrees.push(trees[y][x]);
  }
  return verticalTrees.map(Number);
};

const findNeighbors = (trees: string[], x: number, y: number): Neighbors => {
  const right = trees[y].slice(x + 1, trees[y].length).split('').map(Number);
  const left = trees[y].slice(0, x).split('').map(Number);
  const vertical = findVertical(trees, x);
  const top = vertical.slice(0, y);
  const bottom = vertical.slice(y + 1, trees[y].length)
  return {
    top,
    bottom,
    right,
    left
  }
};

const trees = readAs<Tree[]>({
  path: "./src/level8/input.txt",
  parser: (input: string[]) => {
    const trees: Tree[] = [];
    for (let y = 0; y < input[0].length; y++) {
      for (let x = 0; x < input.length; x++) {
        trees.push({
          neighbors: findNeighbors(input, x, y),
          height: Number(input[y][x])
        });
      }
    }
    return trees;
  }
});

const isEmpty = (arr: any[]) => arr.length === 0;
const biggestTree = (height: number, neighbors: number[]) => neighbors.filter(t => t >= height).length === 0;
const heightFilter = (tree: Tree) => {
  const { height, neighbors: { bottom, left, right, top } } = tree;
  return isEmpty(bottom) || isEmpty(left) || isEmpty(right) || isEmpty(top) || biggestTree(height, top) ||
    biggestTree(height, bottom) || biggestTree(height, left) || biggestTree(height, right);
};

const calculateScore = (height: number, direction: number[]) => {
  if (direction.length === 0) return 1;
  let score = 0;
  for (let i = 0; i < direction.length; i++) {
    if (direction[i] >= height) {
      score += 1;
      break;
    }
    score += 1;
  }
  return score === 0 ? 1 : score;
};

const calculateTreeScenicScore = (tree: Tree) => {
  const { height, neighbors: { bottom, left, right, top } } = tree;
  const topScore = calculateScore(height, top.reverse());
  const bottomScore = calculateScore(height, bottom);
  const rightScore = calculateScore(height, right);
  const leftScore = calculateScore(height, left.reverse());
  return topScore * bottomScore * leftScore * rightScore;
};

const count = trees.filter(heightFilter).length;
console.log(`Level 1: ${count}`);

const bestScore = trees.map(calculateTreeScenicScore).sort((a, b) => b - a)[0];
console.log(`Level 2: ${bestScore}`);

