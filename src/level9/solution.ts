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

interface LinePart {
  id: number;
  next?: LinePart;
  position: Position;
  prevPosition: Position;
  prev?: LinePart;
};

const moves = readAs<Move[]>({
  path: './src/level9/input.txt',
  parser: lines => lines.map(line => {
    const [direction, steps] = line.split(' ');
    return <Move>{ direction, steps: Number(steps) };
  })
});

const isNextTo = (p1: LinePart, p2: LinePart) => {
  const { x: x1, y: y1 } = p1.position;
  const { x: x2, y: y2 } = p2.position;
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

const executeMove = (line: LinePart[], move: Move) => {
  const { direction } = move;
  const head = line[0];
  head.prevPosition = Object.assign({}, head.position)
  const { position } = head;
  if (direction === 'U') {
    position.y += 1;
  } else if (direction === 'D') {
    position.y -= 1;
  } else if (direction === 'R') {
    position.x += 1;
  } else if (direction === 'L') {
    position.x -= 1;
  }
};

const moveTowards = (part: LinePart, target: LinePart) => {
  const { position: { x: targetX, y: targetY } } = target;
  const { position } = part;
  const diffX = Math.abs(position.x - target.position.x);
  const diffY = Math.abs(position.y - target.position.y);

  if (diffX > 1) {
    if (targetX > (position.x + 1)) {
      position.x++;
    } else if (targetX < (position.x - 1)) {
      position.x--;
    }
    if (diffY === 1) {
      if (targetY > (position.y)) {
        position.y++;
      } else if (targetY < (position.y)) {
        position.y--;
      }
    }
  }
  if (diffY > 1) {
    if (targetY > (position.y - 1)) {
      position.y++;
    } else if (targetY < (position.y + 1)) {
      position.y--;
    }
    if (diffX === 1) {
      if (targetX > (position.x)) {
        position.x++;
      } else if (targetX < (position.x)) {
        position.x--;
      }
    }
  }
};

const createLine = (parts: number): LinePart[] => {
  const line: LinePart[] = [];
  for (let i = 0; i < parts; i++) {
    line[i] = {
      id: i,
      prevPosition: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      next: line[i - 1],
    }
  }
  return line;
};

const executeMoves = (line: LinePart[], moves: Move[]) => {
  const tailVisited = new Set();
  for (const move of moves) {
    const { steps } = move;
    for (let i = 0; i < steps; i++) {
      executeMove(line, move);
      for (const element of line) {
        if (element.id === 0) continue;
        if (!isNextTo(element, element.next)) {
          element.prevPosition = Object.assign({}, element.position)
          moveTowards(element, element.next);
          if (element.id === line.length - 1) {
            tailVisited.add(`${element.position.x},${element.position.y}`);
          }
        }
      }
    }
  }
  return tailVisited;
};

const level1Line = createLine(2);
const level1Visited = executeMoves(level1Line, moves);
console.log(`Level 1: ${level1Visited.size}`);

const level2Line = createLine(10);
const level2Visited = executeMoves(level2Line, moves);
console.log(`Level 2: ${level2Visited.size + 1}`);
