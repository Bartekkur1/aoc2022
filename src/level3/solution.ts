import { readAs } from "aoc-util";

interface Rucksack {
  firstCompartment: string[];
  secondCompartment: string[];
  shared: Set<string>;
}

const rucksacks = readAs<Rucksack[]>({
  path: './src/level3/input.txt',
  parser: (file) => file.map(line => {
    const halfSize = line.length / 2;
    const firstCompartment = line.slice(0, halfSize).split('');
    const secondCompartment = line.slice(halfSize, line.length).split('');
    return {
      firstCompartment, secondCompartment,
      shared: new Set(firstCompartment.filter(item => secondCompartment.includes(item)))
    }
  })
});

const getItemsScore = (rucksack: Rucksack): number => {
  return Array.from(rucksack.shared).reduce((sum, item) => sum += getItemScore(item), 0);
};

const getItemScore = (item: string): number => {
  return item.charCodeAt(0) - (item === item.toUpperCase() ? 38 : 96);
};

const prioritiesSum = rucksacks.reduce((sum, rucksack) => sum += getItemsScore(rucksack), 0);
console.log(`Level 1: ${prioritiesSum}`);

// level 2
const findMostCommonItem = (rucksacks: Rucksack[]): string => {
  const [first, second, third] = rucksacks.map(rucksack => Array.from([...rucksack.firstCompartment, ...rucksack.secondCompartment]));
  return first.filter(item => second.includes(item) && third.includes(item))[0];
};

const groups = rucksacks.reduce<Rucksack[][]>((sum, rucksack, index) => {
  const groupId = Math.floor(Number(index) / 3);
  if (!sum[groupId]) sum[groupId] = [];
  sum[groupId].push(rucksack);
  return sum;
}, []);

const sharedItemsSum = groups.reduce((sum, group) => sum += getItemScore(findMostCommonItem(group)), 0);
console.log(`Level 2: ${sharedItemsSum}`);