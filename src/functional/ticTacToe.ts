import { Player, Move } from '../models/ticTacToe.model';
interface TicTacToeResponse {
  player: Player;
  winner?: Player;
}

const validMoves = (moves: Move[]): boolean => {
  if(moves.length > 0) {
    return moves[0].x >= 0 && moves[0].x <= 3 && moves[0].y >= 0 && moves[0].y <= 3 && validMoves(moves.slice(1))
  }
  return true;
}



const checkWinHorizontal = (moves: Move[]): boolean => {
  let win = true;
  for (let y = 0; y < 3; y++)  {
    for (let x = 0; x < 3; x++){
      win = win && moves.find((move) => x === move.x && y === move.y) !== undefined;
    }
    if(win) {
      return win;
    }
  }
  return win;
}

const recursiveCheckWin = (moves: Move[], startMove: Move, mutationMove?: Move): boolean => {

  if(!mutationMove) {
    return moves.find((move) => startMove.x === move.x && startMove.y === move.y) !== undefined;
  }

  let win = true;
  for (let index = 0; index < 3; index++) {
    win = win && recursiveCheckWin(moves, {x: startMove.x + mutationMove.x * index, y: startMove.y + mutationMove.y * index});
  }
  return win;
}

const checkWinVertical = (moves: Move[]): boolean => {
  return recursiveCheckWin(moves, { x: 0, y: 0 }, { x: 0, y: 1 }) || recursiveCheckWin(moves, { x: 1, y: 0 }, { x: 0, y: 1}) || recursiveCheckWin(moves, { x: 2, y: 0 }, { x: 0, y: 1 });
}

const checkWinDiagonal = (moves: Move[]): boolean => {
  return recursiveCheckWin(moves, { x: 0, y: 0 }, { x: 1, y: 1 }) || recursiveCheckWin(moves, { x: 2, y: 0 }, { x: -1, y: 1 });
}

const checkWin = (moves: Move[]): boolean => {
  return checkWinHorizontal(moves) || checkWinVertical(moves) || checkWinDiagonal(moves);
}

export default (moves?: Move[]): TicTacToeResponse => {

  if (moves) {
    const valid = validMoves(moves);
    if (!valid) {
      throw new Error();
    }

    const playerOneWins: boolean = checkWin(moves.filter((move, index) => index % 2 === 0));
    const playerTwoWins: boolean = checkWin(moves.filter((move, index) => index % 2 === 1));

    return {
      player: moves.length % 2 === 0 ? Player.One : Player.Two,
      winner: (playerOneWins || playerTwoWins) ? (playerOneWins ? Player.One : Player.Two) : undefined
    };
  }

  return {
    player: Player.One
  };
  
}