import { readAs } from "aoc-util";

interface Action {
  amount: number;
  source: number;
  target: number;
}

type Stack = string[];

type CrateMover = 9000 | 9001;

const rawInputToAction = (input: string): Action => {
  const [amount, source, target] = input.match(/\d+/g).map(Number);
  return { amount, source, target };
}

const rawInputToSupplies = (input: string[], columns: number): Stack[] => {
  const supplies: Stack[] = [];
  for (let column = 0; column < columns; column++) {
    supplies[column + 1] = input.reduce((sum, line) => sum += line.slice(column * 4, (column * 4) + 4), '')
      .replace(/\[|]/g, '').replace(/\s+/g, '').split('').reverse();
  }
  return supplies;
}

const readSuppliesTops = (supplies: Stack[]) => supplies
  .reduce((sum, stack) => sum += stack[stack.length - 1], '');

const executeAction = (action: Action, supplies: Stack[], version: CrateMover) => {
  const { amount, source, target } = action;
  const suppliesToMove: string[] = [];
  for (let i = 0; i < amount; i++) {
    suppliesToMove.push(supplies[source].pop());
  }

  supplies[target] = [...supplies[target], ...(version === 9000 ? suppliesToMove : suppliesToMove.reverse())];
};

const readInput = () => {
  return readAs<{ supplies: Stack[], actions: Action[] }>({
    parser: (input) => {
      const emptyLine = input.findIndex(e => e === '');
      const stackRaw = input.slice(0, emptyLine);
      const columns = Math.max(...stackRaw.slice(stackRaw.length - 1, stackRaw.length)[0].split(/\s\s/g).map(Number));
      const supplies = rawInputToSupplies(stackRaw.slice(0, stackRaw.length - 1), columns);
      const actions = input.slice(emptyLine + 1).map(rawInputToAction);

      return { actions, supplies }
    },
    path: './src/level5/input.txt'
  });
}

const solve = (version: CrateMover) => {
  const { actions, supplies } = readInput();
  actions.forEach(action => executeAction(action, supplies, version));
  return readSuppliesTops(supplies);
};

// Level 1
console.log(`Level 1: ${solve(9000)}`);

// Level 2
console.log(`Level 2: ${solve(9001)}`);