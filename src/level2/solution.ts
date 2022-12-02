/**
 * A, X: Rock, score 1
 * B, Y: Paper, score 2
 * C, Z: Scissors, score 3
 * Draw, score 3
 * Win score 6
 */

import { readAs } from 'aoc-util';

type Symbol = 'rock' | 'paper' | 'scissors';
type RoundResult = "win" | "lost";
type PlayerSymbol = 'X' | 'Y' | 'Z';
type OpponentSymbol = 'A' | 'B' | 'C';

type Symbols = {
  name: Symbol;
  player: PlayerSymbol;
  opponent: OpponentSymbol;
  score: number;
} & {
    [K in RoundResult]: Symbol;
  }

const symbols: Symbols[] = [
  {
    name: 'rock',
    player: 'X',
    opponent: 'A',
    lost: 'scissors',
    win: 'paper',
    score: 1
  },
  {
    name: 'paper',
    player: 'Y',
    opponent: 'B',
    lost: 'rock',
    win: 'scissors',
    score: 2
  },
  {
    name: 'scissors',
    player: 'Z',
    opponent: 'C',
    lost: 'paper',
    win: 'rock',
    score: 3
  }
];

const roundResultScore: { [R in RoundResult | "draw"]: number } = {
  win: 6,
  draw: 3,
  lost: 0
};

// Level 2
const symbolRoundResult: { [S in PlayerSymbol]: RoundResult | "draw" } = {
  'X': 'lost',
  'Y': 'draw',
  'Z': 'win'
};

const roundResult = (opponent: Symbol, player: Symbol): RoundResult | "draw" => {
  const opponentScore = symbols.find(s => s.name === opponent).score;
  const playerScore = symbols.find(s => s.name === player).score;
  if (opponentScore === playerScore) {
    return 'draw';
  }
  return symbols.find(s => s.name === player).lost === opponent ? "win" : "lost";
};

const getRoundScore = (opponent: string, player: string): number => {
  const opponentSymbol = symbols.find(s => s.opponent === opponent);
  const playerSymbol = symbols.find(s => s.player === player);
  const outcome = roundResult(opponentSymbol.name, playerSymbol.name);
  return playerSymbol.score + roundResultScore[outcome];
};

const rounds = readAs<string[][]>({
  path: './src/level2/input.txt',
  parser: (input: string[]) => {
    return input.map(line => line.split(/\s/));
  }
});

const totalScore = rounds.reduce((prev, round) => prev += getRoundScore(round[0], round[1]), 0);
console.log(`Level 1: ${totalScore}`);

const setupScore = rounds.reduce((prev, round) => {
  const [opponent, player] = round;
  const expectedResult = symbolRoundResult[player];
  let expectedSymbol = symbols.find(s => s.opponent === opponent).player;
  if (expectedResult !== 'draw') {
    const opponentSymbol = symbols.find(s => s.opponent === opponent);
    expectedSymbol = symbols.find(s => s.name === opponentSymbol[expectedResult]).player;
  }
  return prev += getRoundScore(opponent, expectedSymbol);
}, 0);
console.log(`Level 2: ${setupScore}`);
