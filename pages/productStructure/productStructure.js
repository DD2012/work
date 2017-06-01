define(['text!pages/productStructure/productStructure.html', 'css!pages/productStructure/productStructure', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/productStructure/productStructure';

        var search = 'http://192.168.79.88:8080/pbill/billMain/list';
        var save = 'http://192.168.79.88:8080/pbill/billMain/save';
        var del = 'http://192.168.79.88:8080/pbill/billMain/del';


        var viewModel = {
            app: {},
            totalPages: '',
            pageSize: 5,
            currentPage: 2,
            totalCount: '',
            willFetchBeforeAdd: true,
            hasNotFetchYet: true,
            sellCodeSearch: ko.observable(),
            event: {
                func: function () {
                    console.log('test');
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    document.querySelector('.search').click();

                },
                add: function () {
                    if (viewModel.hasNotFetchYet) {//还没有获取数据
                        var allRows = viewModel.productStructure.getAllRows();
                        if (allRows.length > 0) {
                            var lastRowSimpleData = allRows.filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).slice(-1)[0];
                            var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                return lastRowSimpleData[key]||true;
                            });
                            if (shouldAdd) {
                                var row = new Row({parent: viewModel.productStructure});
                                row.myStatus = 'canEdit';
                                viewModel.productStructure.addRow(row);
                                viewModel.willFetchBeforeAdd = false;
                                viewModel.setCanEditRenderType();
                            }
                        } else {
                            var row = new Row({parent: viewModel.productStructure});
                            row.myStatus = 'canEdit';
                            viewModel.productStructure.addRow(row);
                            viewModel.willFetchBeforeAdd = false;
                            viewModel.setCanEditRenderType();
                        }
                    } else {//已经获取了数据
                        if (viewModel.willFetchBeforeAdd) {//重新获取数据，跳转到最后一页
                            viewModel.currentPage = viewModel.totalPages;
                            viewModel.event.fetchData()
                                    .done(function () {
                                        var allRows = viewModel.productStructure.getAllRows();
                                        if (allRows.length > 0) {
                                            var lastRowSimpleData = allRows.filter(function (row) {
                                                return row.status != 'fdel';
                                            }).map(function (row) {
                                                return row.getSimpleData();
                                            }).slice(-1)[0];
                                            var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                                return lastRowSimpleData[key]||true;
                                            });
                                            if (shouldAdd) {
                                                var row = new Row({parent: viewModel.productStructure});
                                                row.myStatus = 'canEdit';
                                                viewModel.productStructure.addRow(row);
                                                viewModel.willFetchBeforeAdd = false;
                                                viewModel.setCanEditRenderType();
                                            }
                                        }
                                    });
                        } else {//已经在最后一页，不需要再重新获取数据
                            var allRows = viewModel.productStructure.getAllRows();
                            if (allRows.length > 0) {
                                var lastRowSimpleData = allRows.filter(function (row) {
                                    return row.status != 'fdel';
                                }).map(function (row) {
                                    return row.getSimpleData();
                                }).slice(-1)[0];
                                var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                    return lastRowSimpleData[key]||true;
                                });
                                if (shouldAdd) {
                                    var row = new Row({parent: viewModel.productStructure});
                                    row.myStatus = 'canEdit';
                                    viewModel.productStructure.addRow(row);
                                    viewModel.willFetchBeforeAdd = false;
                                    viewModel.setCanEditRenderType();
                                }
                            }
                        }
                    }
                },
                del: function (rowId) {
                    var id = viewModel.productStructure.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.productStructure.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.productStructure.removeRow(index);
                            }
                        });
                    } else {
                        viewModel.productStructure.removeRow(index);
                    }
                },
                edit: function (rowId) {
                    var row = viewModel.productStructure.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.setCanEditRenderType();
                },
                save: function () {
                    var params = viewModel.productStructure.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    params.forEach(function (v) {
                        delete v.handleHook;
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
                                viewModel.currentPage = 1;
                                viewModel.event.fetchData();
                            }
                        });
                    }
                },
                mutipleDel:function () {
                    var selectedIndexs = viewModel.productStructure.getSelectedIndexs();
                    var params = viewModel.productStructure.getSelectedRows()
                            .map(function (row) {
                                return {id: row.getSimpleData().id};
                            }).filter(function (v) {
                                return v.id;
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            console.log(params);
                            viewModel.productStructure.removeRows(selectedIndexs);
                        })
                    } else {
                        viewModel.productStructure.removeRows(selectedIndexs);
                    }
                },
                search: function () {
                    viewModel.currentPage = 1;
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.hasNotFetchYet = false;
                    viewModel.initPagination();
                    viewModel.event.fetchData();
                    $('.pagination1Hook').show();
                },
                fetchData: function () {
                    var params = {
                        mCode: viewModel.sellCodeSearch(),
                        pageIndex: viewModel.currentPage,
                        pageSize: viewModel.pageSize
                    };
                    var deffered = $.ajax({
                        data: params,
                        type: 'get',
                        // url: url,
                        url: search,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {
                        viewModel.currentPage = res.pageIndex;
                        viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.pageSize = res.pageSize;
                        viewModel.totalCount = res.total;
                        var willAppendSimpleData = res.data;
                        viewModel.productStructure.removeAllRows();
                        viewModel.productStructure.clear();
                        viewModel.productStructure.setSimpleData(willAppendSimpleData, {unSelect: true});
                        //分页
                        viewModel.pagination1Comp.update({
                            totalPages: viewModel.totalPages ,
                            pageSize: viewModel.pageSize ,
                            currentPage: viewModel.currentPage,
                            totalCount: viewModel.totalCount
                        });
                    });
                    return deffered;
                }
            },
            productStructure: new u.DataTable({
                meta: {
                    productCode: {},
                    productName: {},
                    productStatus: {},
                    seriesName: {},
                    productModel: {},
                    productType: {},
                    suiteCode: {},
                    suiteName: {},
                    plateCode: {},
                    plateName: {},
                    handleHook: {
                        default: {
                            value: 'haha'
                        }
                    }
                }
            }),
            onBeforeEditFun:function (obj) {
                var canEditColIndexs = [0,1,2,3,4,5,6,7,8,9];
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.productStructure.getRowByRowId(rowId);
                return row.myStatus == 'canEdit' && (canEditColIndexs.indexOf(obj.colIndex) != -1);
            },
            handleHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            setCanEditRenderType:function () {
                var grid = viewModel.app.getComp('productStructure').grid;
                function func(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.productStructure.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }
                var arr = ['productCode','productName','productStatus','seriesName','productModel','productType','suiteCode','suiteName','plateCode','plateName'];
                arr.forEach(function (field) {
                    func(field)
                })

            },
            initPagination: function () {
                var el = document.querySelector("#pagination1");
                viewModel.pagination1Comp = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination1Comp.on('pageChange', function (currentPage) {
                    console.log(currentPage);
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.currentPage = currentPage + 1;
                    viewModel.event.fetchData();

                });
                viewModel.pagination1Comp.on('sizeChange', function (pageSize) {
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                    viewModel.event.fetchData();
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




































