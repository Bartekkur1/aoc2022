import { readAs } from 'aoc-util';

const inventories = readAs<number[][]>({
  path: './src/level1/input.txt',
  parser: (input: string[]) => {
    const inventories: number[][] = [];
    let elfInventory: number[] = [];
    for (const line of input) {
      if (/\d+/.test(line)) {
        elfInventory.push(Number(line));
      } else {
        inventories.push(Object.assign([], elfInventory));
        elfInventory = [];
      }
    }
    return inventories;
  }
});

const sum = (input: number[]): number => input.reduce((prev, next) => { prev += next; return prev; }, 0)

const kcalAgr = inventories.map(inventory => sum(inventory));

// part 1
const mostKcal = Math.max(...kcalAgr);
console.log(`Most carried kcal is: ${mostKcal}`);

// part 2
const top3 = kcalAgr.sort((a, b) => b - a).slice(0, 3);
const top3Sum = sum(top3);
console.log(`Kcal carried by top 3 elves if: ${top3Sum}`);