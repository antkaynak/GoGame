export class Game {

  players: {
    player1: Player,
    player2: Player
  };
  gameState: {
    board,
    previousRemoved,
    activeTurn
  };

  constructor() {
  }

  gameStart() {
    this.players = {
      player1: new Player(1, 'BLACK'),
      player2: new Player(2, 'WHITE')
    };
    this.gameState = {
      board: null,
      previousRemoved: [],
      activeTurn: this.players.player1
    };

    this.gameState.board = new Array(19);
    for (let i = 0; i < 19; i++) {
      this.gameState.board[i] = new Array(19);
      for (let j = 0; j < 19; j++) {
        this.gameState.board[i][j] = {
          type: 'EMPTY',
          row: i,
          column: j,
          group: null
        };
      }
    }

    this.calculateGroups();
  }

  playerMove(point) {


    //check for out of board points
    //also if the player wants to play a point where a stone was removed a move ago ( chinese rule )
    if (point.x < 0 || point.x > 18 || point.y < 0 || point.y > 18 || point == null
    || this.gameState.previousRemoved.indexOf(this.gameState.board[point.y][point.x]) != -1) {
      return {
        valid: false,
        removed: null
      };
    }

    //point y first because it is [row][column] and x represents column and y represents row.
    if (this.gameState.board[point.y][point.x].type != 'EMPTY') {
      return {
        valid: false,
        removed: null
      };
    }

    this.gameState.board[point.y][point.x].type = this.gameState.activeTurn.color;

    let removed = this.calculateBoard(point);
    let invalidMove = removed.indexOf(this.gameState.board[point.y][point.x]) != -1;

    if (invalidMove) {
      this.gameState.board[point.y][point.x].type = "EMPTY";
      return {
        valid: false,
        removed: null
      };
    }

    this.gameState.previousRemoved = removed;
    this.nextTurn();

    if (removed.length != 0) {
      return {
        valid: true,
        removed: removed
      };
    } else {
      return {
        valid: true,
        removed: null
      };
    }
  }


  calculateBoard(point) {

    let removed = [];

    //calculate for the nonactive turn
    this.calculateGroups();
    this.calculateLiberties();
    this.removeInsideGroups(this.gameState.activeTurn.color == 'WHITE' ? 'BLACK' : 'WHITE', removed, point);

    //calculate for the active turn
    this.calculateGroups();
    this.calculateLiberties();
    this.removeInsideGroups(this.gameState.activeTurn.color, removed, point);

    return removed;
  }

  calculateGroups() {

    //creating a 19x19 array to store travel visit information
    let visited = new Array(19);
    for (let i = 0; i < 19; i++) {
      visited[i] = new Array(19);
      for (let j = 0; j < 19; j++) {
        visited[i][j] = false;
      }
    }


    for (let row = 0; row < 19; row++) {
      for (let column = 0; column < 19; column++) {
        let type = this.gameState.board[row][column].type;
        let group = {liberties: {}, members: []};
        this.groupStones(row, column, type, group, visited);
      }
    }
  }

  groupStones(row, column, type, group, visited) {
    //we have to group the stones so when they get captured
    //they are removed as a group instead of as individuals.
    if (row < 0 || row > 18 || column < 0 || column > 18) {
      return;
    }
    let stone = this.gameState.board[row][column];
    if (visited[row][column] || stone.type != type) {
      return;
    }

    stone.group = group;
    visited[row][column] = true;
    group.members.push(stone);

    //TODO remove recursion and implement iterative system for performance
    this.groupStones(row - 1, column, type, group, visited);
    this.groupStones(row + 1, column, type, group, visited);
    this.groupStones(row, column - 1, type, group, visited);
    this.groupStones(row, column + 1, type, group, visited);
  }

  calculateLiberties() {
    for (let row = 0; row < 19; row++) {
      for (let column = 0; column < 19; column++) {
        if (this.gameState.board[row][column].type == 'EMPTY') {
          this.addLiberty(row, column, row - 1, column);
          this.addLiberty(row, column, row + 1, column);
          this.addLiberty(row, column, row, column - 1);
          this.addLiberty(row, column, row, column + 1);
        }
      }
    }
  }

  private addLiberty(liberty_row, liberty_column, row, column) {
    if (row < 0 || row > 18 || column < 0 || column > 18) {
      return;
    }

    let stone = this.gameState.board[row][column];
    if (stone.group == null) {
      return;
    }


    if (this.gameState.board[row][column] != null) {
      //using string array key instead of a 2D array
      stone.group.liberties[liberty_row + ' ' + liberty_column] = true;
    }
  }


  removeInsideGroups(type, removed, point) {
    for (let row = 0; row < 19; row++) {
      for (let column = 0; column < 19; column++) {
        let stone = this.gameState.board[row][column];
        let group = stone.group;
        if (stone.type == type
          && Object.keys(group.liberties).length === 0
          && removed.indexOf(stone) == -1) {

          let suicide = false;
          for(let stone of group.members){
            removed.push(stone);
            if(stone.column == point.x && stone.row == point.y){
              suicide = true;
            }
          }

          if(suicide){
            return;
          }

          for (let stone of group.members) {
            console.log("removing");
            // removed.push(stone);

            //storing type because the rules states that other player
            //cannot place a stone on a previously removed place.
            stone.previously = stone.type;

            stone.type = 'EMPTY';
          }
        }
      }
    }
  }

  nextTurn(){
    //after a valid move nextTurn
    if (this.gameState.activeTurn.id == 1) {
      this.gameState.activeTurn = this.players.player2;
    } else {
      this.gameState.activeTurn = this.players.player1;
    }
  }

}

export class Player {

  id;
  color;

  constructor(id, color) {
    this.id = id;
    this.color = color;
  }

}


