import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { map } from 'rxjs/operators';

import { TeamsService } from './teams.service';
import { Pick } from './pick';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  draftResults = [];
  currentPick = localStorage.getItem('currentPick') ? parseInt(localStorage.getItem('currentPick')) : 1;
  currentRound = localStorage.getItem('currentRound') ? parseInt(localStorage.getItem('currentRound')) : 1;
  overallPick = localStorage.getItem('overallPick') ? parseInt(localStorage.getItem('overallPick')) : 1;
  teamLogoUrl = '/assets/images/';
  leagueTeams;
  leagueRounds: number;

  currentPositionPickRank = {
    qb: 1,
    rb: 1,
    wr: 1,
    te: 1,
    def: 1
  }

  private advanceDraft(){
    this.overallPick += 1;

    if((this.currentPick % this.leagueTeams) === 0 && this.overallPick > this.leagueTeams) {
      this.currentPick = 1;
      this.currentRound += 1;
    } else {
      this.currentPick += 1;
    }

    localStorage.setItem('currentPick', this.currentPick.toString());
    localStorage.setItem('currentRound', this.currentRound.toString());
    localStorage.setItem('overallPick', this.overallPick.toString());
    localStorage.setItem('currentPositionPickRank', JSON.stringify(this.currentPositionPickRank));
  }

  constructor(
    private http: Http,
    private teamsService: TeamsService
  ) {
    const positionPickRank = localStorage.getItem('currentPositionPickRank');

    if(positionPickRank) {
      this.currentPositionPickRank = JSON.parse(positionPickRank);
    }
  }

  assignPick(currentPick, player) {
    if(currentPick.round % 2 !== 0) {
      var thisPick = this.draftResults[currentPick.round - 1][currentPick.pickNumber - 1]
    } else {
      var thisPick = this.draftResults[currentPick.round - 1][(this.draftResults[0].length - currentPick.pickNumber)]
    }

    thisPick.pick.name = player.Name;
    thisPick.pick.position = player.Position;
    thisPick.pick.team = player.Team;
    thisPick.pick.teamLogo = this.teamLogoUrl + `${player.Team.toLowerCase()}.png`;

    this.renderCurrentPositionPickRanks();

    if(currentPick.overallPick === this.overallPick){
      this.advanceDraft();
    }

    window.localStorage.setItem('draftResults', JSON.stringify(this.draftResults));

    console.log(this.draftResults);

    return this.draftResults;
  }

  buildDraftResults(teams, rounds){
    this.draftResults = [];
    this.leagueTeams = teams;
    this.leagueRounds = rounds;
    let storedResults = JSON.parse(window.localStorage.getItem('draftResults'));

    if(storedResults) {
      this.draftResults = storedResults;
      this.currentPick = parseInt(localStorage.getItem('currentPick'));
      this.currentRound = parseInt(localStorage.getItem('currentRound'));
      return this.draftResults;
    } else {
      let overallPick = 1;
      let currentRound = 1;
      for(let i = 0; i < rounds; i++){
        let currentPick = 1;
        this.draftResults.push([]);

        if(i % 2 === 0) {
          for(let j = 0; j < teams.length; j++){

            let pick = {
              pickNumber: currentPick,
              overallPick,
              round: currentRound,
              team: teams[j].team_name,
              teamLogo: teams[j].image_path,
              pick: {}
            };
            this.draftResults[i].push(pick);
            currentPick += 1;
            overallPick += 1;
          }
        } else {
          for(let j = teams.length - 1; j >= 0; j--) {
            let pick = {
              pickNumber: currentPick,
              overallPick,
              round: currentRound,
              team: teams[j].team_name,
              teamLogo: teams[j].image_path,
              pick: {}
            };
            this.draftResults[i].push(pick);
            currentPick += 1;
            overallPick += 1;
          }
          this.draftResults[i].reverse();
        }

        currentRound += 1;
      }

      return this.draftResults;
    }
  }

  getDraftStatus() {
    return {
      pick: this.currentPick,
      round: this.currentRound,
      overallPick: this.overallPick
    };
  }

  clearDraft() {
    localStorage.clear();
  }

  buildUpcomingPicks(){
    let upcoming = [];
    let results = JSON.parse(JSON.stringify(this.draftResults));

    for(let i = 0; i < results.length; i++) {
      if(i % 2 !== 0) {
        results[i].reverse();
      }
    }

    for(let i = this.currentRound - 1; i < this.leagueRounds; i++) {
      for(let j = 0; j < this.leagueTeams.length; j++) {
        if(!results[i][j].pick.name){
          upcoming.push(results[i][j]);
        }
      }
    }

    return upcoming;
  }

  removeSelectedPlayer(overallPick, round){
    for(let i = 0; i < this.draftResults[round - 1].length; i++) {
      if(this.draftResults[round - 1][i].overallPick === overallPick) {
        this.draftResults[round - 1][i].pick = {};
      }
    }
    this.renderCurrentPositionPickRanks();

    window.localStorage.setItem('draftResults', JSON.stringify(this.draftResults));
  }

  private renderCurrentPositionPickRanks() {
    this.currentPositionPickRank = {
      qb: 1,
      rb: 1,
      wr: 1,
      te: 1,
      def: 1
    };
    this.draftResults.forEach(x => {
      x.forEach(y => {
        if(y.pick.name) {
          switch(y.pick.position) {
            case 'QB':
              y.pick.positionPickRank = this.currentPositionPickRank.qb;
              this.currentPositionPickRank.qb += 1;
              break;
            case 'RB':
              y.pick.positionPickRank = this.currentPositionPickRank.rb;
              this.currentPositionPickRank.rb += 1;
              break;
            case 'WR':
              y.pick.positionPickRank = this.currentPositionPickRank.wr;
              this.currentPositionPickRank.wr += 1;
              break;
            case 'TE':
              y.pick.positionPickRank = this.currentPositionPickRank.te;
              this.currentPositionPickRank.te += 1;
              break;
            case 'DEF':
              y.pick.positionPickRank = this.currentPositionPickRank.def;
              this.currentPositionPickRank.def += 1;
              break;
          }
        };
      });
    });
  }
}
