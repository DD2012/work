define(['text!pages/cardtable/cardtable.html', 'css!pages/cardtable/cardtable', 'pages/cardtable/cardtablemeta', 'uuigrid'], function (html) {
    var init = function (element) {
        var listUrl = ctx + '/cardtable/list';
        var viewModel = {
            //定义操作列的内容 begin
            optFun: function(obj) {
                console.log(obj.gridObj.getDataTableRowIdByRow(obj.row),obj);
                // alert('rowIndex',obj.rowIndex);
                var delfun = "data-bind=click:event.delClick.bind($data," + (obj.gridObj.getDataTableRowIdByRow(obj.row)) + ")";
                var editfun = "data-bind=click:event.editClick.bind($data," + (obj.gridObj.getDataTableRowIdByRow(obj.row)) + ")";
                obj.element.innerHTML = '<div><i class="op uf uf-pencil" title="修改"' + editfun + '></i>' + '<i class=" op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            //定义操作列的内容 end
            app: {},
            draw: 1,//当前页面index
            totlePage: 0,
            pageSize: 5,
            totleCount: 0,
            //dt1对应的就是上面html中的u-meta的data中的dt1
            dt1: new u.DataTable(metaCardTable),
            //dtnew属性代码 begin
            dtnew: new u.DataTable(metaCardTable),//新增时候的DataTable
            //dtnew属性代码 end
            radiodatacontroller: [{
                value: 'Y',
                name: '是'
            }, {
                value: 'N',
                name: '否'
            }],
            radiodataassociate: [{
                value: 'Y',
                name: '是'
            }, {
                value: 'N',
                name: '否'
            }],
            combodatamodel: [{
                name: '信任',
                value: 'Y'
            }, {
                name: '不信任',
                value: 'N'
            }],
            event: {
                //点击事件 begin
                editClick: function(index) {
                    console.log('index',index)
                    console.log(this.dt1.getRowByRowId(index))
                    viewModel.index = index;
                    $('#editPage').find('.u-msg-title').html("编辑");
                    viewModel.event.clearDt(viewModel.dtnew);
                    var row = viewModel.dt1.getSelectedRows()[0];
                    viewModel.dtnew.setSimpleData(viewModel.dt1.getRowByRowId(index).getSimpleData());
                    $('#code').attr("readonly", "readonly");
                    window.md = u.dialog({
                        id: 'editDialog',
                        content: '#editPage',
                        hasCloseMenu: true
                    });
                },
                delClick: function(index) {
                    var row = viewModel.dt1.getSelectedRows()[0];
                    var data = viewModel.dt1.getRowByRowId(index).getSimpleData()
                    u.confirmDialog({
                        msg: "是否删除" + data.name + "?",
                        title: "删除确认",
                        onOk: function() {
                            viewModel.dt1.removeRowByRowId(index);
                        },
                        onCancel: function() {}
                    });
                },
                //点击事件 end
                //点击事件代码 begin
                saveOkClick: function() {
                    var index = viewModel.index;
                    var data = viewModel.dtnew.getSimpleData()[viewModel.dtnew.getSelectedIndexs()];
                    if (!viewModel.app.compsValidate($('#editPage')[0])) {
                        return;
                    }
                    //如果是readonly就是编辑，否则就是新增
                    if($('#code').attr("readonly")=="readonly"){
                        viewModel.dt1.getRowByRowId(index).setSimpleData(data)
                    }else {
                        viewModel.dt1.addSimpleData(data);
                    }
                    md.close();
                },
                saveCancelClick: function(e) {
                    md.close();
                },
                //点击事件代码 end
                //清除datatable数据
                //addClick代码 begin
                addClick: function() {
                    $('#editPage').find('.u-msg-title').html("新增");
                    viewModel.event.clearDt(viewModel.dtnew);
                    var newr = viewModel.dtnew.createEmptyRow();
                    newr.setValue("radiodatacontroller", "Y");
                    newr.setValue("radiodataassociate", "Y");
                    viewModel.dtnew.setRowSelect(newr);
                    $('#code').removeAttr("readOnly");
                    window.md = u.dialog({
                        id: 'addDialog',
                        content: '#editPage',
                        hasCloseMenu: true
                    });
                    $('#addDialog').css('width', '70%');
                },
                //addClick代码 end
                clearDt: function (dt) {
                    dt.removeAllRows();
                    dt.clear();
                },
                // 卡片表数据读取
                initCardTableList: function () {
                    var jsonData = {
                        pageIndex: viewModel.draw - 1,
                        pageSize: viewModel.pageSize,
                        sortField: "createtime",
                        sortDirection: "asc"
                    };
                    $.ajax({
                        type: 'get',
                        url: listUrl,
                        dataType: 'json',
                        data: jsonData,
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    if (res.detailMsg.data) {
                                        if (jsonData.pageSize == 5 && jsonData.pageIndex == 1) {
                                            res.detailMsg.data.content.splice(0, 5);
                                        } else if (jsonData.pageSize == 5) {
                                            res.detailMsg.data.content.splice(5, 3);
                                        }
                                        viewModel.totleCount = res.detailMsg.data.totalElements;
                                        viewModel.totlePage = res.detailMsg.data.totalPages;
                                        //更新分页信息
                                        viewModel.event.comps.update({
                                            totalPages: viewModel.totlePage,
                                            pageSize: viewModel.pageSize,
                                            currentPage: viewModel.draw,
                                            totalCount: viewModel.totleCount
                                        });
                                        viewModel.dt1.removeAllRows();
                                        viewModel.dt1.clear();
                                        viewModel.dt1.setSimpleData(res.detailMsg.data.content, {
                                            unSelect: true
                                        });
                                    }
                                } else {
                                    var msg = "";
                                    if (res.success == 'fail_global') {
                                        msg = res.message;
                                    } else {
                                        for (var key in res.detailMsg) {
                                            msg += res.detailMsg[key] + "<br/>";
                                        }
                                    }
                                    u.messageDialog({
                                        msg: msg,
                                        title: '请求错误',
                                        btnText: '确定'
                                    });
                                }
                            } else {
                                u.messageDialog({
                                    msg: '后台返回数据格式有误，请联系管理员',
                                    title: '数据错误',
                                    btnText: '确定'
                                });
                            }
                        },
                        error: function (er) {
                            u.messageDialog({
                                msg: '请求超时',
                                title: '请求错误',
                                btnText: '确定'
                            });
                        }
                    });
                },
                //分页相关
                pageChange: function () {
                    viewModel.event.comps.on('pageChange', function (pageIndex) {
                        viewModel.draw = pageIndex + 1;
                        viewModel.event.initCardTableList();
                    });
                },
                sizeChange: function () {
                    viewModel.event.comps.on('sizeChange', function (arg) {
                        viewModel.pageSize = parseInt(arg);
                        viewModel.draw = 1;
                        viewModel.event.initCardTableList();
                    });
                },
                //页面初始化
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    //找到分页的节点
                    var paginationDiv = $(element).find('#pagination')[0];
                    //初始化分页页面，在获取到页面的具体的数据时候还会去更新分页信息
                    this.comps = new u.pagination({
                        el: paginationDiv,
                        jumppage: true
                    });
                    this.initCardTableList();
                    viewModel.event.pageChange();
                    viewModel.event.sizeChange();
                }
            }
        }
        $(element).html(html);
        viewModel.event.pageInit();
    }
    return {
        'template': html,
        init: init
    }
});
