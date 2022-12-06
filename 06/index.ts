import { readFile } from "node:fs/promises";

import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as S from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

const getInput = TE.tryCatch(
  () => readFile("./input", "utf-8"),
  (e) => e
);

const isMarker = (input: string[], len: number) =>
  A.uniq(S.Eq)(input).length === len;

const locateMarkerRec = (input: string[], i: number, len: number): number => {
  if (isMarker(input.slice(i, i + len), len)) return i + len;
  return locateMarkerRec(input, i + 1, len);
};

const p1 = async () =>
  pipe(
    await getInput(),
    E.map((s) => s.split("")),
    E.map((xs) => locateMarkerRec(xs, 0, 4)),
    E.getOrElseW(() => "Failed to load file...")
  );

const p2 = async () =>
  pipe(
    await getInput(),
    E.map((s) => s.split("")),
    E.map((xs) => locateMarkerRec(xs, 0, 14)),
    E.getOrElseW(() => "Failed to load file...")
  );

const run = async () => {
  console.log("P1", await p1());
  console.log("P2", await p2());
};

run();
