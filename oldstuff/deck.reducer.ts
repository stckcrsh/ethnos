import { ROUND_SETUP } from './game.reducer';
import { PlayerID } from "./player.reducer";
import { CardID } from "./cards.reducer";

// Actions
export const DRAW = "[Deck] Draw";

export type State = CardID[];

export const initialState: State = [];

export class DeckDrawAction {
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

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case DRAW: {
      const cardId = payload.cardId as CardID;
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