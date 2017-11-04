import { PlayerID, PLAY_SET } from "./player.reducer";

export interface Space {
  type: string;
  pieces: { [id: string]: number };
  scores: number[];
}

export type State = { [id: string]: Space };

export const initialState: State = {
  "0": { type: "0", pieces: {}, scores: [] },
  "1": { type: "1", pieces: {}, scores: [] },
  "2": { type: "2", pieces: {}, scores: [] },
  "3": { type: "3", pieces: {}, scores: [] },
  "4": { type: "4", pieces: {}, scores: [] },
  "5": { type: "5", pieces: {}, scores: [] }
};

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case PLAY_SET: {
      const playerId = payload.playerId as PlayerID;
      const space = payload.space;
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
    default:
      return state;
  }
}
