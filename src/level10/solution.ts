import { readAs } from "aoc-util"

interface Operation {
  name: string;
  value: number;
};

const operations = readAs<Operation[]>({
  path: './src/level10/input.txt',
  parser: (input) => input.map(line => {
    const [name, value] = line.split(' ');
    return {
      name,
      value: parseInt(value) || 0
    }
  })
});

const sumCycles = [20, 60, 100, 140, 180, 220];
let register = 1;
let cycles = 1;
let cyclesSum = 0;
let line = 0;

for (const operation of operations) {
  const { name, value } = operation;
  const iterations = name === 'addx' ? 2 : 1;
  for (let i = 0; i < iterations; i++) {
    if (Math.abs(((cycles - (line * 40)) - 1) - (register)) < 2) {
      process.stdout.write("#");
    } else {
      process.stdout.write(".");
    }
    if (cycles % 40 === 0) {
      process.stdout.write("\n");
      line++;
    }

    if (sumCycles.includes((cycles))) {
      cyclesSum += register * cycles;
    }
    cycles++;
  }
  register += value;
}

process.stdout.write("\n");
console.log(`Level 1: ${cyclesSum}`);
