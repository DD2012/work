var metaCardTable={
    meta: {
        //系统名称，和html中每一列的options参数中的field是一一对应
        "name":{
            type:'string',
            required:true,
            notipFlag: true,
            hasSuccess: true,
            nullMsg:'系统名称不能为空!'
        },
        "code":{
            type:'string',
            required:true,
            notipFlag: true,
            hasSuccess: true,
            nullMsg:'系统编码不能为空!'
        },
        "radiodatacontroller":"",
        "radiodataassociate":"",
        "combodatamodel":"",
        "gateway": "",
        "operate": ""
    }
};
