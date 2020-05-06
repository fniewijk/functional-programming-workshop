import { Field, Move, TetrominoPiece } from '../models/tetris.model';

export interface Output {
  field: Field[][];
  piece: TetrominoPiece;
}

export interface Input extends Output {
  move?: Move;
  rotate?: boolean;
  nextPiece: TetrominoPiece;
}

const pieces = {
  iPiece: { x: 0, y: 0, shape: [[1, 1], [1, 1]] },
  oPiece: { x: 0, y: 0, shape: [[1], [1], [1], [1]] },
  lPiece: { x: 0, y: 0, shape: [[1, 0], [1, 0], [1, 1]] },
  jPiece: { x: 0, y: 0, shape: [[0, 1], [0, 1], [1, 1]] },
  tPiece: { x: 0, y: 0, shape: [[1, 1, 1], [0, 1, 0]] },
  sPiece: { x: 0, y: 0, shape: [[1, 1, 0], [0, 1, 1]] },
  zPiece: { x: 0, y: 0, shape: [[0, 1, 1], [1, 1, 0]] },
}

const createField = (): Field[][] => [...new Array(10)].map((): Field[] => [...new Array(20)].map((): Field => 0));

export const dimensions: any = { width: 10, height: 20 };

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
      if (field === 1 && piece.x + xIndex < dimensions.width && piece.y + yIndex < dimensions.height && fields[piece.x + xIndex][piece.y + yIndex] === field) {
        collision = true;
        return;
      }
    });
    if (collision) return;
  });

  return collision;
}

const placePiece = (field: Field[][], x: number, y: number, shape: Field[][]): Field[][] => {
  const newField = field.concat();

  shape.forEach((yFields: Field[], xIndex: number) => {
    yFields.forEach((field: Field, yIndex: number) => {
      newField[x + xIndex][y + yIndex] = newField[x + xIndex][y + yIndex] || field;
    })
  });
  return newField;
}

const movePiece = (field: Field[][], piece: TetrominoPiece, move: Move, nextPiece: TetrominoPiece): Output => {
  const newPos: Move = {
    x: piece.x + move.x,
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

  if (newPos.x + piece.shape.length > dimensions.width) {
    return {
      field,
      piece: {
        ...piece,
        x: dimensions.width - piece.shape.length,
      }
    }
  }

  if (!collisionDetection(field, piece) && collisionDetection(field, { x: newPos.x, y: newPos.y, shape: piece.shape })) {
    const newField = placePiece(field, piece.x, piece.y, piece.shape);
    return { field: newField, piece: nextPiece };
  }

  if (newPos.y + piece.shape[0].length > dimensions.height) {
    const newField = placePiece(field, newPos.x, Math.min(dimensions.height - piece.shape[0].length), piece.shape);
    return { field: newField, piece: nextPiece };
  }

  return {
    field, piece: {
      x: piece.x + move.x,
      y: piece.y + move.y,
      shape: [...piece.shape]
    }
  };
}

const rotatePiece = (field: Field[][], piece: TetrominoPiece): Output => {

  // add rotation collision and bounds checking.
  const newShape = [...new Array(piece.shape[0].length)].map(() => [...new Array(piece.shape.length)]);

  piece.shape.forEach((xValue: number[], indexX: number) => {
    xValue.forEach((yValue: number, indexY: number) => {
      newShape[indexY][indexX] = yValue;
    });
  });

  if (!collisionDetection(field, { ...piece, shape: newShape }) && !(piece.x + newShape.length > dimensions.width - 1)) {
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

const removeLine = (fields: Field[][], line: number): Field[][] => {
  return fields.map((xValue: Field[]): Field[] => { 
    xValue.splice(line, 1); 
    xValue.unshift(0); 
    return xValue
  });
}

const removeLines = (fields: Field[][]): Field[][] => {

  let fullLine = true;

  for(let y = 0; y < fields[0].length; y++) {
    for (let x = 0; x < fields.length; x++) {
      if(fields[x][y] === 0) {
        fullLine = false;
      }
    }
    if (fullLine) {
      fields = removeLine([...fields], y)
    } 
    fullLine = true;
  }

  return fields;
}

// Rules, when you start you get a field and a 2x2 rectangular piece you can move with.
// When you do a move the piece movies.
// When the piece hits the bottom, it sticks there a new piece spawns at the top
// A piece can't go off the sides. x < 0 x > 9.
// When a piece hits a stuck piece it sticks to that.
// It has a long 4x1 piece you can select too.
// You can rotate pieces.
// other shapes
// remove complete lines.

// TODO:
// end game
// fix rotation

export default (input?: Input): Output => {
  if (!input) {
    return {
      field: createField(),
      piece: newIPiece(),
    }
  }
  if (input.rotate) {
    const { field, piece } = rotatePiece(input.field, input.piece);
    return {
      field,
      piece
    }
  }
  if (input.move) {
    const movePieceOutput = movePiece(input.field, input.piece, input.move!, input.nextPiece);
    const field = removeLines(movePieceOutput.field);
    return {
      field,
      piece: movePieceOutput.piece
    }
  }
  const { field, piece } = input;
  return {
    field,
    piece,
  }
}