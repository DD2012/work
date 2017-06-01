define(['text!pages/partBase/partBase.html', 'css!pages/partBase/partBase', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/productStructure/productStructure';
        var url1 = ctx + '/partBase/partBase';
        var url2 = ctx + '/partBase/partBaseDropDown';
        var url3 = ctx + '/partBase/partType';


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
                    console.log('test');
                    $.ajax({
                        data: 'params',
                        type: 'get',
                        url: url2,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {
                        console.log(res);
                    })
                },
                pageInit: function () {
                    $.ajax({//初始化grid中到下拉框
                        data: 'params',
                        type: 'get',
                        url: url2,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res1) {
                        viewModel.strType = res1.data.strType;
                        viewModel.unit = res1.data.unit;
                        viewModel.patchType = res1.data.patchType;
                        viewModel.isPatch = res1.data.isPatch;
                        viewModel.isSelf = res1.data.isSelf;
                        viewModel.productionMode = res1.data.productionMode;
                        viewModel.plantName = res1.data.plantName;
                        viewModel.searchData = res1.data.patchType;
                        viewModel.app = u.createApp({
                            el: element,
                            model: viewModel
                        });
                        viewModel.search.setSimpleData([{}]);
                    });
                },
                search: function () {
                    viewModel.hasNotFetchYet = false;
                    viewModel.currentPage = 1;
                    viewModel.event.paginationInit();
                    viewModel.event.fetchData();
                },
                add: function () {
                    //获取最后一行数据
                    var allRows = viewModel.partBase.getAllRows();
                    if (viewModel.hasNotFetchYet) {//还没有获取数据
                        if(allRows.length == 0){
                            var row = new Row({parent: viewModel.partBase});
                            row.myStatus = 'canEdit';
                            viewModel.partBase.addRow(row);
                            viewModel.setCanEditRenderType();
                        }else {
                            var lastRowSimpleData = allRows.filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).slice(-1)[0];
                            var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                return lastRowSimpleData[key];
                            });
                            if (shouldAdd) {
                                var row = new Row({parent: viewModel.partBase});
                                row.myStatus = 'canEdit';
                                viewModel.partBase.addRow(row);
                                viewModel.setCanEditRenderType();
                            }
                        }
                    } else {//已经获取了数据
                        if (viewModel.willFetchBeforeAdd) {//重新获取数据，跳转到最后一页
                            viewModel.currentPage = viewModel.totalPages;
                            viewModel.event.fetchData()
                                    .done(function () {
                                        if(allRows.length > 0){
                                            var lastRowSimpleData = allRows.filter(function (row) {
                                                return row.status != 'fdel';
                                            }).map(function (row) {
                                                return row.getSimpleData();
                                            }).slice(-1)[0];
                                            var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                                return lastRowSimpleData[key];
                                            });
                                            if (shouldAdd) {
                                                var row = new Row({parent: viewModel.partBase});
                                                viewModel.partBase.addRow(row);
                                                row.myStatus = 'canEdit';
                                                viewModel.willFetchBeforeAdd = false;
                                                viewModel.setCanEditRenderType();
                                            }
                                        }
                                    });
                        } else {//已经在最后一页，不需要再重新获取数据
                            if(allRows.length > 0){
                                var lastRowSimpleData = allRows.filter(function (row) {
                                    return row.status != 'fdel';
                                }).map(function (row) {
                                    return row.getSimpleData();
                                }).slice(-1)[0];
                                var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                    return lastRowSimpleData[key];
                                });
                                if (shouldAdd) {
                                    var row = new Row({parent: viewModel.partBase});
                                    viewModel.partBase.addRow(row);
                                    row.myStatus = 'canEdit';
                                    viewModel.setCanEditRenderType();
                                }
                            }

                        }
                    }
                },
                del: function (rowId) {
                    var id = viewModel.partBase.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.partBase.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url1,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.partBase.removeRow(index);
                                console.log(params);
                            }
                        });
                    } else {
                        viewModel.partBase.removeRow(index);
                    }

                },
                edit: function (rowId) {
                    var row = viewModel.partBase.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.setCanEditRenderType();

                },
                save: function () {
                    var params = viewModel.partBase.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).filter(function (v) {
                                var keys = Object.keys(viewModel.partBase.getMeta());
                                return keys.every(function (key) {
                                    return v[key];
                                });
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url1,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.partBase.setSimpleData(res.data, {unSelect: true});
                                console.log(params);
                            }
                        });
                    }

                },
                mutipleDel: function () {
                    var selectedIndexs = viewModel.partBase.getSelectedIndexs();
                    var params = viewModel.partBase.getSelectedRows()
                            .map(function (row) {
                                return {id: row.getSimpleData().id};
                            }).filter(function (v) {
                                return v.id;
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            console.log(params);
                            viewModel.partBase.removeRows(selectedIndexs);
                        })
                    } else {
                        viewModel.partBase.removeRows(selectedIndexs);
                    }
                },
                paginationInit: function () {
                    $('.paginationHook').show();
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
                },
                fetchData: function () {
                    var search = viewModel.search.getSimpleData()[0];

                    var params = {
                        plateCode:search.plateCode,
                        plateType:search.plateType,
                        currentPage: viewModel.currentPage,
                        pageSize: viewModel.pageSize
                    };
                    var deffered = $.ajax({
                        data: params,
                        type: 'get',
                        url: url1,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {

                        viewModel.currentPage = res.pageIndex;
                        viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.pageSize = res.pageSize;
                        viewModel.totalCount = res.total;

                        var simpleData = res.data;
                        viewModel.partBase.setSimpleData(simpleData, {unSelect: true});


                        viewModel.pagination1Comp.update({
                            totalPages: viewModel.totalPages || 5,
                            totalCount: viewModel.totalCount,
                            pageSize: viewModel.pageSize,
                            currentPage: viewModel.currentPage

                        });
                    });
                    return deffered;
                }
            },
            partBase: new u.DataTable({
                meta: {
                    "plateCode": {},
                    "plateParentCode": {},
                    "plateAlias": {},
                    "plateName": {},
                    "strType": {},
                    "strNum": {},
                    "unit": {},
                    "patchType": {},
                    "isPatch": {},
                    "isSelf": {},
                    "productionMode": {},
                    "plantName": {},
                    "handleHook": {
                        default: {
                            value: 'haha'
                        }
                    }
                }
            }),
            strType: [],
            unit: [],
            patchType: [],
            isPatch: [],
            isSelf: [],
            productionMode: [],
            plantName: [],
            search: new u.DataTable({//搜索条件数据
                meta: {
                    plateCode: {},
                    plateType: {}
                }
            }),
            searchData: [],//搜索下拉框数据
            handleHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            setCanEditRenderType: function () {
                var grid = viewModel.app.getComp('partBase').grid;
                //设置普通框样式
                function func(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.partBase.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }

                var arr = ['plateCode', 'plateParentCode', 'plateAlias', 'plateName', 'strNum'];
                arr.forEach(function (field) {
                    func(field)
                });
                //设置下拉框样式
                function dropDown(field) {
                    grid.setRenderType(field, function (obj) {
                        var valueArr = obj.value.split(',');
                        var value = viewModel[field].filter(function (item) {
                            return valueArr.indexOf(item.value.toString()) != -1;
                        }).map(function (item) {
                            return item.name;
                        }).join(',');
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.partBase.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj.element.innerHTML = value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = value;
                        }
                    });
                }
                var arrDropDown = ['strType', 'unit', 'patchType', 'isPatch','isSelf','productionMode', 'plantName'];
                arrDropDown.forEach(function (field) {
                    dropDown(field)
                });
            },
            onBeforeEditFun:function (obj) {
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.partBase.getRowByRowId(rowId);
                return row.myStatus == 'canEdit' && obj.colIndex != 12;
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
