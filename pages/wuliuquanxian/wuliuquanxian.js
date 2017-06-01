define(['text!pages/wuliuquanxian/wuliuquanxian.html', 'css!pages/wuliuquanxian/wuliuquanxian', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/wuliuquanxian/xiangqing';
        var url1 = ctx + '/wuliuquanxian/wuliuguizhe';
        var init = ctx + '/wuliuquanxian/pageInit';



        var dropDown = 'http://192.168.79.88:8080/pbill/logistics/ways/list';
        var list = 'http://192.168.79.88:8080/pbill/logistics/list';
        var searchList = 'http://192.168.79.88:8080/pbill/logistics/distributor/list';
        var save = 'http://192.168.79.88:8080/pbill/logistics/save';
        var del = 'http://192.168.79.88:8080/pbill/logistics/del';


        var viewModel = {
            app: {},
            totalPages: '',
            pageSize: 10,
            currentPage: 1,
            totalCount: '',
            mainPage:{
                totalPages: '',
                pageSize: 10,
                currentPage: 1,
                totalCount: ''
            },
            willTurnToLastPage:true,
            rowId: '',
            disCode: ko.observable(),//弹出框搜索条件
            disName: ko.observable(),//弹出框搜索条件
            event: {
                func: function () {
                    debugger;
                    console.log('test');
                },
                pageInit: function () {
                    $.ajax({
                        data: 'searchData',
                        type: 'get',
                        // url: dropDown,
                        url: url1,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).then(function (res) {
                        var willPentWuliuCombo = res.data.map(function (v) {
                            return {
                                name: v.logistics,
                                value: v.logisticsId
                            }
                        });
                        viewModel.wuliuMethodCombo = willPentWuliuCombo;
                        viewModel.app = u.createApp({
                            el: element,
                            model: viewModel
                        });

                        viewModel.initPageLoad();
                        viewModel.initMainPagination();

                    });
                },
                search: function () {//弹出框查询按钮事件
                    viewModel.pagination1InitAndEvent();
                    viewModel.fetchData();
                    $('.paginationHook').show();

                },
                add: function () {
                    var row = new Row({parent: viewModel.wuliu});
                    row.setSimpleData({
                        logisticsId: '1,3'
                    });
                    row.myStatus = 'canEdit';
                    row.isAdd = true;

                    if(viewModel.willTurnToLastPage){
                        viewModel.mainPage.currentPage = viewModel.mainPage.totalPages;
                        viewModel.initPageLoad().done(function () {

                            viewModel.wuliu.addRow(row);
                            viewModel.setCanEditRenderType();
                            viewModel.willTurnToLastPage = false;

                            viewModel.mainPagination.update({
                                totalPages: viewModel.mainPage.totalPages,
                                pageSize: viewModel.mainPage.pageSize,
                                currentPage: viewModel.mainPage.currentPage,
                                totalCount: viewModel.mainPage.totalCount
                            });
                        })
                    }else {
                        viewModel.wuliu.addRow(row);
                        viewModel.setCanEditRenderType();
                    }
                },
                mutipleDel: function () {
                    var selectedIndexs = viewModel.wuliu.getSelectedIndexs();
                    var params = viewModel.wuliu.getSelectedRows()
                            .map(function (row) {
                                return {id: row.getSimpleData().id};
                            }).filter(function (v) {
                                return v.id;
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url,
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            console.log(params);
                            viewModel.wuliu.removeRows(selectedIndexs);
                        })
                    } else {
                        viewModel.wuliu.removeRows(selectedIndexs);
                    }
                },
                del: function (rowId) {
                    var id = viewModel.wuliu.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.wuliu.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            url: del,
                            // url: url,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.wuliu.removeRow(index);
                                console.log(params);
                            }
                        })
                    } else {
                        viewModel.wuliu.removeRow(index);

                    }
                },
                edit: function (rowId) {
                    var row = viewModel.wuliu.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.setCanEditRenderType();
                },
                save: function () {
                    var params = viewModel.wuliu.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    params.forEach(function (v) {
                        delete v.handleHook;
                        delete v.searchHook;
                    });
                    if (params.length > 0) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            url: save,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.wuliu.setSimpleData(viewModel.wuliu.getSimpleData(), {unSelect: true});
                            }
                        });
                    }
                },
                search2: function (rowId) {//主页面搜索按钮事件
                    viewModel.rowId = rowId;
                    viewModel.dialog = u.dialog({
                        id: 'searchDialog',
                        content: '#searchContent',
                        hasCloseMenu: true,
                        width: '75%',
                        closeFun: function () {
                            viewModel.disCode('');
                            viewModel.disName('');
                        }
                    });
                    viewModel.search.clear();
                },
                addSearchData: function (rowIndex) {
                    var rowId = viewModel.rowId;
                    var simpleDataDialog = viewModel.search.getRow(rowIndex).getSimpleData();
                    viewModel.wuliu.getRowByRowId(rowId).setSimpleData(simpleDataDialog);
                    viewModel.dialog.close();

                }
            },
            search: new u.DataTable({
                meta: {
                    storeCode: {},
                    storeName: {},
                    officeCode: {},
                    handleHook: {
                        default: {value: 'haha'}
                    }
                }
            }),
            wuliu: new u.DataTable({
                meta: {
                    businessAccount: {},
                    storeCode: {},
                    storeName: {},
                    logisticsId: {},//物流方式
                    searchHook: {
                        default: {value: ''}
                    },
                    handleHook: {
                        default: {value: 'haha'}
                    }
                }
            }),
            wuliuMethodCombo: [],
            wuliueditFun: function (obj) {
                var canEditColIndexs = [0, 1, 3, 4, 5];
                var rowId = obj.rowObj.value['$_#_@_id'];
                var myStatus = viewModel.wuliu.getRowByRowId(rowId).myStatus;
                if (myStatus == 'canEdit' && (canEditColIndexs.indexOf(obj.colIndex) != -1)) return true;
            },
            handleRender: function (obj) {//主页面操作
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            handleRenderDialog: function (obj) {//弹出框操作
                var rowId = obj.row.value['$_#_@_id'];
                var rowIndex = obj.rowIndex;
                var html = '<span data-bind="click:event.addSearchData.bind(null,' + rowIndex + ')" style="cursor: pointer;">确定<span class="uf uf-search"></span></span>'
                obj.element.innerHTML = html;

                ko.applyBindings(viewModel, obj.element);

            },
            setCanEditRenderType: function () {
                var grid = viewModel.app.getComp('wuliu').grid;

                function func(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.wuliu.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }

                var arr = ["businessAccount", "storeCode", "storeName", "officeCode"];
                arr.forEach(function (field) {
                    func(field)
                });
                grid.setRenderType('logisticsId', function (obj) {
                    var valueArr = obj.value.split(',');
                    var value = viewModel.wuliuMethodCombo.filter(function (item) {
                        return valueArr.indexOf(item.value.toString()) != -1;
                    }).map(function (item) {
                        return item.name;
                    }).join(',');
                    var rowId = obj.row.value['$_#_@_id'];
                    var myStatus = viewModel.wuliu.getRowByRowId(rowId).myStatus;
                    if (myStatus == 'canEdit') {
                        obj.element.innerHTML = value;
                        obj.element.style.boxSizing = 'border-box';
                        obj.element.style.border = '1px solid';
                    } else {
                        obj.element.innerHTML = value;
                    }
                });
                grid.setRenderType('searchHook', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var row = viewModel.wuliu.getRowByRowId(rowId);
                    if (row.myStatus == 'canEdit') {
                        var search2 = 'data-bind=click:event.search2.bind($data,' + rowId + ')';
                        var html = '<span class="uf uf-search font-size-30"' + search2 + ' style="cursor: pointer;"></span>'
                        obj.element.innerHTML = html;
                        ko.applyBindings(viewModel, obj.element);
                    }
                });
            },
            pagination1InitAndEvent: function () {
                var el = document.querySelector("#pagination1");
                viewModel.pagination1Comp = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination1Comp.on('pageChange', function (currentPage) {
                    viewModel.currentPage = currentPage + 1;

                    viewModel.fetchData()

                });
                viewModel.pagination1Comp.on('sizeChange', function (pageSize) {
                    viewModel.pageSize = pageSize;
                    viewModel.fetchData()
                });
            },
            fetchData: function () {

                var params = {
                    disCode: viewModel.disCode(),
                    disName: viewModel.disName(),
                    currentPage: viewModel.currentPage,
                    pageSize: viewModel.pageSize
                };


                var x = $.ajax({
                    data: params,
                    type: 'get',
                    // url: url,
                    url: searchList,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }).done(function (res) {
                    viewModel.currentPage = res.pageIndex;
                    viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.pageSize = res.pageSize;
                    viewModel.totalCount = res.total;
                    viewModel.pagination1Comp.update({
                        totalPages: viewModel.totalPages,
                        pageSize: viewModel.pageSize,
                        currentPage: viewModel.currentPage,
                        totalCount: viewModel.totalCount
                    });
                    if (res.result == 1) {
                        //模拟数据
                        var willAppendData = res.data;
                        viewModel.search.setSimpleData(willAppendData, {unSelect: true});
                    } else {
                        alert('fail');
                    }
                }).fail(function (res) {
                    console.log('error', res);
                });
            },
            initPageLoad:function () {
                var params = {
                    pageIndex:viewModel.mainPage.currentPage,
                    pageSize:viewModel.mainPage.pageSize
                };
                var x = $.ajax({
                    type: 'get',
                    // url: init,
                    url: list,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data:params
                }).done(function (res) {
                    if(res.result == 1){
                        viewModel.mainPage.currentPage = res.pageIndex;
                        viewModel.mainPage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.mainPage.pageSize = res.pageSize;
                        viewModel.mainPage.totalCount = res.total;

                        viewModel.wuliu.setSimpleData(res.data,{unSelect:true});

                        viewModel.mainPagination.update({
                            totalPages: viewModel.mainPage.totalPages,
                            pageSize: viewModel.mainPage.pageSize,
                            currentPage: viewModel.mainPage.currentPage,
                            totalCount: viewModel.mainPage.totalCount
                        });
                        setTimeout(function () {
                            viewModel.setCanEditRenderType();
                        },300)
                    }
                });
                return x;
            },
            initMainPagination:function () {
                var el = document.querySelector("#mainPagination");
                viewModel.mainPagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.mainPagination.on('pageChange', function (pageIndex) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.mainPage.currentPage = pageIndex + 1;
                    viewModel.initPageLoad();

                });
                viewModel.mainPagination.on('sizeChange', function (pageSize) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.mainPage.pageSize = pageSize;
                    viewModel.mainPage.currentPage = 1;
                    viewModel.initPageLoad();
                });
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
