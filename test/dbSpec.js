"use strict";

define(["db", "linq2indexeddb", "chai", "underscore", "stacktrace"], function (db, linq2indexeddb, chai, _,
    printStacktrace) {
    var should = chai.should();

    describe("db", function () {
        var _db;

        function fail(done, reason, err) {
            if (typeof reason === "string") {
                reason = new Error(reason);
            }
            if (!reason) {
                console.log(typeof done, typeof reason);
                reason = new Error("There's been an error, but no reason was supplied!");
                var st = printStacktrace({e: reason});
                console.log(st);
            }
            if (typeof done !== "function") {
                throw new Error("Was not supplied a function for 'done'!");
            }
            done(reason);
        }

        // Bind done as the first argument to the fail function
        function bindFail(done, reason) {
            if (typeof done !== "function") {
                throw new Error("done must be a function");
            }
            return _.partial(fail, done, reason);
        }

        beforeEach(function (done) {
            _db = linq2indexeddb("test", null, true);
            _db.deleteDatabase()
            .done(function () {
                _db.initialize()
                .done(done)
                .fail(bindFail(done, "Initializing database failed"));
            })
            .fail(bindFail(done, "Deleting database failed"));
        });

        it("can add objects", function (done) {
            console.log("Starting test");
            var refObj = {"key": "value"};
            _db.linq.from("store").insert(refObj, "Key")
            .done(function () {
                console.log("Added object successfully");
                _db.linq.from("store").get("Key")
                .done(function (gotObj) {
                    console.log("Got object", gotObj);
                    if (!gotObj) {
                        return fail(done, "The result is null/undefined");
                    }
                    if (gotObj.key !== refObj.key) {
                        return fail("The loaded object doesn't equal the original one", done);
                    }
                })
                .fail(bindFail(done, "Getting object failed"));
            })
            .fail(bindFail(done, "Inserting object failed"));
        });
    });
});