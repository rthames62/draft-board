import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { PlayersService } from '../players.service';
import { TeamsService } from '../teams.service';
import { DraftService } from '../draft.service';

import { CountdownComponent } from '../countdown/countdown.component';

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
  countdownActive: boolean = false;
  showRemovePlayer: boolean = false;
  
  @ViewChild(CountdownComponent)
  countdownComponent: CountdownComponent;

  constructor(
    private playersService: PlayersService,
    private teamsService: TeamsService,
    private draftService: DraftService
  ) { }

  ngOnInit() {
    this.teamsService.getTeams().subscribe(data => {
      this.leagueTeams = data;
      this.draftResults = this.draftService.buildDraftResults(data);

      this.buildUpcomingPicks();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'xxxxx');
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

  showPlayerSearch(pick){
    if(pick.pick.displayName) {
      this.showRemovePlayer = true;
    }
    this.playerSearchModal = 'active';
    this.currentPick = pick;
  }

  closePlayerSearch(e){
    if(e.target.className === 'player-search active'){
      this.playerSearchModal = '';
    }
  }

  startCountdown(){
    if(this.draftResults[0][0].pick.displayName) {
      this.restartTimer = 'start';
    } else {
      this.countdownActive = true;
    }
  }

  startDraft(e){

    this.restartTimer = 'start';
    this.countdownActive = false;
  }

  pauseDraft(){
    this.restartTimer = 'stop'
  }

  clearDraft(){
    if(window.confirm('Are you sure you want to clear the draft?')){
      this.draftService.clearDraft();
      this.draftResults = this.draftService.buildDraftResults(this.leagueTeams);
    }
  }

  removeSelectedPick(pick){
    pick.pick = {};
    this.showRemovePlayer = false;
    this.draftService.removeSelectedPlayer(pick.overallPick, pick.round);
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
