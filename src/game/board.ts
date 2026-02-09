import { ROWS, COLS } from "./constants";

export type Cell = string | null;
export type Board = Cell[][];

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null)
  );
}
