var listManager = (function (){
    var instance;

    var list = [];

    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
        clearList: function () {
            list = [];
        },
        addToList: function (item) {
            list.push(item);
        },
        saveList: function () {
            return JSON.stringify(list);
        },
        parseList: function (str) {
            list = JSON.parse(str);
            return list;
        },
        returnList: function () {
            return list;
        },
        isEmpty: function() {
            if (list.length === 0) {
                return false; }
            return true;
        }

    };
});

module.export = listManager;