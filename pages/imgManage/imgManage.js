define(['text!pages/imgManage/imgManage.html', 'css!pages/imgManage/imgManage', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/imgManage/imgManage';


        var viewModel = {
            app: {},
            totalPages: '',
            pageSize: 5,
            currentPage: 1,
            totalCount: '',
            willFetchBeforeAdd: true,
            hasNotFetchYet: true,
            suiteNameSearch: ko.observable(),
            event: {
                func: function () {
                    console.log('test');
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
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
                    if (viewModel.hasNotFetchYet) {//还没有获取数据
                        var allRows = viewModel.imgManage.getAllRows();
                        if (allRows.length > 0) {
                            var lastRowSimpleData = allRows.filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).slice(-1)[0];
                            var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                return lastRowSimpleData[key];
                            });
                            if (shouldAdd || true) {
                                var row = new Row({parent: viewModel.imgManage});
                                row.myStatus = 'canEdit';
                                viewModel.imgManage.addRow(row);
                                viewModel.willFetchBeforeAdd = false;
                                viewModel.setCanEditRenderType();
                            }
                        } else {
                            var row = new Row({parent: viewModel.imgManage});
                            row.myStatus = 'canEdit';
                            viewModel.imgManage.addRow(row);
                            viewModel.willFetchBeforeAdd = false;
                            viewModel.setCanEditRenderType();
                        }
                    } else {//已经获取了数据
                        if (viewModel.willFetchBeforeAdd) {//重新获取数据，跳转到最后一页
                            viewModel.currentPage = viewModel.totalPages;
                            viewModel.event.fetchData()
                                    .done(function () {
                                        var allRows = viewModel.imgManage.getAllRows();
                                        if (allRows.length > 0) {
                                            var lastRowSimpleData = allRows.filter(function (row) {
                                                return row.status != 'fdel';
                                            }).map(function (row) {
                                                return row.getSimpleData();
                                            }).slice(-1)[0];
                                            var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                                return lastRowSimpleData[key];
                                            });
                                            if (shouldAdd || true) {
                                                var row = new Row({parent: viewModel.imgManage});
                                                row.myStatus = 'canEdit';
                                                viewModel.imgManage.addRow(row);
                                                viewModel.willFetchBeforeAdd = false;
                                                viewModel.setCanEditRenderType();
                                            }
                                        }
                                    });
                        } else {//已经在最后一页，不需要再重新获取数据
                            var allRows = viewModel.imgManage.getAllRows();
                            if (allRows.length > 0) {
                                var lastRowSimpleData = allRows.filter(function (row) {
                                    return row.status != 'fdel';
                                }).map(function (row) {
                                    return row.getSimpleData();
                                }).slice(-1)[0];
                                var shouldAdd = Object.keys(lastRowSimpleData).every(function (key) {
                                    return lastRowSimpleData[key];
                                });
                                if (shouldAdd || true) {//暂时不对数据做空校验
                                    var row = new Row({parent: viewModel.imgManage});
                                    row.myStatus = 'canEdit';
                                    viewModel.imgManage.addRow(row);
                                    viewModel.willFetchBeforeAdd = false;
                                    viewModel.setCanEditRenderType();

                                }
                            }
                        }
                    }

                },
                del: function (rowId) {
                    var id = viewModel.imgManage.getRowByRowId(rowId).getSimpleData().id;
                    var params = [{id: id}];
                    var index = viewModel.imgManage.getIndexByRowId(rowId);
                    if (params[0].id) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.imgManage.removeRow(index);
                                console.log(params);
                            }
                        });
                    } else {
                        viewModel.imgManage.removeRow(index);
                    }
                },
                edit:function (rowId) {
                    var row = viewModel.imgManage.getRowByRowId(rowId);
                    row.myStatus = 'canEdit';
                    viewModel.setCanEditRenderType();
                },
                mutipleDel: function () {
                    var selectedIndexs = viewModel.imgManage.getSelectedIndexs();
                    var params = viewModel.imgManage.getSelectedRows()
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
                            viewModel.imgManage.removeRows(selectedIndexs);
                        })
                    } else {
                        viewModel.imgManage.removeRows(selectedIndexs);
                    }

                },
                save: function () {
                    var params = viewModel.imgManage.getAllRows()
                            .filter(function (row) {
                                return row.status != 'fdel';
                            }).map(function (row) {
                                return row.getSimpleData();
                            }).filter(function (v) {
                                var keys = Object.keys(viewModel.imgManage.getMeta());
                                return keys.every(function (key) {
                                    return v[key] || true;//暂时对数据不做空校验
                                });
                            });
                    if (params.length > 0) {
                        $.ajax({
                            data: params,
                            type: 'get',
                            url: url,
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8'
                        }).done(function (res) {
                            if (res.result == 1) {
                                viewModel.imgManage.setSimpleData(res.data, {unSelect: true});
                                console.log(params);
                            }
                        });
                    }

                },
                paginationInit: function () {
                    $('.pagination1Hook').show();
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
                    var params = {
                        suiteCode: viewModel.suiteNameSearch(),
                        currentPage: viewModel.currentPage,
                        pageSize: viewModel.pageSize
                    };
                    var deffered = $.ajax({
                        data: params,
                        type: 'get',
                        url: url,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {
                        viewModel.currentPage = res.pageIndex;
                        viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.pageSize = res.pageSize;
                        viewModel.totalCount = res.total;

                        var simpleData = res.data;
                        viewModel.imgManage.removeAllRows();
                        viewModel.imgManage.setSimpleData(simpleData, {unSelect: true});

                        viewModel.pagination1Comp.update({
                            totalPages: viewModel.totalPages || 5,
                            totalCount: viewModel.totalCount,
                            pageSize: viewModel.pageSize,
                            currentPage: viewModel.currentPage

                        });
                    });
                    return deffered;
                },
                uploadImgDialog: function (suiteCode) {
                    viewModel.willUploadImgSuiteCode = suiteCode;
                    console.log(suiteCode);
                    viewModel.upLoadImgDialog = u.dialog({
                        id: 'upLoadImgContent',
                        content: "#upLoadImg",
                        hasCloseMenu: true,
                        width: '300px',
                        height: '100px',
                        closeFun: function () {

                        }
                    });

                },
                lookImg: function (picPath) {
                    console.log(picPath);
                    viewModel.imgDialog = u.dialog({
                        id: 'lookImgContent',
                        content: "#lookImg",
                        hasCloseMenu: true,
                        width: '400px',
                        height: '400px',
                        closeFun: function () {
                            $('#lookImg img').attr('src', '')
                        }
                    });
                    $('#lookImg img').attr('src', picPath)
                },
                upLoadImg: function () {
                    var params = {
                        suiteCode: viewModel.willUploadImgSuiteCode,
                        file: "#upLoadImgInput"
                    };
                    $.ajax({
                        data: params,
                        type: 'get',
                        url: url,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }).done(function (res) {
                        if (res.result == 1) {
                            viewModel.upLoadImgDialog.close()
                        }
                    });

                },
                cancelUpLoadImg: function () {
                    viewModel.upLoadImgDialog.close();
                }
            },
            imgManage: new u.DataTable({
                meta: {
                    suiteCode: {},
                    suiteName: {},
                    productType: {},
                    seriesName: {},
                    picPath: {},
                    fileName: {},
                    handleHook: {
                        default: {
                            value: 'haha'
                        }
                    }
                }
            }),
            handleHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            uploadImgRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var suiteCode = obj.row.value.suiteCode;
                var uploadFun = "data-bind=click:event.uploadImgDialog.bind($data,'" + suiteCode + "')";
                obj.element.innerHTML = '<div> <i style="cursor: pointer;" class="font-size-24 uf uf-upload title="上传图片" ' + uploadFun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            picPathRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var picPath = obj.row.value.picPath;
                var uploadFun = "data-bind=click:event.lookImg.bind($data,'" + picPath + "')";
                obj.element.innerHTML = '<div> <i style="cursor: pointer;" class="font-size-18 title="上传图片" ' + uploadFun + '>查看图片</i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            onBeforeEditFun: function (obj) {
                var canEditColIndexs = [0, 1, 2, 3];
                var rowId = obj.rowObj.value['$_#_@_id'];
                var row = viewModel.imgManage.getRowByRowId(rowId);
                return row.myStatus == 'canEdit' && (canEditColIndexs.indexOf(obj.colIndex) != -1);
            },
            setCanEditRenderType: function () {
                var grid = viewModel.app.getComp('imgManage').grid;
                function func(field) {
                    grid.setRenderType(field, function (obj) {
                        var rowId = obj.row.value['$_#_@_id'];
                        var myStatus = viewModel.imgManage.getRowByRowId(rowId).myStatus;
                        if (myStatus == 'canEdit') {
                            obj.element.innerHTML = obj.value;
                            obj.element.style.boxSizing = 'border-box';
                            obj.element.style.border = '1px solid';
                        } else {
                            obj.element.innerHTML = obj.value;
                        }
                    });
                }
                var arr = ['suiteCode', 'suiteName', 'productType', 'seriesName'];
                arr.forEach(function (field) {
                    func(field)
                })
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





























