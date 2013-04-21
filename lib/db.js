define("db", ["linq2indexeddb"], function (linq2indexeddb) {
    function getDatabaseConfiguration() {
        var dbConfig = {
            version: 1
        };
        // NOTE: definition is an array of schemas, keyed by version;
        // this allows linq2indexedDb to do auto-schema-migrations, based upon the current dbConfig.version
        dbConfig.definition = [{
            version: 1,
            objectStores: [
            { name: "store", objectStoreOptions: { keyPath: 'key' } },
            ],
            defaultData: []
        },
        ];
        
        return dbConfig;
    }

    var module = {
        Database: function (name) {
            var self = this;

            self._db = linq2indexeddb(name, getDatabaseConfiguration());

            self.deleteDatabase = function () {
                return self._db.deleteDatabase();
            };

            self.initialize = function () {
                return self._db.initialize();
            };

            self.insert = function (data) {
                return self._db.linq.from("store").insert(data);
            };
        }
    };
    return module;
});
