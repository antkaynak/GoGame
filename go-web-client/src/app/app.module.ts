import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {GameModule} from './game/game.module';
import {GameService} from './services/game.service';
import {MenuModule} from './menu/menu.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {GameGuardService} from './services/game-guard.service';
import {HttpClientModule} from '@angular/common/http';
import {BotEngineService} from './services/bot-engine.service';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenuModule,
    GameModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [GameService, GameGuardService, BotEngineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
