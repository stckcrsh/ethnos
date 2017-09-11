import { GameEffects } from "../../effects/game.effects";
import { DrawDrawAction } from "../../actions/draw-pile.actions";
import { DeckDrawnAction } from "../../actions/deck.actions";
import shuffle from "../../../../helpers/shuffle";
import { DrawCardAction, RoundStartAction } from "../../actions/game.actions";
import { Card } from "../../models/card.model";
import { Player } from "../../models/player.model";
import {
  getAllCardIds,
  getAllDragonIds,
  getAllPlayers,
  getAllSpaces,
  getCardEntities,
  getCurrentPlayerId,
  getDeckState,
  getDrawPile,
  getTopCard
} from "../../reducers/reducers";
import { Store } from "@ngrx/store";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit {
  public spaces$;
  public players$;
  public deckSize$;
  public drawPile$;
  public currentPlayer$;

  constructor(private store$: Store<any>, private gameEffects: GameEffects) {
    this.spaces$ = this.store$.select(getAllSpaces);
    this.drawPile$ = this.store$
      .select(getDrawPile)
      .do(res => console.log(res));
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

    this.currentPlayer$ = this.store$.select(getCurrentPlayerId);
  }

  ngOnInit() {}

  public setupRound() {
    // Observable.combineLatest(
    //   this.store$.select(getAllCardIds),
    //   this.store$.select(getAllPlayers),
    //   this.store$.select(getAllDragonIds),
    //   (cards: any[], players: any[], dragons: any[]) => {
    //     const newDeck = shuffle(cards);

    //     // take 2 cards per player for the draw pile
    //     let drawIdx = players.length * 2;

    //     // shuffle in the dragons
    //     const action = new RoundSetup(
    //       shuffle(newDeck.slice(drawIdx).concat(dragons)),
    //       newDeck.slice(0, drawIdx),
    //       players[0].id
    //     );

    //     return action;
    //   }
    // )
    //   .take(1)
    //   .subscribe(action => this.store$.dispatch(action));

    this.store$.dispatch(new RoundStartAction());
  }

  public drawCard() {
    this.store$
      .select(getCurrentPlayerId)
      .take(1)
      .subscribe(id => this.store$.dispatch(new DrawCardAction(id)));
  }

  public drawDraw(card) {
    this.store$
      .select(getCurrentPlayerId)
      .take(1)
      .subscribe(id => this.store$.dispatch(new DrawDrawAction(card.id, id)));
  }

  public trackByPlayer(index, player) {
    return player ? player.id : undefined;
  }
}
