import * as game from "../actions/game.actions";
import * as draw from "../actions/draw-pile.actions";
import * as player from "../actions/player.actions";
import { CardID } from "../models/card.model";

export type State = CardID[];

export const initialState: State = [];

export function reducer(
  state: State = initialState,
  action: draw.Actions | game.RoundSetup | player.PlaySetAction
): State {
  switch (action.type) {
    case draw.DRAW: {
      const cardId = action.payload.cardId as CardID;
      const newIds = state.filter((id: CardID) => id !== cardId);

      return newIds;
    }
    case draw.ADD_CARDS: {
      const newCards = action.payload as CardID[];

      return [...state, ...newCards];
    }
    case draw.CLEAR: {
      return initialState;
    }
    case player.PLAY_SET: {
      const discards = action.payload.discards as CardID[];
      return [...state, ...discards];
    }
    case game.ROUND_SETUP: {
      const cards = action.payload.draw as CardID[];
      return cards;
    }
    default:
      return state;
  }
}
