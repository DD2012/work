define(['text!pages/unusualWaring/unusualWaring.html', 'css!pages/unusualWaring/unusualWaring', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/unusualWaring/unusualWaring';


        var viewModel = {
            app: {},
            totalPages: '',
            pageSize: 5,
            currentPage: 2,
            totalCount: '',
            event: {
                func: function () {
                    debugger;
                    // $.ajax({
                    //     type: 'get',
                    //     url: url,
                    //     dataType: 'json',
                    //     contentType: 'application/json;charset=utf-8'
                    // }).done(function (res) {
                    //     console.log(res);
                    // })
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    viewModel.initPagination();
                    viewModel.fetchData();
                }
            },
            unusualWaringGrid: new u.DataTable({
                meta: {
                    combo:{},
                    pbillCode: {},
                    pbillTime: {},
                    productName: {},
                    seriesName: {},
                    partsCode: {},
                    pbillName: {},
                    pbillType: {},
                    num: {},
                    unit: {},
                    quAppraisal: {},
                    currentState: {},
                    stayTime: {},
                    handle: {},
                    reportModel: {}
                }
            }),
            initPagination: function () {
                var el = document.querySelector("#pagination");
                viewModel.pagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination.on('pageChange', function (currentPage) {
                    viewModel.currentPage = currentPage + 1;
                    viewModel.fetchData();

                });
                viewModel.pagination.on('sizeChange', function (pageSize) {
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                    viewModel.fetchData();
                });
            },
            fetchData: function () {
                $.ajax({
                    type: 'get',
                    url: url,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }).done(function (res) {
                    if (res.result == 1) {
                        viewModel.currentPage = res.pageIndex;
                        viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.pageSize = res.pageSize;
                        viewModel.totalCount = res.total;

                        viewModel.unusualWaringGrid.setSimpleData(res.data, {unSelect: true});

                        viewModel.pagination.update({
                            totalPages: viewModel.totalPages ||6,
                            pageSize: viewModel.pageSize ||2,
                            currentPage: viewModel.currentPage,
                            totalCount: viewModel.totalCount
                        });
                    }
                })
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
