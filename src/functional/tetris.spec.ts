import tetris, { createField, Output, newIPiece, newOPiece } from './tetris';

const pieceStartPosition = {
  x: 4,
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
    expect(result.field[4][19]).toEqual(1);
    expect(result.field[4][18]).toEqual(1);
    expect(result.field[5][19]).toEqual(1);
    expect(result.field[5][18]).toEqual(1);
  });

  test('A piece cant go off the left side', () => {
    const { field, piece } = tetris();
    const result: Output = tetris({
      field,
      piece,
      move: { x: -100, y: 0 },
      nextPiece: newIPiece()
    });
    expect(result.piece).toEqual({ x: 0, y: 0, shape: piece.shape });

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
        x: 4,
        y: 16,
        shape: firstGameState.piece.shape,
      },
      move: { x: 0, y: 1 },
      nextPiece: newIPiece()
    });

    expect(secondGameState.field[4][17]).toEqual(1);
    expect(secondGameState.field[4][16]).toEqual(1);
    expect(secondGameState.field[5][16]).toEqual(1);
    expect(secondGameState.field[5][17]).toEqual(1);
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
        x: 4,
        y: 14,
        shape: secondGameState.piece.shape,
      },
      move: { x: 0, y: 1 },
      nextPiece: newOPiece()
    });

    expect(thirdGameState.field[4][14]).toEqual(1);
    expect(thirdGameState.field[4][15]).toEqual(1);
    expect(thirdGameState.field[4][16]).toEqual(1);
    expect(thirdGameState.field[4][17]).toEqual(1);
  });

  test('When a line is full remove it', () => {
    const startField = createField(1);
    const { field } = tetris({
      field: startField,
      piece: newOPiece(),
      nextPiece: newOPiece()
    })
    expect(startField[0][0]).toBe(1);
    expect(field[0][0]).toBe(0);
    expect(field[1][0]).toBe(0);
  });

  test('End a game when a piece cant move', () => {
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
        x: 4,
        y: 17,
        shape: firstGameState.piece.shape,
      },
      move: { x: 0, y: 1 },
      nextPiece: newIPiece()
    });

    expect(secondGameState.gameOver).toBe(true);
  });
})
