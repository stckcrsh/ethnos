import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import * as board from "./board.reducer";
import * as player from "./player.reducer";

describe("board reducer", () => {
  const space_0 = { type: "0", pieces: { "123": 3, "124": 2 }, scores: [] };
  const space_1 = { type: "1", pieces: {}, scores: [] };
  const space_2 = { type: "2", pieces: {}, scores: [] };
  const space_3 = { type: "3", pieces: {}, scores: [] };
  const space_4 = { type: "4", pieces: {}, scores: [] };
  const space_5 = { type: "5", pieces: {}, scores: [] };

  const initialState: board.State = {
    "0": space_0,
    "1": space_1,
    "2": space_2,
    "3": space_3,
    "4": space_4,
    "5": space_5
  };

  describe("PLAY_SET", () => {
    it("add a player to the space if none exists and start at one piece", () => {
      const action = new player.PlaySetAction(
        "123",
        { leader: "3", cards: ["3", "2"] },
        ["1", "4"],
        "2"
      );
      const newState = board.reducer(initialState, action);

      const expectedState = {
        "0": space_0,
        "1": space_1,
        "2": { ...space_2, pieces: { "123": 1 } },
        "3": space_3,
        "4": space_4,
        "5": space_5
      };

      expect(newState).to.deep.equal(expectedState);
    });
    it("if a player exists then increase the number of pieces", () => {
      const action = new player.PlaySetAction(
        "124",
        { leader: "3", cards: ["3", "2"] },
        ["1", "4"],
        "0"
      );
      const newState = board.reducer(initialState, action);

      const expectedState = {
        ...initialState,
        "0": {
          ...space_0,
          pieces: {
            ...space_0.pieces,
            "124": 3
          }
        }
      };

      expect(newState).to.deep.equal(expectedState);
    });
  });
});
