import { Player, Field, Move, Status } from "../models/ticTacToe.model";

class TicTacToe {
  player: Player;
  field: Field[][];

  constructor() {
  this.player = Player.One;
    this.field = [Array(3), Array(3), Array(3)];
  }

  makeMove(move: Move): boolean {
    if(move.x > 3 || move.x < 0) {
      return false;
    }
    if (move.y > 3 || move.y < 0) {
      return false;
    }
    this.field[move.x][move.y] = { player: this.player };
    this.player = this.player === Player.One ? Player.Two : Player.One;
    return true;
  }

  horizontalWin(_player: Player): boolean {
    let win = true;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        win = win && this.field[x][y]?.player === _player;
      }
      if (win) {
        return win;
      }
    }
    return win;
  }

  getStatus(): Status {

    const playerOneHorizontalWin = this.horizontalWin(Player.One);
    const playerTwoHorizontalWin = this.horizontalWin(Player.Two);

    return {
      player: Player.Two,
      winner: playerOneHorizontalWin ? Player.One : playerTwoHorizontalWin ? Player.Two : undefined,
    }
  }

  getPlayer(): Player {
    return this.player
  }
}

export default TicTacToe