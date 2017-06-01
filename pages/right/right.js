define(['text!pages/right/right.html', 'css!pages/right/right', 'uui', 'uuigrid', 'bootstrap', 'uuitree'], function (html) {
    var init = function (element) {

        var data1 = {
            "pageIndex": 1,
            "pageSize": 10,
            "rows": [
                {
                    "status": "nrm",
                    "data": {"name": 'jack', "age": '22', "school": "四川大学", "checkbox": false}
                }, {
                    "status": "nrm",
                    "data": {"name": 'jack', "age": '23', "school": '四川大学', "checkbox": true}
                }, {
                    "status": "nrm",
                    "data": {"name": 'jack', "age": '24', "school": '四川大学', "checkbox": true}
                }, {
                    "status": "nrm",
                    "data": {"name": 'jack', "age": '25', "school": '四川大学', "checkbox": true}
                }
            ]
        };


        var viewModel = {
            editFun:function (obj) {
                obj.element.innerHTML = '<input value="'+ obj.value + '"/>'
                // var rowIndex = obj.rowIndex;
                // var simpleData = obj.gridObj.dataTable.getSimpleData();
                // simpleData[rowIndex].name = obj.value

                // console.log(simpleData)
            },
            onBeforeRowSelected:function (x) {
                if(event.target.className.includes('u-checkbox-tick-outline')){
                    return false;
                }else{
                    return true;
                }
            },
            data1: data1,
            dt1: new u.DataTable({
                meta: {
                    name: 'string',
                    age: {type: 'float'},
                    school: 'string'
                }
            }),
            dt2: new u.DataTable({
                meta: {
                    f1: {
                        required: true,
                        default:function () {
                            return 'tttt'
                        }
                    }
                }
            }),
            dt3:new u.DataTable({
                f1:{}
            }),
            dt4:new u.DataTable({
                f1:{}
            }),
            dt5:new u.DataTable({
                f1:{},
                f2:{}
            }),
            dt6:new u.DataTable({
                f1:{},
                f2:{}
            }),
            comboData1:[{name:'a',value:1}],
            comboData2:null,
            comboData3:null,

            event: {
                func: function () {
                    console.log('click')

                },

                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                }
            },
            func: function (x) {
                $('#grid1_content_tbody tr').eq(x.rowIndex).find('td').css('border', '1px solid red');
                $('#grid1_content_tbody tr').eq(x.rowIndex).siblings().find('td').css('border', '1px solid transparent')
                return true;
            },
            func1: function (x) {
                viewModel.app.getComp('grid1').grid.setAllRowUnSelect()
                viewModel.app.getComp('grid1').grid.setAllRowUnSelect()
                $('#grid1_content_tbody tr').find('td').css('border', '1px solid transparent')

            },
            render: function (obj) {
                // var val = obj.gridObj.dataTable.getSimpleData()[obj.rowIndex].name + '**';
                // obj.element.innerHTML = "<div data-bind='click:event.func'>click</div>";
                // obj.element.innerHTML = 'ddddd';

                if(obj.value){
                    obj.element.innerHTML = obj.value;
                }else{
                    obj.element.innerHTML = '请输入。。。。。'
                }
            },
            change1:function () {
                alert(3)
            },
            checkboxData:[{name:'选项一',value:'1'},{name:'选项二',value:'2'},{name:'选项三',value:'3'}]
        };

        var computed = function () {
            this.firstName = ko.observable('hello');
            this.lastName = ko.observable('world');
            this.fullName = ko.computed(function () {
                return this.firstName() + this.lastName()
            }.bind(this))
        };
        var viewModel1 = $.extend(viewModel,new computed());
        console.log('--------------')
        window.x = viewModel1





        $.ajax({
            type: 'get',
            url: (ctx + '/cardtable/map'),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                viewModel.res = res;
                var shen = res.reduce(function (acc,value,index) {
                    var obj = {};
                    obj.name = value.region.name;
                    obj.value = value.region.code;
                    acc.push(obj);
                    return acc;
                },[]);
                combo1['u.Combo'].emptyValue();
                combo2['u.Combo'].emptyValue();
                combo3['u.Combo'].emptyValue();
                combo1['u.Combo'].setComboData(shen)
            }
        });
        viewModel.dt3.on('valueChange',function () {
            console.log('change');
            var res = viewModel.res;
            var shen = viewModel.dt3.getValue('f1');
            var shi = res.reduce(function (acc,value,index) {
                if(value.region.code == shen){
                    value.region.state.forEach(function (v) {
                        var obj = {};
                        obj.name = v.name;
                        obj.value = v.code;
                        acc.push(obj);
                    })
                }
                return acc;
            },[]);
            combo2['u.Combo'].emptyValue();
            combo3['u.Combo'].emptyValue();
            combo2['u.Combo'].setComboData(shi);
        });
        viewModel.dt4.on('valueChange',function () {
            var shen = viewModel.dt3.getValue('f1');
            var shi = viewModel.dt4.getValue('f1');
            console.log(shi);
            var shenObj = viewModel.res.find(function (v) {
                return v.region.code == shen;
            });
            var shi = shenObj.region.state.find(function (v) {
                return v.code == shi;
            });
            var xian = shi.city.reduce(function (acc,v) {
                var obj = {};
                obj.name = v.name;
                obj.value = v.code;
                acc.push(obj);
                return acc;
            },[])
            combo3['u.Combo'].emptyValue();
            combo3['u.Combo'].setComboData(xian)
            console.log(xian)
        });












        $(element).html(html);
        viewModel.event.pageInit();



        var row = viewModel.dt3.createEmptyRow();
        var row = viewModel.dt4.createEmptyRow();
        var row = viewModel.dt5.createEmptyRow();
















        viewModel.dt1.removeAllRows();
        viewModel.dt1.setData(viewModel.data1);


    };
    return {
        'template': html,
        init: init
    }
});
