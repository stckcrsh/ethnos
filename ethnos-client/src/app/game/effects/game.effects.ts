import shuffle from '../../../helpers/shuffle';
import { Action, combineReducers, Store } from '@ngrx/store';
import {
  getAllCardIds,
  getAllDragonIds,
  getAllPlayers,
  getCardEntities,
  getCurrentPlayerId,
  getPlayerState,
  getScores,
  getTopCard,
  isRoundOver,
  reducers,
  isGameOver
} from '../reducers/reducers';
import { Player, PlayerID } from '../models/player.model';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as game from '../actions/game.actions';
import * as deck from '../actions/deck.actions';
import * as draw from '../actions/draw-pile.actions';
import * as player from '../actions/player.actions';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';
import { from } from 'rxjs/observable/from';
import * as shortid from 'shortid';

const _players: Player[] = [
  {
    name: 'Rob',
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: 'Jon',
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: 'Bran',
    hand: [],
    sets: [],
    id: shortid()
  }
  // {
  //   name: "Rickon",
  //   hand: [],
  //   sets: [],
  //   id: shortid()
  // },
  // {
  //   name: "Arya",
  //   hand: [],
  //   sets: [],
  //   id: shortid()
  // }
];
const initialCards = 12;
const _cards = [
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: 'Elf',
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: 'Minotaur',
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: 'Skeleton',
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: 'Halfling',
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: 'Wizard',
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: 'Goblin',
    type: idx % 6
  }))
];

const _dragons = [1, 2, 3].map(() => ({
  id: shortid(),
  name: 'Dragon',
  type: '6'
}));

const _spaces = [0, 0, 0, 2, 2, 2, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 10];
const _shuffledSpaces = shuffle(_spaces);
const _setSpaces = [0, 1, 2, 3, 4, 5].reduce(
  (acc, id) => ({
    ...acc,
    [id]: _shuffledSpaces.slice(id * 3, (id + 1) * 3).sort((a, b) => a - b)
  }),
  {}
);

@Injectable()
export class GameEffects {

  // when a round is started we shuffle the deck and
  @Effect()
  public roundStart$ = this.actions$
    .ofType(game.ROUND_START)
    .withLatestFrom(this.store$)
    .map(([_, state]) => {
      const cardIds = getAllCardIds(state);
      const players = getAllPlayers(state);
      const dragons = getAllDragonIds(state);

      let newDeck = shuffle(cardIds);

      // grab one card for each player
      const drawnCards = players.reduce((acc, player, idx) => ({ ...acc, [player.id]: newDeck[idx] }), {});

      // remove those drawn cards from the deck
      newDeck = newDeck.slice(players.length, Infinity);

      // take 2 cards per player for the draw pile
      const drawIdx = players.length * 2;

      const drawPile = newDeck.slice(0, drawIdx);
      newDeck = newDeck.slice(drawIdx, Infinity);

      // split deck and add dragons to bottom half
      const half = Math.floor(newDeck.length / 2);
      newDeck = newDeck.slice(0, half).concat(shuffle(newDeck.slice(half, Infinity).concat(dragons)))

      // shuffle in the dragons
      const action = new game.RoundSetup(
        newDeck,
        drawPile,
        players[0].id,
        drawnCards
      );

      // make all the draw card actions
      const drawCardActions = players.map(player => new game.DrawCardAction(player.id));

      return action;
    });

  @Effect()
  public gameStart$ = this.actions$
    .ofType(game.START)
    .startWith(
    new game.RoundStartAction()
    )
    .startWith(
    new game.GameSetupAction(_players, _players[0].id, _cards, _dragons, _setSpaces)
    );

  @Effect()
  public roundEnd$ = this.actions$
    .ofType(game.ROUND_END)
    .withLatestFrom(this.store$)
    .flatMap(([_, state]) => {
      const scores = getScores(state);

      let nextAction;
      if (isGameOver(state)) {
        nextAction = new game.GameEndAction();
      } else {
        nextAction = new game.RoundStartAction()
      }
      return [new game.AddScores(scores), nextAction];
    });

  @Effect()
  public dragonDrawn$ = this.actions$
    .ofType(game.DRAGON_DRAW)
    .withLatestFrom(this.store$)
    .map(([action, state]: [game.DragonDrawnAction, any]) => {
      if (!isRoundOver(state)) {
        return new game.DrawCardAction(getCurrentPlayerId(state));
      }
      return new game.EndRound();
    });

  /**
   * This will wait for the game draw action then check the top card for dragon or not
   * then it will generate the draw action or dragon action
   */
  @Effect()
  public drawCard$ = this.actions$
    .ofType(game.DRAW_CARD)
    .withLatestFrom(this.store$)
    .map(([action, state]: [game.DrawCardAction, any]) => {
      const topCardId = getTopCard(state);
      const topCard = getCardEntities(state)[topCardId];
      const playerId = action.payload as PlayerID;

      if (topCard.type === '6') {
        return new game.DragonDrawnAction(playerId, topCardId);
      } else {
        return new deck.DeckDrawnAction(topCardId, playerId);
      }
    });

  @Effect()
  public nextTurn$ = this.actions$
    .ofType(game.NEXT_TURN)
    .withLatestFrom(this.store$)
    .map(
    (
      [action, state]: [
        deck.DeckDrawnAction | draw.DrawDrawAction | player.PlaySetAction,
        any
      ]
    ) => {
      const playerState = getPlayerState(state);
      const currentPlayerId = getCurrentPlayerId(state);
      const nextPlayer =
        playerState.ids[
        (playerState.ids.indexOf(currentPlayerId) + 1) %
        playerState.ids.length
        ];
      return new game.NextPlayerAction(nextPlayer);
    }
    );
  constructor(public actions$: Actions, private store$: Store<any>) { }
}
