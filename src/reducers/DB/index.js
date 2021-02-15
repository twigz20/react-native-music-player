import initialState from "./initialState";
import * as types from "./types";
export * from "./actions";

export default function reducer(state = initialState(), { type, payload }) {
  switch (type) {
    case types.INIT:
      return {
        ...state,
        init: true,
        db: payload,
      };
    case types.UPDATE_TRACK:
      return state;
    case types.INSERT_TRACK:
      return state;
    case types.GET_TRACKS:
      return {
        ...state,
        tracks: payload,
      };
    default:
      return state;
  }
}
