import { debounce } from 'rxjs/operator/debounce';
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";

import * as player from './player.reducer';
import * as draw from './draw-pile.reducer';
import * as deck from './deck.reducer';
import * as game from './game.reducer';

describe("Player Reducer", () => {
  const player_1: player.Player = {
    id: "124",
    name: "name_1",
    hand: ["1", "2", "3", "8"],
    sets: []
  };
  const player_2: player.Player = {
    id: "123",
    name: "name_2",
    hand: ["4", "5", "7"],
    sets: [
      {
        leader: "6",
        cards: ["6"]
      }
    ]
  };
  const initialState: player.State = {
    entities: {
      [player_2.id]: player_2,
      [player_1.id]: player_1
    },
    ids: [player_1.id, player_2.id]
  };

  describe("PLAY_SET", () => {
    it("should add the set and remove the discard from the hand leaving any leftovers", () => {
      const set: player.CardSet = { leader: "2", cards: ["2", "3"] };
      const action = new player.PlaySetAction(player_1.id, set, ["8"], "2");
      const newState = player.reducer(initialState, action);

      const expectedState: player.State = {
        ...initialState,
        entities: {
          ...initialState.entities,
          [player_1.id]: {
            ...player_1,
            sets: [set],
            hand: ["1"]
          }
        }
      };
      expect(newState).to.deep.equal(expectedState);
    });
  });

  describe("Draw pile DRAW_CARD", () => {
    it("Should add the card the players hand", () => {
      const cardId = "9";
      const action = new draw.DrawDrawAction(cardId, player_1.id);

      const newState = player.reducer(initialState, action);

      const expectedState = {
        ...initialState,
        entities: {
          ...initialState.entities,
          [player_1.id]: {
            ...player_1,
            hand: [...player_1.hand, cardId]
          }
        }
      };

      expect(newState).to.deep.equal(expectedState);
    });
  });

  describe("Deck DRAW_CARD", () => {
    it("Should add the card the players hand", () => {
      const cardId = "9";
      const action = new deck.DeckDrawAction(cardId, player_1.id);

      const newState = player.reducer(initialState, action);

      const expectedState = {
        ...initialState,
        entities: {
          ...initialState.entities,
          [player_1.id]: {
            ...player_1,
            hand: [...player_1.hand, cardId]
          }
        }
      };

      expect(newState).to.deep.equal(expectedState);
    });
  });

  describe("SETUP", () => {
    it("Should set up the players appropriately on setup", () => {
      const player_3: player.Player = {
        id: "1255",
        name: "name_3",
        hand: [],
        sets: []
      };

      const action = new game.GameSetupAction(
        [player_1, player_3],
        player_3.id,
        []
      );

      const newState = player.reducer(initialState, action);

      const expectedState = {
        entities: {
          [player_1.id]: player_1,
          [player_3.id]: player_3
        },
        ids: [player_1.id, player_3.id]
      };

      expect(newState).to.deep.equal(expectedState);
    });
  });
});
