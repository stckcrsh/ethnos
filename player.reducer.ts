import { createSelector } from "@ngrx/store";
import { PLATFORM_ID } from "@angular/core";
import { normalize } from "./helpers";
import * as card from "./cards.reducer";
import * as draw from "./draw-pile.reducer";
import * as game from "./game.reducer";
import * as deck from "./deck.reducer";

export const PLAY_SET = "[Player] play set";

export type PlayerID = string;

export interface Player {
  name: string;
  hand: card.CardID[];
  id: PlayerID;
  sets: CardSet[];
}

export interface CardSet {
  leader: card.CardID;
  cards: card.CardID[];
}

export interface State {
  entities: { [id: string]: Player };
  ids: PlayerID[];
}

export const initialState: State = {
  entities: {},
  ids: []
};

export class PlaySetAction {
  readonly type = PLAY_SET;
  public payload: {
    playerId: PlayerID;
    set: CardSet;
    discards: card.CardID[];
    space: string;
  };
  constructor(
    playerId: PlayerID,
    set: CardSet,
    discards: card.CardID[],
    space: string
  ) {
    this.payload = {
      discards,
      playerId,
      set,
      space
    };
  }
}

export const playerNormalizer = normalize<Player>("id");

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case draw.DRAW:
    case deck.DRAW: {
      const playerId = payload.playerId as PlayerID;
      const cardid = payload.cardId as card.CardID;
      const player = state.entities[playerId];
      const newHand = [...player.hand, cardid];

      return {
        ...state,
        entities: {
          ...state.entities,
          [playerId]: {
            ...player,
            hand: newHand
          }
        }
      };
    }
    case PLAY_SET: {
      const playerId = payload.playerId as PlayerID;
      const set = payload.set as CardSet;
      const discards = payload.discards as card.CardID[];

      const player = state.entities[playerId];
      const newSets = player.sets.concat([set]);
      const newHand = player.hand.filter(
        id => set.cards.indexOf(id) === -1 && discards.indexOf(id) === -1
      );

      return {
        ...state,
        entities: {
          ...state.entities,
          [playerId]: {
            ...player,
            sets: newSets,
            hand: newHand
          }
        }
      };
    }
    case game.SETUP: {
      const players = payload.players as Player[];
      return playerNormalizer(players);
    }
    case game.DRAGON_DRAW: {
      const playerId = payload.playerId as PlayerID;
      const dragon = payload.dragon as card.CardID;

      const newHand = state.entities[playerId].hand.filter(id => id !== dragon);
      return {
        ...state,
        entities: {
          ...state.entities,
          [playerId]: {
            ...state.entities[playerId],
            hand: newHand
          }
        }
      };
    }
    default:
      return state;
  }
}

export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getAll = createSelector(getEntities, getIds, (entities, ids) =>
  ids.map(id => entities[id])
);
