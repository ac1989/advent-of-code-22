import { EOL } from "node:os";
import { readFile } from "node:fs/promises";

import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe, flow } from "fp-ts/function";

const getInput = TE.tryCatch(
  () => readFile("./input", "utf-8"),
  (e) => e
);

const modulo = (n: number, m: number) => ((n % m) + m) % m;

type CodedOppMove = "A" | "B" | "C";
type CodedUsrMove = "X" | "Y" | "Z";
type CodedPair = [CodedOppMove, CodedUsrMove];

const codedOppMoves = ["A", "B", "C"] as const;
const codedUsrMoves = ["X", "Y", "Z"] as const;
const requiredShifts = [-1, 0, 1] as const;
const points = [0, 3, 6];

const getBasePointsFromIndex = (i: number) => i + 1;

const calculateRoundP1 = ([oppMove, usrMove]: CodedPair) => {
  const oppMoveIndex = codedOppMoves.indexOf(oppMove);
  const usrMoveIndex = codedUsrMoves.indexOf(usrMove);
  const basePoints = getBasePointsFromIndex(usrMoveIndex);

  if (oppMoveIndex == usrMoveIndex) return basePoints + 3;

  return modulo(oppMoveIndex + 1, 3) === usrMoveIndex
    ? basePoints + 6
    : basePoints;
};

const calculateRoundP2 = ([oppMove, desiredOutcome]: CodedPair) => {
  const oppMoveIndex = codedOppMoves.indexOf(oppMove);
  const desiredOutcomeIndex = codedUsrMoves.indexOf(desiredOutcome);
  const requiredShift = requiredShifts[desiredOutcomeIndex];
  const usrMoveIndex = modulo(oppMoveIndex + requiredShift, 3);

  return getBasePointsFromIndex(usrMoveIndex) + points[desiredOutcomeIndex];
};

const getPairsFromInput = flow(
  (input: string) => input.split(EOL),
  A.map((x) => x.split(" ") as CodedPair)
);

const sumArray = A.reduce(0, (acc, cur: number) => acc + cur);

const p1 = async () =>
  pipe(
    await getInput(),
    E.map(flow(getPairsFromInput, A.map(calculateRoundP1), sumArray)),
    E.getOrElseW(() => "Failed to load file...")
  );

const p2 = async () =>
  pipe(
    await getInput(),
    E.map(flow(getPairsFromInput, A.map(calculateRoundP2), sumArray)),
    E.getOrElseW(() => "Failed to load file...")
  );

const run = async () => {
  console.log("P1", await p1());
  console.log("P2", await p2());
};

run();
