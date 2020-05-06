import tetris from './tetris';
import { Output, newIPiece, newOPiece } from './tetris';

const pieceStartPosition = {
  x: 0,
  y: 0,
}

describe('tetris', () => {
  test('returns a playing field of 10x20', () => {
    expect(tetris().field.length).toEqual(10);
    expect(tetris().field[0].length).toEqual(20);
  });

  test('a submitted field is returned', () => {
    const { field, piece } = tetris();
    expect(tetris({
      field,
      piece,
      nextPiece: newIPiece()
    }).field).toEqual(field);
  });

  test('a player can make a move', () => {
    const { field, piece } = tetris();
    expect(tetris({
      field,
      piece,
      move: { x: 0, y: 1 },
      nextPiece: newIPiece()
    }).piece).toEqual({ x: piece.x, y: piece.y + 1, shape:piece.shape });
  });

  test('if a player makes a move and it hits the bottom it should show in the field', () => {
    const { field, piece } = tetris();
    const { x, y } = pieceStartPosition;
    const result: Output = tetris({
      field,
      piece,
      move: { x: 0, y: 19 },
      nextPiece: newIPiece()
    });
    expect(result.piece).toEqual({ x , y, shape: piece.shape });
    expect(result.field[0][19]).toEqual(1);
    expect(result.field[0][18]).toEqual(1);
    expect(result.field[1][19]).toEqual(1);
    expect(result.field[1][18]).toEqual(1);
  });

  test('A piece cant go off the left side', () => {
    const { field, piece } = tetris();
    const { x, y } = pieceStartPosition;
    const result: Output = tetris({
      field,
      piece,
      move: { x: -100, y: 0 },
      nextPiece: newIPiece()
    });
    expect(result.piece).toEqual({ x, y, shape: piece.shape });

  });

  test('A piece cant go off the right side', () => {
    const { field, piece } = tetris();
    const { y } = pieceStartPosition;
    const result: Output = tetris({
      field,
      piece,
      move: { x: 100, y: 0 },
      nextPiece: newIPiece()
    });
    expect(result.piece).toEqual({ x: 8, y, shape: piece.shape });

  });

  test('When a rectangle hits a block on board it should stick to that', () => {
    const { field, piece } = tetris();
    const firstGameState: Output = tetris({
      field,
      piece,
      move: { x: 0, y: 19 },
      nextPiece: newIPiece()
    });

    const secondGameState = tetris({
      field: firstGameState.field,
      piece: {
        x: 1,
        y: 16,
        shape: firstGameState.piece.shape,
      },
      move: { x: 0, y: 1 },
      nextPiece: newIPiece()
    });

    expect(secondGameState.field[1][17]).toEqual(1);
    expect(secondGameState.field[1][16]).toEqual(1);
    expect(secondGameState.field[2][16]).toEqual(1);
    expect(secondGameState.field[2][17]).toEqual(1);
  });

  test('When a long piece hits a block on board it should stick to that', () => {
    const { field, piece } = tetris();
    const firstGameState: Output = tetris({
      field,
      piece,
      move: { x: 0, y: 19 },
      nextPiece: newOPiece()
    });

    const secondGameState = tetris({
      field: firstGameState.field,
      piece: {
        x: 1,
        y: 17,
        shape: firstGameState.piece.shape,
      },
      move: { x: 0, y: 1 },
      nextPiece: newOPiece()
    });

    expect(secondGameState.field[1][17]).toEqual(1);
    expect(secondGameState.field[2][17]).toEqual(1);
    expect(secondGameState.field[3][17]).toEqual(1);
    expect(secondGameState.field[4][17]).toEqual(1);
  });

  test('When a rotated long piece hits a block on board it should stick to that', () => {
    const { field, piece } = tetris();
    const firstGameState: Output = tetris({
      field,
      piece,
      move: { x: 0, y: 19 },
      nextPiece: newOPiece()
    });

    const secondGameState = tetris({
      field: firstGameState.field,
      piece: firstGameState.piece,
      rotate: true,
      nextPiece: newOPiece()
    });

    const thirdGameState = tetris({
      field: secondGameState.field,
      piece: {
        x: 1,
        y: 14,
        shape: secondGameState.piece.shape,
      },
      move: { x: 0, y: 1 },
      nextPiece: newOPiece()
    });

    expect(thirdGameState.field[1][14]).toEqual(1);
    expect(thirdGameState.field[1][15]).toEqual(1);
    expect(thirdGameState.field[1][16]).toEqual(1);
    expect(thirdGameState.field[1][17]).toEqual(1);
  });

})
