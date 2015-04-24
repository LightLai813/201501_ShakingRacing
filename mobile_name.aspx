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
    <script src="/Scripts/jquery-1.6.4.min.js" type="text/javascript"></script>
    <script>
        var roomID; //房間ID
        $(document).ready(function () {
            roomID = Get_URL_Parameter("room");//取得房間代號

            $("#enterBtn").unbind().bind("click", function () {
                var runnerName = $("#runnerTypeName").val();
                location.href = "mobile_game.aspx?room=" + roomID + "&runnername=" + encodeURI(runnerName);
            });
        });

        //取得網址參數
        function Get_URL_Parameter(sParameter) {
            var url = window.location.toString();
            var str = "";
            var str_value = "";
            if (url.indexOf("?") != -1) {
                var ary = url.split("?")[1].split("&");
                for (var i in ary) {
                    str = ary[i].split("=")[0];
                    if (str == sParameter) {
                        str_value = decodeURI(ary[i].split("=")[1]);
                    }
                }
            }
            return str_value;
        }
    </script>
</head>
<body>
    <div class="wrapper">
        <div id="step1">
            <div class="icon"><img src="/m/images/icon.gif"></div>
            <h1>請輸入姓名</h1>
            <h2>(中文三個字以內)</h2>
            <div class="text"><input id="runnerTypeName" name="" type="text" class="textfield"></div>
            <a href="javascript: void(0);" class="btn" id="enterBtn">ENTER</a>
        </div>
    </div>
    
</body>
</html>
