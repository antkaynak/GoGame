import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {GameService} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class GameGuardService implements CanActivate{

  constructor(private gameService: GameService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.gameService.canPlay){
      return true;
    }else{
      this.router.navigate(['']);
      return false;
    }
  }


}
