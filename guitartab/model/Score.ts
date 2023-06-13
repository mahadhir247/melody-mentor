import { MIDIChannel } from "./MIDIChannel";
import { Measure } from "./Measure";

export class Score {

  public title: string = "";
  public subtitle: string = "";
  public interpret: string = "";
  public album: string = "";
  public author: string = "";
  public copyright: string = "";
  public tabAuthor: string = "";
  public instructional: string = "";
  public notices: string = "";
  public tempo: number = 0;
  public tempoLabel: string = "";

  public midiChannels: MIDIChannel[] = [];
  public numMeasures: number = 0;
  public numTracks: number = 0;

  public measures: Measure[] = [];
}
