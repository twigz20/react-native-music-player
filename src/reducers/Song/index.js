import initialState from "./initialState";
import * as types from "./types";
export * from "./actions";

export default function reducer(state = initialState(), { type, payload }) {
  switch (type) {
    case types.SET: {
      const { items } = payload;

      if (items.length) {
        const { id } = items[0];

        return {
          id,
          items,
        };
      } else {
        return state;
      }
    }

    case types.SET_PLAYLIST:
      return {
        ...state,
        id: payload.id,
      };

    case types.SET_ALL_PLAYLISTS:
      return Object.assign({}, state, {
        playlists: payload,
      });

    case types.GET_PLAYLIST:
      return Object.assign({}, state, {
        tracks: payload,
        isLoading: false,
      });

    default:
      return state;
  }
}
