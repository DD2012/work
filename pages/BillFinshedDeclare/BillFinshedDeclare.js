define(['text!pages/BillFinshedDeclare/BillFinshedDeclare.html', 'css!pages/BillFinshedDeclare/BillFinshedDeclare', 'uui', 'uuigrid', 'bootstrap', 'uuitree', './tableData.js'], function (html) {
    var init = function (element) {
        var url = ctx + '/BillFinshedDeclare/BillFinshedDeclareDropDowns';
        var url2 = ctx + '/BillFinshedDeclare/orderNumSearch';
        var url3 = ctx + '/BillFinshedDeclare/plate';
        var url4 = ctx + '/BillFinshedDeclare/fiveGold';
        var url5 = ctx + '/BillFinshedDeclare/orderNumSearchDialog1';
        var url6 = ctx + '/BillFinshedDeclare/orderNumSearchDialog2';


        var viewModel = {
            willUploadImgArr: [],//存储需要上传图片对象信息，删除当信息也在里面，保存时需要按照rowId筛选
            willUploadImgObj: {},
            rowStatus: '',//三个状态：add,orderNumSearch,patchModelSearch
            platePage: {
                "totalPages": '',
                "pageSize": 5,
                "currentPage": 1,
                "totalCount": ''
            },
            fiveGoldPage: {
                "totalPages": '',
                "pageSize": 5,
                "currentPage": 1,
                "totalCount": ''
            },
            orderNumSearchDialog1Page: {
                "totalPages": '',
                "pageSize": 5,
                "currentPage": 1,
                "totalCount": ''
            },
            orderNumSearchDialog2Page: {
                "totalPages": '',
                "pageSize": 5,
                "currentPage": 1,
                "totalCount": ''
            },

            event: {
                func: function () {
                    debugger;
                    viewModel.setCanEditRenderType();

                },
                pageInit: function () {

                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: url,
                        data: 'jsonData'
                    }).done(function (res) {
                        viewModel.patchCategory = res.data.patchCategory;
                        viewModel.pbillType = res.data.pbillType;
                        viewModel.unit = res.data.unit;
                        viewModel.patchReason = res.data.patchReason;
                        viewModel.logisticsMode = res.data.logisticsMode;
                    }).done(function () {
                        viewModel.app = u.createApp({
                            el: element,
                            model: viewModel
                        });

                    })
                },
                add: function () {
                    viewModel.rowStatus = 'add';
                    var row = new Row({parent: viewModel.BillFinshedDeclare});
                    row.myStatus = viewModel.rowStatus;
                    viewModel.BillFinshedDeclare.addRow(row);
                    viewModel.setCanEditRenderType();//设置各种条件下的render

                },
                del: function (rowId) {
                    var id = viewModel.BillFinshedDeclare.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.BillFinshedDeclare.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url3,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.BillFinshedDeclare.removeRow(index);
                                console.log(params);
                            }
                        });
                    } else {
                        viewModel.BillFinshedDeclare.removeRow(index);
                    }
                },
                mutipleDel:function () {
                    var selectedIndexs = viewModel.BillFinshedDeclare.getSelectedIndexs();
                    var params = viewModel.BillFinshedDeclare.getSelectedRows()
                            .map(function (row) {
                                return {id: row.getSimpleData().id};
                            }).filter(function (v) {
                                return v.id;
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url3,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            console.log(params);
                            viewModel.BillFinshedDeclare.removeRows(selectedIndexs);
                        })
                    } else {
                        viewModel.BillFinshedDeclare.removeRows(selectedIndexs);
                    }

                },
                save: function () {//过滤掉已经删除掉行对应掉图片
                    var params = viewModel.BillFinshedDeclare.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).filter(function (v) {
                                var keys = Object.keys(viewModel.BillFinshedDeclare.getMeta());
                                return keys.every(function (key) {
                                    return v[key] || true;//不空检查
                                });
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url3,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.BillFinshedDeclare.setSimpleData(res.data, {unSelect: true});
                                console.log(params);
                            }
                        });
                    }
                },
                submit: function () {

                },
                orderNumSearch: function (orderNum, rowId) {//按照订单编号搜索
                    console.log(orderNum);
                    console.log(rowId);
                    var rowStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                    if (rowStatus == 'add' || rowStatus == 'orderNumSearch') {//新增行，两个搜索按钮都能用，通过orderNumSearch搜索，只能用这一个按钮
                        viewModel.rowStatus = 'orderNumSearch';//设置按照订单号搜索行状态
                        viewModel.orderNumSearchDialog1 = u.dialog({
                            id: 'orderNumSearchDialog1',
                            content: "#orderNumSearchDialog1",
                            hasCloseMenu: true,
                            height: 'auto',
                            width: '90%',
                            closeFun: function () {
                                $('.orderNumSearchDialog1Pagination').hide();
                            }
                        });
                        viewModel.orderNumSearchDialog1DataTable.removeAllRows();
                    }
                },
                patchModelSearch: function (patchModel, rowId) {//按照补件类型搜索
                    console.log('patchModel', patchModel, 'rowId', rowId);
                    var rowStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                    if (rowStatus == 'add' || rowStatus == 'patchModelSearch') {//新增行，两个搜索按钮都能用，通过patchModelSearch搜索，只能用这一个按钮
                        viewModel.rowStatus = 'patchModelSearch';//设置按照补件类型搜索行状态

                        viewModel.dialog1 = u.dialog({
                            id: 'patchModelSearchDialog',
                            content: "#patchModelSearchDialog",
                            hasCloseMenu: true,
                            height: '500px',
                            width: '90%',
                            closeFun:function () {
                                viewModel.setCanEditRenderType();//设置各种条件下的render
                            }
                        });
                        viewModel.plate.removeAllRows();
                        viewModel.fiveGold.removeAllRows();

                        viewModel.initPlatePagination();
                        viewModel.fetchPlateData();

                        viewModel.initFiveGoldPagination();
                        viewModel.fetchFiveGoldData();
                    }
                },
                patchModelSearchDialogConfirm: function () {//弹出框，确认按钮
                    var plateWillAppendToMainData = viewModel.plate.getSimpleData({type: 'select'});
                    var fiveGoldWillAppendToMainData = viewModel.fiveGold.getSimpleData({type: 'select'});
                    var mainDataKeys = Object.keys(viewModel.BillFinshedDeclare.getMeta());
                    mainDataKeys.push('id');
                    //按照板件组装主表数据
                    var plateWillAppendToMainRows = plateWillAppendToMainData.map(function (v) {
                        var obj = {};
                        mainDataKeys.forEach(function (key) {
                            if (key == 'pbillCode') {
                                obj[key] = v.plateCode;
                            } else if (key == 'pbillName') {
                                obj[key] = v.plateName;
                            } else if (key == 'unit') {
                                obj[key] = v.unit;
                            } else if (key == 'patchModel') {
                                obj[key] = v.patchModel;
                            } else if (key == 'productionCode') {
                                obj[key] = v.productionCode;
                            } else if (key == 'productionName') {
                                obj[key] = v.productionName;
                            } else if (key == 'seriesName') {
                                obj[key] = v.seriesName;
                            } else if (key == 'productStatus') {
                                obj[key] = v.productStatus;
                            } else if (key == 'pbillType') {
                                obj[key] = v.pbillType;
                            }else if (key == 'id') {
                                obj[key] = v.id;
                            } else {
                                obj[key] = '';
                            }
                        });
                        var row = new Row({parent: viewModel.BillFinshedDeclare});
                        row.myStatus = viewModel.rowStatus;
                        row.setSimpleData(obj);
                        return row;
                    });
                    //按照五金组装主表数据
                    var fiveGoldWillAppendToMainRows = fiveGoldWillAppendToMainData.map(function (v) {
                        var obj = {};
                        mainDataKeys.forEach(function (key) {
                            if (key == 'pbillCode') {
                                obj[key] = v.plateCode;
                            } else if (key == 'pbillName') {
                                obj[key] = v.plateName;
                            } else if (key == 'unit') {
                                obj[key] = v.unit;
                            } else if (key == 'patchModel') {
                                obj[key] = v.patchModel;
                            } else if (key == 'productionCode') {
                                obj[key] = v.productionCode;
                            } else if (key == 'productionName') {
                                obj[key] = v.productionName;
                            } else if (key == 'seriesName') {
                                obj[key] = v.seriesName;
                            } else if (key == 'productStatus') {
                                obj[key] = v.productStatus;
                            } else if (key == 'pbillType') {
                                obj[key] = v.pbillType;
                            }else if (key == 'id') {
                                obj[key] = v.id;
                            } else {
                                obj[key] = '';
                            }
                        });
                        var row = new Row({parent: viewModel.BillFinshedDeclare});
                        row.myStatus = viewModel.rowStatus;
                        row.setSimpleData(obj);
                        return row;
                    });
                    //向页面设置数据
                    viewModel.BillFinshedDeclare.addRows(plateWillAppendToMainRows.concat(fiveGoldWillAppendToMainRows));
                    //删除新增的空行
                    var getRowIndexsHasAdd = viewModel.BillFinshedDeclare.getAllRows()
                            .filter(function (row) {
                                return row.myStatus == 'add';
                            }).map(function (row) {
                                return viewModel.BillFinshedDeclare.getIndexByRowId(row.rowId);
                            });
                    viewModel.BillFinshedDeclare.removeRows(getRowIndexsHasAdd);


                    viewModel.dialog1.close();
                },
                orderNumSearchDialog1Confirm: function (rowId, orderNum) {//按照订单号搜索，第一个弹出框操作按钮
                    console.log(rowId, orderNum);
                    viewModel.orderNumSearchDialog1.close();
                    viewModel.orderNumSearchDialog2 = u.dialog({
                        id: 'orderNumSearchDialog2',
                        content: "#orderNumSearchDialog2",
                        hasCloseMenu: true,
                        height: '500px',
                        width: '90%'
                    });
                    viewModel.orderNumSearchDialog2DataTable.removeAllRows();
                    viewModel.initOrderNumSearchDialog2Pagination();
                    viewModel.fetchOrderNumSearchDialog2Data();

                },
                orderNumSearchDialog1Search: function () {//订单搜索弹出框，搜索按钮
                    $('.orderNumSearchDialog1Pagination').show();
                    viewModel.initOrderNumSearchDialog1Pagination();
                    viewModel.fetchOrderNumSearchDialog1Data();

                },
                orderNumSearchDialog2Confirm: function (rowId, isPatch) {//第二个弹出框,订单搜索弹出框，确定补件列
                    console.log(rowId, isPatch);
                    if (isPatch) {
                        viewModel.orderNumSearchDialog2.close();
                        viewModel.dialog1 = u.dialog({
                            id: 'patchModelSearchDialog',
                            content: "#patchModelSearchDialog",
                            hasCloseMenu: true,
                            height: '500px',
                            width: '90%',
                            closeFun:function () {
                                viewModel.setCanEditRenderType();
                            }
                        });
                        viewModel.plate.removeAllRows();
                        viewModel.fiveGold.removeAllRows();

                        viewModel.initPlatePagination();
                        viewModel.fetchPlateData();

                        viewModel.initFiveGoldPagination();
                        viewModel.fetchFiveGoldData();
                    }


                },
                uploadImg: function (supplementOrderNum, rowId) {//上传图片
                    console.log(supplementOrderNum, rowId);
                    var obj = {//上传图片需要的参数,当要保存当时候，把全部存在当rowId获取到，按照rowId赛选需要当数据
                        rowId: rowId,
                        supplementOrderNum: supplementOrderNum
                    };
                    viewModel.willUploadImgObj = obj;


                    viewModel.uploadImg = u.dialog({
                        id: 'upLoadImgDialog',
                        content: "#upLoadImgDialog",
                        hasCloseMenu: true,
                        height: 'auto',
                        width: '50%',
                        closeFun: function () {

                        }
                    });


                },
                upLoadImgCancel: function () {
                    viewModel.uploadImg.close();
                },
                upLoadImgConfirm: function () {
                    var shouldInsert = viewModel.willUploadImgArr.find(function (obj) {
                        return obj.rowId == viewModel.willUploadImgObj.rowId
                    });
                    if (shouldInsert) {
                        var index = viewModel.willUploadImgArr.findIndex(function (obj) {
                            return obj.rowId == viewModel.willUploadImgObj.rowId;
                        });
                        viewModel.willUploadImgArr.splice(index, 1, viewModel.willUploadImgObj);
                    } else {
                        viewModel.willUploadImgArr.push(viewModel.willUploadImgObj);
                    }
                    viewModel.uploadImg.close();
                }
            },
            BillFinshedDeclare: new u.DataTable({
                meta: {
                    supplementOrderNum: {},
                    consumer: {},
                    telphone: {},
                    orderNum: {},
                    patchModel: {},
                    patchCategory: {},
                    productionCode: {},
                    productionName: {},
                    seriesName: {},
                    productStatus: {},
                    pbillCode: {},
                    pbillName: {},
                    pbillType: {},
                    num: {},
                    unit: {},
                    patchReason: {},
                    logisticsMode: {},
                    address: {},
                    remarks: {},
                    picAddress: {},
                    orderNumHook:{
                        default:{
                            value:'haha'
                        }
                    },
                    patchModelHook:{
                        default:{
                            value:'haha'
                        }
                    },
                    handleHook:{
                        default:{
                            value:'haha'
                        }
                    }
                }
            }),
            patchCategory: [],//表单里面的下拉框
            pbillType: [],
            unit: [],
            patchReason: [],
            logisticsMode: [],
            plate: new u.DataTable({//弹出框，板件信息
                meta: {
                    plateCode: {},
                    plateAlias: {},
                    plateName: {},
                    strNum: {},
                    unit: {}
                }
            }),
            fiveGold: new u.DataTable({//弹出框，五金件信息
                meta: {
                    plateCode: {},
                    plateName: {},
                    strNum: {},
                    unit: {}
                }
            }),
            orderNumSearch: ko.observable(),//按照订单编号搜索条件
            productionNameSearch: ko.observable(),//按照订单编号搜索条件
            seriesNameSearch: ko.observable(),//按照订单编号搜索条件
            orderNumSearchDialog1DataTable: new u.DataTable({
                meta: {
                    orderNum: {},
                    orderName: {},
                    productStatus: {},
                    seriesName: {}
                }
            }),
            orderNumSearchDialog2DataTable: new u.DataTable({
                meta: {
                    suiteCode: {},
                    suiteName: {},
                    productStatus: {},
                    seriesName: {},
                    standard: {},
                    standardPartsInfo: {}
                }
            }),
            afterAdd: function (element, index, data) {
                if (element.nodeType === 1) {
                    u.compMgr.updateComp(element);
                }
            },
            orderNumSearchRender: function (obj) {//按销售订单编号搜索render
                var rowId = obj.row.value['$_#_@_id'];
                var orderNum = obj.row.value['orderNum'] || 'null';
                var orderNumSearch = "data-bind=click:event.orderNumSearch.bind($data,'" + orderNum + "'," + rowId + ")";
                var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>'
                obj.element.innerHTML = html;
                ko.applyBindings(viewModel, obj.element);
            },
            patchModelSearchRender: function (obj) {//按补件型号搜索reder
                var rowId = obj.row.value['$_#_@_id'];
                var patchModel = obj.row.value['patchModel'] || "null";
                var patchModelSearch = "data-bind=click:event.patchModelSearch.bind($data,'" + patchModel + "'," + rowId + ")";
                var html = '<span class="uf uf-search font-size-30"' + patchModelSearch + ' style="cursor: pointer;"></span>'
                obj.element.innerHTML = html;
                ko.applyBindings(viewModel, obj.element);
            },
            imgRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var supplementOrderNum = obj.row.value['supplementOrderNum'] || "null";
                var img = "data-bind=click:event.uploadImg.bind($data,'" + supplementOrderNum + "'," + rowId + ")";
                var html = '<span class="uf uf-upload font-size-30"' + img + ' style="cursor: pointer;"></span>'
                obj.element.innerHTML = html;
                ko.applyBindings(viewModel, obj.element);
            },
            handleHookRender:function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            fetchPlateData: function () {
                //参数:补件型号 和 套件编码
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: url3,
                    data: 'jsonData'
                }).then(function (res) {

                    viewModel.platePage.currentPage = res.pageIndex;
                    viewModel.platePage.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.platePage.pageSize = res.pageSize;
                    viewModel.platePage.totalCount = res.total;

                    var plateSimpleData = res.data;
                    var imgAddress = res.imgAddress;
                    viewModel.plate.removeAllRows();
                    viewModel.plate.setSimpleData(plateSimpleData, {unSelect: true});
                    $('#plateImg').attr('src', imgAddress);
                    viewModel.platePagination.update({
                        totalPages: viewModel.platePage.totalPages||4,
                        totalCount: viewModel.platePage.totalCount,
                        pageSize: viewModel.platePage.pageSize,
                        currentPage: viewModel.platePage.currentPage

                    });
                })
            },
            fetchFiveGoldData: function () {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: url4,
                    data: 'jsonData'
                }).then(function (res) {
                    viewModel.fiveGoldPage.currentPage = res.pageIndex;
                    viewModel.fiveGoldPage.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.fiveGoldPage.pageSize = res.pageSize;
                    viewModel.fiveGoldPage.totalCount = res.total;

                    var plateSimpleData = res.data;
                    var imgAddress = res.imgAddress;
                    viewModel.fiveGold.removeAllRows();
                    viewModel.fiveGold.setSimpleData(plateSimpleData, {unSelect: true});
                    $('#plateImg').attr('src', imgAddress);
                    viewModel.fiveGoldPagination.update({
                        totalPages: viewModel.fiveGoldPage.totalPages||4,
                        totalCount: viewModel.fiveGoldPage.totalCount,
                        pageSize: viewModel.fiveGoldPage.pageSize,
                        currentPage: viewModel.fiveGoldPage.currentPage

                    });
                })
            },
            initPlatePagination: function () {
                var el = document.querySelector("#platePagination");
                viewModel.platePagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.platePagination.on('pageChange', function (currentPage) {
                    viewModel.platePage.currentPage = currentPage + 1;
                    viewModel.fetchPlateData();

                });
                viewModel.platePagination.on('sizeChange', function (pageSize) {
                    viewModel.platePage.pageSize = pageSize;
                    viewModel.platePage.currentPage = 1;
                    viewModel.fetchPlateData();
                });
            },
            initFiveGoldPagination: function () {
                var el = document.querySelector("#fiveGoldPagination");
                viewModel.fiveGoldPagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.fiveGoldPagination.on('pageChange', function (currentPage) {
                    viewModel.fiveGoldPage.currentPage = currentPage + 1;
                    viewModel.fetchFiveGoldData();

                });
                viewModel.fiveGoldPagination.on('sizeChange', function (pageSize) {
                    viewModel.fiveGoldPage.pageSize = pageSize;
                    viewModel.fiveGoldPage.currentPage = 1;
                    viewModel.fetchFiveGoldData();
                });
            },
            initOrderNumSearchDialog1Pagination: function () {//初始化弹出框一分页
                var el = document.querySelector("#orderNumSearchDialog1Pagination");
                viewModel.orderNumSearchDialog1Pagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.orderNumSearchDialog1Pagination.on('pageChange', function (currentPage) {
                    viewModel.orderNumSearchDialog1Page.currentPage = currentPage + 1;
                    viewModel.fetchOrderNumSearchDialog1Data();

                });
                viewModel.orderNumSearchDialog1Pagination.on('sizeChange', function (pageSize) {
                    viewModel.orderNumSearchDialog1Page.pageSize = pageSize;
                    viewModel.orderNumSearchDialog1Page.currentPage = 1;
                    viewModel.fetchOrderNumSearchDialog1Data();
                });
            },
            fetchOrderNumSearchDialog1Data: function () {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: url5,
                    data: 'jsonData'
                }).then(function (res) {
                    viewModel.orderNumSearchDialog1Page.currentPage = res.pageIndex;
                    viewModel.orderNumSearchDialog1Page.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.orderNumSearchDialog1Page.pageSize = res.pageSize;
                    viewModel.orderNumSearchDialog1Page.totalCount = res.total;

                    var orderNumSearchDialog1SimpleData = res.data;
                    viewModel.orderNumSearchDialog1DataTable.removeAllRows();
                    viewModel.orderNumSearchDialog1DataTable.setSimpleData(orderNumSearchDialog1SimpleData, {unSelect: true});
                    viewModel.orderNumSearchDialog1Pagination.update({
                        totalPages: viewModel.orderNumSearchDialog1Page.totalPages||4,
                        totalCount: viewModel.orderNumSearchDialog1Page.totalCount,
                        pageSize: viewModel.orderNumSearchDialog1Page.pageSize,
                        currentPage: viewModel.orderNumSearchDialog1Page.currentPage
                    });
                })
            },
            initOrderNumSearchDialog2Pagination: function () {//初始化弹出框二分页
                var el = document.querySelector("#orderNumSearchDialog2Pagination");
                viewModel.orderNumSearchDialog2Pagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.orderNumSearchDialog2Pagination.on('pageChange', function (currentPage) {
                    viewModel.orderNumSearchDialog2Page.currentPage = currentPage + 1;
                    viewModel.fetchOrderNumSearchDialog2Data();

                });
                viewModel.orderNumSearchDialog2Pagination.on('sizeChange', function (pageSize) {
                    viewModel.orderNumSearchDialog2Page.pageSize = pageSize;
                    viewModel.orderNumSearchDialog2Page.currentPage = 1;
                    viewModel.fetchOrderNumSearchDialog2Data();
                });
            },
            fetchOrderNumSearchDialog2Data: function () {//弹出框二获取数据
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: url6,
                    data: 'jsonData'
                }).then(function (res) {
                    viewModel.orderNumSearchDialog2Page.currentPage = res.pageIndex;
                    viewModel.orderNumSearchDialog2Page.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.orderNumSearchDialog2Page.pageSize = res.pageSize;
                    viewModel.orderNumSearchDialog2Page.totalCount = res.total;

                    var orderNumSearchDialog2SimpleData = res.data;
                    viewModel.orderNumSearchDialog2DataTable.removeAllRows();
                    viewModel.orderNumSearchDialog2DataTable.setSimpleData(orderNumSearchDialog2SimpleData, {unSelect: true});
                    viewModel.orderNumSearchDialog2Pagination.update({
                        totalPages: viewModel.orderNumSearchDialog2Page.totalPages||4,
                        totalCount: viewModel.orderNumSearchDialog2Page.totalCount,
                        pageSize: viewModel.orderNumSearchDialog2Page.pageSize,
                        currentPage: viewModel.orderNumSearchDialog2Page.currentPage
                    });
                })
            },
            orderNumSearchDialog1HandleRender: function (obj) {//按订单号搜索图标
                var rowId = obj.row.value['$_#_@_id'];
                var orderNum = obj.row.value['orderNum'] || 'null';
                var orderNumSearch = "data-bind=click:event.orderNumSearchDialog1Confirm.bind($data,'" + rowId + "'," + orderNum + ")";
                var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>';
                obj.element.innerHTML = html;
                ko.applyBindings(viewModel, obj.element);
            },
            orderNumSearchDialog2HandleRender: function (obj) {//按订单号搜索图标
                var rowId = obj.row.value['$_#_@_id'];
                var orderNum = obj.row.value['orderNum'] || 'null';
                var isPatch = obj.row.value['isPatch'] || 'null';
                var orderNumSearch = "data-bind=click:event.orderNumSearchDialog2Confirm.bind($data,'" + rowId + "'," + isPatch + ")";
                var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>';
                obj.element.innerHTML = html;
                ko.applyBindings(viewModel, obj.element);
            },
            mainOnBeforeEditFun:function (obj) {
                var colIndex = obj.colIndex;
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);
                var myStatus = row.myStatus;
                var canEditColIndexsThroughAdd =                [1,2,3,5,7,8,9,10,12,13,14,15,16,17,18,20];
                var canEditColIndexsThroughOrderNumSearch =     [1,2,3,7,15,17,18,20];
                var canEditColIndexsThroughPatchModelSearch =   [5,7,15,17,18,20];
                if(myStatus == 'add'){
                    return canEditColIndexsThroughAdd.includes(colIndex);
                }else if(myStatus == 'orderNumSearch'){
                    return canEditColIndexsThroughOrderNumSearch.includes(colIndex);
                }else if(myStatus == 'patchModelSearch'){
                    return canEditColIndexsThroughPatchModelSearch.includes(colIndex);
                }
            },
            setCanEditRenderType:function () {
                var grid = viewModel.app.getComp('BillFinshedDeclare').grid;
                //搜索图标render
                grid.setRenderType('orderNumHook', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);
                    if(row.myStatus == 'add' || row.myStatus == 'orderNumSearch'){
                        var orderNum = obj.row.value['orderNum'] || 'null';
                        var orderNumSearch = "data-bind=click:event.orderNumSearch.bind($data,'" + orderNum + "'," + rowId + ")";
                        var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>'
                        obj.element.innerHTML = html;
                        ko.applyBindings(viewModel, obj.element);
                    }
                });
                //搜索图标render
                grid.setRenderType('patchModelHook', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);
                    if(row.myStatus == 'add' || row.myStatus == 'patchModelSearch'){
                        var rowId = obj.row.value['$_#_@_id'];
                        var patchModel = obj.row.value['patchModel'] || "null";
                        var patchModelSearch = "data-bind=click:event.patchModelSearch.bind($data,'" + patchModel + "'," + rowId + ")";
                        var html = '<span class="uf uf-search font-size-30"' + patchModelSearch + ' style="cursor: pointer;"></span>'
                        obj.element.innerHTML = html;
                        ko.applyBindings(viewModel, obj.element);
                    }
                });
                //add状态的render

                function addFunc(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'add') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }
                var addArr = [ 'consumer', 'telphone', 'orderNum', 'patchModel','patchCategory','productionCode','productionName','seriesName','pbillCode','pbillName','pbillType','num','unit','patchReason','logisticsMode','remarks'];
                addArr.forEach(function (field) {
                    addFunc(field)
                });
                //通过orderNumSearch

                function orderNumSearchFun(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'orderNumSearch') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }
                var orderNumSearchArr = [ 'consumer', 'telphone', 'orderNum','patchCategory','num','patchReason','logisticsMode','remarks'];
                orderNumSearchArr.forEach(function (field) {
                    orderNumSearchFun(field)
                });
                //通过patchModelSearch
                function patchModelSearchFun(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'patchModelSearch') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }
                var patchModelSearchArr = ['patchModel','patchCategory','num','unit','patchReason','logisticsMode','remarks'];
                patchModelSearchArr.forEach(function (field) {
                    patchModelSearchFun(field)
                });
                //设置下拉框render
                function dropDown(field) {
                    grid.setRenderType(field, function (obj) {
                        var valueArr = obj.value.split(',');
                        var value = viewModel[field].filter(function (item) {
                            return valueArr.indexOf(item.value.toString()) != -1;
                        }).map(function (item) {
                            return item.name;
                        }).join(',');
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'add' || myStatus == 'orderNumSearch' || myStatus == 'patchModelSearch') {
                            obj.element.innerHTML = value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';


                            if((myStatus == 'orderNumSearch' || myStatus == 'patchModelSearch') && field == 'unit' && !obj.element.innerHTML){
                                obj.element.style.border = 'transparent';

                            }



                        } else {
                            obj.element.innerHTML = value;
                        }
                    });
                }
                var arrDropDown = ['patchCategory', 'pbillType', 'unit', 'patchReason','logisticsMode'];
                arrDropDown.forEach(function (field) {
                    dropDown(field)
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
