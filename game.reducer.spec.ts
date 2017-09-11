import { Player } from "./player.reducer";
import { describe, it } from "mocha";
import { expect } from "chai";
import * as game from "./game.reducer";

describe("Game Reducer", () => {
  const player_0: Player = {
    id: "123",
    name: "name_0",
    sets: [],
    hand: []
  };
  const player_1: Player = {
    id: "123",
    name: "name_1",
    sets: [],
    hand: []
  };
  const player_2: Player = {
    id: "123",
    name: "name_2",
    sets: [],
    hand: []
  };

  const players = [player_0, player_1, player_2];
  const startPlayer = player_1.id;

  describe("SETUP", () => {
    it("should get the start player and zero out the scores", () => {
      const action = new game.GameSetupAction(players, startPlayer, [],[]);
      const newState = game.reducer(undefined, action);

      const expectedState: game.State = {
        currentPlayer: startPlayer,
        scores: {
          [player_0.id]: 0,
          [player_1.id]: 0,
          [player_2.id]: 0
        },
        dragons:[]
      };

      expect(newState).to.deep.equal(expectedState);
    });
  });

  describe("NEXT_PLAYER", () => {
    it("should change the current player", () => {
      const gameState: game.State = {
        currentPlayer: player_1.id,
        scores: {
          [player_1.id]: 0,
          [player_2.id]: 0
        },
        dragons: []
      };
      const action = new game.NextPlayerAction(player_2.id);

      const newState = game.reducer(gameState, action);

      const expectedState = {
        currentPlayer: player_2.id,
        scores: {
          [player_1.id]: 0,
          [player_2.id]: 0
        },
        dragons: []
      };

      expect(newState).to.deep.equal(expectedState);
    });
  });
});
