export type Field = number;

export interface Move {
  x: number;
  y: number;
}

export interface Tetromino<T> {
  x: number;
  y: number;
  shape: T;
}

export type TetrominoPiece = Tetromino<Field[][]>