import { readAs } from "aoc-util";

interface Directory {
  name: string;
  path: string[];
  subDirectories: Directory[];
  parent?: Directory;
  size: number;
  totalSize: number;
}

const createEmptyDirectory = (name, path: string[], parent?: Directory): Directory =>
  ({ path, size: 0, totalSize: 0, subDirectories: [], name, parent });

const isMoveCommand = (line: string) => /\$\scd.+/.test(line);
const isFile = (line: string) => /\d+\s\w/.test(line);
const isDirectory = (line: string) => /^dir/.test(line);

const handleCommand = (line: string) => {
  const [_, name, target] = line.split(/\s/);
  if (target === '/') {
    currentDirectory = rootDir;
  } else if (target === '..') {
    currentDirectory = currentDirectory.parent;
  } else {
    currentDirectory = currentDirectory.subDirectories.find(d => d.name === target);
  }
};

const createDirectory = (line: string) => {
  const [_, name] = line.split(' ');
  const path = [...currentDirectory.path, name];
  currentDirectory.subDirectories.push(createEmptyDirectory(name, path, currentDirectory));
};

const readFileSize = (line: string) => {
  const [size, _] = line.split(' ');
  currentDirectory.size += Number(size);
};

const rootDir: Directory = createEmptyDirectory('/', []);
let currentDirectory = rootDir;

const calculateTotalSize = (directory: Directory) => {
  return directory.size + directory.subDirectories.reduce((sum, directory) => sum += calculateTotalSize(directory), 0);
};

const calculateDirectoriesSize = (directory: Directory) => {
  directory.totalSize = calculateTotalSize(directory);
  directory.subDirectories.forEach(d => calculateDirectoriesSize(d));
};

readAs<void>({
  path: './src/level7/input.txt',
  parser: (input: string[]) => {
    for (const line of input) {
      if (isMoveCommand(line)) {
        handleCommand(line);
      } else if (isDirectory(line)) {
        createDirectory(line);
      } else if (isFile(line)) {
        readFileSize(line);
      }
    }
    calculateDirectoriesSize(rootDir);
  }
});

let sum = 0;
const findWithLimit = (directory: Directory) => {
  if (directory.totalSize < 100_000) {
    sum += directory.totalSize;
  }
  directory.subDirectories.forEach(d => findWithLimit(d));
};

findWithLimit(rootDir);
console.log(`Level 1: ${sum}`);

// Level 2
const directoriesSizes = [];
const mapDirectoryToSize = (directory: Directory) => {
  directoriesSizes.push(directory.totalSize);
  directory.subDirectories.forEach(d => mapDirectoryToSize(d));
};

const freeSpace = 70_000_000 - rootDir.totalSize;
const spaceNeeded = 30_000_000 - freeSpace;
mapDirectoryToSize(rootDir)
const closestDiff = directoriesSizes.filter(size => size > spaceNeeded).sort((a, b) => a - b)[0];
console.log(`Level 2: ${closestDiff}`);
