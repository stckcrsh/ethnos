import { CardID } from "./cards.reducer";
import { Player } from "./player.reducer";
import { describe, it } from "mocha";
import { expect } from "chai";
import * as game from "./game.reducer";
import * as deck from "./deck.reducer";

describe("Deck Reducer", () => {
  const card_0: CardID = "120";
  const card_1: CardID = "121";
  const card_2: CardID = "122";
  const card_3: CardID = "123";
  const card_4: CardID = "124";

  const cards = [card_0, card_1, card_2, card_3, card_4];
  describe("Deck Draw", () => {
    it("should remove the drawn card from the list of cards", () => {
      const action = new deck.DeckDrawAction(card_3, "121");

      const newState = deck.reducer(cards, action);

      const expectedState = [card_0, card_1, card_2, card_4];

      expect(newState).to.eql(expectedState);
    });
  });

  describe("Game setup", () => {
    it("should set up the deck when the round begins", () => {
      const action = new game.RoundSetup(cards, []);

      const newState = deck.reducer(undefined, action);

      expect(newState).to.eql(cards);
    });
  });
});
