define(['text!pages/purchaseOrder/purchaseOrder.html', 'css!pages/purchaseOrder/purchaseOrder', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
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
                    viewModel.initExpand();
                },
                del:function (rowId) {
                    console.log(rowId);
                },
                edit:function (rowId) {
                    console.log(rowId);
                }
            },
            searchCondition: new u.DataTable({
                meta: {
                    xxx: {}
                }
            }),
            purchaseOrderGrid:new u.DataTable({
                meta:{
                    xxx:{
                        default:{
                            value:'--default--'
                        }
                    },
                    handelHook:{}
                }
            }),
            initExpand:function () {
                $('#condition-toggle').on('click', function () {
                    var isVisible = $('.drop').hasClass('u-not-visible');
                    if (isVisible) {
                        $('.drop').removeClass('u-not-visible').addClass('u-visible');
                        $(this).find('i').removeClass('uf-arrow-down').addClass('uf-arrow-up').end().find('span').html('收起');
                    } else {
                        $('.drop').removeClass('u-visible').addClass('u-not-visible');
                        $(this).find('i').removeClass('uf-arrow-up').addClass('uf-arrow-down').end().find('span').html('展开');
                    }
                });
            },
            handelHookRender:function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
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






        viewModel.purchaseOrderGrid.setSimpleData([{}]);





    };
    return {
        'template': html,
        init: init
    }
});
