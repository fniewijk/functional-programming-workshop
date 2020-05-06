import { Field, Move, TetrominoPiece } from '../models/tetris.model';

export interface Output {
  field: Field[][];
  piece: TetrominoPiece;
}

export interface Input extends Output {
  field: Field[][];
  piece: TetrominoPiece;
  move?: Move;
  rotate?: boolean;
  nextPiece: TetrominoPiece;
}

const pieces = {
  iPiece: { x: 0, y: 0, shape: [[1, 1], [1, 1]] },
  oPiece: { x: 0, y: 0, shape: [[1], [1], [1], [1]] },
  lPiece: { x: 0, y: 0, shape: [[1, 0], [1,0], [1, 1]] }, 
  jPiece: { x: 0, y: 0, shape: [[0, 1], [0, 1], [1, 1]] },
  tPiece: { x: 0, y: 0, shape: [[1,1,1],[0,1,0]]},
  sPiece: { x: 0, y: 0, shape: [[1, 1, 0], [0, 1, 1]] },
  zPiece: { x: 0, y: 0, shape: [[0, 1, 1], [1, 1, 0]] },
}

const createField = (): Field[][] => [...new Array(10)].map((): Field[] => [...new Array(20)].map((): Field => 0));

// SideEffect
export const newPiece = (): TetrominoPiece => {
  const pick = Math.floor(Math.random() * Object.keys(pieces).length);
  return Object.assign({}, Object.values(pieces)[pick]);
}

export const newIPiece = (): TetrominoPiece => Object.assign({}, pieces.iPiece);
export const newOPiece = (): TetrominoPiece => Object.assign({}, pieces.oPiece);

const collisionDetection = (fields: Field[][], piece: TetrominoPiece): boolean => {
  
  let collision = false;
  
  piece.shape.forEach((yFields: Field[], xIndex: number) => {
    yFields.forEach((field: Field, yIndex: number) => {
      if(field === 1 && fields[piece.x + xIndex ][piece.y + yIndex] === field) {
        collision = true;
        return;
      }
    });
    if(collision) return;
  });

  return collision;
}

const placePiece = (field: Field[][], x: number, y: number, shape: Field[][]): Field[][] => {
  const newField = Object.assign({}, field);

  shape.forEach((yFields: Field[], xIndex: number) => {
    yFields.forEach((field: Field, yIndex: number) => {
      newField[x+ xIndex][y + yIndex] = field;
    })
  });
  return newField;
}

const movePiece = (field: Field[][], piece: TetrominoPiece, move: Move, nextPiece: TetrominoPiece): Output => {
  const newPos: Move = {
    x: piece.x + move.x ,
    y: piece.y + move.y,
  }
  if (newPos.x < 0) {
    return {
      field,
      piece: {
        ...piece,
        x: 0,
      }
    }
  }

  if (newPos.x + piece.shape.length > 9) {
    return {
      field,
      piece: {
        ...piece,
        x: 10 - piece.shape.length,
      }
    }
  }

  if (!collisionDetection(field, piece) && collisionDetection(field, { x: newPos.x, y: newPos.y, shape: piece.shape })) {
    const newField = placePiece(field, piece.x, piece.y, piece.shape);
    return { field: newField, piece: nextPiece };
  }

  if (newPos.y + piece.shape[0].length > 19) {
    const newField = placePiece(field, newPos.x, Math.min(18, newPos.y), piece.shape);
    return { field: newField, piece: nextPiece };
  }

  return { field, piece: {
    x: piece.x + move.x,
    y: piece.y + move.y,
    shape: [...piece.shape]
  } };
}

const rotatePiece = (field: Field[][], piece: TetrominoPiece): Output => {

  // add rotation collision and bounds checking.
  const newShape = [...new Array(piece.shape[0].length)].map(() => [...new Array(piece.shape.length)]);

  piece.shape.forEach((xValue: number[], indexX: number) => {
    xValue.forEach((yValue: number, indexY: number) => {
      newShape[indexY][indexX] = yValue;
    });
  });

  if (!collisionDetection(field, { ...piece, shape: newShape }) && !(piece.x + newShape.length > 9)){
    return {
      field, 
      piece: {
        ...piece,
        shape: newShape
      }
    };
  }
  return {
    field,
    piece
  }
}

// Rules, when you start you get a field and a 2x2 rectangular piece you can move with.
// When you do a move the piece movies.
// When the piece hits the bottom, it sticks there a new piece spawns at the top
// A piece can't go off the sides. x < 0 x > 9.
// When a piece hits a stuck piece it sticks to that.
// It has a long 4x1 piece you can select too.
// You can rotate pieces.

// TODO:
// other shapes
// remove complete lines.
// make rotation nicer?

export default (input?: Input): Output => {
  if (!input){
    return {
      field: createField(),
      piece: newIPiece(),
    }
  }
  if(input.rotate) {
    const { field, piece } = rotatePiece(input.field, input.piece);
    return {
      field,
      piece
    }
  }
  if(input.move) {
    const { field, piece } = movePiece(input.field, input.piece, input.move!, input.nextPiece);
    return {
      field,
      piece
    }
  }
  const { field, piece } = input;
  return {
    field,
    piece,
  }
}