define(['text!pages/BillAuditFirst/BillAuditFirst.html', 'css!pages/BillAuditFirst/BillAuditFirst', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/BillAuditFirst/BillAuditFirstDropDown';
        var url1 = ctx + '/BillAuditFirst/standardGrid';
        var url2 = ctx + '/BillAuditFirst/customizationGrid';


        var viewModel = {
            app:{},
            standardPage:{
                totalPages: '',
                pageSize: 5,
                currentPage: 1,
                totalCount: ''
            },
            customizationPage:{
                totalPages: '',
                pageSize: 5,
                currentPage: 1,
                totalCount: ''
            },
            event: {
                func: function () {
                    debugger;
                },
                pageInit: function () {
                    $.ajax({
                        type: 'get',
                        url: url,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {
                        if (res.result == 1) {
                            viewModel.hasImg = res.data.hasImg;
                            viewModel.reportModel = res.data.reportModel;
                            viewModel.quAppraisal = res.data.quAppraisal;
                            viewModel.isPbill = res.data.isPbill;
                            viewModel.app = u.createApp({
                                el: element,
                                model: viewModel
                            });
                        }
                    })
                },
                customizationSearch:function () {
                    viewModel.initCustomizationPagination();
                    viewModel.customizationFetchData();
                },
                standardSearch:function () {
                    viewModel.initStandardPagination();
                    viewModel.standardFetchData();
                }
            },
            //标准件grid数据
            standardGrid:new u.DataTable({
                meta:{
                    pbillApplyCode:{},
                    pbillPame:{},
                    pbillTime:{},
                    productCode:{},
                    productName:{},
                    pbillCode:{},
                    seriesName:{},
                    pbillName:{},
                    pbillType:{},
                    isPbill:{},
                    num:{},
                    firstAuditNum:{},
                    unit:{},
                    logisticsMode:{},
                    pbillReason:{},
                    picAddress:{},
                    quAppraisal:{},
                    reportModel:{}

                }
            }),
            //定制件grid数据
            customizationGrid:new u.DataTable({
                meta:{
                    pbillApplyCode:{},
                    pbillPame:{},
                    pbillTime:{},
                    pbillName:{},
                    color:{},
                    length:{},
                    wide:{},
                    thick:{},
                    num:{},
                    firstAdultNum:{},
                    unit:{},
                    area:{},
                    thinEdge:{},
                    thickBand:{},
                    logisticsMode:{},
                    pbillReason:{},
                    picAddress:{},
                    quAppraisal:{},
                    remark:{},
                    productSelect:{}
                }
            }),
            //标准件搜索
            standardSearch: new u.DataTable({
                meta: {
                    pbillCode: {},
                    pbillPame: {},
                    productName: {},
                    seriesName: {},
                    pbillName: {},
                    hasImg: {},
                    reportModel: {},
                    startTime: {},
                    endTime: {}
                }
            }),
            //定制件搜索
            customizationSearch: new u.DataTable({
                meta: {
                    pbillCode: {},
                    pbillPame: {},
                    productName: {},
                    seriesName: {},
                    pbillName: {},
                    hasImg: {},
                    reportModel: {},
                    startTime: {},
                    endTime: {}
                }
            }),
            hasImg: [],//是否有见证图片
            reportModel: [],//填报方式
            quAppraisal: [],//原因鉴定
            isPbill:[],//是否允许补件
            standardFetchData:function () {
                var params = viewModel.standardSearch.getRow(0).getSimpleData();
                $.ajax({
                    type: 'get',
                    url: url1,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }).done(function (res) {
                    if(res.result == 1){
                        viewModel.standardPage.currentPage = res.pageIndex;
                        viewModel.standardPage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.standardPage.pageSize = res.pageSize;
                        viewModel.standardPage.totalCount = res.total;

                        viewModel.standardGrid.setSimpleData(res.data,{unSelect:true});

                        viewModel.paginationStandard.update({
                            totalPages: viewModel.standardPage.totalPages || 5,
                            totalCount: viewModel.standardPage.totalCount,
                            pageSize: viewModel.standardPage.pageSize,
                            currentPage: viewModel.standardPage.currentPage

                        });
                    }
                })
            },
            customizationFetchData:function () {
                var params = viewModel.customizationSearch.getRow(0).getSimpleData();
                $.ajax({
                    type: 'get',
                    url: url2,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }).done(function (res) {
                    if(res.result == 1){
                        viewModel.customizationPage.currentPage = res.pageIndex;
                        viewModel.customizationPage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.customizationPage.pageSize = res.pageSize;
                        viewModel.customizationPage.totalCount = res.total;

                        viewModel.customizationGrid.setSimpleData(res.data,{unSelect:true});

                        viewModel.paginationCustomization.update({
                            totalPages: viewModel.customizationPage.totalPages || 5,
                            totalCount: viewModel.customizationPage.totalCount,
                            pageSize: viewModel.customizationPage.pageSize,
                            currentPage: viewModel.customizationPage.currentPage

                        });
                    }
                })

            },
            initStandardPagination:function () {
                var el = document.querySelector("#standardPagination");
                viewModel.paginationStandard = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.paginationStandard.on('pageChange', function (currentPage) {
                    viewModel.currentPage = currentPage + 1;
                    viewModel.standardFetchData();

                });
                viewModel.paginationStandard.on('sizeChange', function (pageSize) {
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                    viewModel.customizationFetchData();
                });

            },
            initCustomizationPagination:function () {
                var el = document.querySelector("#customizationPagination");
                viewModel.paginationCustomization = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.paginationCustomization.on('pageChange', function (currentPage) {
                    viewModel.currentPage = currentPage + 1;
                    viewModel.customizationFetchData();

                });
                viewModel.paginationCustomization.on('sizeChange', function (pageSize) {
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                    viewModel.customizationFetchData();
                });

            }

        };
        $(element).html(html);
        viewModel.event.pageInit();


        viewModel.standardSearch.setSimpleData([{}]);//为标准件创建一行空数据
        viewModel.customizationSearch.setSimpleData([{}]);//为标准件创建一行空数据



    };
    return {
        'template': html,
        init: init
    }
});
