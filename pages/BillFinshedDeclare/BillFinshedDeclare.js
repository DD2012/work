define(['text!pages/BillFinshedDeclare/BillFinshedDeclare.html', 'css!pages/BillFinshedDeclare/BillFinshedDeclare', 'uui', 'uuigrid', 'bootstrap', 'uuitree', './tableData.js'], function (html) {
    var init = function (element) {
        var url = ctx + '/BillFinshedDeclare/BillFinshedDeclareDropDowns';
        var url2 = ctx + '/BillFinshedDeclare/orderNumSearch';
        var url3 = ctx + '/BillFinshedDeclare/plate';
        var url4 = ctx + '/BillFinshedDeclare/fiveGold';
        var url5 = ctx + '/BillFinshedDeclare/orderNumSearchDialog1';
        var url6 = ctx + '/BillFinshedDeclare/orderNumSearchDialog2';
        var url7 = ctx + '/initMainPage/initMainPage';

        var list = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/listSave';//页面加载接口
        var save = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/save';//保存接口
        var del = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/del';//单删，多删接口

        //dialog1
        var plate = 'http://192.168.79.88:8080/pbill/parts/list/plate';//部件接口
        var fiveGold = 'http://192.168.79.88:8080/pbill/parts/list/hardWord';//五金接口


        // orderNum search通过不同搜索方式对应的接口
        var tellphoneSearchDialog1 = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/orderList';
        // var tellphoneSearchDialog1 = url5;
        //材料
        var materialList = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/materialList';

        var orderNumSearchDialog1 = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/orderList';



        //按照补件型号搜索
        var patchModelSearchDialog1 = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/productObj';

        //下拉框数据
        var dropdowns = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/select';

        //通过产品编码搜索部件信息 弹框一的确定按钮
        var productsByCode = 'http://192.168.79.88:8080/pbill/billFinishedDeclare/productsByCode';




        //
        // 成品补件申报分页 http://192.168.79.88:8080/pbill/billFinishedDeclare/list
        //
        // 成品补件申报保存： http://192.168.79.88:8080/pbill/billFinishedDeclare/save
        //
        // 销售订单：    http://192.168.79.88:8080/pbill/billFinishedDeclare/orderList
        //

        //
        // 补件型号(产品)： http://192.168.79.88:8080/pbill/billFinishedDeclare/productObj   [productModel=""]
        //
        // 补件型号（套件信息）： http://192.168.79.88:8080/pbill/billFinishedDeclare/suiteObj [suiteCode=""]
        //
        // 补件板件: http://192.168.79.88:8080/pbill/billFinishedDeclare/plates 板件  (参数：suiteCode)
        //
        // 补件五金: http://192.168.79.88:8080/pbill/billFinishedDeclare/hardWords 五金 (参数：suiteCode)
        //
        // 材料:http://192.168.79.88:8080/pbill/billFinishedDeclare/materialList


        var viewModel = {
            willUploadImgArr: [],//存储需要上传图片对象信息，删除当信息也在里面，保存时需要按照rowId筛选
            willUploadImgObj: {},
            rowStatus: '',//三个状态：add,orderNumSearch,telphoneSearch,patchModelSearch
            willTurnToLastPage: true,
            cacheOrderNumSearchDialog1Simple: [],
            cacheOrderNumSearchDialog2Simple: [],
            cacheDialog1MaterialRow: [],
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
            mainPagination: {
                "totalPages": '',
                "pageSize": 5,
                "currentPage": 1,
                "totalCount": ''
            },
            dialog1MaterialPage: {//弹窗材料分页
                "totalPages": '',
                "pageSize": 5,
                "currentPage": 1,
                "totalCount": ''
            },

            event: {
                func: function () {
                    debugger;
                    viewModel.setColumnRenderType();


                },
                pageInit: function () {

                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        // url: url,
                        url: dropdowns,
                        data: 'jsonData'
                    }).done(function (res) {
                        viewModel.patchCategory = res.data.patchCategory;
                        viewModel.pbillType = res.data.pbillType;
                        viewModel.unit = res.data.unit;
                        viewModel.patchReason = res.data.patchReason.filter(function (x) {
                            return x
                        });
                        viewModel.logisticsMode = res.data.logisticsMode || [{
                                    name: '物流方式1',
                                    value: '1'
                                }, {name: '物流方式2', value: '2'}];
                    }).done(function () {
                        viewModel.app = u.createApp({
                            el: element,
                            model: viewModel
                        });
                        viewModel.setColumnRenderType();//设置rendertype
                        viewModel.fetchInitPageData();//初始化页面已经保存了的数据
                        viewModel.dialog1SearchCondition.setSimpleData([{}]);
                        viewModel.orderNumSearchMaterial.setSimpleData([{}]);//初始化按照材料搜索条件
                    })
                },
                add: function () {
                    if (viewModel.willTurnToLastPage) {
                        viewModel.mainPagination.currentPage = viewModel.mainPagination.totalPages;
                        viewModel.fetchInitPageData().done(function (res) {
                            if (res.result == 1) {
                                viewModel.rowStatus = 'add';
                                var row = new Row({parent: viewModel.BillFinshedDeclare});
                                row.myStatus = viewModel.rowStatus;
                                viewModel.BillFinshedDeclare.addRow(row);
                                // viewModel.setCanEditRenderType();//设置各种条件下的render
                                viewModel.willTurnToLastPage = false;
                                viewModel.setColumnRenderType();
                            }
                        });
                    } else {
                        viewModel.rowStatus = 'add';
                        var row = new Row({parent: viewModel.BillFinshedDeclare});
                        row.myStatus = viewModel.rowStatus;
                        viewModel.BillFinshedDeclare.addRow(row);
                        viewModel.setColumnRenderType();
                    }


                },
                del: function (rowId) {
                    var id = viewModel.BillFinshedDeclare.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.BillFinshedDeclare.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url3,
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.fetchInitPageData();
                            }
                        });
                    } else {
                        viewModel.BillFinshedDeclare.removeRow(index);
                    }
                },
                mutipleDel: function () {
                    var selectedIndexs = viewModel.BillFinshedDeclare.getSelectedIndexs();
                    var params = viewModel.BillFinshedDeclare.getSelectedRows()
                            .map(function (row) {
                                return {id: row.getSimpleData().id};
                            }).filter(function (v) {
                                return v.id;
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url3,
                            url: del,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            viewModel.fetchInitPageData();
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
                                var rowSimpleData = row.getSimpleData();
                                return rowSimpleData;
                            });
                    params.forEach(function (v) {
                        delete v.orderNumHook;
                        delete v.patchModelHook;
                        delete v.phoneHook;
                        delete v.handleHook;

                        v["reportModel"] = "MANUAL";

                        v["madeType"] = "IS_SELF";
                        v["pbillSubmitType"] = "DISTRIBUTOR_CODE";


                    });
                    if (params.length > 0) {
                        $.ajax({
                            data: JSON.stringify(params),
                            type: 'post',
                            // url: url3,
                            url: save,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.willTurnToLastPage = true;
                                viewModel.fetchInitPageData();
                            }
                        }).fail(function (res) {
                            console.log(res)
                        });
                    }
                },
                submit: function () {

                },
                orderNumSearch: function (whichSearch, rowId) {//三个搜索全走这个弹框
                    console.log(whichSearch);
                    console.log(rowId);
                    var rowSimpleData = viewModel.BillFinshedDeclare.getRowByRowId(rowId).getSimpleData();

                    if(whichSearch == 'orderNumSearch'){
                        viewModel.dialog1SearchCondition.setSimpleData([{
                            orderNum:rowSimpleData.orderNum
                        }]);

                    }


                    viewModel.orderNumSearchRowId = rowId;
                    var rowStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                    viewModel.rowStatus = whichSearch;//设置按照订单号搜索行状态
                    viewModel.orderNumSearchDialog1 = u.dialog({
                        id: 'orderNumSearchDialog1',
                        content: "#orderNumSearchDialog1",
                        hasCloseMenu: true,
                        height: 'auto',
                        width: '90%',
                        closeFun: function () {
                            $('.orderNumSearchDialog1Pagination').hide();
                            viewModel.dialog1SearchCondition.setSimpleData([{}]);
                            viewModel.orderNumSearchDialog1DataTable.removeAllRows();//删除产品搜索表的数据
                            viewModel.orderNumSearchDialog1DataTable.clear();
                            viewModel.dialog1Material.removeAllRows();//删除材料搜索表的数据
                            viewModel.dialog1Material.clear();
                            viewModel.cacheDialog1MaterialRow = [];//清空缓存数据

                            viewModel.dialog1MaterialPage.currentPage = 1;
                            viewModel.orderNumSearchDialog1Page.currentPage = 1;
                            viewModel.dialog1SearchCondition.setSimpleData([{dropdown: '1'}]);

                            //缓存表的行对象
                            viewModel.cacheOrderNumSearchDialog1DataTableRows = viewModel.orderNumSearchDialog1DataTable.getAllRows();
                        }
                    });

                    $('.orderNumSearchProduct').show();
                    $('.orderNumSearchMaterial').hide();

                    $('.productGrid').show();
                    $('.materialGrid').hide();

                    $('.orderNumSearchTitle').html('订单信息');


                    viewModel.orderNumSearchDialog1DataTable.removeAllRows();
                    viewModel.fetchOrderNumSearchDialog1Data(whichSearch);
                },
                dialog1MaterialSearchConfirm: function () {//材料确定按钮
                    var willAddData = viewModel.cacheDialog1MaterialRow.map(function (v) {
                        var obj = {};
                        obj.pbillCode = v.mCode;
                        obj.pbillName = v.mName;
                        // obj.patchCategory = v.mCategory;
                        obj.patchCategory = "沙发";
                        obj.unit = v.mUnit;
                        return obj;
                    });

                    var willDeleteRowIndex = viewModel.BillFinshedDeclare.getAllRows()
                            .map(function (row, i) {
                                var rowSimpleData = row.getSimpleData();
                                if (row.myStatus == 'add' && rowSimpleData.productName == null && rowSimpleData.pbillName == null) {
                                    return i;
                                }
                            }).filter(function (x) {
                                return x != undefined;
                            });

                    viewModel.BillFinshedDeclare.removeRows(willDeleteRowIndex);


                    viewModel.BillFinshedDeclare.addSimpleData(willAddData);
                    viewModel.orderNumSearchDialog1.close();

                },
                patchModelSearch: function (witchSearch, rowId) {//按照补件类型搜索
                    console.log('patchModel', patchModel, 'rowId', rowId);
                    var rowStatus = viewModel.BillFinshedDeclare.getRowByRowId(rowId).myStatus;
                    viewModel.rowStatus = witchSearch;//设置按照补件类型搜索行状态

                    viewModel.dialog1 = u.dialog({
                        id: 'patchModelSearchDialog',
                        content: "#patchModelSearchDialog",
                        hasCloseMenu: true,
                        height: '500px',
                        width: '90%',
                        closeFun: function () {
                            // viewModel.setCanEditRenderType();//设置各种条件下的render
                        }
                    });
                    viewModel.plate.removeAllRows();
                    viewModel.fiveGold.removeAllRows();

                    viewModel.initPlatePagination();
                    viewModel.fetchPlateData();

                    viewModel.initFiveGoldPagination();
                    viewModel.fetchFiveGoldData();
                },

                patchModelSearchDialogConfirm: function () {//弹出框，确认按钮
                    var plateWillAppendToMainData = viewModel.plate.getSimpleData({type: 'select'});//选中的板件信息
                    var fiveGoldWillAppendToMainData = viewModel.fiveGold.getSimpleData({type: 'select'});//选中的五金件数据


                    var cacheOrderNumSearchDialog1Simple = [viewModel.cacheOrderNumSearchDialog1Simple];//dialog1 产品信息
                    var willAppendOrderNumSearchData = cacheOrderNumSearchDialog1Simple.map(function (v) {
                        var obj = {};
                        obj.orderNum = v.orderNum;
                        obj.patchModel = v.productModel;
                        obj.productCode = v.productCode;
                        obj.productName = v.productName;
                        obj.productStatus = v.productStatus;
                        obj.seriesName = v.seriesName;
                        return obj;
                    })[0];
                    var willAppendPlateData = plateWillAppendToMainData.map(function (v) {//板件数据
                        var obj = {};
                        obj.pbillCode = v.plateCode;
                        obj.pbillName = v.plateName;
                        obj.unit = v.unit;
                        obj.strType = v.strType
                        obj = $.extend({},obj,willAppendOrderNumSearchData);
                        return obj;
                    });

                    var willAppendFiveGoldData = fiveGoldWillAppendToMainData.map(function (v) {//五金数据
                        var obj = {};
                        obj.pbillCode = v.plateCode;
                        obj.pbillName = v.plateName;
                        obj.unit = v.unit;
                        obj.strType = v.strType
                        obj = $.extend({},obj,willAppendOrderNumSearchData);
                        return obj;
                    });
                    var willAppendAllData = willAppendPlateData.concat(willAppendFiveGoldData);
                    var willAppendRows = willAppendAllData.map(function (v) {
                        var row = new Row({parent: viewModel.BillFinshedDeclare});
                        row.myStatus = viewModel.rowStatus;
                        row.setSimpleData(v);
                        return row;
                    });
                    viewModel.BillFinshedDeclare.addRows(willAppendRows);


                    //删除新增的空行
                    var getRowIndexsHasAdd = viewModel.BillFinshedDeclare.getAllRows()
                            .filter(function (row) {
                                var rowSimpleData = row.getSimpleData();
                                return row.myStatus == 'add' && rowSimpleData.productName == null && rowSimpleData.pbillName == null;
                            }).map(function (row) {
                                return viewModel.BillFinshedDeclare.getIndexByRowId(row.rowId);
                            });
                    viewModel.BillFinshedDeclare.removeRows(getRowIndexsHasAdd);


                    viewModel.dialog1.close();
                },
                orderNumSearchDialog1Confirm: function (rowId, orderNum) {//按照订单号搜索，第一个弹出框操作按钮
                    console.log(rowId, orderNum);
                    var rowSimpleData = viewModel.orderNumSearchDialog1DataTable.getRowByRowId(rowId).getSimpleData();

                    viewModel.cacheOrderNumSearchDialog1Simple = rowSimpleData;//缓存弹框一选中的一行数据

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
                    viewModel.fetchOrderNumSearchDialog2Data(rowSimpleData.productCode);

                },
                orderNumSearchDialog1Search: function () {//订单搜索弹出框，搜索按钮
                    viewModel.orderNumSearchDialog1Page.currentPage = 1;
                    $('.orderNumSearchDialog1Pagination').show();
                    viewModel.fetchOrderNumSearchDialog1Data();

                },
                dialog1MaterialSearch:function () {//材料搜索
                    viewModel.dialog1MaterialPage.currentPage = 1;
                    $('.orderNumSearchProduct').hide();
                    $('.orderNumSearchMaterial').show();

                    $('.productGrid').hide();
                    $('.materialGrid').show();

                    $('.orderNumSearchTitle').html('材料信息');

                    viewModel.initDialog1MaterialPagnition();
                    viewModel.fetchOrderNumSearchDialog1Material();

                },
                orderNumSearchDialog2Confirm: function (rowId, isPatch) {//第二个弹出框,订单搜索弹出框，确定补件列
                    console.log(rowId, isPatch);
                    var rowSimpleData = viewModel.orderNumSearchDialog2DataTable.getRowByRowId(rowId);
                    viewModel.suiteCode = rowSimpleData.suiteCode;
                    viewModel.orderNumSearchDialog2.close();
                    viewModel.dialog1 = u.dialog({
                        id: 'patchModelSearchDialog',
                        content: "#patchModelSearchDialog",
                        hasCloseMenu: true,
                        height: '500px',
                        width: '90%',
                        closeFun: function () {
                            // viewModel.setCanEditRenderType();
                        }
                    });
                    viewModel.plate.removeAllRows();
                    viewModel.fiveGold.removeAllRows();

                    viewModel.initPlatePagination();
                    viewModel.fetchPlateData();

                    viewModel.initFiveGoldPagination();
                    viewModel.fetchFiveGoldData();
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
                    id: {},
                    consumer: {},
                    telphone: {},
                    phoneHook: {
                        default: {
                            value: 'phone'
                        }
                    },
                    orderNum: {},
                    orderNumHook: {
                        default: {
                            value: 'haha'
                        }
                    },
                    patchModel: {},
                    patchModelHook: {
                        default: {
                            value: 'haha'
                        }
                    },
                    patchCategory: {},
                    productCode: {},
                    productName: {},
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
                    picAddressId: {},
                    reportModel: {},
                    handleHook: {
                        default: {
                            value: 'haha'
                        }
                    }
                }
            }),
            patchCategory: [],//补件类别下拉框
            pbillType: [],//补件类型下拉框
            unit: [],//单位下拉框
            patchReason: [],//补件原因下拉框
            logisticsMode: [],//物流方式下拉框
            plate: new u.DataTable({//弹出框，板件信息
                meta: {
                    plateCode: {},
                    plateAlias: {},
                    plateName: {},
                    strNum: {},
                    unit: {},
                    strType:{
                        default:{
                            value:'PLATE'
                        }
                    }
                }
            }),
            fiveGold: new u.DataTable({//弹出框，五金件信息
                meta: {
                    plateCode: {},
                    plateName: {},
                    strNum: {},
                    unit: {},
                    strType:{
                        default:{
                            value:'HARD_WORD'
                        }
                    }
                }
            }),
            orderNumSearchDialog1DataTable: new u.DataTable({
                meta: {
                    orderNum: {},
                    productModel: {},
                    productCode: {},
                    productName: {},
                    productStatus: {},
                    seriesName: {},
                    handleHook: {}
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
            dialog1SearchCondition: new u.DataTable({
                meta: {
                    orderNum: {},
                    productionName: {},
                    seriesName: {},
                    dropdown: {
                        default: {
                            value: '1'
                        }
                    }
                }
            }),
            dialog1Material: new u.DataTable({
                meta: {
                    mCode: {},
                    mName: {},
                    mSpec: {},
                    mCategory: {},
                    mUnit: {}
                }
            }),
            orderNumSearchMaterial: new u.DataTable({
                meta: {
                    mCode: {},
                    mName: {}
                }
            }),//按照材料编码搜索条件
            dialog1MaterialOnRowSelected: function (obj) {//材料表选中的事件
                var rowId = obj.rowObj.value['$_#_@_id'];
                var rowSimpleData = viewModel.dialog1Material.getRowByRowId(rowId).getSimpleData();
                var id = rowSimpleData.id;
                var shouldPushOneRow = viewModel.cacheDialog1MaterialRow.map(function (v) {
                            return v.id;
                        }).indexOf(id) != -1;
                if (!shouldPushOneRow) {
                    viewModel.cacheDialog1MaterialRow.push(rowSimpleData);
                }
                console.log(viewModel.cacheDialog1MaterialRow);
            },
            dialog1MaterialOnRowUnSelected: function (obj) {//材料表取消选中的事件
                var rowId = obj.rowObj.value['$_#_@_id'];
                var rowSimpleData = viewModel.dialog1Material.getRowByRowId(rowId).getSimpleData();
                var id = rowSimpleData.id;
                viewModel.cacheDialog1MaterialRow = viewModel.cacheDialog1MaterialRow.filter(function (v) {
                    return v.id != id;
                });
                console.log(viewModel.cacheDialog1MaterialRow);
            },
            initDialog1MaterialPagnition: function () {
                var el = document.querySelector("#materialPagination");
                viewModel.dialog1MaterialPagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.dialog1MaterialPagination.on('pageChange', function (currentPage) {
                    viewModel.dialog1MaterialPage.currentPage = currentPage + 1;
                    viewModel.fetchOrderNumSearchDialog1Material();

                });
                viewModel.dialog1MaterialPagination.on('sizeChange', function (pageSize) {
                    viewModel.dialog1MaterialPage.pageSize = pageSize;
                    viewModel.dialog1MaterialPage.currentPage = 1;
                    viewModel.fetchOrderNumSearchDialog1Material();
                });
            },
            dialog1SearchConditionCombo: [{name: '产品', value: '1'}, {name: '材料', value: '2'}],
            afterAdd: function (element, index, data) {
                if (element.nodeType === 1) {
                    u.compMgr.updateComp(element);
                }
            },
            imgRender: function (obj) {
                var $element = $(obj.element);
                var grid = obj.gridObj;
                var datatable = grid.dataTable;
                var rowId = obj.row.value['$_#_@_id'];
                var row = datatable.getRowByRowId(rowId);
                var column = obj.gridCompColumn;
                var field = column.options.field;


                obj.element.innerHTML = '<input class="u-not-visible" type="file" id="img_' + rowId + '" /><i class="uf uf-upload font-size-24" style="cursor: pointer;"></i><span></span>'
                $element.find('i').on('click', function () {
                    $element.find('input')[0].click();
                });
                $element.find('input').on('change', function () {
                    $element.find('span').html($element.find('input').val());
                    // row.setValue(field, ('#img_' + rowId));//span中的文件路径回消失
                });
            },
            handleHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },

            fetchPlateData: function () {
                //参数:补件型号 和 套件编码
                var params = {
                    suiteCode:viewModel.suiteCode,
                    pageIndex: viewModel.platePage.currentPage,
                    pageSize: viewModel.platePage.pageSize
                };
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    // url: url4,
                    url: plate,
                    data: params
                }).then(function (res) {
                    if(res.result == 1){

                    }

                    viewModel.platePage.currentPage = res.pageIndex;
                    viewModel.platePage.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.platePage.pageSize = res.pageSize;
                    viewModel.platePage.totalCount = res.total;

                    var plateSimpleData = res.data;
                    var imgAddress = res.imgAddress || '../static/1.png';
                    viewModel.plate.removeAllRows();
                    viewModel.plate.setSimpleData(plateSimpleData, {unSelect: true});
                    $('#plateImg').attr('src', imgAddress);
                    viewModel.platePagination.update({
                        totalPages: viewModel.platePage.totalPages || 4,
                        totalCount: viewModel.platePage.totalCount,
                        pageSize: viewModel.platePage.pageSize,
                        currentPage: viewModel.platePage.currentPage

                    });
                })
            },

            fetchFiveGoldData: function () {
                var params = {
                    suiteCode:viewModel.suiteCode,
                    pageIndex: viewModel.fiveGoldPage.currentPage,
                    pageSize: viewModel.fiveGoldPage.pageSize
                };
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: fiveGold,
                    // url: url4,
                    data: params
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
                        totalPages: viewModel.fiveGoldPage.totalPages || 4,
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
                var rowId = viewModel.orderNumSearchRowId;
                var witchWaySearch = viewModel.rowStatus;
                var url = '';
                var params = null;
                var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);
                var searchData = viewModel.dialog1SearchCondition.getSimpleData()[0];

                if (searchData.dropdown == '1') {//选择产品


                    if (witchWaySearch == 'telphoneSearch') {
                        url = tellphoneSearchDialog1;
                        params = {
                            pageIndex: viewModel.orderNumSearchDialog1Page.currentPage,
                            pageSize: viewModel.orderNumSearchDialog1Page.pageSize,
                            telphone: row.getSimpleData().telphone,
                            orderNum:searchData.orderNum,
                            productionName:searchData.productionName,
                            seriesName:searchData.seriesName
                        };
                    } else if (witchWaySearch == 'orderNumSearch') {
                        url = orderNumSearchDialog1;
                        params = {
                            pageIndex: viewModel.orderNumSearchDialog1Page.currentPage,
                            pageSize: viewModel.orderNumSearchDialog1Page.pageSize,
                            orderNum: searchData.orderNum,
                            productionName:searchData.productionName,
                            seriesName:searchData.seriesName
                        };
                    } else if (witchWaySearch == 'patchModelSearch') {
                        url = patchModelSearchDialog1;
                        params = {
                            pageIndex: viewModel.orderNumSearchDialog1Page.currentPage,
                            pageSize: viewModel.orderNumSearchDialog1Page.pageSize||5,
                            productModel: row.getSimpleData().patchModel,
                            productionName:searchData.productionName,
                            seriesName:searchData.seriesName
                        };
                    }
                } else {//选择材料
                    url = materialList;
                    params = {
                        pageIndex: viewModel.orderNumSearchDialog1Page.currentPage,
                        pageSize: viewModel.orderNumSearchDialog1Page.pageSize
                    };
                    params = $.extend({}, params, searchData);
                }


                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: url,
                    data: params
                }).then(function (res) {
                    if (res.result == 1) {

                        viewModel.initOrderNumSearchDialog1Pagination();
                        $('.orderNumSearchDialog1Pagination').show();
                        viewModel.orderNumSearchDialog1Page.currentPage = res.pageIndex;
                        viewModel.orderNumSearchDialog1Page.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.orderNumSearchDialog1Page.pageSize = res.pageSize;
                        viewModel.orderNumSearchDialog1Page.totalCount = res.total;

                        var orderNumSearchDialog1SimpleData = res.data;
                        viewModel.orderNumSearchDialog1DataTable.setSimpleData(orderNumSearchDialog1SimpleData, {unSelect: true});

                        viewModel.orderNumSearchDialog1Pagination.update({
                            totalPages: viewModel.orderNumSearchDialog1Page.totalPages,
                            totalCount: viewModel.orderNumSearchDialog1Page.totalCount,
                            pageSize: viewModel.orderNumSearchDialog1Page.pageSize,
                            currentPage: viewModel.orderNumSearchDialog1Page.currentPage
                        });
                    }
                })
            },
            fetchOrderNumSearchDialog1Material: function () {
                var mCode = viewModel.orderNumSearchMaterial.getSimpleData()[0].mCode;
                var mName = viewModel.orderNumSearchMaterial.getSimpleData()[0].mName;
                var params = {
                    pageIndex: viewModel.dialog1MaterialPage.currentPage,
                    pageSize: viewModel.dialog1MaterialPage.pageSize,
                    mCode: mCode,
                    mName: mName
                };
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: materialList,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {


                        viewModel.dialog1MaterialPage.currentPage = res.pageIndex;
                        viewModel.dialog1MaterialPage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.dialog1MaterialPage.pageSize = res.pageSize;
                        viewModel.dialog1MaterialPage.totalCount = res.total;


                        viewModel.dialog1MaterialPagination.update({
                            totalPages: viewModel.dialog1MaterialPage.totalPages,
                            totalCount: viewModel.dialog1MaterialPage.totalCount,
                            pageSize: viewModel.dialog1MaterialPage.pageSize,
                            currentPage: viewModel.dialog1MaterialPage.currentPage
                        });


                        viewModel.dialog1Material.setSimpleData(res.data, {unSelect: true});


                        //设置翻页选中行
                        var hasCachedIds = viewModel.cacheDialog1MaterialRow.map(function (rowSimple) {
                            return rowSimple.id;
                        });
                        var selectedIndexs = viewModel.dialog1Material.getSimpleData().map(function (rowSimple, i) {
                            var isExist = viewModel.cacheDialog1MaterialRow.map(function (v) {
                                return v.id;
                            }).indexOf(rowSimple.id);
                            if (isExist != -1) {
                                return i;
                            }
                        }).filter(function (x) {
                            return x != undefined;
                        });

                        viewModel.dialog1Material.setRowsSelect(selectedIndexs);
                    }

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
            fetchOrderNumSearchDialog2Data: function (productCode) {//弹出框二获取数据
                var params = {
                    pageIndex:viewModel.orderNumSearchDialog2Page.currentPage,
                    pageSize:viewModel.orderNumSearchDialog2Page.pageSize,
                    productCode:productCode
                };
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    // url: url6,
                    url: productsByCode,
                    data: params
                }).then(function (res) {
                    viewModel.orderNumSearchDialog2Page.currentPage = res.pageIndex ;
                    viewModel.orderNumSearchDialog2Page.totalPages = Math.ceil(res.total / res.pageSize);
                    viewModel.orderNumSearchDialog2Page.pageSize = res.pageSize ;
                    viewModel.orderNumSearchDialog2Page.totalCount = res.total;

                    var orderNumSearchDialog2SimpleData = res.data;
                    viewModel.orderNumSearchDialog2DataTable.removeAllRows();
                    viewModel.orderNumSearchDialog2DataTable.setSimpleData(orderNumSearchDialog2SimpleData, {unSelect: true});
                    viewModel.orderNumSearchDialog2Pagination.update({
                        totalPages: viewModel.orderNumSearchDialog2Page.totalPages ,
                        totalCount: viewModel.orderNumSearchDialog2Page.totalCount,
                        pageSize: viewModel.orderNumSearchDialog2Page.pageSize,
                        currentPage: viewModel.orderNumSearchDialog2Page.currentPage
                    });
                })
            },
            initMainPagination: function () {
                var el = document.querySelector("#mainPagination");
                viewModel.mainPagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.mainPagination.on('pageChange', function (currentPage) {
                    viewModel.mainPagination.currentPage = currentPage + 1;
                    viewModel.fetchInitPageData();
                    viewModel.willTurnToLastPage = true;

                });
                viewModel.mainPagination.on('sizeChange', function (pageSize) {
                    viewModel.mainPagination.pageSize = pageSize;
                    viewModel.mainPagination.currentPage = 1;
                    viewModel.fetchInitPageData();
                    viewModel.willTurnToLastPage = true;
                });
            },
            fetchInitPageData: function () {//初始化主表
                var params = {
                    pageIndex: viewModel.mainPagination.currentPage,
                    pageSize: viewModel.mainPagination.pageSize
                };
                return $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: list,
                    // url: url7,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {
                        // viewModel.setCanEditRenderType();
                        viewModel.initMainPagination();
                        viewModel.mainPagination.currentPage = res.pageIndex;
                        viewModel.mainPagination.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.mainPagination.pageSize = res.pageSize;
                        viewModel.mainPagination.totalCount = res.total;


                        viewModel.mainPagination.update({
                            totalPages: viewModel.mainPagination.totalPages,
                            totalCount: viewModel.mainPagination.totalCount,
                            pageSize: viewModel.mainPagination.pageSize,
                            currentPage: viewModel.mainPagination.currentPage
                        });


                        var simpleData = res.data;
                        var rows = simpleData.map(function (rowSimpleData) {
                            var row = new Row({parent: viewModel.BillFinshedDeclare});
                            row.setSimpleData(rowSimpleData);
                            row.myStatus = rowSimpleData.rowStatus;
                            return row;
                        });
                        viewModel.BillFinshedDeclare.removeAllRows();
                        viewModel.BillFinshedDeclare.addRows(rows);
                    }
                }).fail(function (res) {
                    console.log(res)
                });
            },
            orderNumSearchDialog1HandleRender: function (obj) {//按订单号搜索图标
                var rowId = obj.row.value['$_#_@_id'];
                var orderNum = obj.row.value['orderNum'] || 'null';
                var orderNumSearch = "data-bind=click:event.orderNumSearchDialog1Confirm.bind($data,'" + rowId + "','" + orderNum + "')";
                var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>';
                obj.element.innerHTML = html;
                ko.applyBindings(viewModel, obj.element);
            },
            orderNumSearchDialog2HandleRender: function (obj) {//按订单号搜索图标
                var rowId = obj.row.value['$_#_@_id'];
                var orderNum = obj.row.value['orderNum'] || 'null';
                var isPatch = obj.row.value['isPatch'] || 'null';
                var orderNumSearch = "data-bind=click:event.orderNumSearchDialog2Confirm.bind($data,'" + rowId + "','" + isPatch + "')";
                var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>';
                obj.element.innerHTML = html;
                ko.applyBindings(viewModel, obj.element);
            },


            mainOnBeforeEditFun: function (obj) {
                var colIndex = obj.colIndex;
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);
                var rowSimpleData = row.getSimpleData();
                var myStatus = row.myStatus;
                var metaArr = Object.keys(viewModel.BillFinshedDeclare.getMeta());
                var canEditThrouthAdd = ["consumer", "telphone", "orderNum", "patchModel", "patchCategory", "productCode", "productName", "seriesName", "pbillCode", "pbillName", "pbillType", "num", "unit", "patchReason", "logisticsMode", "remarks"];
                var canEditThrouthTelphoneOrderNum = ["orderNum", "patchCategory", "num", "patchReason", "logisticsMode", "remarks"];
                var canEditThrouthPatchModel = ["pbillCode", "patchModel", "patchCategory", "num", "patchReason", "logisticsMode", "remarks"];
                canEditThrouthAdd = canEditThrouthAdd.map(function (v) {
                    return metaArr.indexOf(v);
                });
                canEditThrouthTelphoneOrderNum = canEditThrouthTelphoneOrderNum.map(function (v) {
                    return metaArr.indexOf(v);
                });
                canEditThrouthPatchModel = canEditThrouthPatchModel.map(function (v) {
                    return metaArr.indexOf(v);
                });
                if (myStatus == 'add') {

                    return canEditThrouthAdd.includes(colIndex);
                } else if (myStatus == 'orderNumSearch' || myStatus == 'telphoneSearch') {

                    return canEditThrouthTelphoneOrderNum.includes(colIndex);
                } else if (myStatus == 'patchModelSearch') {

                    return canEditThrouthPatchModel.includes(colIndex);
                }
            },


            setColumnRenderType: function () {//设置除下拉框的rendertype，分别对add,orderNumSearch,patchModelSearch做判断
                var grid = viewModel.app.getComp('BillFinshedDeclare').grid;
                //设置搜索框rendertype
                grid.setRenderType('orderNumHook', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);
                    var rowSimpleData = row.getSimpleData();
                    var x = 'orderNumSearch';
                    if (row.myStatus == 'add' && rowSimpleData.productName == null && rowSimpleData.pbillName == null) {
                        var orderNum = obj.row.value['orderNum'] || 'null';
                        var orderNumSearch = "data-bind=click:event.orderNumSearch.bind($data,'" + x + "'," + rowId + ")";
                        var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>'
                        obj.element.innerHTML = html;
                        ko.applyBindings(viewModel, obj.element);
                    }
                });
                grid.setRenderType('phoneHook', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);

                    var rowSimpleData = row.getSimpleData();
                    var x = 'telphoneSearch';

                    if (row.myStatus == 'add' && rowSimpleData.productName == null && rowSimpleData.pbillName == null) {
                        var orderNum = obj.row.value['orderNum'] || 'null';
                        var orderNumSearch = "data-bind=click:event.orderNumSearch.bind($data,'" + x + "'," + rowId + ")";
                        var html = '<span class="uf uf-search font-size-30"' + orderNumSearch + ' style="cursor: pointer;"></span>';
                        obj.element.innerHTML = html;
                        ko.applyBindings(viewModel, obj.element);
                    }
                });
                grid.setRenderType('patchModelHook', function (obj) {
                    var rowId = obj.row.value['$_#_@_id'];
                    var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);

                    var rowSimpleData = row.getSimpleData();
                    var x = 'patchModelSearch';

                    if (row.myStatus == 'add' && rowSimpleData.productName == null && rowSimpleData.pbillName == null) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var patchModel = obj.row.value['patchModel'] || "null";
                        var patchModelSearch = "data-bind=click:event.orderNumSearch.bind($data,'" + x + "'," + rowId + ")";
                        var html = '<span class="uf uf-search font-size-30"' + patchModelSearch + ' style="cursor: pointer;"></span>'
                        obj.element.innerHTML = html;
                        ko.applyBindings(viewModel, obj.element);
                    }
                });
                //render可编辑选框border
                var canEditThrouthAdd = ["consumer", "telphone", "orderNum", "patchModel", "patchCategory", "productCode", "productName", "seriesName", "pbillCode", "pbillName", "pbillType", "num", "unit", "patchReason", "logisticsMode", "remarks"];
                var canEditThrouthTelphoneOrderNum = ["orderNum", "patchCategory", "num", "patchReason", "logisticsMode", "remarks"];
                var canEditThrouthPatchModel = ["pbillCode", "patchModel", "patchCategory", "num", "patchReason", "logisticsMode", "remarks"];
                var dropDowns = ["patchCategory", "pbillType", "unit", "patchReason", "logisticsMode"];
                canEditThrouthAdd.forEach(function (field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var row = viewModel.BillFinshedDeclare.getRowByRowId(rowId);

                        var rowSimpleData = row.getSimpleData();

                        if (row.myStatus == 'add') {//判断add
                            if (canEditThrouthAdd.indexOf(field) != -1) {
                                obj.element.innerHTML = obj.value;
                                obj.element.style.boxSizing = 'border-box';
                                obj.element.style.border = '1px solid';
                            } else {
                                obj.element.innerHTML = obj.value;
                            }
                        } else if (row.myStatus == 'telphoneSearch' || row.myStatus == 'orderNumSearch') {
                            if (canEditThrouthTelphoneOrderNum.indexOf(field) != -1) {
                                obj.element.innerHTML = obj.value;
                                obj.element.style.boxSizing = 'border-box';
                                obj.element.style.border = '1px solid';
                            } else {
                                obj.element.innerHTML = obj.value;
                            }
                        } else if (row.myStatus == 'patchModelSearch') {
                            if (canEditThrouthPatchModel.indexOf(field) != -1) {
                                obj.element.innerHTML = obj.value;
                                obj.element.style.boxSizing = 'border-box';
                                obj.element.style.border = '1px solid';
                            } else {
                                obj.element.innerHTML = obj.value;
                            }
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                        //判断dropdows
                        var valueArr = obj.value.split(',');
                        if (viewModel[field]) {//判断下拉框是否存在
                            var value = viewModel[field].filter(function (item) {
                                return valueArr.indexOf(item.value.toString()) != -1;
                            }).map(function (item) {
                                return item.name;
                            }).join(',');
                            obj.element.innerHTML = value;
                        }


                    });
                });


            }
        };


        $(element).html(html);
        viewModel.event.pageInit();



        viewModel.dialog1SearchCondition.on('valueChange', function (obj) {
            if (obj.newValue == '1' && obj.field == 'dropdown') {//如果是产品
                $('.orderNumSearchProduct').show();
                $('.orderNumSearchMaterial').hide();

                $('.productGrid').show();
                $('.materialGrid').hide();

                $('.orderNumSearchTitle').html('订单信息');

                viewModel.fetchOrderNumSearchDialog1Data();

            } else if(obj.newValue == '2' && obj.field == 'dropdown') {//如果是材料
                $('.orderNumSearchProduct').hide();
                $('.orderNumSearchMaterial').show();

                $('.productGrid').hide();
                $('.materialGrid').show();

                $('.orderNumSearchTitle').html('材料信息');

                viewModel.initDialog1MaterialPagnition();
                viewModel.fetchOrderNumSearchDialog1Material();

            }

        });



    };
    return {
        'template': html,
        init: init
    }
});
