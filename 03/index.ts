import { EOL } from "node:os";
import { readFile } from "node:fs/promises";

import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as M from "fp-ts/Monoid";
import * as N from "fp-ts/number";
import * as S from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";
import { pipe, flow } from "fp-ts/function";

// SHARED:

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getInput = TE.tryCatch(
  () => readFile("./input", "utf-8"),
  (e) => e
);

const splitByNewline = (input: string) => input.split(EOL);

const charToValue = (c: string) => {
  return alphabet.indexOf(c) + 1;
};

const sum = M.concatAll(N.MonoidSum);

// P1
const bisectItem = (item: string) => {
  const asArray = item.split("");
  return A.chunksOf(asArray.length / 2)(asArray);
};

const getValuesP1 = flow(bisectItem, (item) =>
  pipe(
    A.intersection(S.Eq)(item[0])(item[1]),
    A.uniq(S.Eq),
    (x) => x[0],
    charToValue
  )
);

const p1 = async () =>
  pipe(
    await getInput(),
    E.map(flow(splitByNewline, A.map(getValuesP1), sum)),
    E.getOrElseW(() => "Failed to load file...")
  );

// P2
const intersectRec = (xs: string[][]): string[] => {
  switch (xs.length > 1) {
    case true:
      return intersectRec([
        A.intersection(S.Eq)(xs[0])(xs[1]),
        ...A.dropLeft(2)(xs),
      ]);
    default:
      return xs[0];
  }
};

const getValuesP2 = flow(
  A.map((x: string) => x.split("")),
  intersectRec,
  A.uniq(S.Eq),
  (x) => x[0],
  charToValue
);

const p2 = async () =>
  pipe(
    await getInput(),
    E.map(flow(splitByNewline, A.chunksOf(3), A.map(getValuesP2), sum)),
    E.getOrElseW(() => "Failed to load file...")
  );

const run = async () => {
  console.log("P1", await p1());
  console.log("P2", await p2());
};

run();
