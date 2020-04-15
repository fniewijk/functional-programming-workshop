import TicTacToe from './ticTacToe';

test('gives the right player at the start', () => {
  const game = new TicTacToe();
  expect(game.getPlayer()).toBe(0);
});