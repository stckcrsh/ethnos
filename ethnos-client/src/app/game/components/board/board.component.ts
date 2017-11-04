import { Player } from '../../models/player.model';
import { Space } from '../../models/space.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as player from '../../reducers/players.reducer';
import * as board from '../../reducers/board.reducer';
import * as R from 'ramda';

const mapPlayersToSpace = R.over(R.lensProp('pieces'), R.map())

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  public board$: ReplaySubject<board.State> = new ReplaySubject<board.State>();

  @Input()
  public set board(value: board.State) {
    this.board$.next(value);
  }

  @Input()
  public players: player.State;

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {

  }

}
