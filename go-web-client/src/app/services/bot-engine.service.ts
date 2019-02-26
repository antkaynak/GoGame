import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BotEngineService {

  constructor(private httpClient : HttpClient) { }

  postEngine(board){

    let bodyArray = JSON.parse(JSON.stringify(board, function(key, value){
      if( key == 'members') {return null;}
      else { return value; }
    }));

    return this.httpClient.post("http://localhost:8080/prediction",{
        bodyArray
      },
      {
        headers:
          {'Content-type': 'application/json'}
      });
  }
}
