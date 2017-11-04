import { Card } from "./cards.reducer";
import { describe, it } from "mocha";
import { expect } from "chai";
import * as game from "./game.reducer";
import * as cards from "./cards.reducer";

describe("Card Reducer", () => {
  const card_0: Card = {
    id: "0",
    name: "name",
    type: "5"
  };
  const card_1: Card = {
    id: "1",
    name: "name",
    type: "5"
  };
  const card_2: Card = {
    id: "2",
    name: "name",
    type: "5"
  };
  const dragon: Card = {
    id: "3",
    name: "dragon",
    type: "6"
  };

  describe("Game Setup", () => {
    it("should take the cards and dragons and put them into entities and ids approriately", () => {
      const action = new game.GameSetupAction(
        [],
        "",
        [card_0, card_1, card_2],
        [dragon]
      );
      const newState = cards.reducer(undefined, action);
      const expectedState = {
        entities: {
          [card_0.id]: card_0,
          [card_1.id]: card_1,
          [card_2.id]: card_2,
          [dragon.id]: dragon
        },
        ids: [card_0.id, card_1.id, card_2.id],
        dragons: [dragon.id]
      };

      expect(newState).to.eql(expectedState);
    });
  });
});
