export class TrackModel {
  constructor(params) {
    this.seq = params.seq;
    this.track_id = params.track_id;
    this.favourite = params.favourite;
    this.play_count = params.play_count;
    this.date_added = params.date_added;
    this.last_played = params.last_played;
  }
}
