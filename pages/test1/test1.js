define(['text!pages/test1/test1.html', 'css!pages/test1/test1', 'uui'], function(html) {
    var init = function(element) {


        var viewModel = {
            text:'11111',
            checkboxData:[{name:'check1',value:1},{name:'check2',value:2},{name:'check3',value:3}],
            checkboxData1:[{name:'check11',value:1},{name:'check22',value:2},{name:'check33',value:3}],
            dt1:new u.DataTable({
                meta:{
                    f1:{
                        default:{
                            value:'red'
                        }
                    },
                    f2:{
                        default:{
                            value:'blue'
                        }
                    }
                }
            }),
















            event:{
                func:function () {
                    console.log(this);
                    if(this.dt1.getValue('f1')=='red'){
                        this.dt1.setValue('f1','blue');
                        this.dt1.setValue('f2','red');
                    }else {
                        this.dt1.setValue('f1','red');
                        this.dt1.setValue('f2','blue');
                    }

                },
                pageInit:function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                }
            }
        };

        var obj = {
            comp:ko.computed(function () {
                return viewModel.dt1.ref('f1')()+viewModel.dt1.ref('f2')()
            })
        };

        viewModel = $.extend(viewModel,obj);









        var row = viewModel.dt1.createEmptyRow();
        // row.setValue('f1','1');






        $(element).html(html);




        viewModel.event.pageInit();
















    };
    return {
        'template': html,
        init: init
    }
});
