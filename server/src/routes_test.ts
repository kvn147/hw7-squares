import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { dummy } from './routes';


describe('routes', function () {
  // After you know what to do, feel free to delete this Dummy test
  it('dummy', function () {
    // You can copy this test structure to start your own tests, these comments
    // are included as a reminder of how testing routes works:

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
      // query: is how we add query params. body: {} can be used to test a POST request
      { method: 'GET', url: '/api/dummy', query: { name: 'Kevin' } });
    const res1 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    dummy(req1, res1);
    // check that the request was successful
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepStrictEqual(res1._getData(), { greeting: 'Hi, Kevin' });
  });
});
