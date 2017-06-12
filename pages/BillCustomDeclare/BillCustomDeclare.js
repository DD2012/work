define(['text!pages/BillCustomDeclare/BillCustomDeclare.html', 'css!pages/BillCustomDeclare/BillCustomDeclare', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/BillCustomDeclare/BillCustomDeclareDropDown';


        // 定制补件申报分页 http://192.168.79.88:8080/pbill/billCustomDeclare/list
        //
        //         定制补件申报保存： http://192.168.79.88:8080/pbill/billCustomDeclare/save
        //
        //         补件类别：http://192.168.79.88:8080/pbill/billCategory/list
        //
        //         补件类型：http://192.168.79.88:8080/pbill/billType/list
        //
        //         补件原因: http://192.168.79.88:8080/pbill/billQu/list
        //
        //                 物流方式: http://192.168.79.88:8080/pbill/logistics/ways/list
        //
        //                         上传图片：http://192.168.79.88:8080/pbill/picUpload/save
        //
        //         补件型号: http://192.168.79.88:8080/pbill/parts/list/plate 板件 [{plateCode:"xxxx"}]
        //
        //                 补件型号: http://192.168.79.88:8080/pbill/parts/list/hardWord 五金 [{plateCode:"xxxx"}]
        //



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
                
            },
            plankImgRender:function () {
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
            fiveGoldImgRender:function () {
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
