import { readAs } from "aoc-util";

interface Monkey {
  id: number;
  inspections: number;
  items: number[];
  operation: (old: number) => number,
  divisible: number;
  isDivisibleThrowTo: number;
  isNotDivisibleThrowTo: number;
}

const readMonkeys = () => {
  return readAs<Monkey[]>({
    path: './src/level11/input.txt',
    parser: (input) => {
      let context: number = 0;
      const monkeys: Monkey[] = [];
      for (const line of input) {
        if (/Monkey\s\d+/.test(line)) {
          const [_, id] = line.replace(/:/, '').split(/\s/);
          context = parseInt(id);
          monkeys[id] = {
            id: context,
            inspections: 0
          };
        }
        else if (/Starting\sitems:/.test(line)) {
          const items = line.replace(/Starting\sitems:/, '')
            .replace(/\s+/, '').split(',').map(Number);
          monkeys[context].items = items;
        }
        else if (/Operation:/.test(line)) {
          const [_, __, ___, operator, multiplier] = line
            .replace(/Operation:/, '').split(' ').filter(e => e !== '');
          if (operator === '*') {
            if (multiplier === 'old') {
              monkeys[context].operation = (old) => old * old;
            } else {
              monkeys[context].operation = (old) => old * parseInt(multiplier);
            }
          } else if (operator === '+') {
            if (multiplier === 'old') {
              monkeys[context].operation = (old) => old + old;
            } else {
              monkeys[context].operation = (old) => old + parseInt(multiplier);
            }
          }
        }
        else if (/Test:\sdivisible\sby/.test(line)) {
          monkeys[context].divisible = parseInt(line.replace(/Test:\sdivisible\sby/, ''));
        }
        else if (/If\strue:\sthrow\sto\smonkey\s\d+/.test(line)) {
          monkeys[context].isDivisibleThrowTo = parseInt(line.replace(/If\strue:\sthrow\sto\smonkey\s/, ''));
        }
        else if (/If\sfalse:\sthrow\sto\smonkey\s\d+/.test(line)) {
          monkeys[context].isNotDivisibleThrowTo = parseInt(line.replace(/If\sfalse:\sthrow\sto\smonkey/, ''));
        }
      }
      return monkeys;
    }
  });
};

const simulateRounds = (rounds: number, shouldBeWorried: boolean) => {
  const monkeys = readMonkeys();
  for (let round = 1; round <= rounds; round++) {
    for (const monkey of monkeys) {
      const { items, divisible, isDivisibleThrowTo, isNotDivisibleThrowTo } = monkey;
      if (items.length === 0) {
        continue;
      }
      for (const item of items) {
        monkey.inspections++;
        const worryLevel = monkey.operation(item);
        const boredLevel = shouldBeWorried ? Math.floor(worryLevel / 3) : worryLevel;
        const isDivisible = boredLevel % divisible === 0;
        if (isDivisible) {
          monkeys[isDivisibleThrowTo].items.push(boredLevel);
        } else {
          monkeys[isNotDivisibleThrowTo].items.push(boredLevel);
        }
      }
      monkey.items = [];
    }
  };
  return monkeys;
};

const calculateMonkeyBusiness = (monkeys: Monkey[]) => {
  const inspectionsSorted = monkeys.map(m => m.inspections).sort((a, b) => b - a);
  const [a, b] = inspectionsSorted;
  return a * b;
};

const level1Monkeys = simulateRounds(20, true);
console.log(`Level 1: ${calculateMonkeyBusiness(level1Monkeys)}`);
