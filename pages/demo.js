define(['text!pages/test1/test1.html', 'css!pages/test1/test1', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {


        var viewModel = {
            event: {
                func: function () {

                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                }
            }
        };
        $(element).html(html);
        viewModel.event.pageInit();
    };
    return {
        'template': html,
        init: init
    }
});
