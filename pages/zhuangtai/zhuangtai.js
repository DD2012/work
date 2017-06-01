define(['text!pages/zhuangtai/zhuangtai.html', 'css!pages/zhuangtai/zhuangtai', 'uui','uuigrid', 'bootstrap'], function(html) {
    var init = function(element) {


        var viewModel = {
            event:{
                pageInit:function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                },
                func:function () {
                    console.log('click-test');
                },
                search:function () {
                    if($('#gridTest1').css('display') == 'none'){
                        $('#gridTest1').css('display','block');
                    }
                    $.ajax({
                        type: 'get',
                        url: window.ctx + '/zhuangtai/table1',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        success:function (data) {
                            viewModel.table1.removeAllRows();
                            viewModel.table1.setSimpleData(data);
                            viewModel.table1.setAllRowsUnSelect();
                        }
                    });
                    $.ajax({
                        type: 'get',
                        url: window.ctx + '/zhuangtai/table2',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        success:function (data) {
                            // viewModel.table2.removeAllRows();
                            // viewModel.table2.setSimpleData(data);
                            // viewModel.table2.setAllRowsUnSelect();
                        }
                    })
                },
                edit:function () {
                    //让table1 可修改
                    var simpleData1 = this.table1.getSimpleData();
                    var selectdRowsArr = this.table1.getSelectedIndexs();
                    if(simpleData1){
                        simpleData1.forEach(function (v,i) {
                            if(selectdRowsArr.includes(i)) v.canEdit = true;
                                else v.canEdit = false;
                        });
                    }

                    this.table1.setSimpleData(simpleData1);
                    this.table1.setAllRowsUnSelect();
                    this.table1.setRowsSelect(selectdRowsArr);
                    //让table2 可修改
                    var simpleData2 = this.table2.getSimpleData();
                    var selectdRowsArr2 = this.table2.getSelectedIndexs();
                    if(simpleData2){
                        simpleData2.forEach(function (v,i) {
                            if(selectdRowsArr2.includes(i)) v.canEdit = true;
                            else v.canEdit = false;
                        });
                        this.table2.setSimpleData(simpleData2);
                        this.table2.setAllRowsUnSelect();
                        this.table2.setRowsSelect(selectdRowsArr2);
                    }
                },
                add:function () {
                    if($('#gridTest2').css('display') == 'none'){
                        $('#gridTest2').css('display','block');
                    }
                    var simpleData2 = this.table2.getSimpleData();
                    var selectdRowsArr2 = this.table2.getSelectedIndexs();
                    if(simpleData2){
                        simpleData2.push({"mingcheng":"", "zhouqi":"", "canEdit":true});
                        this.table2.setSimpleData(simpleData2);
                        this.table2.setAllRowsUnSelect();
                        this.table2.setRowsSelect(selectdRowsArr2);
                    }else {
                        this.table2.setSimpleData([{"mingcheng":"", "zhouqi":"", "canEdit":true}])
                        this.table2.setAllRowsUnSelect();
                        this.table2.setRowsSelect(selectdRowsArr2);
                    }
                },
                del:function () {
                    //删除表一
                    var simpleData1 = this.table1.getSimpleData();
                    var selectdRowsArr1 = this.table1.getSelectedIndexs();
                    if(simpleData1){
                        var newSimpleData1 = simpleData1.filter(function (v,i) {
                            return !selectdRowsArr1.includes(i);
                        });
                        this.table1.setSimpleData(newSimpleData1);
                        this.table1.setAllRowsUnSelect();
                    }
                    //删除表二
                    var simpleData2 = this.table2.getSimpleData();
                    var selectdRowsArr2 = this.table2.getSelectedIndexs();
                    if(simpleData2){
                        var newSimpleData2 = simpleData2.filter(function (v,i) {
                            return !selectdRowsArr2.includes(i);
                        });
                        this.table2.setSimpleData(newSimpleData2);
                        this.table2.setAllRowsUnSelect();
                    }
                }

            },
            table1:new u.DataTable({
                meta:{
                    mingcheng:{},
                    zhouqi:{
                        required:true,
                        nullMsg:'不能为空!',
                        errorMsg:'输入错误'
                    }
                }
            }),
            table2:new u.DataTable({
                meta:{
                    mingcheng:{},
                    zhouqi:{}
                }
            }),
            onBeforeEditFun1:function (obj) {
                if(obj.colIndex > 1 && obj.rowObj.value.canEdit){
                    return true
                }

            },
            onBeforeEditFun2:function (obj) {
                if(obj.colIndex > 0 && obj.rowObj.value.canEdit){
                    return true
                }
            },
            xuhaoRender1:function (obj) {
                obj.element.innerHTML = obj.rowIndex;
            },
            xuhaoRender2:function (obj) {
                obj.element.innerHTML = obj.rowIndex;
            },
            renderType1:function (obj) {
                var maxLen = viewModel.table2.getSimpleData().length - 1;
                if(obj.rowIndex == maxLen && !obj.row.value.mingcheng){
                    obj.element.innerHTML = '请输入名称...'
                }else {
                    obj.element.innerHTML = obj.value;
                }
                if(obj.row.value.canEdit){
                    obj.element.style.border = '1px solid red';
                }
            },
            renderType2:function (obj) {
                var maxLen = viewModel.table2.getSimpleData().length - 1;
                if(obj.rowIndex == maxLen && !obj.row.value.zhouqi){
                    obj.element.innerHTML = '请输入周期...'
                }else {
                    obj.element.innerHTML = obj.value;
                }
                if(obj.row.value.canEdit){
                    obj.element.style.border = '1px solid red';
                }
            },
            table1Render:function (obj) {
                obj.element.innerHTML = obj.value;
                if(obj.row.value.canEdit){
                    obj.element.style.border = '1px solid red';
                }
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
