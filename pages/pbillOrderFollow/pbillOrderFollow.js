define(['text!pages/pbillOrderFollow/pbillOrderFollow.html', 'css!pages/pbillOrderFollow/pbillOrderFollow', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/pbillOrderFollow/pbillOrderFollow';
        var url1 = ctx + '/pbillOrderFollow/pbillOrderFollowDropdowns';


        var viewModel = {
            app: {},
            totalPages: '',
            pageSize: 5,
            currentPage: 2,
            totalCount: '',
            event: {
                func: function () {
                    debugger;


                },
                pageInit: function () {
                    $.ajax({
                        data: 'params',
                        type: 'get',
                        url: url1,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {
                        if (res.result == 1) {
                            viewModel.pbillOrderType = res.data.pbillOrderType;
                            viewModel.pbillType = res.data.pbillType;
                            viewModel.pbillReason = res.data.pbillReason;
                            viewModel.handleState = res.data.handleState;
                            viewModel.reportModel = res.data.reportModel;
                            viewModel.productionMethod = res.data.productionMethod;
                            viewModel.productionFactory = res.data.productionFactory;
                            viewModel.logisticsMode = res.data.logisticsMode;
                            viewModel.app = u.createApp({
                                el: element,
                                model: viewModel
                            });
                        }
                    });

                },
                search: function () {
                    viewModel.initPagination();
                    viewModel.fetchData();
                },
                reset: function () {

                }
            },
            pbillOrderFollow: new u.DataTable({
                meta: {
                    sellOrderNum: {},
                    sellArriving: {},
                    name: {},
                    pbillCode: {},
                    pbillPame: {},
                    pbillTime: {},
                    productName: {},
                    seriesName: {},
                    partsCode: {},
                    partsMark: {},
                    pbillName: {},
                    pbillType: {},
                    num: {},
                    unit: {},
                    quAppraisal: {},
                    productionMethod: {},
                    productionFactory: {},
                    logisticsMode: {},
                    address: {},
                    carNum: {},
                    expressNumber: {},
                    handleState: {},
                    reportModel: {}
                }
            }),
            searchCondition: new u.DataTable({
                meta: {
                    pbillCode: {},
                    orderNum: {},
                    name: {},
                    pbillPame: {},
                    productName: {},
                    seriesName: {},
                    pbillName: {},
                    carNum: {},
                    expressNumber: {},
                    pbillOrderType: {},
                    startTime: {},
                    endTime: {},
                    pbillType: {},
                    pbillReason: {},
                    handleState: {},
                    reportModel: {},
                    productionMethod: {},
                    productionFactory: {},
                    logisticsMode: {}
                }
            }),
            pbillOrderType: [],//补件订单类型
            pbillType: [],//补件类型
            pbillReason: [],//补件原因
            handleState: [],//处理状态
            reportModel: [],//填报方式
            productionMethod: [],//生产方式
            productionFactory: [],//生产工厂
            logisticsMode: [],//物流方式
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
                var params = viewModel.searchCondition.getSimpleData();
                $.ajax({
                    data: params,
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

                        viewModel.pbillOrderFollow.setSimpleData(res.data, {unSelect: true});

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


        $('#condition-toggle').on('click', function () {
            var isVisible = $('.drop').hasClass('u-not-visible');
            if (isVisible) {
                $('.drop').removeClass('u-not-visible').addClass('u-visible');
                $(this).find('i').removeClass('uf-arrow-down').addClass('uf-arrow-up').end().find('span').html('收起');
            } else {
                $('.drop').removeClass('u-visible').addClass('u-not-visible');
                $(this).find('i').removeClass('uf-arrow-up').addClass('uf-arrow-down').end().find('span').html('展开');
            }
        });
        viewModel.searchCondition.setSimpleData([{}]);//搜索条件创建一行空数据


    };
    return {
        'template': html,
        init: init
    }


});
