import TicTacToe from './ticTacToe';
import { Player } from '../models/ticTacToe.model';

describe('imperative', () => {
  test('player one starts', () => {
    const game = new TicTacToe();
    expect(game).toBeTruthy();

    expect(game.getPlayer()).toBe(Player.One);
  });

  test('a player can make a move', () => {
    const game = new TicTacToe();
    expect(game).toBeTruthy();

    expect(game.makeMove({ x: 0, y: 0})).toBe(true);
  });

  test('a player can make a move within 3x3 square', () => {
    const game = new TicTacToe();
    expect(game).toBeTruthy();

    expect(game.makeMove({ x: 4, y: 4 })).toBe(false);
    expect(game.makeMove({ x: -1, y: -1 })).toBe(false);
  });

  test('a player can make a move, then its player 2s turn', () => {
    const game = new TicTacToe();

    game.makeMove({ x: 0, y: 0 })
    expect(game.getPlayer()).toBe(Player.Two);
  });

  test('a player wins horizontally', () => {
    const game = new TicTacToe();

    game.makeMove({ x: 0, y: 0 });
    game.makeMove({ x: 0, y: 1 });
    game.makeMove({ x: 1, y: 0 });
    game.makeMove({ x: 0, y: 2 });
    game.makeMove({ x: 2, y: 0 });
    expect(game.getStatus().winner).toEqual(Player.One);
  });

})
