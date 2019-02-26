import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {GameService} from '../../services/game.service';
import {take} from 'rxjs/operators';
import {BotEngineService} from '../../services/bot-engine.service';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {


  activeTurnSubscription: Subscription = null;
  activeTurnColor;
  activeTurnId;

  @ViewChild('canvas') public canvas: ElementRef;

  private context: CanvasRenderingContext2D;

  private boardSettings: any = {
    boardWidth: 19,
    boardHeight : 19,
    boardPadding : 6,
    pieceWidth : 27,
    pieceHeight : 27,
    pixelWidth : 522,
    pixelHeight : 522,
    imgPieceBlack : "piece-black.png",
    imgPieceWhite : "piece-white.png",
  };

  constructor(private gameService: GameService, private botEngineService : BotEngineService) { }

  ngOnInit() {
    this.gameService.engineStart();
    this.activeTurnColor = this.gameService.game.gameState.activeTurn.color;
    this.activeTurnId = this.gameService.game.gameState.activeTurn.id;
    this.activeTurnSubscription = this.gameService.activeTurnSubject.subscribe( data => {
      this.activeTurnColor = data.color;
      this.activeTurnId = data.id;
    });
  }

  ngOnDestroy(): void {
    if(this.activeTurnSubscription != null){
      this.activeTurnSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(){
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.context = canvasEl.getContext('2d');
    this.canvas.nativeElement.style.background = "transparent url(assets/board19x19.png) no-repeat 0 0";
    this.canvas.nativeElement.style['background-size'] = "cover";
    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .subscribe((res: any) => {
        this.handleEvent(res);
      });

    //touch support
    fromEvent(canvasEl, 'touchstart')
      .subscribe((res: any) => {
        this.handleEvent(res);
      });
  }

  handleEvent(res){
    if(this.gameService.game.gameState.activeTurn.color == "WHITE"){
      return;
    }
    const point = this.getPoint(res);
    if(!this.makeMove(point, "BLACK")){
      alert("Invalid move!");
      return;
    }

    this.botEngineService.postEngine(this.gameService.game.gameState.board).pipe(take(1)).subscribe( (data : Array<any>) =>  {
      console.log(data);
      console.log(Object.keys(data).length);
      for(let i = 0; i < Object.keys(data).length; i++){
        if(!this.makeMove(data[i], "WHITE")){
          if( i == data.length - 1){
            this.gameService.playerPass();
            alert("No valid move by the bot. Pass!");
            break;
          }
        }else{
          break;
        }
      }
    });
  }

  makeMove(point, color){
    let move = this.gameService.playerMove(point);
    if(move.valid){
      this.drawPiece(point, color);
      if(move.removed != null){
        this.clearPieces(move.removed);
      }
      return true;
    }
    return false;
  }


  getMousePos(clientX, clientY) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    let X = (clientX - rect.left) / (this.canvas.nativeElement.clientWidth / this.canvas.nativeElement.width);
    let Y = (clientY - rect.top) / (this.canvas.nativeElement.clientHeight / this.canvas.nativeElement.height);
    X = Math.ceil(X);
    Y = Math.ceil(Y);
    return {
      x: X,
      y: Y
    };
  }

  getPoint(e) {

    const pos = this.getMousePos(e.clientX, e.clientY);
    let x = pos.x;
    let y = pos.y;

    x -= this.boardSettings.boardPadding;
    y -= this.boardSettings.boardPadding;


    const point = {
      x: Math.floor(x/this.boardSettings.pieceHeight),
      y: Math.floor(y/this.boardSettings.pieceWidth)
    };

    return point;
  };

  getCoordsFromPoint(point) {
    return {
    y:((point.x) * this.boardSettings.pieceWidth) + this.boardSettings.boardPadding,
    x:((point.y) * this.boardSettings.pieceHeight) + this.boardSettings.boardPadding
  }

  };


  drawPiece(point, color) {
    const coords = this.getCoordsFromPoint(point);

    let piece = new Image();

    if (color == "BLACK") {
      piece.src = "assets/piece-black.png";
    } else {
      piece.src = "assets/piece-white.png";
    }

    let ctx = this.context;


    piece.onload = function () {
      ctx.drawImage(piece, coords.y, coords.x);
    };

  };

  clearPieces(removed){
    removed.forEach( piece => {

      let point = {
        x: piece.column,
        y: piece.row
      };

      const coords = this.getCoordsFromPoint(point);
      let ctx = this.context;
      ctx.clearRect(coords.y, coords.x, this.boardSettings.pieceWidth,
        this.boardSettings.pieceHeight);
    });

  }





}
