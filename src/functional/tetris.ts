import { Field, Move, TetrominoPiece } from '../models/tetris.model';

export interface Dimensions {
  width: number;
  height: number;
}

export interface Output {
  field: Field[][];
  piece: TetrominoPiece;
  gameOver?: boolean;
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

export const dimensions: Dimensions = { width: 10, height: 20 };

export const createField = (fill = 0): Field[][] => [...new Array(dimensions.width)].map((): Field[] => [...new Array(dimensions.height)].map((): Field => fill));

const instantiatePiece = (piece: TetrominoPiece): TetrominoPiece => {
  return { ...piece, x: Math.floor(dimensions.width / 2 - Math.floor(piece.shape.length / 2)) }
}
// SideEffect
export const newPiece = (): TetrominoPiece => {
  const pick = Math.floor(Math.random() * Object.keys(pieces).length);
  const piece = Object.values(pieces)[pick];
  return instantiatePiece(piece);
}

export const newIPiece = (): TetrominoPiece => instantiatePiece(pieces.iPiece);
export const newOPiece = (): TetrominoPiece => instantiatePiece(pieces.oPiece);

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

  const currentPositionCollision = collisionDetection(field, piece);
  const nextPositionCollision = collisionDetection(field, { x: newPos.x, y: newPos.y, shape: piece.shape });

  if (currentPositionCollision && nextPositionCollision) {
    return { field, piece, gameOver: true };
  }

  if (!currentPositionCollision && nextPositionCollision) {
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
  const newShape = [...new Array(piece.shape[0].length)].map(() => [...new Array(piece.shape.length).map(()=>0)]);

  piece.shape.forEach((xValue: number[], indexX: number) => {
    xValue.forEach((yValue: number, indexY: number) => {
      newShape[indexY][piece.shape.length - 1 - indexX] = yValue;
    });
  });

  if (!collisionDetection(field, { ...piece, shape: newShape }) && !(piece.x + newShape.length > dimensions.width)) {
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
    const newXValue = [...xValue];
    newXValue.splice(line, 1); 
    newXValue.unshift(0); 
    return newXValue
  });
}

const removeLines = (fields: Field[][]): Field[][] => {
  let newFields = [...fields];
  let fullLine = true;
  for(let y = 0; y < newFields[0].length; y++) {
    for (let x = 0; x < newFields.length; x++) {
      if(newFields[x][y] === 0) {
        fullLine = false;
      }
    }
    if (fullLine) {
      newFields = removeLine(newFields, y)
    } 
    fullLine = true;
  }
  return newFields;
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
// end game

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
      piece: movePieceOutput.piece,
      gameOver: movePieceOutput.gameOver === true
    }
  }
  const { piece } = input;
  const field = removeLines(input.field);
  return {
    field,
    piece,
  }
}