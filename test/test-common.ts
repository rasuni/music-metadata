import {} from "mocha";
import {assert} from 'chai';
import Common from "../lib/common";

const t = assert;

describe("Common", () => {

  it("should be able to parse genres", () => {
    const tests = {
      Electronic: 'Electronic',
      'Electronic/Rock': 'Electronic/Rock',
      '(0)': 'Blues',
      '(0)(1)(2)': 'Blues/Classic Rock/Country',
      '(0)(160)(2)': 'Blues/Electroclash/Country',
      '(0)(192)(2)': 'Blues/Country',
      '(0)(255)(2)': 'Blues/Country',
      '(4)Eurodisco': 'Disco/Eurodisco',
      '(4)Eurodisco(0)Mopey': 'Disco/Eurodisco/Blues/Mopey',
      '(RX)(CR)': 'RX/CR',
      '1stuff': '1stuff',
      'RX/CR': 'RX/CR'
    };
    for (const test in tests) {
      t.strictEqual(Common.parseGenre(test), tests[test], test);
    }
  });

  it("be able to remove unsynchronisation bytes from buffer", () => {
    const expected = new Buffer([0xFF, 0xD8, 0xFF, 0xE0, 0x00]);
    const sample = new Buffer([0xFF, 0xD8, 0xFF, 0x00, 0xE0, 0x00]);
    const output = Common.removeUnsyncBytes(sample);
    t.deepEqual(output, expected, 'bytes');
  });

  /*
   it("should be able to detect ftypmp42 as a valid mp4 header headerType", () => {
   const buf = new Buffer([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32]);

   const types = [
   {
   buf: new Buffer([0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32]),
   tag: require('../lib/id4'),
   offset: 4
   }
   ];

   t.equal(Common.getParserForMediaType(types, buf), require('../src/id4'), 'headerType');
   });*/

  it("readUInt64LE", () => {
    const tests = [
      {
        str: 'foo',
        expected: 'foo'
      },
      {
        str: 'derp\x00\x00',
        expected: 'derp'
      },
      {
        str: '\x00\x00harkaaa\x00',
        expected: 'harkaaa'
      },
      {
        str: '\x00joystick',
        expected: 'joystick'
      }
    ];
    tests.forEach((test) => {
      t.strictEqual(Common.stripNulls(test.str), test.expected);
    });
  });

});
