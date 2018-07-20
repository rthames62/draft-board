import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { PlayersService} from './players.service';
import { TeamsService} from './teams.service';
import { DraftService } from './draft.service';
import { PickSelectorComponent } from './pick-selector/pick-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PickSelectorComponent
  ],
  imports: [
    BrowserModule, HttpModule, FormsModule
  ],
  providers: [
    PlayersService, TeamsService, DraftService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
