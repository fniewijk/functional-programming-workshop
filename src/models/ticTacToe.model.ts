export enum Player {
  One = 'X',
  Two = 'O'
}

export interface Field {
  player?: Player;
}

export interface Move {
  x: number;
  y: number;
}

export interface Status {
  ended: boolean;
  winner?: Player;
}