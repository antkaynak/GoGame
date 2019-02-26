import { Injectable } from '@angular/core';
import {Game} from './game';
import {Subject} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GameService {

  game;
  canPlay: boolean = false;

  activeTurnSubject: Subject<any>;

  constructor() { }

  engineStart(){
    this.game = new Game();
    this.game.gameStart();
    this.activeTurnSubject = new Subject<any>();
    this.activeTurnSubject.next(this.game.gameState.activeTurn);
  }

  playerMove(point){
    const move = this.game.playerMove(point);
    this.activeTurnSubject.next(this.game.gameState.activeTurn);
    console.log("returnmove", this.game.gameState.board);
    return move;
  }

  playerPass(){
    this.game.nextTurn();
    this.activeTurnSubject.next(this.game.gameState.activeTurn);
  }


}
