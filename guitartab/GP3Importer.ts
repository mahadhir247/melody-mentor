/**
 * Follows:
 * https://dguitar.sourceforge.net/GP4format.html#Version
 *
 * References:
 * https://github.com/CoderLine/alphaTab
 * https://github.com/mauriciogracia/DGuitarSoftware
 */

import * as br from "./BinaryReader";
import { ByteBuffer } from "./ByteBuffer";
import { Score } from "./model/Score";
import { MIDIChannel } from "./model/MIDIChannel";
import { Measure } from "./model/Measure";
import { Track } from "./model/Track";

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
    this.readMeasures();
    this.readTracks();

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
    br.skip(this._data, br.ValueSize.Integer);

    for (let i: number = 0; i < 64; i++) {
      //why 65 instead of 64? TODO
      let midiChannel: MIDIChannel = new MIDIChannel();

      midiChannel.instrument = br.readInt(this._data);
      midiChannel.volume = br.readByte(this._data);
      midiChannel.balance = br.readByte(this._data);
      midiChannel.chorus = br.readByte(this._data);
      midiChannel.reverb = br.readByte(this._data);
      midiChannel.phaser = br.readByte(this._data);
      midiChannel.tremolo = br.readByte(this._data);
      br.skip(this._data, 2); //As per specification

      this._score.midiChannels.push(midiChannel);
    }

    // console.log(this._score.midiChannels[0].instrument);
    // console.log(this._score.midiChannels[0].volume);
    // console.log(this._score.midiChannels[0].balance);

    this._score.numMeasures = br.readInt(this._data);
    this._score.numTracks = br.readInt(this._data);
  }

  public readMeasures(): void {
    let previousMeasure: Measure | null = null;

    for (let i: number = 0; i < this._score.numMeasures; i++) {
      let measure: Measure = new Measure();
      measure.number = i + 1;

      let header: number = br.readByte(this._data);

      // Time Signature Numerator
      if ((header & 0x01) != 0) {
        measure.numerator = br.readByte(this._data);
      } else if (previousMeasure) {
        measure.numerator = previousMeasure.numerator;
      }

      // Time Signature Denominator
      if ((header & 0x02) != 0) {
        measure.denominator = br.readByte(this._data);
      } else if (previousMeasure) {
        measure.denominator = previousMeasure.denominator;
      }

      // Beginning of repeat
      measure.repeatStart = (header & 0x04) !== 0;

      // End of repeat
      if ((header & 0x08) != 0) {
        measure.numberOfRepetitions = br.readByte(this._data);
      }

      // Number of alternate endings
      if ((header & 0x10) != 0) {
        measure.numberOfAlternateEndings = br.readByte(this._data);
      }

      // GPMarker (SKIP)
      if ((header & 0x20) != 0) {
        br.readStringIntPlusOne(this._data);
        br.skip(this._data, 4);
      }

      // Tonality (SKIP)
      if ((header & 0x40) != 0) {
        br.skip(this._data, 1);
      }

      // Presence of double bar
      measure.hasDoubleBar = (header & 0x80) != 0;

      this._score.measures.push(measure);
      previousMeasure = measure;
    }
  }

  public readTracks(): void {
    console.log(this._data.toArray().subarray(this._data.position, this._data.position + 300));

    for (let i: number = 0; i < this._score.numTracks; i++) {
      let track: Track = new Track();

      let header = br.readByte(this._data);

      track.isDrumsTrack = (header & 0x01) != 0;
      track.is12StringedGuitarTrack = (header & 0x02) != 0;
      track.isBanjoTrack = (header & 0x04) != 0;
      track.name = br.readStringByteLength(this._data, 40);
      track.numberOfStrings = br.readInt(this._data);
      for (let i: number = 0; i < 7; i++) {
        console.log(i);
        let stringTuning: number = br.readInt(this._data);
        track.stringsTuning.push(stringTuning);
        // br.skip(this._data);
      }
      track.port = br.readInt(this._data);
      track.channel = br.readInt(this._data);
      track.channelEffects = br.readInt(this._data);
      track.numberOfFrets = br.readInt(this._data);
      track.capo = br.readInt(this._data);
      br.skip(this._data, 4); // SKIP COLOR

      this._score.tracks.push(track);
    }
  }
}
