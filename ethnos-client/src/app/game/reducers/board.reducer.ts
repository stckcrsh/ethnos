import { Space } from "../models/space.model";
import * as player from "../actions/player.actions";
import * as game from "../actions/game.actions";
import { PlayerID } from "../models/player.model";

export type State = { [id: string]: Space };

export const initialState: State = {
  "0": { type: "0", pieces: {}, scores: [] },
  "1": { type: "1", pieces: {}, scores: [] },
  "2": { type: "2", pieces: {}, scores: [] },
  "3": { type: "3", pieces: {}, scores: [] },
  "4": { type: "4", pieces: {}, scores: [] },
  "5": { type: "5", pieces: {}, scores: [] }
};

export function reducer(
  state: State = initialState,
  action: game.Actions | player.Actions
): State {
  switch (action.type) {
    case player.PLAY_SET: {
      const playerId = action.payload.playerId as PlayerID;
      const space = action.payload.space;
      const pieces = state[space].pieces;

      const newPieces = {
        ...pieces,
        [playerId]: pieces[playerId] + 1 || 1
      };

      return {
        ...state,
        [space]: {
          ...state[space],
          pieces: newPieces
        }
      };
    }
    case game.SETUP: {
      const types = Object.keys(state);
      const newSpaces = action.payload.spaces;

      return types.reduce(
        (acc, type) => ({
          ...acc,
          [type]: {
            ...state[type],
            scores: newSpaces[type]
          }
        }),
        {}
      );
    }
    default:
      return state;
  }
}

export const getAll = (state: State) => Object.keys(state).map(id => state[id]);
