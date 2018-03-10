import {} from "mocha";
import {assert} from 'chai';
import * as mm from '../src';
import * as path from 'path';
import {commonTags} from "../src/common/GenericTagTypes";
import {ICommonTagsResult} from "../src/index";

const t = assert;

/**
 * Ensure the mapping of native comment field to the common comment field is done correctly
 * Ref: https://github.com/Borewit/music-metadata/issues/50
 */
describe("Mapping of common comment tag", () => {

  const samples = path.join(__dirname, 'samples');

  /**
   * Check the common result for array properties which always should be returned
   * Related: https://github.com/Borewit/music-metadata/issues/65
   * @param {ICommonTagsResult} common Common tag result
   */
  function checkArrays(common: ICommonTagsResult) {
    // for each tag type
    for (const commonTagKey in commonTags) {
      const commonTag = commonTags[commonTagKey];
      if (commonTag.multiple) {
        t.isDefined(common[commonTagKey], "Array type 'common." + commonTagKey + "' should be defined");
      }
    }
  }

  describe("Vorbis", () => {

    it("FLAC/Vorbis", () => {

      const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer.flac");

      // Parse flac/Vorbis file
      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });

    it("should map ogg/Vorbis", () => {

      const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer.ogg");

      // Parse ogg/Vorbis file
      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });
  });

  describe("APEv2 header", () => {

    it("Monkey's Audio / APEv2", function() {

      this.skip(); // ToDo: update sample file

      const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer.ape");

      // Run with default options
      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });

    it("WavPack / APEv2", function() {

      this.skip(); // ToDo: update sample file

      const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer.wv");

      // Run with default options
      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });
  });

  describe("ID3v2.3 header", () => {

    it("MP3 / ID3v2.3", () => {

      const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer [id3v2.3].V2.mp3");

      // Run with default options
      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });

    it("RIFF/WAVE/PCM / ID3v2.3", function() {

      this.skip(); // ToDo: update sample file

      const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer [id3v2.3].wav");

      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });
  });

  describe("ID3v2.4 header", () => {

    it("MP3/ID3v2.4 header", () => {

      const filename = "MusicBrainz - Beth Hart - Sinner's Prayer [id3v2.4].V2.mp3";
      const filePath = path.join(__dirname, 'samples', filename);

      // Run with default options
      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });

    it("should parse AIFF/ID3v2.4 audio file", function() {

      this.skip(); // ToDo: update sample file

      const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer [id3v2.4].aiff");

      // Run with default options
      return mm.parseFile(filePath, {native: true}).then(metadata => {
        t.deepEqual(metadata.common.comment, ["Test 123"]);
        checkArrays(metadata.common);
      });
    });

  });

  it("should map M4A / (Apple) iTunes MP4 header", () => {

    const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer.m4a");

    // Run with default options
    return mm.parseFile(filePath, {native: true}).then(metadata => {
      // Aggregation of '----:com.apple.iTunes:NOTES' & '©cmt'
      t.deepEqual(metadata.common.comment, ["Medieval CUE Splitter (www.medieval.it)", "Test 123"]);
      checkArrays(metadata.common);
    });
  });

  it("should map WMA/ASF header", function() {

    this.skip(); // ToDo: update sample file

    const filePath = path.join(samples, "MusicBrainz - Beth Hart - Sinner's Prayer.wma");

    // Parse wma/asf file
    return mm.parseFile(filePath, {native: true}).then(metadata => {
      t.deepEqual(metadata.common.comment, ["Medieval CUE Splitter (www.medieval.it)", "Test 123"]);
      checkArrays(metadata.common);
    });
  });

});
