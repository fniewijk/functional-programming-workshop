import tetris, { dimensions } from './functional/tetris';
import { Output, newPiece } from './functional/tetris';
import { Field } from './models/ticTacToe.model';
import { TetrominoPiece } from './models/tetris.model';

const rectSize = 20;

const setupCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');

  canvas.id = "CursorLayer";
  canvas.width = dimensions.width * rectSize;
  canvas.height = dimensions.height * rectSize;
  canvas.style.zIndex = '8';
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";

  document.body.appendChild(canvas);
  return canvas;
}

const canvas = setupCanvas();
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let state: Output;
state = tetris();
let nextPiece: TetrominoPiece;

const drawField = (field: Field[][]): void => {
  field.forEach((xFields: Field[], xIndex: number) => xFields.map((field: Field, yIndex: number) => {
    ctx.fillStyle = field === 1 ? "#00FF00" : "#FF0000";
    ctx.fillRect(rectSize*xIndex, rectSize*yIndex, rectSize, rectSize);
  }));
}

const drawPiece = (piece: TetrominoPiece): void => {
  (piece.shape as Field[][]).forEach((xFields: Field[], xIndex: number) => xFields.map((field: Field, yIndex: number) => {
    ctx.fillStyle = "#000000";
    if( field === 1) {
      ctx.fillRect(rectSize * (piece.x + xIndex), rectSize * (piece.y + yIndex), rectSize, rectSize);
    }
  }));
}

const intervalId: number = setInterval(() => {
  nextPiece = newPiece();
  state = tetris({ ...state, move: { x: 0, y: 1 }, nextPiece});
  drawField(state.field as Field[][]);
  drawPiece(state.piece);

  if(state.gameOver) {
    clearInterval(intervalId);
  }
}, 500);

document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 37:
      // left
      state = tetris({ ...state, move: { x: -1, y: 0 }, nextPiece })
      break;
    case 38:
      // up
      state = tetris({ ...state, rotate: true, nextPiece })
      break;
    case 39:
      // right
      state = tetris({ ...state, move: { x: 1, y: 0}, nextPiece })
      break;
    case 40:
      // down
      state = tetris({ ...state, move: { x: 0, y: 1 }, nextPiece })
      break;
  }

  drawField(state.field as Field[][]);
  drawPiece(state.piece);
}, false);