"use strict";

define(["db", "linq2indexeddb", "chai"], function (db, linq2indexeddb, chai) {
	var should = chai.should();
	describe("db", function () {
		var _db;

		beforeEach(function () {
			_db = linq2indexeddb("test", null, true);
		});

		it("can add objects", function (done) {
			var refObj = {"key": "value"};
			_db.linq.from("store").insert(refObj, "Key");
			_db.linq.from("store").get("Key")
			.done(function (gotObj) {
				console.log("Done!");
				if (gotObj === refObj) {
					console.log("gotObj", gotObj);
					done();
				} else {
					done("The loaded object doesn't equal the original one");
				}
			})
			.fail(function (err) {
				console.log("Error!");
				done("An error occurred:", err);
			});
		});
	});
});