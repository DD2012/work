define(['text!pages/test/test.html','exports', 'css!pages/test/test', 'uui', 'uuigrid', 'bootstrap', 'uuitree', './datatables.js'], function (html) {
    console.log(evnets);
    var init = function (element) {
        var viewModel = {

            onBeforeEditFun: function (obj) {
                console.log('====onBeforeEditFun===');
                var allRows = obj.gridObj.dataTable.getSimpleData();
                // if((allRows.length-1) == obj.rowIndex) return true;
                //     else  return false;
                var selectIndexs = viewModel.table.getSelectedIndexs();
                if (selectIndexs.includes(obj.rowIndex))return true;
                else return false;
            },
            onBeforeRowSelected: function () {
                if (event.target.innerText == '')
                    return true;
                else return false;
            },
            onBeforeRowUnSelected: function () {
                console.log(event.target.nodeName)
                if (event.target.nodeName == 'SPAN') return true
                else return false;
                // return false;
            },
            comb1: [{name: '选项一', value: '1'}, {name: '选项二', value: '2'}],
            comboRenderFun: function (obj) {


            },
            isClick: ko.observable(false),
            click1: function () {
                this.isClick(!this.isClick());
                var x = tableSimpleData.slice(0, 2);
                viewModel.table1.setSimpleData(x);
                viewModel.table1.setAllRowsUnSelect();
                var span = $('#dialog1 .head span');
                span.eq(0).css('background', 'white');
                span.eq(1).css('background', 'rgba(255,0,0,0.4)');
            },
            click2: function () {
                var x = tableSimpleData.slice(0, 4);
                viewModel.table1.setSimpleData(x);
                viewModel.table1.setAllRowsUnSelect();
                var span = $('#dialog1 .head span');
                span.eq(0).css('background', 'rgba(255,0,0,0.4)');
                span.eq(1).css('background', 'white');
            },
            save: function () {
                viewModel.dialog.close();
            },
            search: new u.DataTable(searchMeta),
            table: new u.DataTable(tableMeta),
            table1: new u.DataTable(table1Meta),
            comboData1: [{name: '选项一', value: '1'}, {name: '选项二', value: '2'}, {name: '选项三', value: '3'}],





            event: {
                func: function (x) {
                    console.log(evnets);
                },
                func1: function () {
                    u.dialog({
                        id: 'test1',
                        content: '#dialog2'
                    });
                },
                afterCreate: function () {
                    // console.log(x)

                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                }
            },










            render1: function (obj) {
                obj.element.innerHTML = obj.rowIndex + 1;
            },
            caozuo: function (obj) {
                // obj.element.innerHTML = '<a style="color:blue;text-decoration: underline;cursor: pointer;" data-bind=click:event.func.bind($data,'+ obj.rowIndex +')>查看明细</a>'
                // ko.applyBindings(viewModel,obj.element)
                // console.log(obj);
                obj.element.innerHTML = '<input type="text" />'
                if (obj.rowIndex > 2) {
                    obj.element.style.border = '3px solid red';
                    $(obj.element).find('input').css('background','blue')
                }

            }
        };


        $(element).html(html);
        viewModel.event.pageInit();


        viewModel.table.setSimpleData(tableSimpleData);
        viewModel.app.getComp('grid').grid.setAllRowUnSelect()







    };
    return {
        'template': html,
        init: init
    }
});
