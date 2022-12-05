import { EOL } from "node:os";
import { readFile } from "node:fs/promises";

import * as A from "fp-ts/Array";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe, flow } from "fp-ts/function";

const getInput = TE.tryCatch(
  () => readFile("./input", "utf-8"),
  (e) => e
);

const splitCratesAndMoves = (input: string[]) => {
  const { init, rest } = A.spanLeft((s) => s !== "")(input);
  return { crates: A.dropRight(1)(init), moves: A.dropLeft(1)(rest) };
};

const parseCrates = (input: { crates: string[] }) => {
  const spl = A.map((s: string) => s.split(""))(input.crates);
  const chn = A.map(A.chunksOf(4))(spl);
  const tmp = A.reverse(
    A.map(A.map(A.filter((s: string) => /[a-zA-Z]/.test(s))))(chn)
  );

  let parsed: string[][][] = [];

  // PRAGMATISM NOT IDEALISM
  for (let row = 0; row <= tmp.length; row++) {
    let line = [];
    for (let column = 0; column < tmp.length; column++) {
      line[column] = tmp[column][row];
    }
    parsed[row] = line;
  }

  return parsed.map((row) => row.filter((a) => a.length > 0));
};

const parseInstructions = (input: { moves: string[] }) => {
  return pipe(
    input.moves,
    A.map(
      flow(
        (s: string) => s.match(/\d+/g) as string[],
        A.mapWithIndex((i, s: string) =>
          // sub 1 from 'from' and 'to' for array indexing;
          i > 0 ? parseInt(s, 10) - 1 : parseInt(s)
        )
      )
    )
  );
};

const getTopCrates = flow(
  A.map((stack: string[][]) => A.last(stack)),
  A.map(O.getOrElse(() => ["!"])),
  A.reduce("", (acc, el) => acc + el)
);

const parseCratesAndMoves = (cratesAndMoves: {
  crates: string[];
  moves: string[];
}) => ({
  crates: parseCrates(cratesAndMoves),
  moves: parseInstructions(cratesAndMoves),
});

const executeStep = (crates: string[][][], from: number, to: number) => {
  const crateValue = crates[from][crates[from].length - 1];
  const nextFrom = A.dropRight(1)(crates[from]);
  const nextTo = A.append(crateValue)(crates[to]);
  const nextCrates = [...crates];
  nextCrates[from] = nextFrom;
  nextCrates[to] = nextTo;
  return nextCrates;
};

const executeMove = (
  crates: string[][][],
  [count, from, to]: number[]
): string[][][] => {
  switch (count === 0) {
    case true:
      return crates;
    default: {
      const nextCrates = executeStep(crates, from, to);
      return executeMove(nextCrates, [count - 1, from, to]);
    }
  }
};

const executeMoves = ({
  crates,
  moves,
}: {
  crates: string[][][];
  moves: number[][];
}): string[][][] => {
  switch (moves.length) {
    case 0:
      return crates;
    default:
      const nextCrates = executeMove(crates, moves[0]);
      return executeMoves({ crates: nextCrates, moves: A.dropLeft(1)(moves) });
  }
};

const p1Workflow = flow(
  splitCratesAndMoves,
  parseCratesAndMoves,
  executeMoves,
  getTopCrates
);

const p1 = async () =>
  pipe(
    await getInput(),
    E.map((input) => input.split(EOL)),
    E.map(p1Workflow),
    E.getOrElseW(() => "things went very wrong")
  );

const executeMoveP2 = (
  crates: string[][][],
  [count, from, to]: number[]
): string[][][] => {
  const values = A.takeRight(count)(crates[from]);
  const nextCrates = [...crates];
  const nextFrom = A.dropRight(count)(crates[from]);
  const nextTo = [...crates[to], ...values];
  nextCrates[from] = nextFrom;
  nextCrates[to] = nextTo;
  return nextCrates;
};

const executeMovesP2 = ({
  crates,
  moves,
}: {
  crates: string[][][];
  moves: number[][];
}): string[][][] => {
  switch (moves.length) {
    case 0:
      return crates;
    default:
      const nextCrates = executeMoveP2(crates, moves[0]);
      return executeMovesP2({
        crates: nextCrates,
        moves: A.dropLeft(1)(moves),
      });
  }
};

const p2Workflow = flow(
  splitCratesAndMoves,
  parseCratesAndMoves,
  executeMovesP2,
  getTopCrates
);

const p2 = async () =>
  pipe(
    await getInput(),
    E.map((input) => input.split(EOL)),
    E.map(p2Workflow),
    E.getOrElseW(() => "things went very wrong")
  );

async function run() {
  console.log("P1:", await p1());
  console.log("P2:", await p2());
}

run();
