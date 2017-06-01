define(['text!pages/liaoping/liaoping.html', 'css!pages/liaoping/liaoping', 'uui', 'uuigrid', 'bootstrap', 'uuitree','./data.js'], function (html) {
    var init = function (element) {


        var viewModel = {
            count:1,
            event: {
                func: function () {
                    console.log('test');
                    // comp.update({ totalPages: 5, pageSize: 20, currentPage: viewModel.count++, totalCount: 200 });
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                },
                add: function () {

                },
                update: function () {

                },
                del: function () {

                },
                save: function () {

                }
            },
            liaoping: new u.DataTable({
                meta: {
                    productCode: {},
                    produceName: {},
                    productState:{},
                    seriesName:{},
                    produceType:{},
                    productMode:{},
                    setCode:{},
                    setName:{},
                    bagCode:{},
                    bagName:{},
                    partCode:{},
                    partName:{},
                    canPart:{},
                    canBag:{},
                    supplementType:{},
                    isSame:{},
                    productMethodName:{},
                    productFactoryName:{}
                }
            }),
            xialakuang: new u.DataTable({
                meta:{
                    bujian:{},
                    bubaojian:{},
                    tongkuan:{},
                    fangshi:{},
                    gongchang:{},
                    bianma:{},
                    mingcheng:{}
                }
            }),
            bujian:[{name:'是',value:'1'},{name:'否',value:'0'}],
            bubaojian:[{name:'是',value:'1'},{name:'否',value:'0'}],
            tongkuan:[{name:'是',value:'1'},{name:'否',value:'0'}],
            leixing:[{name:'五金',value:'1'},{name:'板件',value:'0'}],
            fangshi:[{name:'定做',value:'1'},{name:'委外',value:'0'}],
            gongchang:[{name:'五金',value:'1'},{name:'板件',value:'0'}]


        };


        $(element).html(html);
        viewModel.event.pageInit();

        //设置表格数据
        viewModel.liaoping.setSimpleData(simpleData);
        viewModel.liaoping.setAllRowsUnSelect();


        //下拉框数据创建一行空数据
        viewModel.xialakuang.createEmptyRow();


        $('input').css('width','150px');

        //分页
        var element = document.getElementById("pagination");
        var comp = new u.pagination({ el: element,showState:true });
        comp.update({ totalPages: 5, pageSize: 20, currentPage: 1, totalCount: 200 });
        comp.on('pageChange', function(pageIndex) {
            console.log('新的页号为' + pageIndex);

        });
        comp.on('sizeChange', function(arg) {
            console.log('每页显示条数为', arg[0],arg);
        });




    };
    return {
        'template': html,
        init: init
    }
});
