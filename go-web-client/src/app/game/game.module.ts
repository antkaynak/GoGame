import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameRoutingModule} from './game-routing.module';
import {GameComponent} from './game.component';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule
  ],
  declarations: [
    GameComponent,
    CanvasComponent
  ]
})
export class GameModule {
}
