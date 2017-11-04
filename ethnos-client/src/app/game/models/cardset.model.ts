import { CardID } from './card.model';

export interface CardSet {
  leader: CardID;
  cards: CardID[];
}
