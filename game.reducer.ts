import { Card, CardID } from "./cards.reducer";
import { PlayerID, Player } from "./player.reducer";
export const SETUP = "[Game] Setup";
export const NEXT_PLAYER = "[Game] Next player";
export const ROUND_SETUP = "[Game] Round setup";
export const DRAGON_DRAW = "[Game] Dragon draw";
export const NEXT_ROUND = "[Game] Next Round";

export class GameSetupAction {
  readonly type = SETUP;
  public payload;
  constructor(
    players: Player[],
    startPlayer: PlayerID,
    cards: Card[],
    dragons: Card[]
  ) {
    this.payload = {
      players,
      startPlayer,
      cards,
      dragons
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
  };
  constructor(deck: CardID[], draw: CardID[]) {
    this.payload = {
      deck,
      draw
    };
  }
}

export class NextRound {
  readonly type = NEXT_ROUND;
}

export class DragonDrawnAction {
  readonly type = DRAGON_DRAW;
  public payload: {
    playerId: PlayerID;
    cardId: CardID;
  };
  constructor(playerId: PlayerID, cardId: CardID) {
    this.payload = {
      playerId,
      cardId
    };
  }
}

export interface State {
  currentPlayer: string;
  scores: { [playerId: string]: number };
  dragons: CardID[];
  round: number
}

export const initialState: State = {
  currentPlayer: null,
  scores: {},
  dragons: [],
  round: 0
};

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case SETUP:
      const startPlayer = payload.startPlayer;
      const players = payload.players as Player[];

      // default the scores
      const newScores = players.reduce(
        (acc, player: Player) => ({ ...acc, [player.id]: 0 }),
        {}
      );
      return {
        ...state,
        currentPlayer: startPlayer,
        scores: newScores
      };

    case NEXT_PLAYER: {
      const nextPlayer = payload.nextPlayer as PlayerID;
      return {
        ...state,
        currentPlayer: nextPlayer
      };
    }
    case DRAGON_DRAW: {
      const dragon = payload.dragon as CardID;
      return {
        ...state,
        dragons: [...state.dragons, dragon]
      };
    }
    case NEXT_ROUND:{
      return {
        ...state,
        round: state.round++
      };
    }
    default:
      return state;
  }
}

export const getCurrentPlayerId = (state: State) => state.currentPlayer;

export const isRoundOver = (state: State) => state.dragons.length >= 3;
export const getRoundNumber = (state: State) => state.round;
