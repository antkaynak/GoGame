import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameComponent} from './game.component';
import {GameGuardService} from '../services/game-guard.service';

const routes: Routes = [
  {path: 'game', component: GameComponent, canActivate: [GameGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
