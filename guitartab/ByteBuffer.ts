import encoding from "text-encoding";

export class ByteBuffer {
  private _buffer!: Uint8Array;

  public length: number = 0;
  public position: number = 0;

  public get bytesWritten(): number {
    return this.position;
  }

  public getBuffer(): Uint8Array {
    return this._buffer;
  }

  public static empty(): ByteBuffer {
    return ByteBuffer.withCapacity(0);
  }

  public static withCapacity(capacity: number): ByteBuffer {
    let buffer: ByteBuffer = new ByteBuffer();
    buffer._buffer = new Uint8Array(capacity);
    return buffer;
  }

  public static fromBuffer(data: Uint8Array): ByteBuffer {
    let buffer: ByteBuffer = new ByteBuffer();
    buffer._buffer = data;
    buffer.length = data.length;
    return buffer;
  }

  //   public static fromFile(file: Blob): Promise<ByteBuffer> {
  //     console.log("hi");

  //     return new Promise<ByteBuffer>((resolve, reject) => {
  //       const reader: FileReader = new FileReader();

  //       reader.onload = (r) => {
  //         const binaryBuffer: ArrayBuffer = r.target!.result as ArrayBuffer;
  //         const data: Uint8Array = new Uint8Array(binaryBuffer);

  //         resolve(this.fromBuffer(data));
  //       };

  //       reader.onerror = (r) => {
  //         reject("Error");
  //       };

  //       reader.readAsArrayBuffer(file);
  //     });
  //   }

  public static fromString(contents: string): ByteBuffer {
    let encoder = new encoding.TextEncoder();
    let byteArray: Uint8Array = encoder.encode(contents);
    return ByteBuffer.fromBuffer(byteArray);
  }

  public reset(): void {
    this.position = 0;
  }

  /**
   * Integer = 4
   * Short Int = 2
   * Byte = 1
   */
  public skip(offset: number): void {
    this.position += offset;
  }

  public readByte(): number {
    let n: number = this.length - this.position;
    if (n <= 0) {
      return -1;
    }
    return this._buffer[this.position++];
  }

  public read(buffer: Uint8Array, offset: number, count: number): number {
    let n: number = this.length - this.position;
    if (n > count) {
      n = count;
    }
    if (n <= 0) {
      return 0;
    }
    buffer.set(this._buffer.subarray(this.position, this.position + n), offset);
    this.position += n;
    return n;
  }

  public writeByte(value: number): void {
    let i: number = this.position + 1;
    this.ensureCapacity(i);
    this._buffer[this.position] = value & 0xff;
    if (i > this.length) {
      this.length = i;
    }
    this.position = i;
  }

  public write(buffer: Uint8Array, offset: number, count: number): void {
    let i: number = this.position + count;
    this.ensureCapacity(i);

    let count1: number = Math.min(count, buffer.length - offset);
    this._buffer.set(buffer.subarray(offset, offset + count1), this.position);

    if (i > this.length) {
      this.length = i;
    }
    this.position = i;
  }

  private ensureCapacity(value: number): void {
    if (value > this._buffer.length) {
      let newCapacity: number = value;
      if (newCapacity < 256) {
        newCapacity = 256;
      }
      if (newCapacity < this._buffer.length * 2) {
        newCapacity = this._buffer.length * 2;
      }

      let newBuffer: Uint8Array = new Uint8Array(newCapacity);
      if (this.length > 0) {
        newBuffer.set(this._buffer.subarray(0, 0 + this.length), 0);
      }
      this._buffer = newBuffer;
    }
  }

  public readAll(): Uint8Array {
    return this.toArray();
  }

  public toArray(): Uint8Array {
    let copy: Uint8Array = new Uint8Array(this.length);
    copy.set(this._buffer.subarray(0, 0 + this.length), 0);
    return copy;
  }
}

export enum ValueSize {
  Integer = 4,
  ShortInt = 2,
  Byte = 1
}
