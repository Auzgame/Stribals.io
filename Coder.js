const { createBrotliDecompress } = require("zlib");

class Coder {
  constructor() {
    this.strToAB = (str) =>
      new Uint8Array(str.split("").map((c) => c.charCodeAt(0))).buffer;

    this.ABToStr = (ab) =>
      new Uint8Array(ab).reduce((p, c) => p + String.fromCharCode(c), "");
  }
}

module.exports = Coder;
