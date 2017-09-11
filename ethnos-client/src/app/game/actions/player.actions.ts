import { Player, PlayerID } from "../models/player.model";
import { CardSet } from "../models/cardset.model";
import { CardID } from "../models/card.model";

export const PLAY_SET = "[Player] play set";

export class PlaySetAction {
  readonly type = PLAY_SET;
  public payload: {
    playerId: PlayerID;
    set: CardSet;
    discards: CardID[];
    space: string;
  };
  constructor(
    playerId: PlayerID,
    set: CardSet,
    discards: CardID[],
    space: string
  ) {
    this.payload = {
      discards,
      playerId,
      set,
      space
    };
  }
}

export type Actions = PlaySetAction;
