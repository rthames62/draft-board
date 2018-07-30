import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { PlayersService } from '../players.service';
import { TeamsService } from '../teams.service';
import { DraftService } from '../draft.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {

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
  upcomingPicks: Array<any>;
  restartTimer;

  constructor(
    private playersService: PlayersService,
    private teamsService: TeamsService,
    private draftService: DraftService
  ) { }

  ngOnInit() {
    this.teamsService.getTeams().subscribe(data => {
      this.leagueTeams = data.teams;
      this.draftResults = this.draftService.buildDraftResults(data.teams);

      this.buildUpcomingPicks();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  searchPlayers(e) {
    this.playersService.searchPlayers(this.searchInput).subscribe(data => {
      this.searchedPlayers = data;
    });
  }

  assignPick(team, player) {
    let draftStatus = this.draftService.getDraftStatus();
    this.updateUpcomingPicks();

    this.draftResults = this.draftService.assignPick(team, player);
    this.playerSearchModal = "";
    this.searchInput = "";
    this.searchedPlayers = [];
    this.restartTimer = 'nextPick';
    setTimeout(()=>{
      this.restartTimer = '';
    }, 500);
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

  startDraft(){
    this.restartTimer = 'start'
  }

  pauseDraft(){
    this.restartTimer = 'stop'
  }

  clearDraft(){
    this.draftService.clearDraft();
    this.draftResults = this.draftService.buildDraftResults(this.leagueTeams);
  }

  private updateUpcomingPicks():void {
    let status = this.draftService.getDraftStatus();

    console.log(status.overallPick, this.currentPick);

    if(status.overallPick === this.currentPick.overallPick) {
      this.upcomingPicks.shift();
    }
  }

  private buildUpcomingPicks() {
    let draftStatus = this.draftService.getDraftStatus();
    
    this.upcomingPicks = this.draftService.buildUpcomingPicks();
  }
}
