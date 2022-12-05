import { EOL } from "node:os";
import { readFile } from "node:fs/promises";

import * as A from "fp-ts/Array";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as N from "fp-ts/number";
import { pipe, flow } from "fp-ts/function";

const getInput = TE.tryCatch(
  () => readFile("./input", "utf-8"),
  (e) => e
);

const toPairs = (line: string): [number, number][] =>
  line.split(",").map((s) => s.split("-").map((d) => parseInt(d, 10))) as [
    number,
    number
  ][];

const toRange = ([start, end]: [number, number]) => {
  const length = end - start + 1;
  return A.makeBy(length, (i) => i + start);
};

const isFullIntersect = (pairs: number[][]) => {
  const smallest = A.sort(N.Ord)([pairs[0].length, pairs[1].length])[0];
  return A.intersection(N.Eq)(pairs[0])(pairs[1]).length === smallest;
};

const isIntersect = (pairs: number[][]) =>
  A.intersection(N.Eq)(pairs[0])(pairs[1]).length > 0;

const countFullIntersect = flow(
  A.map(flow(toPairs, A.map(toRange), isFullIntersect)),
  A.reduce(0, (acc: number, cur: boolean) => (cur ? acc + 1 : acc))
);

const countIsIntersect = flow(
  A.map(flow(toPairs, A.map(toRange), isIntersect)),
  A.reduce(0, (acc: number, cur: boolean) => (cur ? acc + 1 : acc))
);

async function p1() {
  return pipe(
    await getInput(),
    E.map(flow((input) => input.split(EOL), countFullIntersect)),
    E.getOrElseW(() => 0)
  );
}

async function p2() {
  return pipe(
    await getInput(),
    E.map(flow((input) => input.split(EOL), countIsIntersect)),
    E.getOrElseW(() => 0)
  );
}

async function run() {
  console.log("P1:", await p1());
  console.log("P2:", await p2());
}

run();
