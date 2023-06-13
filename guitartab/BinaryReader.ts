import { ByteBuffer } from "./ByteBuffer";
import encoding from "text-encoding";

export function readByte(data: ByteBuffer): number {
  return data.readByte();
}

export function skip(data: ByteBuffer, num: number): void {
  data.skip(num);
}

export function readString(data: ByteBuffer, length: number): string {
  let b: Uint8Array = new Uint8Array(length);
  data.read(b, 0, b.length);
  let decoder = new encoding.TextDecoder("utf-8");
  return decoder.decode(b);
}

/**
 * Reads a byte as size, followed by the string.
 * The string is represented literally in the binary file.
 * It is ensured the specified amount of bytes is read.
 */
export function readStringByteLength(
  data: ByteBuffer,
  expectedLength: number
): string {
  let realLength: number = data.readByte();
  let s: string = "";

  if (expectedLength != 0) {
    s = readString(data, expectedLength);
  } else {
    s = readString(data, realLength);
  }

  return s;
}

/**
 * Skips the size integer (4byte) and reads a string using
 * a bytesize
 */
export function readStringIntUnused(data: ByteBuffer): string {
  data.skip(4);
  const strLength: number = data.readByte();
  return readString(data, strLength);
}

/**
 * Reads an integer as size, and then the string itself
 */
export function readStringInt(data: ByteBuffer): string {
  return readString(data, readInt(data));
}

/**
 * Reads an integer as the string size + 1, and then the string itself
 */
export function readStringIntPlusOne(data: ByteBuffer): string {
  const lengthPlusOne = readInt(data);
  const length = lengthPlusOne - 1;

  if (lengthPlusOne > 0) {
    const r: number = data.readByte(); //not sure what this does
    if (length != r) {
      console.log("Wrong string length, should have been " + length);
    }
    return readString(data, length);
  } else {
    const r: number = data.readByte();
    return "";
  }

  // return readString(data, readInt32LE(data) - 1);
}

export function readBool(data: ByteBuffer): boolean {
  return data.readByte() !== 0;
}

export function readInt(data: ByteBuffer): number {
  let ch1: number = data.readByte();
  let ch2: number = data.readByte();
  let ch3: number = data.readByte();
  let ch4: number = data.readByte();
  return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
}

export enum ValueSize {
  Integer = 4,
  ShortInt = 2,
  Byte = 1,
}
