import { CardID } from "./card.model";
import { CardSet } from "./cardset.model";

export type PlayerID = string;

export interface Player {
  name: string;
  hand: CardID[];
  id: PlayerID;
  sets: CardSet[];
}
