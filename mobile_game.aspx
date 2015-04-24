<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <link rel="stylesheet" type="text/css" href="/m/css/m_style.css">
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:800' rel='stylesheet' type='text/css'>
    <title>Realtime Racing by signalR</title>

    <%-- 引用 jQuery 的參考 --%>
    <script src="/Scripts/jquery-1.6.4.min.js" type="text/javascript"></script>
    <script src="/Scripts/jquery-migrate-1.2.1.min.js"></script>
    <script src="/Scripts/jquery.signalR-2.0.1.min.js" type="text/javascript"></script>
    <script src='<%: ResolveClientUrl("~/signalr/hubs") %>'></script>
    <script src="/Scripts/mobile.js" type="text/javascript"></script>
</head>
<body>
    <div class="wrapper">
        <div id="step2">
            <div class="wait_font">請晃動手機</div>
            <div class="wait_font">送出個人資訊</div>
            <div class="wait_font"></div>
            <div class='loading'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
          
        </div>

        <div id="step3" class="close">
            <div class="wait_font">等待其它玩家進入遊戲</div>
            <div class='loading'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
          
            <div class="people"></div>
        </div>

        <div id="step4" class="close">
            <!---------------倒數----------------->
            <div class="final_second">
                <span id="count3" class="countdown">3</span>
                <span id="count2" class="countdown">2</span>
                <span id="count1" class="countdown">1</span>
                <span id="count0" class="countdown">Go!</span>
            </div>
            <!---------------倒數結束-------------->

            <!------------------------------------->
            <div class="go_font close">
                <h3>加油!距離終點還剩下</h3>
                <div class="distance">
                    <div class="number"><span class="num">99</span>m</div>
                </div>
            </div>
            <!---------------倒數結束-------------->   
                  
            <div class="run"></div>
        </div>


        <div id="step5" class="close">
            <!------------------------------------->
            <div class="go_font">
                <h3>抵達終點!!<br> 恭喜你獲得</h3>
                <div class="distance">
                    <div class="award">第<span class="num">1</span>名</div>
                </div>
            </div>
            <!---------------倒數結束-------------->         
            <div class="run"></div>
        </div>
    </div>

    <script>
        $(function () {
            $.connection.hub.start();
        });
    </script>
</body>
</html>
