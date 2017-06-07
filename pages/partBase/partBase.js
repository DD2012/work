define(['text!pages/partBase/partBase.html', 'css!pages/partBase/partBase', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/productStructure/productStructure';
        var url1 = ctx + '/partBase/partBase';
        var url2 = ctx + '/partBase/partBaseDropDown';
        var url3 = ctx + '/partBase/partType';

        var list = 'http://192.168.79.88:8080/pbill/parts/lists';
        var save = 'http://192.168.79.88:8080/pbill/parts/save';
        var del = 'http://192.168.79.88:8080/pbill/parts/del';


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
                        viewModel.proFactoryName = res1.data.proFactoryName;
                        viewModel.patchType = res1.data.patchType;
                        viewModel.app = u.createApp({
                            el: element,
                            model: viewModel
                        });
                        viewModel.search.setSimpleData([{}]);
                        $('.search')[0].click();
                    });
                },
                search: function () {
                    viewModel.hasNotFetchYet = false;
                    viewModel.willFetchBeforeAdd = true;
                    viewModel.currentPage = 1;
                    viewModel.event.paginationInit();
                    viewModel.event.fetchData();
                },
                add: function () {
                    //获取最后一行数据
                    if (viewModel.willFetchBeforeAdd) {//重新获取数据，跳转到最后一页
                        viewModel.currentPage = viewModel.totalPages;
                        viewModel.event.fetchData()
                                .done(function () {
                                    var row = new Row({parent: viewModel.partBase});
                                    viewModel.partBase.addRow(row);
                                    row.myStatus = 'canEdit';
                                    viewModel.willFetchBeforeAdd = false;
                                    viewModel.setCanEditRenderType();
                                });
                    } else {//已经在最后一页，不需要再重新获取数据
                        var row = new Row({parent: viewModel.partBase});
                        viewModel.partBase.addRow(row);
                        row.myStatus = 'canEdit';
                        viewModel.willFetchBeforeAdd = false;
                        viewModel.setCanEditRenderType();

                    }
                },
                del: function (rowId) {
                    var id = viewModel.partBase.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.partBase.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url1,
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.partBase.removeRow(index);
                                viewModel.event.fetchData();
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
                            });
                    params.forEach(function (v) {
                        delete v.handleHook;
                    });
                    if (params.length > 0) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url1,
                            url: save,
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
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url,
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if(res.result == 1){
                                viewModel.partBase.removeRows(selectedIndexs);
                                viewModel.event.fetchData();
                            }
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
                        plateCode: search.plateCode,
                        plateType: search.plateType,
                        pageIndex: viewModel.currentPage,
                        pageSize: viewModel.pageSize
                    };
                    var deffered = $.ajax({
                        data: params,
                        type: 'get',
                        // url: url1,
                        url: list,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {

                        if (res.result == 1) {
                            viewModel.currentPage = res.pageIndex;
                            viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                            viewModel.pageSize = res.pageSize;
                            viewModel.totalCount = res.total;

                            var simpleData = res.data;
                            viewModel.partBase.setSimpleData(simpleData, {unSelect: true});


                            viewModel.pagination1Comp.update({
                                totalPages: viewModel.totalPages,
                                totalCount: viewModel.totalCount,
                                pageSize: viewModel.pageSize,
                                currentPage: viewModel.currentPage

                            });
                        } else {

                        }


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
                    "handleHook": {
                        default: {
                            value: 'haha'
                        }
                    }
                }
            }),
            strType: [{name: '板件', value: 1}, {name: '五金', value: 2}],//部件类别
            unit: [],//单位
            patchType: [],//补件类型
            isPatch: [],//是否可补件
            isSelf: [],//是否委外自制
            productionMode: [],//生产方式名称
            proFactoryName: [],//生产工厂名称
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

                var arrDropDown = ['strType', 'unit', 'patchType', 'isPatch', 'isSelf', 'productionMode', 'proFactoryName'];
                arrDropDown.forEach(function (field) {
                    dropDown(field)
                });
            },
            onBeforeEditFun: function (obj) {
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
