export class Measure {
  /**
   * Presence of a double bar.
   */
  public hasDoubleBar: boolean = false;

  /**
   * The marker possibly associated with this measure.
   */
  //public GPMarker marker;

  /**
   * Presence of a beginning of repeat sign.
   */
  public repeatStart: boolean = false;

  /**
   * Denominator of the measure
   */
  public denominator: number = 0;

  /**
   * The number of the measure
   */
  public number: number = 0;

  /**
   * The number of alternate endings of the measure.
   */
  public numberOfAlternateEndings: number = 0;

  /**
   * The number of repetitions of the measure.
   */
  public _numberOfRepetitions: number = 0;

  /**
   * Numerator of the measure
   */
  public numerator: number = 0;

  /**
   * The tonality of this measure.
   */
  //private GPKey _tonality;
}
