import { PlaySetAction } from "./player.reducer";
import { CardID } from "./cards.reducer";
import { describe, it } from "mocha";
import { expect } from "chai";
import * as draw from "./draw-pile.reducer";

describe("Draw Pile Reducer", () => {
  const card_0: CardID = "120";
  const card_1: CardID = "121";
  const card_2: CardID = "122";
  const card_3: CardID = "123";
  const card_4: CardID = "124";

  const cards = [card_0, card_1, card_2, card_3, card_4];

  describe("DRAW", () => {
    it("should remove the drawn card from the list of cards", () => {
      const action = new draw.DrawDrawAction(card_3, "121");

      const newState = draw.reducer(cards, action);

      const expectedState = [card_0, card_1, card_2, card_4];

      expect(newState).to.eql(expectedState);
    });
  });

  describe("ADD_CARDS", () => {
    it("should add the cards to the draw pile", () => {
      const card_4: CardID = "4";
      const card_5: CardID = "5";

      const action = new draw.DrawAddCardsAction([card_4, card_5]);

      const newState = draw.reducer(cards, action);

      const expectedState = [...cards, card_4, card_5];

      expect(newState).to.eql(expectedState);
    });
  });

  describe("CLEAR", () => {
    it("should remove all the cards on clear", () => {
      const action = new draw.ClearDrawAction();

      const newState = draw.reducer(cards, action);

      const expectedState = [];

      expect(newState).to.eql(expectedState);
    });
  });

  describe("PLAY_SET", () => {
    it("should add discards to the draw pile", () => {
      const card_4: CardID = "4";
      const card_5: CardID = "5";
      const action = new PlaySetAction(
        "123",
        { leader: "1", cards: ["1"] },
        [card_4, card_5],
        "1"
      );

      const newState = draw.reducer(cards, action);

      const expectedState = [[...cards, card_4, card_5]];
    });
  });
});
