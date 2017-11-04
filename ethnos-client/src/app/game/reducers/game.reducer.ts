import { Card, CardID } from '../models/card.model';
import { PlayerID, Player } from '../models/player.model';

import * as game from '../actions/game.actions';
import * as R from 'ramda';

export interface State {
  currentPlayer: string;
  scores: { [playerId: string]: number };
  dragons: CardID[];
  round: number;
}

export const initialState: State = {
  currentPlayer: null,
  scores: {},
  dragons: [],
  round: -1
};

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case game.SETUP: {
      const startPlayer = payload.startPlayer;
      const players = payload.players as Player[];

      // default the scores
      const newScores = players.reduce(
        (acc, player: Player) => ({ ...acc, [player.id]: 0 }),
        {}
      );
      return {
        ...state,
        currentPlayer: startPlayer,
        scores: newScores
      };
    }
    case game.NEXT_PLAYER: {
      const nextPlayer = payload.nextPlayer as PlayerID;
      return {
        ...state,
        currentPlayer: nextPlayer
      };
    }
    case game.DRAGON_DRAW: {
      const dragon = payload.dragon as CardID;
      return {
        ...state,
        dragons: [...state.dragons, dragon]
      };
    }
    case game.ROUND_END: {
      return {
        ...state,
        round: state.round++,
        dragons: []
      };
    }
    case game.ROUND_SETUP: {
      const currentPlayer = payload.startPlayer as PlayerID;
      return {
        ...state,
        currentPlayer,
        round: state.round + 1
      };
    }
    case game.ADD_SCORES: {
      const newScores = payload;

      return {
        ...state,
        scores: R.mapObjIndexed(
          (num, key) => num + state.scores[key],
          newScores
        )
      };
    }
    default:
      return state;
  }
}

export const getCurrentPlayerId = (state: State) => state.currentPlayer;

export const isRoundOver = (state: State) => state.dragons.length >= 3;
export const isGameOver = (state: State) => state.round >= 2;
export const getRoundNumber = (state: State) => state.round;
