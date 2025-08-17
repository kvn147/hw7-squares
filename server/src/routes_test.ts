// server/src/routes_test.ts
import * as assert from "assert";
import * as httpMocks from "node-mocks-http";
import { save, load, getNames, resetSavesForTesting, addSaveForTesting } from "./routes";

describe("routes", function () {
  beforeEach(function () {
    // Fresh state before every test (don’t rely on previous tests)
    resetSavesForTesting();
  });

  it("getNames", function () {
    // Statement coverage: empty store returns []
    {
      const req0 = httpMocks.createRequest({ method: "GET", url: "/api/names" });
      const res0 = httpMocks.createResponse();
      getNames(req0, res0);
      assert.strictEqual(res0.statusCode, 200);
      assert.deepStrictEqual(res0._getJSONData(), { names: [] });
    }

    // Branch/argument variety: non-empty store (1 name)
    addSaveForTesting("test", { value: "v" });
    const req1 = httpMocks.createRequest({ method: "GET", url: "/api/names" });
    const res1 = httpMocks.createResponse();
    getNames(req1, res1);
    assert.strictEqual(res1.statusCode, 200);
    assert.deepStrictEqual(res1._getJSONData(), { names: ["test"] });

    // Notes:
    // - “At least two tests” for a function with many inputs: covered by the two calls above.
    // - No loops/recursion here, so loop coverage is N/A.
  });

  it("save", function () {
    // Statement coverage: successful save with object payload
    {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/save?name=a",
        body: { value: { some: "data" } }
      });
      const res = httpMocks.createResponse();
      save(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res._getJSONData(), { success: true, name: "a", value: { some: "data" } });
    }

    // “At least two tests”: second successful save with a different payload shape
    {
      const req2 = httpMocks.createRequest({
        method: "POST",
        url: "/api/save?name=b",
        body: { value: 17 }
      });
      const res2 = httpMocks.createResponse();
      save(req2, res2);
      assert.strictEqual(res2.statusCode, 200);
      assert.deepStrictEqual(res2._getJSONData(), { success: true, name: "b", value: 17 });
    }
  });

  it("load", function () {
    // Branch coverage: not found branch
    {
      const req0 = httpMocks.createRequest({ method: "GET", url: "/api/load?name=missing" });
      const res0 = httpMocks.createResponse();
      load(req0, res0);
      assert.strictEqual(res0.statusCode, 200);
      assert.deepStrictEqual(res0._getJSONData(), { value: null });
    }

    // Statement coverage and found branch
    addSaveForTesting("x", ["blue", "orange"]);
    const req1 = httpMocks.createRequest({ method: "GET", url: "/api/load?name=x" });
    const res1 = httpMocks.createResponse();
    load(req1, res1);
    assert.strictEqual(res1.statusCode, 200);
    assert.deepStrictEqual(res1._getJSONData(), { value: ["blue", "orange"] });
  });
});
