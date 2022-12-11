import { readAs } from "aoc-util";

type Direction = "U" | "D" | "L" | "R";

interface Position {
  x: number;
  y: number;
}

interface Move {
  direction: Direction;
  steps: number;
}

const moves = readAs<Move[]>({
  path: './src/level9/input.txt',
  parser: lines => lines.map(line => {
    const [direction, steps] = line.split(' ');
    return <Move>{ direction, steps: Number(steps) };
  })
});

export const isNextTo = (p1: Position, p2: Position) => {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  if (Math.abs(x1 - x2) > 1) {
    return false;
  } else if (Math.abs(y1 - y2) > 1) {
    return false;
  } else if (Math.abs(x2 - x1) > 1) {
    return false
  } else if (Math.abs(y2 - y1) > 1) {
    return false
  }
  return true;
};

export const executeMove = (position: Position, move: Move) => {
  const { direction } = move;
  if (direction === 'U') {
    position.y += 1;
  } else if (direction === 'D') {
    position.y -= 1;
  } else if (direction === 'R') {
    position.x += 1;
  } else if (direction === 'L') {
    position.x -= 1;
  }
  return Object.assign({}, position);
};

export const executeMoves = (moves: Move[]) => {
  const headPosition: Position = { x: 0, y: 0 };
  let previousHeadPosition: Position = { x: 0, y: 0 };
  let tailPosition: Position = { x: 0, y: 0 };
  let headMap: Position[] = [{ x: 0, y: 0 }];
  const tailVisited = new Set();

  for (const move of moves) {
    const { steps } = move;
    for (let i = 0; i < steps; i++) {
      previousHeadPosition = Object.assign({}, headPosition);
      headMap.push(executeMove(headPosition, move));
      if (!isNextTo(headPosition, tailPosition)) {
        tailPosition = Object.assign({}, previousHeadPosition);
        tailVisited.add(`${tailPosition.x},${tailPosition.y}`);
      }
    }
  }

  return tailVisited;
};

export const mapToSet = (map: Position[]) => {
  const set = new Set<string>();
  for (const position of map) {
    const { x, y } = position;
    set.add(`${x},${y}`);
  }
  return set;
};

const tailVisited = executeMoves(moves);
console.log(`Level 1: ${tailVisited.size}`);