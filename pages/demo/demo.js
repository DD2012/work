define(['text!pages/demo/demo.html', 'css!pages/demo/demo', 'uui','uuigrid', 'bootstrap', './datatables.js'], function(html) {
    var init = function(element) {


        var viewModel = {
            func:function (x) {
                console.log(11111111,x);
            },
            renderType:function (obj) {
                var simpleData = viewModel.table.getSimpleData();
                var len = simpleData.length - 1;
                if(obj.rowIndex == len){
                    if(obj.value == '') obj.element.innerHTML = '请输入。。。。。。'
                        else obj.element.innerHTML = obj.value;
                }else {
                    obj.element.innerHTML = obj.value;
                }
            },
            onBeforeEditFun:function (obj) {
                console.log(obj);
                if(obj.rowObj.value.canEdit) return true;
                    else return false;
            },
            renderType1:function (obj) {
                // obj.element.innerHTML = obj.value + ' 元 ' + obj.row.value.danwei
                obj.element.innerHTML = '<input type="text" />'
            },
            renderType2:function (obj) {
                obj.element.innerHTML = '<input />' ;
            },
            editType:function (obj) {
                obj.element.innerHTML = '<input value='+ obj.value +' />'
            },
            event:{
                pageInit:function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                },
                xiugai:function () {
                    var checkedArr = viewModel.table.getSelectedIndexs();
                    var simpleData = viewModel.table.getSimpleData();
                    simpleData.forEach(function (v,i) {
                        if(checkedArr.includes(i)){
                            v.canEdit = true;
                        }
                    });
                    viewModel.table.setSimpleData(simpleData);
                    viewModel.table.setRowsSelect(checkedArr);
                },
                addOneRow:function () {
                    var checkedArr = viewModel.table.getSelectedIndexs();
                    var simpleData = viewModel.table.getSimpleData();
                    simpleData.push({
                        xinhao:'',
                        mingchen:'',
                        danwei:'',
                        jiage:'',
                        canEdit:true
                    });
                    viewModel.table.setSimpleData(simpleData);
                    viewModel.table.setRowsSelect(checkedArr);
                },
                delete:function () {
                    var checkedArr = viewModel.table.getSelectedIndexs();
                    var simpleData = viewModel.table.getSimpleData();
                    var newSimpleData = simpleData.filter(function (v,i) {
                        if(checkedArr.includes(i)) return false;
                            else return true;
                    })
                    viewModel.table.setSimpleData(newSimpleData);
                    viewModel.table.setAllRowsUnSelect();
                }
            },
            table:new u.DataTable({
                meta:{
                    xinhao:{},
                    mincheng:{},
                    danwei:{},
                    jiage:{}

                }
            })
        };


        viewModel.table.on('valueChange',function (x,y) {
            console.log(1);
            console.log(x,y);
        });















    $(element).html(html);




    viewModel.event.pageInit();


    viewModel.table.setSimpleData(tableData);
    viewModel.table.setAllRowsUnSelect();
    var x = viewModel.app.getComp('grid')
        console.log('=======');
        console.log(x);













    };
    return {
        'template': html,
        init: init
    }
});
