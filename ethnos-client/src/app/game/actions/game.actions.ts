import { DrawAddCardsAction } from "../../../../../draw-pile.reducer";
import { Player, PlayerID } from "../models/player.model";
import { Card, CardID } from "../models/card.model";

export const SETUP = "[Game] Setup";
export const NEXT_PLAYER = "[Game] Next player";
export const ROUND_START = "[Game] Round start";
export const ROUND_SETUP = "[Game] Round setup";
export const DRAGON_DRAW = "[Game] Dragon draw";
export const ROUND_END = "[Game] Round End";
export const START = "[Game] Start Game";
export const ADD_SCORES = "[Game] Adding scores";
export const DRAW_CARD = "[Game] draw card";

export class GameStartAction {
  readonly type = START;
}

export class RoundStartAction {
  readonly type = ROUND_START;
}

export class DrawCardAction {
  readonly type = DRAW_CARD;
  constructor(public payload: PlayerID) {}
}

export class GameSetupAction {
  readonly type = SETUP;
  public payload;
  constructor(
    players: Player[],
    startPlayer: PlayerID,
    cards: Card[],
    dragons: Card[],
    spaces: { [type: string]: number[] }
  ) {
    this.payload = {
      players,
      startPlayer,
      cards,
      dragons,
      spaces
    };
  }
}

export class NextPlayerAction {
  readonly type = NEXT_PLAYER;
  public payload: { nextPlayer: PlayerID };
  constructor(nextPlayer: PlayerID) {
    this.payload = {
      nextPlayer
    };
  }
}

export class RoundSetup {
  readonly type = ROUND_SETUP;
  public payload: {
    deck: CardID[];
    draw: CardID[];
    startPlayer: string;
  };
  constructor(deck: CardID[], draw: CardID[], startPlayer: string) {
    this.payload = {
      deck,
      draw,
      startPlayer
    };
  }
}

/**
 * Ends the round and scores the players
 */
export class EndRound {
  readonly type = ROUND_END;
}

/**
 * add the scores
 */
export class AddScores {
  readonly type = ADD_SCORES;
  constructor(
    public payload: {
      [playerId: string]: number;
    }
  ) {}
}

export class DragonDrawnAction {
  readonly type = DRAGON_DRAW;
  public payload: {
    playerId: PlayerID;
    dragon: CardID;
  };
  constructor(playerId: PlayerID, dragon: CardID) {
    this.payload = {
      playerId,
      dragon
    };
  }
}

export type Actions =
  | GameSetupAction
  | NextPlayerAction
  | RoundSetup
  | EndRound
  | AddScores
  | DragonDrawnAction
  | GameStartAction
  | RoundStartAction
  | DrawCardAction;
