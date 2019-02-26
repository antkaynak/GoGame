import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './menu.component';
import {MenuRoutingModule} from './menu-routing.module';
import {MatCardModule, MatListModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule,
    MatListModule,
    MatCardModule
  ],
  declarations: [
    MenuComponent
  ]
})
export class MenuModule {
}
