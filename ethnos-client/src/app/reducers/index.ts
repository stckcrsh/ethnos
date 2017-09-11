import { environment } from "../../environments/environment";
import { storeFreeze } from "ngrx-store-freeze";
export type State = any;

export function getInitialState(): State {
  return {};
}

export const reducers = {};
export const metaReducers = [...(environment.production ? [] : [storeFreeze])];
