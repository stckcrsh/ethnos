import shuffle from "../../../helpers/shuffle";
import {
  GameSetupAction,
  EndRound,
  RoundStartAction
} from "../actions/game.actions";
import { Action, combineReducers, Store } from "@ngrx/store";
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
  reducers
} from "../reducers/reducers";
import { Player, PlayerID } from "../models/player.model";
import { Actions, Effect } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import * as game from "../actions/game.actions";
import * as deck from "../actions/deck.actions";
import * as draw from "../actions/draw-pile.actions";
import * as player from "../actions/player.actions";
import "rxjs/add/operator/map";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/withLatestFrom";
import { from } from "rxjs/observable/from";
import * as shortid from "shortid";

const players: Player[] = [
  {
    name: "Rob",
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: "Jon",
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: "Bran",
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
const initialCards = 2;
const cards = [
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Elf",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Minotaur",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Skeleton",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Halfling",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Wizard",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Goblin",
    type: idx % 6
  }))
];

const dragons = [1, 2, 3].map(() => ({
  id: shortid(),
  name: "Dragon",
  type: "6"
}));

const spaces = [0, 0, 0, 2, 2, 2, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 10];
const shuffledSpaces = shuffle(spaces);
const setSpaces = [0, 1, 2, 3, 4, 5].reduce(
  (acc, id) => ({
    ...acc,
    [id]: shuffledSpaces.slice(id * 3, (id + 1) * 3).sort((a, b) => a - b)
  }),
  {}
);

@Injectable()
export class GameEffects {
  @Effect()
  public roundStart$ = this.actions$
    .ofType(game.ROUND_START)
    .withLatestFrom(this.store$)
    .map(([_, state]) => {
      const cardIds = getAllCardIds(state);
      const players = getAllPlayers(state);
      const dragons = getAllDragonIds(state);

      const newDeck = shuffle(cardIds);

      // take 2 cards per player for the draw pile
      let drawIdx = players.length * 2;

      // shuffle in the dragons
      const action = new game.RoundSetup(
        shuffle(newDeck.slice(drawIdx).concat(dragons)),
        newDeck.slice(0, drawIdx),
        players[0].id
      );

      return action;
    });

  @Effect()
  public gameStart$ = this.actions$
    .ofType(game.START)
    .startWith(
      new GameSetupAction(players, players[0].id, cards, dragons, setSpaces)
    );

  @Effect()
  public roundEnd$ = this.actions$
    .ofType(game.ROUND_END)
    .withLatestFrom(this.store$)
    .map(([_, state]) => {
      const scores = getScores(state);

      return new game.AddScores(scores);
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

      if (topCard.type === "6") {
        return new game.DragonDrawnAction(playerId, topCardId);
      } else {
        return new deck.DeckDrawnAction(topCardId, playerId);
      }
    });

  @Effect()
  public nextTurn$ = this.actions$
    .ofType(deck.DRAW, draw.DRAW, player.PLAY_SET)
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
  constructor(public actions$: Actions, private store$: Store<any>) {}
}
