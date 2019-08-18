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
  leageRounds: number;
  leagueRowHeights;
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
  draftActive: boolean = false;
  draftStarted: boolean = false;

  @ViewChild(CountdownComponent)
  countdownComponent: CountdownComponent;

  constructor(
    private playersService: PlayersService,
    private teamsService: TeamsService,
    private draftService: DraftService
  ) { }

  ngOnInit() {
    this.teamsService.getTeams().subscribe(data => {
      this.leagueTeams = data.teams;
      this.leageRounds = data.rounds;
      this.leagueRowHeights = `rounds${data.rounds}`;
      this.draftResults = this.draftService.buildDraftResults(data.teams, data.rounds);

      if(this.draftResults[0][0].pick.name) {
        this.draftStarted = true;
      }

      this.buildUpcomingPicks();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'xxxxx');
  }

  searchPlayers(e) {
    if(this.searchInput.length > 2) {
      this.playersService.searchPlayers(this.searchInput).subscribe(data => {
        this.searchedPlayers = data;
        console.log()
      });
    } else {
      this.searchedPlayers = [];
    }

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
    if(pick.pick.name) {
      this.showRemovePlayer = true;
    }
    this.playerSearchModal = 'active';
    this.currentPick = pick;
    setTimeout(() => {
      document.getElementById('player-search').focus();
    }, 100);

  }

  closePlayerSearch(e){
    if(e.target.className === 'player-search active'){
      this.playerSearchModal = '';
    }
  }

  startCountdown(){
    this.draftActive = true;
    if(this.draftResults[0][0].pick.name) {
      this.restartTimer = 'start';
    } else {
      this.countdownActive = true;
    }
  }

  startDraft(e){
    this.restartTimer = 'start';
    this.countdownActive = false;
    this.draftStarted = true;
  }

  pauseDraft(){
    this.restartTimer = 'stop'
    this.draftActive = false;
  }

  clearDraft(){
    if(window.confirm('Are you sure you want to clear the draft?')){
      this.draftService.clearDraft();
      this.draftResults = this.draftService.buildDraftResults(this.leagueTeams, this.leageRounds);
    }
    this.draftActive = false;
    this.draftStarted = true;
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
