define(['text!pages/purchaseOrderDetail/purchaseOrderDetail.html', 'css!pages/purchaseOrderDetail/purchaseOrderDetail', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {


        var viewModel = {
            totalPages: '',
            pageSize: 5,
            currentPage: 1,
            totalCount: '',
            policyProductPage: {
                totalPages: '',
                pageSize: 5,
                currentPage: 1,
                totalCount: ''
            },
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
                    viewModel.policyProductSearchCondition.setSimpleData([{}]);
                    // $('#tree2 li').eq(0)[0].click();
                },
                del: function (rowId) {
                    console.log(rowId);
                },
                edit: function (rowId) {
                    console.log(rowId);
                },
                policyProductClick: function () {
                    viewModel.policyProductDialog = u.dialog({
                        id: 'policyProductDialog',
                        content: '#policyProductDialog',
                        hasCloseMenu: true,
                        width: '90%',
                        closeFun: function () {
                            viewModel.policyProductSearchCondition.setSimpleData([{}]);
                            // viewModel.policyProductGrid.setSimpleData([]);


                        }
                    });
                    setTimeout(function () {
                        var rightHeight = $('.dialogRight').height();
                        $('.dialogLeft').height(rightHeight);
                        // $('#tree2 li a').eq(0)[0].click();
                    },1000)
                }
            },
            searchCondition: new u.DataTable({
                meta: {
                    xxx: {}
                }
            }),
            policyProductSearchCondition: new u.DataTable({
                meta: {
                    xxx: {}
                }
            }),

            purchaseOrderDetailGrid: new u.DataTable({
                meta: {
                    xxx: {
                        default: {
                            value: '--default--'
                        }
                    },
                    handelHook: {}
                }
            }),
            policyProductGrid: new u.DataTable({
                meta: {
                    xxx: {}
                }
            }),
            tree: new u.DataTable({
                meta: {
                    'id': {
                        'value': ""
                    },
                    'pid': {
                        'value': ""
                    },
                    'title': {
                        'value': ""
                    }
                }
            }),
            treeSetting: {
                view: {
                    showLine: false,
                    selectedMulti: false,
                    selectedId: '01'
                },
                callback: {
                    onClick: function (e, id, node) {
                        console.log('tree-checked',node);

                    }
                }
            },
            handelHookRender: function (obj) {
                var rowId = obj.row.value['$_#_@_id'];
                var delfun = "data-bind=click:event.del.bind($data," + rowId + ")";
                var editfun = "data-bind=click:event.edit.bind($data," + rowId + ")";
                obj.element.innerHTML = '<div><i style="cursor: pointer;" class="op uf uf-pencil font-size-18" title="修改"' + editfun + '></i>' + '<i style="cursor: pointer;" class="font-size-18 op icon uf uf-del title="删除" ' + delfun + '></i></div>';
                ko.applyBindings(viewModel, obj.element);
            },
            initPagniation: function () {
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
            },
            initPolicyProductPageination: function () {
                var el = document.querySelector("#policyProductPageination");
                viewModel.policyProductPageination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.policyProductPageination.on('pageChange', function (currentPage) {
                    viewModel.policyProductPage.currentPage = currentPage + 1;

                });
                viewModel.policyProductPageination.on('sizeChange', function (pageSize) {
                    viewModel.policyProductPage.pageSize = pageSize;
                    viewModel.policyProductPage.currentPage = 1;
                });
            }
        };
        $(element).html(html);
        viewModel.event.pageInit();


        viewModel.purchaseOrderDetailGrid.setSimpleData([{}]);
        viewModel.policyProductGrid.setSimpleData([{}, {}, {}, {}, {}]);
        var treeData = [
            {id: 'a', pid: 'root', title: 'aaaaa'},
            {id: 'b', pid: 'root', title: 'bbbbb'},
            {id: 'c', pid: 'root', title: 'ccccc'},
            {id: 'd', pid: 'root', title: 'ddddd'}
        ];
        viewModel.tree.setSimpleData(treeData);


    };
    return {
        'template': html,
        init: init
    }
});
