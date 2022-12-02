import { EOL } from "node:os";
import { readFile } from "node:fs/promises";

import * as A from "fp-ts/Array";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as N from "fp-ts/number";
import * as O from "fp-ts/Option";
import { pipe, flow } from "fp-ts/function";

// Shared:
const getInput = TE.tryCatch(
  () => readFile("./input", "utf-8"),
  (e) => e
);

const isNotEmpty = (s: string) => s !== "";

const sumAndSort = flow(
  A.chop((xs: string[]) => {
    const { init, rest } = A.spanLeft(isNotEmpty)(xs);
    return [init, A.dropLeft(1)(rest)];
  }),
  A.map(A.reduce(0, (acc, cur) => acc + parseInt(cur))),
  A.sort(N.Ord)
);

const getMostCalorific = flow(
  sumAndSort,
  A.last,
  O.getOrElse(() => 0)
);

// P1:
async function p1() {
  return pipe(
    await getInput(),
    E.map((input) => input.split(EOL)),
    E.map(getMostCalorific),
    E.getOrElse(() => 0)
  );
}

const getTopThreeCalorEs = flow(
  sumAndSort,
  A.takeRight(3),
  A.reduce(0, (acc, cur) => acc + cur)
);

// P2:
async function p2() {
  return pipe(
    await getInput(),
    E.map((input) => input.split(EOL)),
    E.map(getTopThreeCalorEs),
    E.getOrElse(() => 0)
  );
}

async function run() {
  console.log("Most Calories:", await p1());
  console.log("Top 3 Combined:", await p2());
}

run();
