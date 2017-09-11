import { createSelector } from "@ngrx/store";
import { normalize } from "./helpers";
import { SETUP } from "./game.reducer";

export interface Card {
  name: string;
  type: string;
  id: string;
}

export type CardID = string;

export interface State {
  entities: { [id: string]: Card };
  ids: CardID[];
  dragons: CardID[];
}

export const initialState: State = {
  entities: {},
  ids: [],
  dragons: []
};

export const cardNormalizer = normalize<Card>("id");

export function reducer(state: State = initialState, { type, payload }): State {
  switch (type) {
    case SETUP: {
      const cards = payload.cards as Card[];
      const dragons = payload.dragons as Card[];

      const normalizedDragons = cardNormalizer(dragons);
      const normalizedCards = cardNormalizer(cards);
      return {
        ...state,
        entities: {
          ...normalizedCards.entities,
          ...normalizedDragons.entities
        },
        ids: normalizedCards.ids,
        dragons: normalizedDragons.ids
      };
    }
    default:
      return state;
  }
}

export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getDragons = (state: State) => state.dragons;

export const getAll = createSelector(getEntities, getIds, (entities, ids) =>
  ids.map(id => entities[id])
);
