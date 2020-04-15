import ticTacToe from './ticTacToe';

test('gives the right player at the start', () => {
  expect(ticTacToe()).toBe(0);
});