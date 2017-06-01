define(['text!pages/chengpingshengbao/chengpingshengbao.html', 'css!pages/chengpingshengbao/chengpingshengbao', 'uui', 'uuigrid', 'bootstrap', 'uuitree','./tableData.js'], function (html) {
    var init = function (element) {


        var viewModel = {

            event: {
                func: function () {
                    console.log('--test--');
                },
                pageInit: function () {
                    viewModel.app = u.createApp({
                        el: element,
                        model: viewModel
                    });
                }
            },
            supplementReport: new u.DataTable({
                meta: {
                    supplementOrderNum:{},
                    consumerName:{},
                    phone:{},
                    sellOrderNum:{},
                    supplementMode:{},
                    supplementType:{},
                    sellProduceNum:{},
                    sellProductName:{},
                    seriesName:{},
                    productionState:{},
                    supplementName:{},
                    supplementVersion:{},
                    num:{},
                    unit:{},
                    supplementReason:{},
                    logisticsMetho:{},
                    receivingLocation:{},
                    remark:{},
                    uploadImg:{}
                }
            })
        };


        $(element).html(html);
        viewModel.event.pageInit();

        supplementReportSimpleData.push(supplementReportSimpleData[0]);
        supplementReportSimpleData.push(supplementReportSimpleData[0]);
        supplementReportSimpleData.push(supplementReportSimpleData[0]);
        supplementReportSimpleData.push(supplementReportSimpleData[0]);
        viewModel.supplementReport.setSimpleData(supplementReportSimpleData);
        viewModel.supplementReport.setAllRowsUnSelect();


    };
    return {
        'template': html,
        init: init
    }
});
