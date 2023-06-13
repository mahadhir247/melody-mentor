import { MIDIChannel } from "./MIDIChannel";

export class Track {
  /**
   * Whether this track is a drums track.
   */
  public isDrumsTrack: boolean = false;

  /**
   * Whether this track is a 12-stringed guitar track.
   */
  public is12StringedGuitarTrack: boolean = false;

  /**
   * Whether this track is a banjo track.
   */
  public isBanjoTrack: boolean = false;

  /**
   * The capo number (if present).
   */
  public capo: number = 0;

  /**
   * The MIDI Channel.
   */
  public channel: number = 0;

  /**
   * The MIDI Channel used for effects.
   */
  public channelEffects: number = 0;

  /**
   * The track's color.
   */
  //private GPColor _color;

  /**
   * The track's name
   */
  public name: string = "";

  /**
   * The number of frets of the track's instrument.
   */
  public numberOfFrets: number = 0;

  /**
   * The number of strings in this track.
   */
  public numberOfStrings: number = 6;

  /**
   * The MIDI port.
   */
  public port: number = 0;

  /**
   * The track's instrument tuning.
   */
  public stringsTuning: number[] = [];
}
