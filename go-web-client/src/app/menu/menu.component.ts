import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuBlack: string = "../../assets/menu_black.png";
  menuWhite: string = "../../assets/menu_white.png";

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.canPlay = true;
  }

  mouseOver(element){
    element.src = this.menuBlack;
  }

  mouseOverEnd(element){
    element.src = this.menuWhite;
  }

}
