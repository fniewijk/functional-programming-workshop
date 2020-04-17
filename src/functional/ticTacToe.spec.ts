import ticTacToe from './ticTacToe';
import { Player } from '../models/ticTacToe.model';

describe('functional', () => {
  test('first player starts', () => {
    expect(ticTacToe()).toEqual({ player: Player.One });
  });

  test('a player can make a move', () => {
    expect(ticTacToe([{ x: 0, y: 0 }])).toEqual({ player: Player.Two });
  });

  test('a player cant make a move outside 3x3 square', () => {
    const throwWrapper = (): void => {
      ticTacToe([{ x: -1, y: -1 }])
    }
    expect(throwWrapper).toThrow();

    const throwWrapper2 = (): void => {
      expect(ticTacToe([{ x: 4, y: 4 }])).toThrow();
    }
    expect(throwWrapper2).toThrow();
  });

  test('a player can win horizontally', () => {
    expect(ticTacToe([{ x: 0, y: 0 }, {x:1, y:0}, {x:1, y:0}, {x:1,y:1}, {x:2, y:0}]).winner).toEqual(Player.One);
  });

  test('a player can win vertically', () => {
    expect(ticTacToe([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }]).winner).toEqual(Player.One);
  });

  test('a player can win diagonally', () => {
    expect(ticTacToe([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 2 }]).winner).toEqual(Player.One);
  });
})
