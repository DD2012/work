define(['text!pages/BillCustomDeclare/BillCustomDeclare.html', 'css!pages/BillCustomDeclare/BillCustomDeclare', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/BillCustomDeclare/BillCustomDeclareDropDown';
        var viewModel = {
            app: {},
            event: {
                func: function () {
                    debugger;

                },
                pageInit: function () {
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        url: url,
                        data: 'jsonData'
                    }).done(function (res) {
                        if(res.result == 1){
                            viewModel.pbillType = res.data.pbillType;
                            viewModel.pbillReason = res.data.pbillReason;
                            viewModel.logisticsMode = res.data.logisticsMode;
                            viewModel.app = u.createApp({
                                el: element,
                                model: viewModel
                            });
                        }
                    });

                },//板件表事件
                plankDel:function (rowId) {
                    console.log(rowId);
                },
                plankEdit:function (rowId) {
                    console.log(rowId);
                },
                plankAdd:function () {

                },
                plankMutipleDel:function () {

                },
                plankSave:function () {

                },
                plankCommit:function () {

                },//五金事件
                fiveGoldDel:function (rowId) {
                    console.log(rowId);
                },
                fiveGoldEdit:function (rowId) {
                    console.log(rowId);
                },
                fiveGoldAdd:function () {

                },
                fiveGoldMutipleDel:function () {

                },
                fiveGoldSave:function () {

                },
                fiveGoldCommit:function () {

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
                    count: {},
                    unit: {},
                    area: {},
                    thinEdge: {},
                    thickBand: {},
                    pbillReason: {},
                    picAddress: {},
                    logisticsMode: {},
                    address: {},
                    remark: {},
                    reportModel: {},
                    handleHook:{
                        default:{
                            value:'跳过空值判断'
                        }
                    }
                }
            }),
            fiveGold: new u.DataTable({
                meta: {
                    pbillCode: {},
                    pbillType: {},
                    pbillName: {},
                    count: {},
                    unit: {},
                    pbillReason: {},
                    picAddress: {},
                    logisticsMode: {},
                    address: {},
                    remark: {},
                    reportModel: {},
                    handleHook:{
                        default:{
                            value:'跳过空值判断'
                        }
                    }
                }
            }),
            pbillType:[],//补件类型下拉框
            pbillReason:[],//补件原因
            logisticsMode:[],//物流方式
            plankHandleHookRender:function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.plankDel.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.plankEdit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
                
            },
            fiveGoldHandleHookRender:function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.fiveGoldDel.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.fiveGoldEdit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
                
            }
        };
        $(element).html(html);
        viewModel.event.pageInit();

        viewModel.plank.createEmptyRow();
        viewModel.fiveGold.createEmptyRow();

    };
    return {
        'template': html,
        init: init
    }
});
