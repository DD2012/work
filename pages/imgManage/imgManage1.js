define(['text!pages/imgManage1/imgManage1.html', 'css!pages/imgManage1/imgManage1', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/imgManage/imgManage';


        var viewModel = {
            app:{},
            totalPages: '',
            pageSize:5,
            currentPage:1,
            totalCount:'',
            willFetchBeforeAdd:true,
            hasNotFetchYet:true,
            event: {
                func: function () {
                    console.log('test');
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                },
                search:function () {
                    viewModel.hasNotFetchYet = false;
                    viewModel.currentPage = 1;
                    viewModel.event.paginationInit();
                    viewModel.event.fetchData();
                },
                add:function () {
                    var row = new Row({parent:viewModel.imgManageAdd});
                    viewModel.imgManageAdd.addRow(row);
                },
                del:function () {
                    var selectedRows = viewModel.imgManage.getSelectedIndexs();
                    var selectedSellCodes = viewModel.imgManage.getSelectedRows()
                            .map(function (row) {
                                return row.getSimpleData().suiteCode;
                            });
                    viewModel.imgManage.removeRows(selectedRows);
                    console.log(selectedSellCodes);
                    var willAppendData = viewModel.imgManage.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).filter(function (v) {
                                return v.suiteCode;
                            });
                    viewModel.imgManage.setSimpleData(willAppendData,{unSelect:true});
                },
                save:function () {

                },
                handle:function (suiteCode) {
                    console.log(suiteCode);
                },
                paginationInit:function () {
                    $('.paginationHook').removeClass('hidden');
                    $('.paginationHook').addClass('show');
                    var el = document.querySelector("#pagination1");
                    viewModel.pagination1Comp = new u.pagination({
                        el: el,
                        showState:true,
                        jumppage: true
                    });
                    viewModel.pagination1Comp.on('pageChange',function (currentPage) {
                        console.log(currentPage);
                        viewModel.willFetchBeforeAdd = true;
                        viewModel.currentPage = currentPage+1;
                        viewModel.event.fetchData();

                    });
                    viewModel.pagination1Comp.on('sizeChange', function(pageSize) {
                        viewModel.willFetchBeforeAdd = true;
                        viewModel.pageSize = pageSize;
                        viewModel.currentPage = 1;
                        viewModel.event.fetchData();
                    });
                },
                fetchData:function () {
                    var params = {
                        suiteCode:viewModel.setCodeSearch(),
                        currentPage:viewModel.currentPage,
                        pageSize:viewModel.pageSize
                    };
                    var deffered = $.ajax({
                        data:params,
                        type: 'get',
                        url: url,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {
                        var mokeContent = res.data.splice(viewModel.pageSize*(viewModel.currentPage-1),viewModel.pageSize);

                        viewModel.totalPages = res.totalPages;
                        viewModel.totalCount = res.totalCount;
                        viewModel.imgManage.removeAllRows();
                        viewModel.imgManage.clear();
                        viewModel.imgManage.setSimpleData(mokeContent,{unSelect:true});


                        viewModel.pagination1Comp.update({
                            totalPages: viewModel.totalPages,
                            totalCount: viewModel.totalCount,
                            pageSize: viewModel.pageSize,
                            currentPage: viewModel.currentPage

                        });
                    });
                    return deffered;
                },
                afterAdd: function(element, index, data) {
                    if (element.nodeType === 1) {
                        u.compMgr.updateComp(element);
                    }
                }
            },
            setCodeSearch:ko.observable(),
            imgManage:new u.DataTable({
                meta:{
                    suiteCode:{},
                    suiteName:{},
                    productType:{},
                    seriesName:{},
                    picPath:{},
                    fileName:{}
                }
            }),
            imgManageAdd:new u.DataTable({
                meta:{
                    suiteCode:{},
                    suiteName:{},
                    productType:{},
                    seriesName:{},
                    picPath:{},
                    fileName:{}
                }
            })
        };
        $(element).html(html);
        viewModel.event.pageInit();



        viewModel.imgManageAdd.setSimpleData([{}],{unSelect:true});



























    };
    return {
        'template': html,
        init: init
    }
});
