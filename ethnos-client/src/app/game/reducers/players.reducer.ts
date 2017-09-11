import { createSelector } from "@ngrx/store/src/selector";
import { Player, PlayerID } from "../models/player.model";
import { CardSet } from "../models/cardset.model";
import { CardID } from "../models/card.model";
import * as player from "../actions/player.actions";
import * as game from "../actions/game.actions";
import * as deck from "../actions/deck.actions";
import * as draw from "../actions/draw-pile.actions";
import normalize from "../../../helpers/normalize";

export interface State {
  entities: { [id: string]: Player };
  ids: PlayerID[];
}

export const initialState: State = {
  entities: {},
  ids: []
};

export const playerNormalizer = normalize<Player>("id");

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case draw.DRAW:
    case deck.DRAW: {
      const playerId = payload.playerId as PlayerID;
      const cardid = payload.cardId as CardID;
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
    case player.PLAY_SET: {
      const playerId = payload.playerId as PlayerID;
      const set = payload.set as CardSet;
      const discards = payload.discards as CardID[];

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
      const dragon = payload.dragon as CardID;

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
    case game.ROUND_SETUP: {
      const players = state.ids
        .map(id => state.entities[id])
        .map(player => ({ ...player, hand: [], sets: [] }));

      return playerNormalizer(players);
    }

    // case game.ROUND_END: {
    //   const players = state.ids
    //   .map(id => ({
    //     ...state.entities[id],
    //     hand: [],
    //     sets: []
    //   }));

    //   return playerNormalizer(players);
    // }
    default:
      return state;
  }
}

export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getAll = createSelector(getEntities, getIds, (entities, ids) =>
  ids.map(id => entities[id])
);
