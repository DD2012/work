define(['text!pages/handleCycleMaintain/handleCycleMaintain.html', 'css!pages/handleCycleMaintain/handleCycleMaintain', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/supplementCycleMaintain/supplementCycleMaintain';

        var list = 'http://192.168.79.88:8080/pbill/billMaintenance/list';
        var del = 'http://192.168.79.88:8080/pbill/billMaintenance/del';
        var save = 'http://192.168.79.88:8080/pbill/billMaintenance/save';


        var viewModel = {
            currentPage: 1,
            pageSize: 10,
            totalPages: '',
            totalCount: '',
            willTurnToLastPage: true,
            event: {
                func: function () {
                    console.log('test');
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    viewModel.initLoadData();
                },
                add: function () {
                    if (viewModel.willTurnToLastPage) {
                        viewModel.currentPage = viewModel.totalPages;
                        viewModel.initLoadData().done(function () {
                            var row = new Row({parent: viewModel.handleCycleMaintain});
                            var allRows = viewModel.handleCycleMaintain.getAllRows().filter(function (row) {
                                return row.status != 'fdel';
                            });
                            if (allRows.slice(-1)[0].getSimpleData().name && allRows.slice(-1)[0].getSimpleData().cycleTime) {
                                row.myStatus = 'canEdit';
                                viewModel.handleCycleMaintain.addRow(row);
                                viewModel.setRenderTypeEditStyle();
                            }
                            viewModel.willTurnToLastPage = false;
                        });
                    } else {
                        var row = new Row({parent: viewModel.handleCycleMaintain});
                        var allRows = viewModel.handleCycleMaintain.getAllRows().filter(function (row) {
                            return row.status != 'fdel';
                        });
                        if (allRows.slice(-1)[0].getSimpleData().name && allRows.slice(-1)[0].getSimpleData().cycleTime) {
                            row.myStatus = 'canEdit';
                            viewModel.handleCycleMaintain.addRow(row);
                            viewModel.setRenderTypeEditStyle();
                        }
                        viewModel.willTurnToLastPage = false;
                    }
                },
                del: function (rowId) {
                    var rowIndex = viewModel.handleCycleMaintain.getIndexByRowId(rowId);
                    var rowSimpleData = viewModel.handleCycleMaintain.getRow(viewModel.handleCycleMaintain.getIndexByRowId(rowId)).getSimpleData();
                    var params = [{id: rowSimpleData.id}];
                    if (params[0].id) {
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            // url: url,
                            url: del,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            console.log(params);
                            viewModel.handleCycleMaintain.removeRow(rowIndex);

                        });
                    } else {
                        viewModel.handleCycleMaintain.removeRow(rowIndex);
                    }
                },
                mutipleDel: function () {
                    var params = viewModel.handleCycleMaintain.getSimpleData({type: 'select'})
                            .filter(function (v) {
                                return v.id;
                            }).map(function (v) {
                                return {id: v.id};
                            });
                    console.log(params);
                    if (params.length > 0) {
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            // url: url,
                            url: del,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            if (res.result == 1) {
                                var selectedIndexs = viewModel.handleCycleMaintain.getSelectedIndexs();
                                viewModel.handleCycleMaintain.removeRows(selectedIndexs);
                            }
                        })
                    }
                },
                edit: function (rowId) {
                    var row = viewModel.handleCycleMaintain.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.setRenderTypeEditStyle();
                },
                save: function () {
                    var params = viewModel.handleCycleMaintain.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).filter(function (value) {
                                return value.name && value.cycleTime;
                            });
                    params.forEach(function (v) {
                        delete v.hook1;
                    });
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: save,
                        data: JSON.stringify(params)
                    }).done(function (res) {
                        if (res.result == 1) {
                            var data = res.data;
                            viewModel.initLoadData();
                        }
                    }).fail(function (res) {
                        console.log(res);
                    });
                    console.log(params);
                }
            },
            handleCycleMaintain: new u.DataTable({
                meta: {
                    name: {},
                    cycleTime: {},
                    hook1: {
                        default: {
                            value: 'haha'
                        }
                    },
                    type: {
                        default: {
                            value: 'TREATMENT_CYCLE'
                        }
                    }
                }
            }),
            onBeforeEditFun: function (obj) { //条件编辑
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.handleCycleMaintain.getRowByRowId(rowId);
                return row.myStatus == 'canEdit' && ([0, 1].indexOf(obj.colIndex) != -1);
            },
            handleRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            setRenderTypeEditStyle: function () {//设置可编辑样式
                var grid = viewModel.app.getComp('supplementCycleMaintain').grid;
                grid.setRenderType('cycleTime', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var myStatus = viewModel.handleCycleMaintain.getRowByRowId(rowId).myStatus;
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
                    var myStatus = viewModel.handleCycleMaintain.getRowByRowId(rowId).myStatus;
                    if (myStatus == 'canEdit') {
                        obj.element.innerHTML = obj.value;
                        obj.element.style.boxSizing = 'border-box';
                        obj.element.style.border = '1px solid';
                    } else {
                        obj.element.innerHTML = obj.value;
                    }
                });
            },
            initLoadData: function () {
                var params = {
                    pageIndex: viewModel.currentPage,
                    pageSize: viewModel.pageSize,
                    type: "TREATMENT_CYCLE"
                };
                var deffered = $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: list,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {
                        viewModel.currentPage = res.pageIndex;
                        viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.pageSize = res.pageSize;
                        viewModel.totalCount = res.total;
                        viewModel.initPagination();
                        viewModel.pagination.update({
                            totalPages: viewModel.totalPages,
                            pageSize: viewModel.pageSize,
                            currentPage: viewModel.currentPage,
                            totalCount: viewModel.totalCount
                        });
                        var data = res.data;
                        viewModel.handleCycleMaintain.setSimpleData(data, {unSelect: true});
                    }
                });
                return deffered;
            },
            initPagination: function () {
                var el = document.querySelector("#pagination");
                viewModel.pagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination.on('pageChange', function (pageIndex) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.currentPage = pageIndex + 1;
                    viewModel.initLoadData();
                });
                viewModel.pagination.on('sizeChange', function (pageSize) {
                    viewModel.willTurnToLastPage = true;
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
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
