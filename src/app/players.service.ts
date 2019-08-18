import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { map } from 'rxjs/operators';

@Injectable()
export class PlayersService {

  private _playersUrl = '../assets/nfl-players.json';

  constructor(private http: Http) { }

  searchPlayers(str) {
    return this.http.get(this._playersUrl).pipe(map(response => {
      const list = response.json();
      let matched = [];

      for(var i = 0; i < list.length; i++){
        if(list[i].Name.toLowerCase().indexOf(str.toLowerCase()) >= 0) {
          matched.push(list[i]);
        }
      }

      return matched;
    }));
  }
}
