define(['text!pages/supplyReason/supplyReason.html', 'css!pages/supplyReason/supplyReason', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/supplyReason/supplyReason';

        var list = 'http://192.168.79.88:8080/pbill/billQu/list';
        var save = 'http://192.168.79.88:8080/pbill/billQu/save';
        var del = 'http://192.168.79.88:8080/pbill/billQu/del';



        var viewModel = {
            app: {},
            totalPages: '',
            pageSize: 5,
            currentPage: 1,
            totalCount: '',
            willFetchBeforeAdd: true,
            hasNotFetchYet: true,
            event: {
                func: function () {
                    debugger;


                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    viewModel.fetchData();
                    viewModel.paginationInit();
                },
                add: function () {
                    if (viewModel.hasNotFetchYet) {//还没有获取数据
                        var row = new Row({parent: viewModel.supplyReason});
                        row.myStatus = 'canEdit';
                        viewModel.supplyReason.addRow(row);
                        viewModel.setCanEditRenderType();
                    } else {//已经获取了数据
                        if (viewModel.willFetchBeforeAdd) {//重新获取数据，跳转到最后一页
                            viewModel.currentPage = viewModel.totalPages;
                            viewModel.fetchData()
                                    .done(function () {
                                        var row = new Row({parent: viewModel.supplyReason});
                                        row.myStatus = 'canEdit';
                                        viewModel.supplyReason.addRow(row);
                                        viewModel.willFetchBeforeAdd = false;
                                        viewModel.setCanEditRenderType();
                                    });
                        } else {//已经在最后一页，不需要再重新获取数据
                            var row = new Row({parent: viewModel.supplyReason});
                            row.myStatus = 'canEdit';
                            viewModel.supplyReason.addRow(row);
                            viewModel.setCanEditRenderType();
                        }
                    }
                },
                save: function () {
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.currentPage = 1;
                    var params = viewModel.supplyReason.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    params.forEach(function (v) {
                        delete v.handleHook;
                        delete v.remark;
                    });
                    if (params.length > 0) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url,
                            url: save,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.fetchData();
                            }
                        });
                    }
                },
                del: function (rowId) {
                    var id = viewModel.supplyReason.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.supplyReason.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url,
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.fetchData();
                            }
                        });
                    } else {
                        viewModel.supplyReason.removeRow(index);
                    }
                },
                mutipleDel:function (rowId) {
                    var selectedIndexs = viewModel.supplyReason.getSelectedIndexs();
                    var params = viewModel.supplyReason.getSelectedRows()
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
                            viewModel.fetchData();
                        })
                    } else {
                        viewModel.supplyReason.removeRows(selectedIndexs);
                    }

                },
                edit:function (rowId) {
                    var row = viewModel.supplyReason.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.setCanEditRenderType();

                }
            },
            supplyReason: new u.DataTable({
                meta: {
                    name: {},
                    remark: {},
                    handleHook:{
                        default:{
                            value:'用作跳过空值判断'
                        }
                    }
                }
            }),
            handleHookRender:function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            setCanEditRenderType:function () {
                var grid = viewModel.app.getComp('supplyReason').grid;
                function func(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.supplyReason.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }
                var arr = ['name', 'remark'];
                arr.forEach(function (field) {
                    func(field)
                })
            },
            onBeforeEditFun:function (obj) {
                var canEditColIndexs = [0, 1];
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.supplyReason.getRowByRowId(rowId);
                return row.myStatus == 'canEdit' && (canEditColIndexs.indexOf(obj.colIndex) != -1);
            },
            fetchData: function () {
                viewModel.hasNotFetchYet = false;
                viewModel.paginationInit();
                var params = {
                    pageIndex:viewModel.currentPage,
                    pageSize:viewModel.pageSize
                };
                var deffered = $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    // url: url,
                    url: list,
                    data: params
                }).done(function (res) {
                    var simpleData = res.data;
                    viewModel.currentPage = res.pageIndex;
                    viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.pageSize = res.pageSize;
                    viewModel.totalCount = res.total;



                    viewModel.supplyReason.removeAllRows();
                    viewModel.supplyReason.clear();
                    viewModel.supplyReason.setSimpleData(simpleData, {unSelect: true});


                    viewModel.pagination1Comp.update({
                        totalPages: viewModel.totalPages,
                        totalCount: viewModel.totalCount,
                        pageSize: viewModel.pageSize,
                        currentPage: viewModel.currentPage
                    });
                });
                return deffered;
            },
            paginationInit: function () {
                var el = document.querySelector("#pagination1");
                viewModel.pagination1Comp = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination1Comp.on('pageChange', function (currentPage) {
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.currentPage = currentPage + 1;
                    viewModel.fetchData();

                });
                viewModel.pagination1Comp.on('sizeChange', function (pageSize) {
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                    viewModel.fetchData();
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
