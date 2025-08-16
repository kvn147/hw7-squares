import * as assert from 'assert';
import { cons, nil } from './list';
import { solid, split, toJson, fromJson, findSquare, replaceSquare, Path, Dir, Square } from './square';

// Helper function to build a path from an array of directions
const buildPath = (dirs: ReadonlyArray<Dir>): Path => {
    let out: Path = nil;
    let i = dirs.length - 1;

    // Inv: i < dirs.length and i >= 0 and out is the path
    // dirs[i+1 ... dirs.length - 1] in order.
    while (i >= 0) {
      out = cons(dirs[i], out);
      i -= 1;
    }
    return out;
  };

describe('square', function() {
  
  it('findSquare', function() {
    // Leaf keeps color type narrow
    const leaf = (c: "white" | "pink" | "orange" | "yellow" | "green" | "blue" | "purple"): Square => solid(c);

    // Arrange: a simple split and a nested split
    const one = split(leaf("white"), leaf("green"), leaf("blue"), leaf("yellow"));
    const nested = split(
      split(leaf("pink"), leaf("orange"), leaf("blue"), leaf("purple")),
      leaf("green"),
      leaf("yellow"),
      leaf("white")
    );

    // Statement coverage: base case path.kind === "nil" returns root
    assert.deepStrictEqual(findSquare(nil, one), one);

    // Branch coverage: stepping into a solid should throw
      assert.throws(() => findSquare(buildPath(["NW"]), leaf("white")), Error);

    // Branch/statement coverage: each direction on a single level split
    assert.deepStrictEqual(findSquare(buildPath(["NW"]), one), leaf("white"));
    assert.deepStrictEqual(findSquare(buildPath(["NE"]), one), leaf("green"));
    assert.deepStrictEqual(findSquare(buildPath(["SW"]), one), leaf("blue"));
    assert.deepStrictEqual(findSquare(buildPath(["SE"]), one), leaf("yellow"));

    // Recursion coverage:
    //  - 0 recursive calls: nil (covered above)
    //  - 1 recursive call: single-step paths (covered above)
    //  - many recursive calls: multi-step path into nested
    assert.deepStrictEqual(findSquare(buildPath(["NW","NE"]), nested), leaf("orange"));
  });

  
  it('replaceSquare', function() {
    // TODO: write tests for replaceSquare() here
    const leaf = (c: "white" | "pink" | "orange" | "yellow" | "green" | "blue" | "purple"): Square => solid(c);
    const one = split(leaf("white"), leaf("green"), leaf("blue"), leaf("yellow"));
    const purple = leaf("purple");

    // Statement coverage: base case (path = nil) returns the replacement
    assert.deepStrictEqual(replaceSquare(nil, purple, one), purple);

    // Branch coverage: throws error when attempting to descend into a solid
    assert.throws(() => replaceSquare(buildPath(["SE"]), purple, leaf("green")), Error);

    // Branch/statement coverage: each direction on a single level split
    assert.deepStrictEqual(
      replaceSquare(buildPath(["NW"]), purple, one),
      split(purple, leaf("green"), leaf("blue"), leaf("yellow"))
    );
    assert.deepStrictEqual(
      replaceSquare(buildPath(["NE"]), purple, one),
      split(leaf("white"), purple, leaf("blue"), leaf("yellow"))
    );
    assert.deepStrictEqual(
      replaceSquare(buildPath(["SW"]), purple, one),
      split(leaf("white"), leaf("green"), purple, leaf("yellow"))
    );
    assert.deepStrictEqual(
      replaceSquare(buildPath(["SE"]), purple, one),
      split(leaf("white"), leaf("green"), leaf("blue"), purple)
    );

    // Recursion coverage:
    //  - 0 calls: nil
    //  - 1 call: single-step paths (covered above)
    //  - many calls: deep replace in nested split
    const nested = split(one, leaf("pink"), leaf("orange"), one);
    const deepPath = buildPath(["NW", "SE"]);
    const replacedDeep = replaceSquare(deepPath, purple, nested);
    assert.deepStrictEqual(
      replacedDeep,
      split(
        split(leaf("white"), leaf("green"), leaf("blue"), purple),
        leaf("pink"),
        leaf("orange"),
        one
      )
    );
  });

  it('toJson', function() {
    assert.deepStrictEqual(toJson(solid("white")), "white");
    assert.deepStrictEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("pink"));
    assert.deepStrictEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "pink"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepStrictEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepStrictEqual(fromJson("white"), solid("white"));
    assert.deepStrictEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepStrictEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "pink"]),
        split(s1, solid("green"), s1, solid("pink")));

    assert.deepStrictEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

});
