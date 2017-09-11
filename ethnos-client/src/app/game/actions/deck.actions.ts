import { CardID } from "../models/card.model";
import { PlayerID } from "../models/player.model";

// Actions
export const DRAW = "[Deck] Drawn";

export class DeckDrawnAction {
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

export type Actions = DeckDrawnAction;
