// 接口A
function saveSoldierTeam(name,cipher,callback){
    $.ajax({
        type: 'get',
        url: "https://testappapi.btt.top/pullnew/v1/saveSoldierTeam",
        headers: {
            "Authorization": token
        },
        data: {
            name: name,
            cipher: cipher
        },
        success: function(data) {
            callback && callback('success',data);
            
        },
        error: function(event) {
            callback && callback('error', event);
        }
    });
}
// 获取当前用户暗号 接口B
function getCipter(callback){
    $.ajax({
        type: 'get',
        url: 'https://testappapi.btt.top/pullnew/v1/getCipher',
        headers: {
            'Authorization': token
        },
        success: function(data) {
            callback && callback('success',data);
        },
        error: function(err) { 
            callback && callback('error', err);
        }
    });
}

// 成功组件战队后总得做点啥
function doSomeAfterSuccess(data) {
    if (data.code == 0) {
        //组建战队成功的弹窗内容
        $('.modal-share h6').text('战队组建成功');
        $('.modal-share p').text('系统已扣除参赛奖金100TOT，瓜分亿万奖励金快去邀请好友加入我的战队吧');
        $('.modal-share').show();
        init(); // 初始化
        getMyteam(); // 更新我的战队信息
        getBonusPool(); // 更新奖金池
    } else if (data.code == 5083) {
        $.toast({
            text: '您的暗号错误！',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
    } else if (data.code == 5086) {  // 需输入战队名称和暗号
        $.toast({
            text: '请输入战队名称和暗号',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
    } else if (data.code == 5087) { // 只需输入战队名称
        $.toast({
            text: '请输入战队名',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
    } else if (data.code == 5082) {
        $.toast({
            text: '您不是平台邀请用户，请联系管理员获取暗号',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
    } else if (data.code == 5081) {
        $.toast({
            text: '您已经加入过战队了',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
    } else if(data.code == 5090) {
        $.toast({
            text: '口令与用户绑定口令不一致',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
    }
}

// 组建战队提交
function createmyTeam() {
    var name = $('#input-teamName').val();
    var cipher = $('#input-cipher').val();

    if (name == "") {
        $.toast({
            text: '请输入战队名称',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
        return false;
    }

    var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/; // 只允许字母 数字和中文
    if (!reg.test(name)) {
        $.toast({
            text: '战队名称不能包含标点符号',
            showHideTransition: 'slide',
            icon: 'notice',
            loader: false,
            allowToastClose: false
        });
        return false;
    }


    if(cipher == ""){
        getCipter(function(status,result){
            if(status==='success'){
                console.log('cipher 成功了',result);
                // 可以先把cipher存下来，下次就不用再请求B接口了
                // 看下数据结构== 是不是 result.data ==============
                $('#input-cipher').val(result.data);
                // 成功之后去调用A接口
                saveSoldierTeam(name,cipher,function(statusTeam,resTeam){
                    if(statusTeam === 'success'){
                        console.log('resTeam 成功了',resTeam);
                        // 干点啥吧
                        doSomeAfterSuccess(resTeam)
                        return;
                    };
                    
                    if(statusTeam === 'error'){
                        console.log('resTeam 失败了',resTeam);
                        return;
                    }
                });

                return;
            };

            if(status==='error'){
                console.log('cipher 失败了',result);
                
                return;
            };
        })
    }else{
        // 如果上次请求的cipher还在而且还能用，那就不请求B了，直接走A接口
        saveSoldierTeam(name,cipher,function(statusTeam,resTeam){
            if(statusTeam === 'success'){
                console.log('resTeam 成功了',resTeam);
                // 干点啥吧
                doSomeAfterSuccess(resTeam)
                return;
            };
            
            if(statusTeam === 'error'){
                console.log('resTeam 失败了',resTeam);
                return;
            }
        });
    }
    
}