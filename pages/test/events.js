
define(['exports','./test.js'],function (exports,test) {
    console.log(test);
    exports.events = function () {
        return{
            a:22222222,
            b:test
        }
    }


});

