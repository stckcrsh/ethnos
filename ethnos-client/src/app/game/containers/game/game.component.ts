import { GameEffects } from '../../effects/game.effects';
import { DrawDrawAction } from '../../actions/draw-pile.actions';
import { DeckDrawnAction } from '../../actions/deck.actions';
import shuffle from '../../../../helpers/shuffle';
import { DrawCardAction, RoundStartAction, NextTurnAction } from '../../actions/game.actions';
import { Card } from '../../models/card.model';
import { Player } from '../../models/player.model';
import {
  getAllCardIds,
  getAllDragonIds,
  getAllPlayers,
  getAllSpaces,
  getBoardState,
  getCardEntities,
  getCurrentPlayerId,
  getDeckState,
  getDrawPile,
  getTopCard,
  getPlayerState
} from '../../reducers/reducers';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { getCurrentPlayer } from '../../reducers/reducers';

@Component({
  selector: 'app-game',
  template: `
    <app-board [board]="board$ | async" [players]="playerState$|async"></app-board>
    <div>
      <app-deck [size]="deckSize$ | async" (draw)="drawCard()"></app-deck>
      <app-draw [cards]="drawPile$ | async" (draw)="drawDraw($event)"></app-draw>
    </div>
    <h3>Turn: {{(currentPlayer$ | async).name}}</h3>
    <div class="player-state" *ngFor="let player of players$ | async;let idx = index;trackBy:trackByPlayer" >
      <app-player-state class="player-state" [player]="player" [isCurrentPlayer]="player.id === (currentPlayerId$ | async)"></app-player-state>
    </div>
  `,
  // templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public board$;
  public players$;
  public playerState$;
  public deckSize$;
  public drawPile$;
  public currentPlayer$;
  public currentPlayerId$;

  constructor(private store$: Store<any>, private gameEffects: GameEffects) {
    this.board$ = this.store$.select(getBoardState).do(res => console.log('board$:', res));
    this.drawPile$ = this.store$
      .select(getDrawPile);
    this.playerState$ = this.store$.select(getPlayerState);
    this.currentPlayer$ = this.store$.select(getCurrentPlayer);
    this.players$ = Observable.combineLatest(
      this.store$.select(getAllPlayers),
      this.store$.select(getCardEntities),
      (players: Player[], cards: { [id: string]: Card }) =>
        players.map(player => ({
          ...player,
          hand: player.hand.map(id => cards[id]),
          sets: player.sets.map(set => ({
            leader: cards[set.leader],
            cards: set.cards.map(id => cards[id])
          }))
        }))
    );
    this.deckSize$ = this.store$.select(getDeckState).map(deck => deck.length);

    this.currentPlayerId$ = this.store$.select(getCurrentPlayerId);
  }

  ngOnInit() { }

  public drawCard() {
    this.store$
      .select(getCurrentPlayerId)
      .take(1)
      .subscribe(id => {
        this.store$.dispatch(new DrawCardAction(id));
        this.store$.dispatch(new NextTurnAction())
      });
  }

  public drawDraw(card) {
    this.store$
      .select(getCurrentPlayerId)
      .take(1)
      .subscribe(id => {
        this.store$.dispatch(new DrawDrawAction(card.id, id));
        this.store$.dispatch(new NextTurnAction());
      });
  }

  public trackByPlayer(index, player) {
    return player ? player.id : undefined;
  }
}
