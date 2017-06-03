define(['text!pages/purchaseOrderList/purchaseOrderList.html', 'css!pages/purchaseOrderList/purchaseOrderList', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {


        var viewModel = {
            totalPages: '',
            pageSize: 5,
            currentPage: 1,
            totalCount: '',
            event: {
                func: function () {
                    debugger;
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    viewModel.searchCondition.setSimpleData([{}]);
                },
                detail:function (rowId) {
                    console.log(rowId);
                }
            },
            searchCondition: new u.DataTable({
                meta: {
                    xxx: {}
                }
            }),
            purchaseOrderList:new u.DataTable({
                meta:{
                    xxx:{
                        default:{
                            value:'--default--'
                        }
                    },
                    handelHook:{}
                }
            }),
            handelHookRender:function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var detail = "data-bind=click:event.detail.bind($data," + rowId + ")";
                // obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                obj.element.innerHTML = '<a '+ detail +'>查看详情</a>'
                ko.applyBindings(viewModel, obj.element);
            },
            initPagniation:function () {
                var el = document.querySelector("#pagination1");
                viewModel.pagination1 = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination1.on('pageChange', function (currentPage) {
                    viewModel.currentPage = currentPage + 1;

                });
                viewModel.pagination1.on('sizeChange', function (pageSize) {
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                });
            }
        };
        $(element).html(html);
        viewModel.event.pageInit();






        viewModel.purchaseOrderList.setSimpleData([{}]);





    };
    return {
        'template': html,
        init: init
    }
});
