define(['text!pages/wuliufangshi/wuliufangshi.html', 'css!pages/wuliufangshi/wuliufangshi', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {


        var viewModel = {
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
                add: function () {
                    var simpleData = viewModel.logisticsMethod.getSimpleData();
                    var selectedRowsIndex = viewModel.logisticsMethod.getSelectedIndexs();
                    simpleData.push({code: '', name: '', canEdit: true});
                    viewModel.logisticsMethod.clear();
                    viewModel.logisticsMethod.setSimpleData(simpleData);
                    viewModel.logisticsMethod.setAllRowsUnSelect();
                    viewModel.logisticsMethod.setRowsSelect(selectedRowsIndex);
                },
                update: function () {
                    var simpleData = viewModel.logisticsMethod.getSimpleData();
                    var selectedRowsIndex = viewModel.logisticsMethod.getSelectedIndexs();
                    simpleData.forEach(function (v, i) {
                        if (selectedRowsIndex.includes(i)) v.canEdit = true;
                        else v.canEdit = false;
                    });
                    viewModel.logisticsMethod.clear();
                    viewModel.logisticsMethod.setSimpleData(simpleData);
                    viewModel.logisticsMethod.setAllRowsUnSelect();
                    viewModel.logisticsMethod.setRowsSelect(selectedRowsIndex);
                },
                del: function () {

                },
                save: function () {

                }
            },
            logisticsMethod: new u.DataTable({
                meta: {
                    code: {},
                    name: {}
                }
            }),
            onBeforeEditFun: function (obj) {
                return obj.rowObj.value.canEdit
            },
            codeRender: function (obj) {
                if (obj.value) {
                    obj.element.innerHTML = obj.value;
                } else {
                    obj.element.innerHTML = '请输入编码。。。';
                }
                if (obj.row.value.canEdit) {
                    $(obj.element).css('border', '1px solid red');
                }


            },
            nameRender: function (obj) {
                if (obj.value) {
                    obj.element.innerHTML = obj.value;
                } else {
                    obj.element.innerHTML = '请输入编码。。。';
                }
                if (obj.row.value.canEdit) {
                    $(obj.element).css('border', '1px solid red');
                }
            },
            onValueChange: function (obj) {
                //判断输入的值是否重复
                var simpleData = viewModel.logisticsMethod.getSimpleData();
                var codeValueArr = simpleData.map(function (v) {
                    return v.code;
                });
                if (obj.newValue != obj.oldValue) {
                    codeValueArr[obj.rowIndex] = obj.oldValue;
                    if (codeValueArr.includes(obj.newValue)) {
                        viewModel.logisticsMethod.getRow(obj.rowIndex).setValue(obj.field, obj.oldValue);

                        var rightInfo = '<i class="uf uf-exc-t-o margin-r-5"></i>输入编码重复!!!';
                        u.showMessage({msg: rightInfo, position: "topright", width: '200px', top: '200px'})
                    }
                }
            }
        };
        $(element).html(html);
        viewModel.event.pageInit();
        viewModel.logisticsMethod.setSimpleData([
            {code: 'QY0000000000000111', name: '发办事处', canEdit: false},
            {code: 'QY0000000000000112', name: '发经销商', canEdit: false},
            {code: 'QY0000000000000113', name: '发消费者', canEdit: false}
        ]);
        viewModel.logisticsMethod.setAllRowsUnSelect();
        var referDOM = document.getElementById('delete');
        u.on(referDOM, 'click', function () {
            var selectedData = viewModel.logisticsMethod.getSimpleData({type: 'select'});
            var strDOM = selectedData.map(function (v, i) {
                var str = '<div>' + v.code + '----' + v.name + '</div>'
                return str;
            }).join('');
            if (selectedData.length > 0) {
                u.refer({
                    // 模式 弹出层
                    isPOPMode: true,
                    // 弹出层id
                    contentId: 'testitemid_ref',
                    // 设定参照层标题
                    title: '测试项目',
                    // 设置而参照层高度
                    height: '300px',
                    // 设置参照层内容
                    module: {
                        template: strDOM
                    },
                    // 点击确认后回调事件
                    onOk: function () {
                        var selectedIndex = viewModel.logisticsMethod.getSelectedIndexs();
                        var simpleData = viewModel.logisticsMethod.getSimpleData();
                        var newSimpleData = simpleData.filter(function (v, i) {
                            return !selectedIndex.includes(i);
                        });
                        viewModel.logisticsMethod.clear();
                        viewModel.logisticsMethod.setSimpleData(newSimpleData);
                        viewModel.logisticsMethod.setAllRowsUnSelect();
                    },
                    // 点击取消后回调事件
                    onCancel: function () {
                        alert('cancel');
                    }
                })
            }

        });
        var save = document.querySelector("#save");
        var rightInfo = '<i class="uf uf-correct margin-r-20"></i>保存成功  !!';
        u.on(save, 'click', function () {
            u.showMessage({msg: rightInfo, position: "topright", width: "200px"})
        });


    };
    return {
        'template': html,
        init: init
    }
});
