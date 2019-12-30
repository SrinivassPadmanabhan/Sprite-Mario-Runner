let expect = require("chai").expect;
var request = require('request');

try {
    it('Main page status', function(done) {
    request('http://localhost:8796/sprite.html' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});
} catch(Ex){
    console.log("the error is ====>", Ex);
}