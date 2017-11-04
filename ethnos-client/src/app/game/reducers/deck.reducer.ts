import { CardID } from '../models/card.model';
import { DRAW } from '../actions/deck.actions';
import { ROUND_SETUP } from '../actions/game.actions';
import * as game from '../actions/game.actions';

export type State = CardID[];

export const initialState: State = [];

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case DRAW: {
      const cardId = payload.cardId as CardID;
      const newIds = state.filter((id: CardID) => id !== cardId);

      return newIds;
    }
    case game.DRAGON_DRAW: {
      const cardId = payload.dragon as CardID;
      const newIds = state.filter((id: CardID) => id !== cardId);

      return newIds;
    }
    case ROUND_SETUP: {
      const cards = payload.deck as CardID[];
      return cards;
    }
    default:
      return state;
  }
}

export const getTopCard = (state: State) => state[0] || null;
