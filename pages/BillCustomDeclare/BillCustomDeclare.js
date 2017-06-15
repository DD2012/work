define(['text!pages/BillCustomDeclare/BillCustomDeclare.html', 'css!pages/BillCustomDeclare/BillCustomDeclare', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/BillCustomDeclare/BillCustomDeclareDropDown';

        var plateList = 'http://192.168.79.88:8080/pbill/billCustomDeclare/listPlate';
        var plateSave = 'http://192.168.79.88:8080/pbill/billCustomDeclare/savePlate';
        var plateSubmit = '';

        var fiveGoldList = 'http://192.168.79.88:8080/pbill/billCustomDeclare/listHardWord';
        var fiveGoldSave = 'http://192.168.79.88:8080/pbill/billCustomDeclare/saveHardWord';
        var fiveGoldSubmit = '';

        var dropDowns = 'http://192.168.79.88:8080/pbill/billCustomDeclare/select';
        var saveImg = 'http://192.168.79.88:8080/pbill/picUpload/save';


        var viewModel = {
            app: {},
            plateWillTurnToLastPage: true,
            fiveGoldWillTurnToLastPage: true,
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
            event: {
                func: function () {
                    debugger;
                    viewModel.setColsRenderType();
                },
                pageInit: function () {
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        // url: url,
                        url: dropDowns,
                        data: 'jsonData'
                    }).done(function (res) {//下拉框初始化
                        if (res.result == 1) {
                            viewModel.unit = res.data.unit;
                            viewModel.pbillType = res.data.pbillType;
                            viewModel.pbillReason = res.data.patchReason;
                            viewModel.logisticsMode = res.data.logisticsMode;
                        }
                    }).done(function (res) {//创建app
                        if (res.result == 1) {
                            viewModel.app = u.createApp({
                                el: element,
                                model: viewModel
                            });
                            viewModel.setColsRenderType();//设置render
                            viewModel.logisticsModeDialogDataTable.setSimpleData([{}]);//设置物流方式弹出框空行
                        }
                    }).done(function (res) {//分页初始化
                        if (res.result == 1) {
                            viewModel.initPlatePagination();
                            viewModel.fetchPlateData();

                            viewModel.initFiveGoldPagination();
                            viewModel.fetchFiveGoldData();
                        }
                    }).fail(function (res) {
                        console.warn(res);
                    });

                },//板件表事件
                plankDel: function (rowId) {
                    console.log(rowId);
                    var rowIndex = viewModel.plank.getIndexByRowId(rowId);
                    var id = viewModel.plank.getRowByRowId(rowId).getSimpleData().id;
                    if (id) {
                        var params = [{id: id}];
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            url: plateDel,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.plank.removeRows([rowIndex]);
                            }
                        });
                    } else {
                        viewModel.plank.removeRows([rowIndex]);
                    }
                },
                plankEdit: function (rowId) {
                    console.log(rowId);
                    var row = viewModel.plank.getRowByRowId(rowId);
                    row.canEdit = true;
                    viewModel.setColsRenderType();
                },
                plankAdd: function () {

                    var row = new Row({parent: viewModel.plank});
                    row.canEdit = true;
                    viewModel.platePage.currentPage = viewModel.platePage.totalPages;
                    if (viewModel.plateWillTurnToLastPage == true) {
                        viewModel.fetchPlateData().then(function (res) {
                            if (res.result == 1) {
                                viewModel.plank.addRow(row);
                                viewModel.plateWillTurnToLastPage = false;
                            }
                        });
                    } else {
                        viewModel.plank.addRow(row);
                    }


                },
                plankMutipleDel: function () {
                    var params = viewModel.plank.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData().id;
                            }).filter(function (v) {
                                return v;
                            });
                    var selectedRowIndexs = viewModel.plank.getSelectedIndexs();
                    if (params.length > 0) {
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            url: plateDel,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.plank.removeRows(selectedRowIndexs);
                            } else {

                            }
                        });
                    }


                },
                plankSave: function () {
                    viewModel.plateWillTurnToLastPage = true;
                    var params = viewModel.plank.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    params.forEach(function (v) {
                        delete v.handleHook
                    });
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: plateSave,
                        data: JSON.stringify(params)
                    }).done(function (res) {
                        if (res.result == 1) {
                            viewModel.platePage.currentPage = 1;
                            viewModel.fetchPlateData();
                        }
                    });
                },
                plankCommit: function () {
                    viewModel.plateWillTurnToLastPage = true;
                    var params = viewModel.plank.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    params.forEach(function (v) {
                        delete v.handleHook
                    });
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: plateSubmit,
                        data: JSON.stringify(params)
                    }).done(function (res) {
                        if (res.result == 1) {
                            viewModel.platePage.currentPage = 1;
                            viewModel.fetchPlateData();
                        }
                    });

                },//五金事件
                fiveGoldDel: function (rowId) {
                    var rowIndex = viewModel.fiveGold.getIndexByRowId(rowId);
                    var id = viewModel.fiveGold.getRowByRowId(rowId).getSimpleData().id;
                    if (id) {
                        var params = [{id: id}];
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            url: fiveGoldDel,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.fiveGold.removeRows([rowIndex]);
                            }
                        });
                    } else {
                        viewModel.fiveGold.removeRows([rowIndex]);
                    }
                },
                fiveGoldEdit: function (rowId) {
                    console.log(rowId);
                    var row = viewModel.fiveGold.getRowByRowId(rowId);
                    row.canEdit = true;
                    viewModel.setColsRenderType();
                },
                fiveGoldAdd: function () {
                    var row = new Row({parent: viewModel.fiveGold});
                    row.canEdit = true;
                    viewModel.fiveGoldPage.currentPage = viewModel.fiveGoldPage.totalPages;
                    if (viewModel.fiveGoldWillTurnToLastPage == true) {
                        viewModel.fetchFiveGoldData().then(function (res) {
                            if (res.result == 1) {
                                viewModel.fiveGold.addRow(row);
                                viewModel.fiveGoldWillTurnToLastPage = false;
                            }
                        });
                    } else {
                        viewModel.fiveGold.addRow(row);
                    }
                },
                fiveGoldMutipleDel: function () {
                    var params = viewModel.fiveGold.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData().id;
                            }).filter(function (v) {
                                return v;
                            });
                    var selectedRowIndexs = viewModel.fiveGold.getSelectedIndexs();
                    if (params.length > 0) {
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            url: fiveGoldDel,
                            data: JSON.stringify(params)
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.fiveGold.removeRows(selectedRowIndexs);
                            } else {

                            }
                        });
                    }
                },
                fiveGoldSave: function () {
                    viewModel.fiveGoldWillTurnToLastPage = true;
                    var params = viewModel.fiveGold.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    params.forEach(function (v) {
                        delete v.handleHook
                    });
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: fiveGoldSave,
                        data: JSON.stringify(params)
                    }).done(function (res) {
                        if (res.result == 1) {
                            viewModel.fiveGoldPage.currentPage = 1;
                            viewModel.fetchFiveGoldData();
                        }
                    });
                },
                fiveGoldCommit: function () {
                    viewModel.fiveGoldWillTurnToLastPage = true;
                    var params = viewModel.fiveGold.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            });
                    params.forEach(function (v) {
                        delete v.handleHook
                    });
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: fiveGoldSubmit,
                        data: JSON.stringify(params)
                    }).done(function (res) {
                        if (res.result == 1) {
                            viewModel.fiveGold.currentPage = 1;
                            viewModel.fetchFiveGoldData();
                        }
                    });

                }
            },
            plank: new u.DataTable({
                meta: {
                    pbillCode: {},
                    pbillType: {},
                    pbillName: {},
                    color: {},
                    length: {},
                    wide: {},
                    thick: {},
                    num: {},
                    unit: {},
                    area: {},
                    thinEdge: {},
                    thickBand: {},
                    pbillReason: {},
                    picAddressId: {},
                    logisticsMode: {},
                    deliveryAddress: {},
                    remark: {},
                    handleHook: {
                        default: {
                            value: '跳过空值判断'
                        }
                    }
                }
            }),
            fiveGold: new u.DataTable({
                meta: {
                    pbillCode: {},
                    pbillType: {},
                    pbillName: {},
                    num: {},
                    unit: {},
                    pbillReason: {},
                    picAddressId: {},
                    logisticsMode: {},
                    deliveryAddress: {},
                    remark: {},
                    handleHook: {
                        default: {
                            value: '跳过空值判断'
                        }
                    }
                }
            }),
            logisticsModeDialogDataTable:new u.DataTable({
                meta:{
                    name:{},
                    phone:{},
                    provName:{},
                    cityName:{},
                    countyName:{},
                    streetName:{}
                }
            }),
            pbillType: [],//补件类型下拉框
            pbillReason: [],//补件原因
            logisticsMode: [],//物流方式
            unit: [],
            plankHandleHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.plankDel.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.plankEdit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);

            },
            fiveGoldHandleHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.fiveGoldDel.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.fiveGoldEdit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);

            },
            plankImgRender: function (obj) {
                var $element = $(obj.element);
                var grid = obj.gridObj;
                var datatable = grid.dataTable;
                var rowId = obj.row.value['$_#_@_id'];
                var row = datatable.getRowByRowId(rowId);
                var column = obj.gridCompColumn;
                var field = column.options.field;
                var rowSimpleData = row.getSimpleData();


                obj.element.innerHTML = '<input class="u-not-visible" type="file" id="img_' + rowId + '" /><i class="uf uf-upload font-size-24" style="cursor: pointer;"></i><span></span>'
                $element.find('i').on('click', function () {
                    $element.find('input')[0].click();
                });
                $element.find('input').on('change', function () {
                    $element.find('span').html($element.find('input').val());
                    // row.setValue(field, ('#img_' + rowId));//span中的文件路径回消失

                    var params = {
                        imgEl: document.getElementById('img_' + rowId),
                        pbillCode:rowSimpleData.pbillCode
                    };
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: url,
                        data: 'params'
                    }).done(function (res) {
                        console.log(res);
                    });
                });
            },
            fiveGoldImgRender: function (obj) {
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
            initPlatePagination: function () {
                var el = document.querySelector("#plagePagination");
                viewModel.plagePagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.plagePagination.on('pageChange', function (currentPage) {
                    viewModel.platePage.currentPage = currentPage + 1;
                    viewModel.plateWillTurnToLastPage = true;
                    viewModel.fetchPlateData();

                });
                viewModel.plagePagination.on('sizeChange', function (pageSize) {
                    viewModel.platePage.pageSize = pageSize;
                    viewModel.plateWillTurnToLastPage = true;
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
                    viewModel.fiveGoldWillTurnToLastPage = true;
                    viewModel.fetchFiveGoldData();
                });
                viewModel.fiveGoldPagination.on('sizeChange', function (pageSize) {
                    viewModel.fiveGoldPage.pageSize = pageSize;
                    viewModel.fiveGoldPage.currentPage = 1;
                    viewModel.fiveGoldWillTurnToLastPage = true;
                    viewModel.fetchFiveGoldData();
                });
            },
            fetchPlateData: function () {
                var params = {
                    pageIndex: viewModel.platePage.currentPage,
                    pageSize: viewModel.platePage.pageSize
                };
                return $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: plateList,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {
                        viewModel.platePage.currentPage = res.pageIndex;
                        viewModel.platePage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.platePage.pageSize = res.pageSize;
                        viewModel.platePage.totalCount = res.total;

                        viewModel.plagePagination.update({
                            totalPages: viewModel.platePage.totalPages,
                            totalCount: viewModel.platePage.totalCount,
                            pageSize: viewModel.platePage.pageSize,
                            currentPage: viewModel.platePage.currentPage
                        });
                        viewModel.plank.setSimpleData(res.data, {unSelect: true});
                    }
                });
            },
            fetchFiveGoldData: function () {
                var params = {
                    pageIndex: viewModel.fiveGoldPage.currentPage,
                    pageSize: viewModel.fiveGoldPage.pageSize
                };
                return $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    url: fiveGoldList,
                    data: params
                }).done(function (res) {
                    if (res.result == 1) {
                        viewModel.fiveGoldPage.currentPage = res.pageIndex;
                        viewModel.fiveGoldPage.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.fiveGoldPage.pageSize = res.pageSize;
                        viewModel.fiveGoldPage.totalCount = res.total;

                        viewModel.fiveGoldPagination.update({
                            totalPages: viewModel.fiveGoldPage.totalPages,
                            totalCount: viewModel.fiveGoldPage.totalCount,
                            pageSize: viewModel.fiveGoldPage.pageSize,
                            currentPage: viewModel.fiveGoldPage.currentPage
                        });
                        viewModel.fiveGold.setSimpleData(res.data, {unSelect: true});
                    }
                });
            },
            setColsRenderType: function () {
                var plateGrid = viewModel.app.getComp('plank').grid;//获取补件gridObj
                var fiveGoldGrid = viewModel.app.getComp('fiveGold').grid;//获取五金gridObj
                var plateMetas = viewModel.plank.getMeta();

                var fiveGoldMetas = viewModel.fiveGold.getMeta();

                var plateFieldKeys = Object.keys(plateMetas).filter(function (v) {
                    return v != 'handleHook' && v != 'picAddressId';
                });
                var fiveGoldFieldKeys = Object.keys(fiveGoldMetas).filter(function (v) {
                    return v != 'handleHook' && v != 'picAddressId';
                });
                plateFieldKeys.forEach(function (field) {
                    plateGrid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var row = viewModel.plank.getRowByRowId(rowId);
                        var rowSimpleData = row.getSimpleData();
                        if (row.canEdit == true) {//判断add
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
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
                fiveGoldFieldKeys.forEach(function (field) {//设置五金rendertype
                    fiveGoldGrid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var row = viewModel.fiveGold.getRowByRowId(rowId);
                        var rowSimpleData = row.getSimpleData();
                        if (row.canEdit == true) {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
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
                })

            },
            plateOnBeforeEditFun: function (obj) {
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.plank.getRowByRowId(rowId);
                if (row.canEdit == true) return true;
            },
            fiveGoldOnBeforeEditFun: function (obj) {
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.fiveGold.getRowByRowId(rowId);
                if (row.canEdit == true) return true;
            }
        };
        $(element).html(html);
        viewModel.event.pageInit();

        viewModel.plank.on('valueChange',function (obj) {
            console.log(obj);
            if(obj.field == "logisticsMode"){
                viewModel.orderNumSearchDialog1 = u.dialog({
                    id: 'logisticsModeDialog',
                    content: "#logisticsModeDialog",
                    hasCloseMenu: true,
                    height: 'auto',
                    width: '90%',
                    closeFun: function () {}
                });
                viewModel.logisticsModeDialogDataTable.setValue('name',obj.newValue);
            }
        });
        viewModel.fiveGold.on('valueChange',function (obj) {
            console.log(obj);
        });


    };
    return {
        'template': html,
        init: init
    }
});
