define(['text!pages/patchType/patchType.html', 'css!pages/patchType/patchType', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/pathType/pathType';

        var list = 'http://192.168.79.88:8080/pbill/billCategory/list';
        var save = 'http://192.168.79.88:8080/pbill/billCategory/save';
        var del = 'http://192.168.79.88:8080/pbill/billCategory/del';



        var viewModel = {
            totalPages: '',
            pageSize: 5,
            currentPage: 1,
            totalCount: '',
            willFetchBeforeAdd: true,
            event: {
                func: function () {
                    console.log('test');
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    viewModel.initPagination();
                    viewModel.fetchData();
                },
                add: function () {

                    if (viewModel.willFetchBeforeAdd) {
                        viewModel.currentPage = viewModel.totalPages;
                        viewModel.fetchData()
                                .done(function () {
                                    viewModel.willFetchBeforeAdd = false;
                                    var metaKeys = Object.keys(viewModel.patchType.getMeta());
                                    var lastRowSimpleData = viewModel.patchType.getAllRows()
                                            .filter(function (row) {
                                                return row.status != 'fdel';
                                            }).map(function (row) {
                                                return row.getSimpleData();
                                            }).slice(-1)[0];
                                    if (lastRowSimpleData) {
                                        var shouldAdd = metaKeys.every(function (key) {
                                            return lastRowSimpleData[key];
                                        });
                                        if (shouldAdd) {
                                            var row = new Row({parent: viewModel.patchType});
                                            row.myStatus = 'canEdit';
                                            viewModel.patchType.addRow(row);
                                            viewModel.setCanEditRenderType();
                                        }
                                    } else {
                                        var row = new Row({parent: viewModel.patchType});
                                        row.myStatus = 'canEdit';
                                        viewModel.patchType.addRow(row);
                                        viewModel.setCanEditRenderType();
                                    }
                                });
                    } else {
                        var metaKeys = Object.keys(viewModel.patchType.getMeta());
                        var lastRowSimpleData = viewModel.patchType.getAllRows()
                                .filter(function (row) {
                                    return row.status != 'fdel';
                                }).map(function (row) {
                                    return row.getSimpleData();
                                }).slice(-1)[0];
                        if (lastRowSimpleData) {
                            var shouldAdd = metaKeys.every(function (key) {
                                return lastRowSimpleData[key];
                            });
                            if (shouldAdd) {
                                var row = new Row({parent: viewModel.patchType});
                                row.myStatus = 'canEdit';
                                viewModel.patchType.addRow(row);
                                viewModel.setCanEditRenderType();
                            }
                        } else {
                            var row = new Row({parent: viewModel.patchType});
                            row.myStatus = 'canEdit';
                            viewModel.patchType.addRow(row);
                            viewModel.setCanEditRenderType();
                        }
                    }
                },
                save: function () {
                    var params = viewModel.patchType.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    if (params.length > 0) {
                        params.forEach(function (v) {
                            delete v.handleHook;
                        });
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url,
                            url: save,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.currentPage = 1;
                                viewModel.willFetchBeforeAdd = true;
                                viewModel.fetchData();
                            }
                        });
                    }

                },
                del: function (rowId) {
                    var id = viewModel.patchType.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.patchType.getIndexByRowId(rowId);
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
                                viewModel.patchType.removeRow(index);
                                console.log(params);
                            }
                        })
                    } else {
                        viewModel.patchType.removeRow(index);

                    }
                },
                edit: function (rowId) {
                    var row = viewModel.patchType.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.setCanEditRenderType();
                },
                mutipleDel: function () {
                    var selectedIndexs = viewModel.patchType.getSelectedIndexs();
                    var params = viewModel.patchType.getSelectedRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            })
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
                            viewModel.patchType.removeRows(selectedIndexs);
                        })
                    } else {
                        viewModel.patchType.removeRows(selectedIndexs);
                    }
                }
            },
            patchType: new u.DataTable({
                meta: {
                    code: {},
                    name: {},
                    handleHook: {
                        default: {
                            value: 'heihei'
                        }
                    }
                }
            }),
            onBeforeEditFun: function (obj) {
                var canEditColIndexs = [0, 1];
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.patchType.getRowByRowId(rowId);
                return row.myStatus == 'canEdit' && (canEditColIndexs.indexOf(obj.colIndex) != -1);
            },
            handleHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            initPagination: function () {
                var el = document.querySelector("#pagination");
                viewModel.pagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination.on('pageChange', function (currentPage) {
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.currentPage = currentPage + 1;
                    viewModel.fetchData();

                });
                viewModel.pagination.on('sizeChange', function (pageSize) {
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                    viewModel.fetchData();
                });
            },
            fetchData: function () {
                var params = {
                    pageIndex: viewModel.currentPage,
                    pageSize: viewModel.pageSize
                };
                var deffered = $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    // url: url,
                    url: list,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {
                        viewModel.currentPage = res.pageIndex;
                        viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.pageSize = res.pageSize;
                        viewModel.totalCount = res.total;
                        var willAppendData = res.data;
                        viewModel.patchType.removeAllRows();
                        viewModel.patchType.setSimpleData(willAppendData, {unSelect: true});
                    }
                    viewModel.pagination.update({
                        totalPages: viewModel.totalPages,
                        pageSize: viewModel.pageSize,
                        currentPage: viewModel.currentPage,
                        totalCount: viewModel.totalCount
                    });
                }).fail(function (res) {
                    console.log(res);
                });
                return deffered;
            },
            setCanEditRenderType: function () {
                var grid = viewModel.app.getComp('patchType').grid;
                grid.setRenderType('code', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var myStatus = viewModel.patchType.getRowByRowId(rowId).myStatus;
                    if (myStatus == 'canEdit') {
                        obj.element.innerHTML = obj.value;
                        obj.element.style.boxSizing = 'border-box';
                        obj.element.style.border = '1px solid';
                    } else {
                        obj.element.innerHTML = obj.value;
                    }
                });
                grid.setRenderType('name', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var myStatus = viewModel.patchType.getRowByRowId(rowId).myStatus;
                    if (myStatus == 'canEdit') {
                        obj.element.innerHTML = obj.value;
                        obj.element.style.boxSizing = 'border-box';
                        obj.element.style.border = '1px solid';
                    } else {
                        obj.element.innerHTML = obj.value;
                    }
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




































