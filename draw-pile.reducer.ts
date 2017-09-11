import { ROUND_SETUP, RoundSetup } from './game.reducer';
import { PLAY_SET, PlayerID, PlaySetAction } from "./player.reducer";
import { Card, CardID } from "./cards.reducer";
import { normalize } from "./helpers";
export const DRAW = "[Draw pile] Draw";
export const ADD_CARDS = "[Draw pile] Add cards";
export const CLEAR = "[Draw Pile] Clear";

export type State = CardID[];

export const initialState: State = [];

export class DrawDrawAction {
  readonly type = DRAW;
  public payload: {
    cardId: CardID;
    playerId: PlayerID;
  };
  constructor(cardId: CardID, playerId: PlayerID) {
    this.payload = {
      cardId,
      playerId
    };
  }
}

export class DrawAddCardsAction {
  readonly type = ADD_CARDS;
  constructor(public payload: CardID[]) {}
}

export class ClearDrawAction {
  readonly type = CLEAR;
}

export function reducer(state: State = initialState, action: Actions | RoundSetup): State {
  switch (action.type) {
    case DRAW: {
      const cardId = action.payload.cardId as CardID;
      const newIds = state.filter((id: CardID) => id !== cardId);

      return newIds;
    }
    case ADD_CARDS: {
      const newCards = action.payload as CardID[];

      return [...state, ...newCards];
    }
    case CLEAR: {
      return initialState;
    }
    case PLAY_SET: {
      const discards = action.payload.discards as CardID[];
      return [...state, ...discards];
    }
    case ROUND_SETUP: {
      const cards = action.payload.draw as CardID[];
      return cards;
    }
    default:
      return state;
  }
}

export type Actions =
  | DrawDrawAction
  | DrawAddCardsAction
  | ClearDrawAction
  | PlaySetAction;
