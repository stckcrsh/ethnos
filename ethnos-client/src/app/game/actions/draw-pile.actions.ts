import { CardID } from "../models/card.model";
import { PlayerID } from "../models/player.model";
export const DRAW = "[Draw pile] Draw";
export const ADD_CARDS = "[Draw pile] Add cards";
export const CLEAR = "[Draw Pile] Clear";

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

export type Actions = DrawDrawAction | DrawAddCardsAction | ClearDrawAction;
