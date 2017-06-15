define(['text!pages/supplementCycleMaintain/supplementCycleMaintain.html', 'css!pages/supplementCycleMaintain/supplementCycleMaintain', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var listUrl = ctx + '/supplementCycleMaintain/supplementCycleMaintain';
        var list = 'http://192.168.79.88:8080/pbill/billType/list';
        var del = 'http://192.168.79.88:8080/pbill/billMaintenance/del';
        var save = 'http://192.168.79.88:8080/pbill/billMaintenance/save';
        var init = 'http://192.168.79.88:8080/pbill/billMaintenance/list';


        var viewModel = {
            searchCode: ko.observable(),
            searchName: ko.observable(),
            mainPage: {
                totalPages: '',
                pageSize: 10,
                currentPage: 1,
                totalCount: ''
            },
            dialogPage: {
                totalPages: '',
                pageSize: 10,
                currentPage: 1,
                totalCount: ''
            },
            willTurnToLastPage: true,
            event: {
                func: function () {
                    console.log('test');
                    debugger;
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    viewModel.initPageTable();
                },
                add: function () {
                    if (viewModel.willTurnToLastPage) {
                        viewModel.initPageTable().then(function () {
                            var allRows = viewModel.supplementCycleMaintain.getAllRows().filter(function (row) {
                                return row.status != 'fdel';
                            });
                            var shouldAdd = (!!allRows.slice(-1)[0].getSimpleData().name && !!allRows.slice(-1)[0].getSimpleData().cycleTime)
                            if (shouldAdd) {

                                var row = new Row({parent: viewModel.supplementCycleMaintain});
                                row.myStatus = 'canEdit';
                                row.isAdd = true;
                                viewModel.supplementCycleMaintain.addRow(row);
                                viewModel.event.setCanEditRenderType();//设置可编辑区域的样式
                                viewModel.willTurnToLastPage = false;
                                viewModel.mainPage.currentPage = viewModel.mainPage.totalPages;
                                viewModel.mainPagination.update({
                                    totalPages: viewModel.mainPage.totalPages,
                                    pageSize: viewModel.mainPage.pageSize,
                                    currentPage: viewModel.mainPage.currentPage,
                                    totalCount: viewModel.mainPage.totalCount
                                });
                            }
                        });
                    } else {
                        var allRows = viewModel.supplementCycleMaintain.getAllRows().filter(function (row) {
                            return row.status != 'fdel';
                        });
                        var shouldAdd = (!!allRows.slice(-1)[0].getSimpleData().name && !!allRows.slice(-1)[0].getSimpleData().cycleTime)
                        if (shouldAdd) {
                            var row = new Row({parent: viewModel.supplementCycleMaintain});
                            row.myStatus = 'canEdit';
                            row.isAdd = true;
                            viewModel.supplementCycleMaintain.addRow(row);
                            viewModel.event.setCanEditRenderType();//设置可编辑区域的样式
                            viewModel.willTurnToLastPage = false;
                        }
                    }
                },
                save: function () {//保存已经选择了的数据
                    var willSendData = viewModel.supplementCycleMaintain.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData()
                            }).filter(function (v) {
                                return v['cycleTime'] && v['name'];
                            });
                    //ajax
                    willSendData.forEach(function (v) {
                        delete v.searchHook;
                        delete v.hook1;
                        delete v.code;
                    });
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        // url: listUrl,
                        url: save,
                        data: JSON.stringify(willSendData)
                    }).done(function (res) {
                        //保存后重新设置不可编辑
                        if (res.result == 1) {
                            viewModel.willTurnToLastPage = true;
                            viewModel.mainPage.currentPage = 1;
                            viewModel.mainPagination.update({
                                totalPages: viewModel.mainPage.totalPages,
                                pageSize: viewModel.mainPage.pageSize,
                                currentPage: viewModel.mainPage.currentPage,
                                totalCount: viewModel.mainPage.totalCount
                            });
                            viewModel.initPageTable();
                        }
                    }).fail(function (res) {
                        console.log(res)
                    })
                },
                mutipleDel: function () {
                    var params = viewModel.supplementCycleMaintain.getSimpleData({type: 'select'})
                            .map(function (v) {
                                return {id: v.id};
                            }).filter(function (v) {
                                return v.id
                            });
                    var selectedIndex = viewModel.supplementCycleMaintain.getSelectedIndexs();
                    if (params.length > 0) {
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            // url: listUrl,
                            url: del,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            //保存后重新设置不可编辑
                            if (res.result == 1) {
                                viewModel.supplementCycleMaintain.removeRows(selectedIndex);
                            }
                        })
                    }else {
                        viewModel.supplementCycleMaintain.removeRows(selectedIndex);
                    }
                },
                addSearchData: function (rowIndex) {//把搜索后的结果添加到主页面中(点击事件)
                    var clickRowSimpleData = viewModel.search.getRow(rowIndex).getSimpleData();
                    //主页面对应行设置数据
                    var mainRowIndex = viewModel.supplementCycleMaintain.getIndexByRowId(viewModel.rowId);
                    delete clickRowSimpleData.id
                    viewModel.supplementCycleMaintain.getRow(mainRowIndex).setSimpleData(clickRowSimpleData);
                    viewModel.dialog.close();
                },
                searchDialog: function (rowId) {//主页面中的搜索
                    viewModel.rowId = rowId;
                    console.log(viewModel.rowId);
                    viewModel.dialog = u.dialog({
                        id: 'testDialg',
                        content: "#dialog_content",
                        hasCloseMenu: true,
                        width: '70%',
                        closeFun: function () {
                            $('.paginationHook').hide();
                            viewModel.searchCode('');
                            viewModel.searchName('');
                            viewModel.search.removeAllRows();
                            viewModel.currentPage = 1;
                        }
                    });
                    $('.paginationHook').show();
                    viewModel.initPagination();
                    viewModel.fetchData();
                },
                search: function () {//弹出框点击搜索事件
                    viewModel.dialogPage.currentPage = 1;

                    viewModel.fetchData();
                },
                del1: function (rowId) {
                    var rowIndex = viewModel.supplementCycleMaintain.getIndexByRowId(rowId);
                    var id = viewModel.supplementCycleMaintain.getRow(rowIndex).getSimpleData().id;
                    var params = [{id: id}];
                    if(id){
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            // url: listUrl,
                            url: del,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            //保存后重新设置不可编辑
                            console.log(params);
                            if (res.result == 1) {
                                viewModel.supplementCycleMaintain.removeRow(rowIndex);
                                viewModel.initPageTable();
                            }
                        }).fail(function (res) {
                            console.log(res);

                        })
                    }else {
                        viewModel.supplementCycleMaintain.removeRow(rowIndex);
                    }

                },
                edit1: function (rowId) {
                    var row = viewModel.supplementCycleMaintain.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.event.setCanEditRenderType();
                },
                setCanEditRenderType: function () {//设置可编辑行的样式
                    var grid = viewModel.app.getComp('supplementCycleMaintain').grid;
                    grid.setRenderType('cycleTime', function (obj) {//控制搜索列的显示隐藏
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.supplementCycleMaintain.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                    grid.setRenderType('searchHook', function (obj1) {//控制搜索列的显示隐藏
                        var rowId = obj1.row.value['$_#_@_id'];
                        var myStatus = viewModel.supplementCycleMaintain.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj1.element.innerHTML = '<span data-bind="click:event.searchDialog.bind($data,' + rowId + ')" class="uf uf-search font-size-24" style="cursor: pointer;"></span>';
                            ko.applyBindings(viewModel, obj1.element);
                        }
                    });
                }
            },
            supplementCycleMaintain: new u.DataTable({
                meta: {
                    name: {},
                    cycleTime: {},
                    searchHook: {},
                    hook1: {},
                    type: {
                        default: {
                            value: 'PRODUCT_CYCLE'
                        }
                    }
                }
            }),
            search: new u.DataTable({
                meta: {
                    code: {},
                    name: {}
                }
            }),
            onBeforeEditFun: function (obj) { //条件编辑
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.supplementCycleMaintain.getRowByRowId(rowId);
                if (row.myStatus == 'canEdit' && obj.colIndex == 2) {
                    // if (row.myStatus == 'canEdit') {
                    return true;
                }
            },
            manualRender: function (obj) { //弹出框'操作'render
                var rowId = obj.row.value['$_#_@_id'];
                var rowIndex = obj.rowIndex;
                var html = '<span data-bind="click:event.addSearchData.bind(null,' + rowIndex + ')" style="cursor: pointer;">确定<span class="uf uf-search"></span></span>'
                obj.element.innerHTML = html;

                ko.applyBindings(viewModel, obj.element);
            },
            mainHandleRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del1.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit1.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);

            },
            initPagination: function () {//弹框分页
                var el = document.querySelector("#pagination");
                viewModel.pagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination.on('pageChange', function (pageIndex) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.dialogPage.currentPage = pageIndex + 1;
                    viewModel.fetchData();

                });
                viewModel.pagination.on('sizeChange', function (pageSize) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.dialogPage.pageSize = pageSize;
                    viewModel.dialogPage.currentPage = 1;
                    viewModel.fetchData();
                });
            },
            fetchData: function () {//弹框搜索数据
                var params = {
                    type: 'PRODUCT_CYCLE',
                    pageIndex: viewModel.dialogPage.currentPage,
                    pageSize: viewModel.dialogPage.pageSize,
                    code: viewModel.searchCode(),
                    name: viewModel.searchName()
                };
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    // url: listUrl,
                    url: list,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {
                        viewModel.dialogPage.currentPage = res.pageIndex;
                        viewModel.dialogPage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.dialogPage.pageSize = res.pageSize;
                        viewModel.dialogPage.totalCount = res.total;

                        viewModel.pagination.update({
                            totalPages: viewModel.dialogPage.totalPages,
                            pageSize: viewModel.dialogPage.pageSize,
                            currentPage: viewModel.dialogPage.currentPage,
                            totalCount: viewModel.dialogPage.totalCount
                        });


                        viewModel.search.removeAllRows();
                        viewModel.search.setSimpleData(res.data, {unSelect: true});
                    }

                }).fail(function (res) {
                    console.log(res);
                });
            },
            initPageTable: function () {//页面进来就加载数据
                var params = {
                    pageIndex: viewModel.mainPage.currentPage,
                    pageSize:viewModel.mainPage.pageSize,
                    type:"PRODUCT_CYCLE"
                };
                var deffered = $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    // url: listUrl
                    url: init,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {
                        viewModel.mainPage.currentPage = res.pageIndex;
                        viewModel.mainPage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.mainPage.pageSize = res.pageSize;
                        viewModel.mainPage.totalCount = res.total;
                        viewModel.initMainPage();
                        viewModel.mainPagination.update({
                            totalPages: viewModel.mainPage.totalPages,
                            pageSize: viewModel.mainPage.pageSize,
                            currentPage: viewModel.mainPage.currentPage,
                            totalCount: viewModel.mainPage.totalCount
                        });
                        viewModel.supplementCycleMaintain.setSimpleData(res.data, {unSelect: true});
                    }
                });
                return deffered;
            },
            initMainPage: function () {//主页面分页
                var el = document.querySelector("#mainPagination");
                viewModel.mainPagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.mainPagination.on('pageChange', function (pageIndex) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.mainPage.currentPage = pageIndex + 1;
                    viewModel.initPageTable();
                });
                viewModel.mainPagination.on('sizeChange', function (pageSize) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.mainPage.pageSize = pageSize;
                    viewModel.mainPage.currentPage = 1;
                    viewModel.initPageTable();
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