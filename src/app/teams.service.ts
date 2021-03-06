import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private _teamsUrl = '../assets/teams.json'

  constructor(private http: Http) { }

  getTeams(){
    return this.http.get(this._teamsUrl).pipe(map(response => {
      let teams = response.json().teams;

      teams.sort((a, b) => {
        return a.draft_position - b.draft_position;
      });

      return {
        teams: teams,
        rounds: response.json().rounds
      }
     }));
  }
}
