import { Component, OnInit } from '@angular/core';

import { PlayersService } from '../players.service';
import { TeamsService } from '../teams.service';
import { DraftService } from '../draft.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  searchedPlayers: Array<any> = [];
  searchInput: String;
  leagueTeams: Array<any>;
  selectedPlayer = {
    displayName: ''
  };

  draftRounds: Array<Number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  currentPick;
  draftResults;
  playerSearchModal: String;
  upcomingPicks = [];

  constructor(
    private playersService: PlayersService,
    private teamsService: TeamsService,
    private draftService: DraftService
  ) { }

  ngOnInit() {
    this.teamsService.getTeams().subscribe(data => {
      this.leagueTeams = data.teams;
      this.draftResults = this.draftService.buildDraftResults(data.teams);
      this.upcomingPicks = data.teams;
    });
  }

  searchPlayers(e) {
    this.playersService.searchPlayers(this.searchInput).subscribe(data => {
      this.searchedPlayers = data;
    });
  }

  assignPick(team, player) {
    this.draftResults = this.draftService.assignPick(team, player);
    this.playerSearchModal = "";
    this.searchInput = "";
    this.searchedPlayers = [];
  }

  getPlayerSearchModal(str){
    this.playerSearchModal = str;
  }

  showPlayerSearch(){
    this.playerSearchModal = 'active';
  }

  closePlayerSearch(e){
    if(e.target.className === 'player-search active'){
      this.playerSearchModal = '';
    }
  }
}
