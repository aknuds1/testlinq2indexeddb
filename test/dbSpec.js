"use strict";

define(["db", "linq2indexeddb", "chai", "underscore", "stacktrace"], function (db, linq2indexeddb, chai, _,
    printStacktrace) {
    var should = chai.should();

    describe("db", function () {
        var _db;

        function fail(done, reason, err) {
            console.log("err:", err);
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
            // Linq2IndexedDB's web worker needs this URL
            linq2indexeddb.prototype.utilities.linq2indexedDBWorkerFileLocation = '/base/lib/Linq2IndexedDb.js'

            _db = linq2indexeddb("test", null, true);
            console.log("Deleting database");
            _db.deleteDatabase()
            .done(function () {
                console.log("Initializing database");
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
                done();
            })
            .fail(bindFail(done, "Inserting object failed"));
        });
    });
});