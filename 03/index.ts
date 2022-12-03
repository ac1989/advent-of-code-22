import { EOL } from "node:os";
import { readFile } from "node:fs/promises";

import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as S from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";
import { pipe, flow } from "fp-ts/function";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getInput = TE.tryCatch(
  () => readFile("./input", "utf-8"),
  (e) => e
);

const splitByNewline = (input: string) => input.split(EOL);

const bisectItem = (item: string) => {
  const asArray = item.split("");
  return A.chunksOf(asArray.length / 2)(asArray);
};

const charToValue = (c: string) => {
  return alphabet.indexOf(c) + 1;
};

const sumArray = A.reduce(0, (acc, cur: number) => acc + cur);

const calculateP1 = flow(bisectItem, (item) =>
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
    E.map(flow(splitByNewline, A.map(calculateP1), sumArray)),
    E.getOrElseW(() => "Failed to load file...")
  );

const run = async () => {
  console.log("P1", await p1());
};

run();
