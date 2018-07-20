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
  currentPick: Number;
  currentTeamPicking: Number = 1;

  playerSearchModal: String;

  constructor(
    private playersService: PlayersService,
    private teamsService: TeamsService,
    private draftService: DraftService
  ) { }

  ngOnInit() {
    this.teamsService.getTeams().subscribe(data => {
      this.leagueTeams = data.teams;
      console.log(this.leagueTeams);
    });
  }

  searchPlayers(e) {
    this.playersService.searchPlayers(this.searchInput).subscribe(data => {
      this.searchedPlayers = data;
    });
  }

  assignPick(team, player) {
    this.draftService.assignPick(team, player);
    this.selectedPlayer = player;
    this.playerSearchModal = "";
  }

  getPlayerSearchModal(str){
    this.playerSearchModal = str;
  }

  showPlayerSearch(){
    this.playerSearchModal = 'active';
  }
}
