define(['text!pages/unusualWaring/unusualWaring.html', 'css!pages/unusualWaring/unusualWaring', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {
        var url = ctx + '/unusualWaring/unusualWaring';


        var viewModel = {
            app: {},
            totalPages: '',
            pageSize: 5,
            currentPage: 2,
            totalCount: '',
            event: {
                func: function () {
                    debugger;
                    // $.ajax({
                    //     type: 'get',
                    //     url: url,
                    //     dataType: 'json',
                    //     contentType: 'application/json;charset=utf-8'
                    // }).done(function (res) {
                    //     console.log(res);
                    // })
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                    viewModel.initPagination();
                    viewModel.fetchData();
                }
            },
            unusualWaringGrid: new u.DataTable({
                meta: {
                    combo: {
                        default: {
                            value: '1'
                        }
                    },
                    pbillCode: {},
                    pbillTime: {},
                    productName: {},
                    seriesName: {},
                    partsCode: {},
                    pbillName: {},
                    pbillType: {},
                    num: {},
                    unit: {},
                    quAppraisal: {},
                    currentState: {},
                    stayTime: {},
                    handle: {},
                    reportModel: {}
                }
            }),
            initPagination: function () {
                var el = document.querySelector("#pagination");
                viewModel.pagination = new u.pagination({
                    el: el,
                    showState: true,
                    jumppage: true
                });
                viewModel.pagination.on('pageChange', function (currentPage) {
                    viewModel.currentPage = currentPage + 1;
                    viewModel.fetchData();

                });
                viewModel.pagination.on('sizeChange', function (pageSize) {
                    viewModel.pageSize = pageSize;
                    viewModel.currentPage = 1;
                    viewModel.fetchData();
                });
            },
            myBooleanRender: function (obj) {

                var grid = obj.gridObj;
                var datatable = grid.dataTable;
                var rowId = obj.row.value['$_#_@_id'];
                var row = datatable.getRowByRowId(rowId);
                var checkStr = '',
                        disableStr = '';

                if (obj.value == '2' || obj.value == 'true') {
                    checkStr = 'is-checked';
                }
                if (grid.options.editType == 'form') {
                    disableStr = 'is-disabled';
                }
                var htmlStr = '<label class="u-checkbox is-upgraded ' + checkStr + disableStr + '">' + '<input type="checkbox" class="u-checkbox-input">' + '<span class="u-checkbox-label"></span>' + '<span class="u-checkbox-focus-helper"></span><span class="u-checkbox-outline"><span class="u-checkbox-tick-outline"></span></span>' + '</label>';

                obj.element.innerHTML = htmlStr;

                $(obj.element).find('input').on('click', function (e) {
                    $(this).parent().toggleClass('is-checked');
                    if (!obj.gridObj.options.editable) {
                        (0, _event.stopEvent)(e);
                        return false;
                    }
                    if ($(this).parent().hasClass('is-checked')) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                    var value = this.checked ? "2" : "1";
                    var column = obj.gridCompColumn;
                    var field = column.options.field;
                    row.setValue(field, value);
                });

                // 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
                if (typeof afterRType == 'function') {
                    afterRType.call(this, obj);
                }


            },
            fetchData: function () {
                $.ajax({
                    type: 'get',
                    url: url,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }).done(function (res) {

                    if (res.result == 1) {
                        viewModel.currentPage = res.pageIndex;
                        viewModel.totalPages = Math.ceil(res.total / res.pageSize);
                        viewModel.pageSize = res.pageSize;
                        viewModel.totalCount = res.total;


                        new Array(500).fill(1).forEach(function () {
                            res.data.push(res.data[0]);
                        });
                        viewModel.data = res.data;
                        viewModel.count = 0;
                        $(document).scroll(function () {
                            var scrollTop = $(this).scrollTop();
                            if (scrollTop % 200 < 150) {
                                ++viewModel.count;
                                var data = res.data.slice(viewModel.count * 50, viewModel.count * 50 + 50);
                                if (data.length > 0) {
                                    viewModel.unusualWaringGrid.addSimpleData(data, {unSelect: true});
                                    console.log(data);
                                }


                            }
                        });

                        var data = res.data.slice(viewModel.count * 20, viewModel.count * 20 + 20);

                        viewModel.unusualWaringGrid.setSimpleData(data, {unSelect: true});

                        viewModel.pagination.update({
                            totalPages: viewModel.totalPages || 6,
                            pageSize: viewModel.pageSize || 2,
                            currentPage: viewModel.currentPage,
                            totalCount: viewModel.totalCount
                        });
                    }
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
