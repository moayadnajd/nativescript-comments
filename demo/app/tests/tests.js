var Comments = require("nativescript-comments").Comments;
var comments = new Comments();

describe("greet function", function() {
    it("exists", function() {
        expect(comments.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(comments.greet()).toEqual("Hello, NS");
    });
});