<?php
    header("Content-type: text/html; charset=utf-8");
    require_once "jssdk.php";
    $jssdk = new JSSDK("wxb6dcd098576876f8", "fbd08a1afdf832c1478cd092e818756f");
    $signPackage = $jssdk->GetSignPackage();
    $name = $jssdk->getUser();
?>
<!DOCTYPE html>
<html>
<head lang="zh-CN">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!-- viewport -->
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    <!-- WebApp全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <!-- 隐藏状态栏/设置状态栏颜色 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="blank" />
    <!-- 忽略数字自动识别为电话号码 -->
    <meta name="format-detection" content="telephone=no" />
    <!-- 忽略识别邮箱 -->
    <meta content="email=no" name="format-detection" />
    <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
    <meta name="HandheldFriendly" content="true">
    <!-- 浏览器内核控制 -->
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <title>测测现在的你每个月能赚多少钱</title>
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
    <section class="box begin box-in" id="begin">
        <div class="begin-immortal">
            <div class="immortal">
                <img alt="immortal" src="img/begin-immortal.png"/>
            </div>
            <span class="begin-cloud begin-cloud1"></span>
            <span class="begin-cloud begin-cloud2"></span>
            <span class="begin-cloud begin-cloud3"></span>
        </div>
        <div class="begin-title">
            <img alt="title" src="img/begin-title.png"/>
        </div>
        <div class="begin-subtitle">
            <img alt="title" src="img/begin-subtitle.png"/>
        </div>
        <div>
            <a id="go" class="begin-btn" href="javascript:void(0);"></a>
        </div>
    </section>
    <section class="box page" id="page1">
        <div class="subject">1.性别？</div>
        <ul class="answer">
            <li score="2" class="answer-item"><i></i>铁铮铮汉子</li>
            <li score="1" class="answer-item"><i></i>纯妹子</li>
        </ul>
        <p>一共<em>7</em>题，已答<em>0</em>题</p>
    </section>
    <section class="box page" id="page2">
        <div class="subject">2.手机是哪个家族的？</div>
        <ul class="answer">
            <li score="2" class="answer-item"><i></i>安卓Android</li>
            <li score="1" class="answer-item"><i></i>苹果IOS</li>
        </ul>
        <p>一共<em>7</em>题，已答<em>1</em>题</p>
    </section>
    <section class="box page" id="page3">
        <div class="subject">3.你的代步坐骑是？</div>
        <ul class="answer">
            <li score="2" class="answer-item"><i></i>自行车或电动车</li>
            <li score="1" class="answer-item"><i></i>地铁公交或出租车</li>
            <li score="0" class="answer-item"><i></i>私家车</li>
        </ul>
        <p>一共<em>7</em>题，已答<em>2</em>题</p>
    </section>
    <section class="box page" id="page4">
        <div class="subject">4.最近忙吗？</div>
        <ul class="answer">
            <li score="2" class="answer-item"><i></i>悠哉悠哉</li>
            <li score="1" class="answer-item"><i></i>朝九晚五按部就班</li>
            <li score="0" class="answer-item"><i></i>起得比鸡早睡得比狗晚</li>
        </ul>
        <p>一共<em>7</em>题，已答<em>3</em>题</p>
    </section>
    <section class="box page" id="page5">
        <div class="subject">5.怎么看待钱的价值？</div>
        <ul class="answer">
            <li score="2" class="answer-item"><i></i>越多越好</li>
            <li score="0" class="answer-item"><i></i>身外之物</li>
        </ul>
        <p>一共<em>7</em>题，已答<em>4</em>题</p>
    </section>
    <section class="box page" id="page6">
        <div class="subject">6.钱包经常喊饿吗？</div>
        <ul class="answer">
            <li score="2" class="answer-item"><i></i>饿饿饿</li>
            <li score="1" class="answer-item"><i></i>偶尔</li>
            <li score="0" class="answer-item"><i></i>钱包鼓鼓的</li>
        </ul>
        <p>一共<em>7</em>题，已答<em>5</em>题</p>
    </section>
    <section class="box page" id="page7">
        <div class="subject">7.在自己熟悉的大街小巷奔跑穿梭，是否感觉很拉风？</div>
        <ul class="answer">
            <li score="2" class="answer-item"><i></i>yes</li>
            <li score="1" class="answer-item"><i></i>no</li>
        </ul>
        <p>一共<em>7</em>题，已答<em>6</em>题</p>
    </section>
    <section class="box end" id="end">
        <div class="end-immortal">
            <div class="immortal-arm"></div>
        </div>
        <div class="share">去朋友圈晒一晒吧！</div>
        <div class="score">
            <div id="salary" class="salary"></div>
            <div class="percent">恭喜！击败了全国<span id="percent">90</span>%的上班族</div>
        </div>
        <div class="tooltip">
            哇塞，你离月入过万仅<span id="gap">1000</span>元
        </div>
        <div class="end-btn">
            <a id="again" href="javascript:void(0);"></a>
            <a id="bible" href="javascript:void(0);"></a>
        </div>
    </section>
    <section class="dialog" id="dialog">
        <div class="mask"></div>
        <div class="dialog-body">
            <header>
                <a id="close" href="javascript:void(0);">&times;</a>
            </header>
            <section class="dialog-content">
                <p>饿了么推出蜂鸟众包，</p>
                <p class="spec">单多，路短，补贴高！</p>
                <p>注册即可抢单做配送，</p>
                <p>天天送外卖，轻松赚几万！</p>
            </section>
            <footer class="dialog-footer">
                <a target="_blank" href="http://talaris-h5.ele.me/reg_and_auth/reg/register.html?h5=1​">立刻加入</a>
            </footer>
        </div>
    </section>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="js/zepto-1.1.6.min.js"></script>
    <script>
        $(function() {

            var pageIndex = 1,  // 当前页（从第一题算起）
                totalPage = 7,  // 总页数（题数，从1开始）
                score = 0;      // 总分

            /*
             * 注意：
             * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
             * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
             * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
             *
             * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
             * 邮箱地址：weixin-open@qq.com
             * 邮件主题：【微信JS-SDK反馈】具体问题
             * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
             */
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: '<?php echo $signPackage["appId"];?>',
                timestamp: <?php echo $signPackage["timestamp"];?>,
                nonceStr: '<?php echo $signPackage["nonceStr"];?>',
                signature: '<?php echo $signPackage["signature"];?>',
                jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function(res){

                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: '<?php echo $name ?>赚了9000元', // 分享标题
                    desc: '测测现在的你每个月能赚多少钱', // 分享描述
                    link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb6dcd098576876f8&redirect_uri=http://dynx.heyfish.cn/game&response_type=code&scope=snsapi_userinfo#wechat_redirect', // 分享链接
                    imgUrl: 'http://dynx.heyfish.cn/game/img/wx.png', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: '测测现在的你每个月能赚多少钱', // 分享标题
                    link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb6dcd098576876f8&redirect_uri=http://dynx.heyfish.cn/game&response_type=code&scope=snsapi_userinfo#wechat_redirect', // 分享链接
                    imgUrl: 'http://dynx.heyfish.cn/game/img/wx.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
            wx.error(function(err){
                alert('网络异常');
            });

            // 禁用页面滑动
            $(document).on("touchmove",function(e){
                e.preventDefault();
            });

            // 开始测验
            $('#go').on('click', function() {
                $('#begin').addClass('box-out');
                $('#page' + pageIndex).addClass('box-in');
            });

            // 选择答案，选完自动进入下一页
            $('.answer-item').on('click', function() {
                // 选中
                $(this).addClass('checked');

                // 得分累计
                score += Number($(this).attr('score'));

                $('#page' + pageIndex).addClass('box-out');

                // 如果做完，进入结算页(end)
                if(pageIndex == totalPage) {
                    $('#end').addClass('box-in');

                    // 计算结果
                    var result = calcuResult(score);

                    // 赋值
                    $('#salary').text(result.salary + '元');
                    $('#percent').text(result.percent);
                    $('#gap').text(result.gap);

                    wx.onMenuShareAppMessage({
                        title: '<?php echo $name ?>赚了'+ result.salary +'元', // 分享标题
                        desc: '测测现在的你每个月能赚多少钱', // 分享描述
                        link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb6dcd098576876f8&redirect_uri=http://dynx.heyfish.cn/game&response_type=code&scope=snsapi_userinfo#wechat_redirect', // 分享链接
                        imgUrl: 'http://dynx.heyfish.cn/game/img/wx.png', // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                } else {
                    $('#page' + (pageIndex + 1)).addClass('box-in');
                }

                pageIndex++;
            });

            // 再来一次
            $('#again').on('click', function() {
                $('.answer-item').removeClass('checked');
                $('.box').removeClass('box-in').removeClass('box-out');
                pageIndex = 1;
                score = 0;
                $('#begin').addClass('box-in');
            });

            // 赚钱宝典
            $('#bible').on('click', function() {
                $('#dialog').addClass('dialog-in');
                // 关闭
                $('#close').on('click', function() {
                    $('#dialog').removeClass('dialog-in');
                });
                $('.mask').on('click', function() {
                    $('#dialog').removeClass('dialog-in');
                })
            });

            // 获取随机数
            function getRandom(start, end) {
                return Math.floor(Math.random() * (end - start + 1) + start);
            }

            // 获取随机的百分比（两位小数点）
            function getPercent(start) {
                return (Math.random() + start).toFixed(2);
            }

            // 计算得分
            function calcuResult(score) {
                var salary,     //月薪
                    gap,        //离万元差
                    percent;    //百分比

                switch(score) {
                    case 1:
                        salary = getRandom(7000, 7200);
                        gap = 10000 - salary;
                        percent = getPercent(85);
                        break;
                    case 2:
                        salary = getRandom(7201, 7400);
                        gap = 10000 - salary;
                        percent = getPercent(86);
                        break;
                    case 3:
                        salary = getRandom(7401, 7600);
                        gap = 10000 - salary;
                        percent = getPercent(87);
                        break;
                    case 4:
                        salary = getRandom(7601, 7800);
                        gap = 10000 - salary;
                        percent = getPercent(88);
                        break;
                    case 5:
                        salary = getRandom(7801, 8000);
                        gap = 10000 - salary;
                        percent = getPercent(89);
                        break;
                    case 6:
                        salary = getRandom(8001, 8200);
                        gap = 10000 - salary;
                        percent = getPercent(90);
                        break;
                    case 7:
                        salary = getRandom(8201, 8400);
                        gap = 10000 - salary;
                        percent = getPercent(91);
                        break;
                    case 8:
                        salary = getRandom(8401, 8600);
                        gap = 10000 - salary;
                        percent = getPercent(92);
                        break;
                    case 9:
                        salary = getRandom(8601, 8800);
                        gap = 10000 - salary;
                        percent = getPercent(93);
                        break;
                    case 10:
                        salary = getRandom(8801, 9000);
                        gap = 10000 - salary;
                        percent = getPercent(94);
                        break;
                    case 11:
                        salary = getRandom(9001, 9200);
                        gap = 10000 - salary;
                        percent = getPercent(95);
                        break;
                    case 12:
                        salary = getRandom(9201, 9400);
                        gap = 10000 - salary;
                        percent = getPercent(96);
                        break;
                    case 13:
                        salary = getRandom(9401, 9600);
                        gap = 10000 - salary;
                        percent = getPercent(97);
                        break;
                    case 14:
                        salary = getRandom(9601, 9800);
                        gap = 10000 - salary;
                        percent = getPercent(98);
                        break;
                    default:
                        break;
                }

                return {
                    salary: salary,
                    gap: gap,
                    percent: percent
                }
            }

        });
    </script>
</body>
</html>