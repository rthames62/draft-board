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
    return this.http.get(this._teamsUrl).pipe(map(response => { return response.json(); }))
  }
}
