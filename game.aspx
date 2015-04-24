<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:800' rel='stylesheet' type='text/css'>
    <title>Realtime Racing by signalR</title>
    <script src="/Scripts/jquery-1.6.4.min.js" type="text/javascript"></script>
    <script src="/Scripts/jquery.signalR-2.0.1.min.js" type="text/javascript"></script>
    <script src='<%: ResolveClientUrl("~/signalr/hubs") %>'></script>
    <script src="/Scripts/game.js" type="text/javascript"></script>
</head>
<body>
    <!--進場畫面-------------------------------------------------------------------------------------------------------->
    <div id="IntroPage">
        <div class="loading">
            <div id="container">
                <span></span>
                <span></span>
                <span></span>
                <h4>LOADING...</h4>
            </div>
            <div class="mask_loading"></div>
        </div>
        <!------------------------------------------------------------>
        <div class="wrapper bg1">
            <a href="javascript:void(0)" class="btn_start"></a>
        </div>
    </div>
    <!--進場畫面-------------------------------------------------------------------------------------------------------->

    <!------------------------------第一步 連線------------------------------------------>
    <div class="step1 close">    
        <div class="mask_bg"></div>
        <div class="connent_box">
            <h1 id="GameTarget"></h1>
            <div class="font1">請參賽者使用手機掃描右側QRCODE</div>
            <div class="qrcode" style="overflow:hidden;"><img style="margin-top:-35px; margin-left:-35px;" src=""></div>
            <div class="tip">等待參賽者連線中...</div>
        </div>
        <div class="ready_people"></div>     
    </div>
    <!------------------------------第一步 連線結束--------------------------------------->

    <!------------------------------第二步 準備------------------------------------------>
    <div class="step2 close">
        <!---------------倒數----------------->
            <div class="final_second close">
                <span id="count3" style="display:none;">3</span>
                <span id="count2" style="display:none;">2</span>
                <span id="count1" style="display:none;">1</span>
                <span id="count0" style="display:none;">GO!</span>
            </div>
        <!---------------倒數結束-------------->
   
        <div class="run_people"></div>
    </div>
    <!------------------------------第二步 準備結束------------------------------------------>

    <div class="wrapper bg2 close"></div>

    <!------------------------------遊戲結果------------------------------------------>
    <div class="wrapper bg3 close">
        <div class="team">TEAM 3</div>
        <div class="plat"></div>
        <div class="no1"></div>
        <div class="no2"></div>
        <div class="no3"></div>
        <div class="bomb1"><img src="/images/bomb1.png"></div>
        <div class="bomb2"><img src="/images/bomb2.png"></div>
    </div>
    <!------------------------------遊戲結果------------------------------------------>

    <audio <%--autoplay--%> loop>
        <source src="/sounds/bgMusic.mp3" type="audio/mpeg">
    </audio>

    <script>
        $(function () {
            $.connection.hub.start();
        });
    </script>
</body>
</html>
