/**
 * Follows:
 * https://dguitar.sourceforge.net/GP4format.html#Version
 *
 * References:
 * https://github.com/CoderLine/alphaTab
 * https://github.com/mauriciogracia/DGuitarSoftware
 */

import * as br from "./BinaryReader";
import { ValueSize, ByteBuffer } from "./ByteBuffer";
import { Score } from "./model/Score";
import { MIDIChannel } from "./model/MIDIChannel";

export class GP3Importer {
  private static readonly VERSION: string = "FICHIER GUITAR PRO v3.00";
  /**
   * End product after reading file.
   */
  private _score!: Score;
  private _data: ByteBuffer;
  private _tripletFeel: boolean = false;
  public _version: string = "";

  constructor(data: ByteBuffer) {
    this._data = data;
  }

  public readScore(): Score {
    this._score = new Score();

    this.readVersion();
    this.readScoreInformation();
    this.readOtherInfo();

    return this._score;
  }

  public readVersion(): void {
    const version = br.readStringByteLength(this._data, 30);
    this._version = version;

    console.log(version);
  }

  public readScoreInformation(): void {
    this._score.title = br.readStringIntPlusOne(this._data);
    this._score.subtitle = br.readStringIntPlusOne(this._data);
    this._score.interpret = br.readStringIntPlusOne(this._data);
    this._score.album = br.readStringIntPlusOne(this._data);
    this._score.author = br.readStringIntPlusOne(this._data);
    this._score.copyright = br.readStringIntPlusOne(this._data);
    this._score.tabAuthor = br.readStringIntPlusOne(this._data);
    this._score.instructional = br.readStringIntPlusOne(this._data);

    let noticeLines: number = br.readInt(this._data);
    let notice: string = "";
    for (let i: number = 0; i < noticeLines; i++) {
      if (i > 0) {
        notice += "\r\n";
      }
      notice += br.readStringIntPlusOne(this._data)?.toString();
    }
    this._score.notices = notice;

    this._tripletFeel = br.readBool(this._data);
  }

  public readOtherInfo(): void {
    this._score.tempo = br.readInt(this._data);

    //Skip key signature (for now)
    this._data.skip(ValueSize.Integer);

    for (let i: number = 0; i < 65; i++) { //why 65 instead of 64?
      let midiChannel: MIDIChannel = new MIDIChannel();

      midiChannel.instrument = br.readInt(this._data);
      midiChannel.volume = br.readByte(this._data);
      midiChannel.balance = br.readByte(this._data);
      midiChannel.chorus = br.readByte(this._data);
      midiChannel.reverb = br.readByte(this._data);
      midiChannel.phaser = br.readByte(this._data);
      midiChannel.tremolo = br.readByte(this._data);
      this._data.skip(2); //As per specification

      this._score.midiChannels.push(midiChannel);
    }

    console.log(this._score.midiChannels[0].instrument)
    console.log(this._score.midiChannels[0].volume)
    console.log(this._score.midiChannels[0].balance)


    this._score.numMeasures = br.readInt(this._data);
    this._score.numTracks = br.readInt(this._data);
  }

  public readMeasures(): void {

  }
}
