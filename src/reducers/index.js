import { combineReducers } from "redux";

import Song from "./Song";
import Player from "./Player";
import DB from "./DB";

export default combineReducers({
  Song,
  Player,
  DB,
});
