var roomID; //房間ID

var runnerID;//Runner專屬ID
var runnerRoleID;//Runner Role ID
var runnerName;//Runner姓名
var runnerRank;//Runner名次
var shakeTimes = 0;//Runner搖動次數

var RaceCore; //連線Core
var game_progress; //遊戲進度

/***************搖動處理*******************************************/
var SHAKE_THRESHOLD = 3000; //晃動閥值
var last_update = 0, updateTime = 100;

var x, pre_x;
var y, pre_y;
var z, pre_z;
/***************搖動處理*******************************************/

$(document).ready(function () {
    runnerID = Date.now();//取得Runner序號
    roomID = Get_URL_Parameter("room");//取得房間代號
    runnerName = decodeURI(Get_URL_Parameter("runnername"));//取得Runner姓名

    game_progress = "subbmitname";

    //建立core
    RaceCore = $.connection.racing;

    //接收Server端傳送之RoleID
    RaceCore.client.getRole = function (retureRoomID, retureUniID, retureRoleID) {
        if (retureRoomID == roomID && retureUniID == runnerID && game_progress == "waitingothers") {
            runnerRoleID = retureRoleID;
            $("#step3 .people").html("<div class='name color" + runnerRoleID + "'>" + runnerName + "</div><div class='ready_pic'><img src='/images/noaward" + runnerRoleID + ".png'></div>");
        }
    }

    //接收Server端遊戲開始通知
    RaceCore.client.gameStart = function (retureRoomID, countDown) {
        if (retureRoomID == roomID){
            if (game_progress == "waitingothers") {
                countdown();
            }else if (game_progress == "countdown") {
                switch (countDown) {
                    case 3:
                        $(".countdown").hide();
                        $("#count2").show();
                        break;

                    case 2:
                        $(".countdown").hide();
                        $("#count1").show();
                        break;

                    case 1:
                        $(".countdown").hide();
                        $("#count0").show();
                        break;

                    case 0:
                        startGame();
                        break;
                }
            }
        }
    }

    //取得自己的名次
    RaceCore.client.getOwnRank = function (retureRoomID, retureUniID, retureRank) {
        if (retureRoomID == roomID && retureUniID == runnerID && game_progress == "start") {
            runnerRank = retureRank;
            gameResult();
        }
    }

    //藉由晃動送出個人資訊,確保所有玩家的手機,皆支援加速器功能
    window.addEventListener('devicemotion', sendName, false);
});

function sendName(eventData) {
    // 獲取含重力的加速度
    var acceleration = eventData.accelerationIncludingGravity;

    // 獲取當前時間
    var curTime = new Date().getTime();
    var diffTime = curTime - last_update;
    // 固定時間段

    if (diffTime > updateTime) {
        last_update = curTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        var speed = Math.abs(x + y + z - pre_x - pre_y - pre_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
            //超過閥值時,送出姓名
            $.connection.hub.start().done(function () {
                RaceCore.server.runnerSubbmit(roomID, runnerID, runnerName);
            });
            window.removeEventListener('devicemotion', sendName, false);
            intoWaiting();
        }

        pre_x = x;
        pre_y = y;
        pre_z = z;
    }
}

function intoWaiting() {
    game_progress = "waitingothers";

    
    $("#step2").addClass("close");
    $("#step3").removeClass("close");
}

function countdown() {
    game_progress = "countdown";

    $(".countdown").hide();
    $("#count3").show();
    $("body").addClass("bg2");

    $("#step3").addClass("close");
    $("#step4").removeClass("close");

    $("#step4 .run").html("<div class='name color" + runnerRoleID + "'>" + runnerName + "</div><div class='ready_pic'><img src='/images/p" + runnerRoleID + ".png'></div>");
}

function startGame() {
    game_progress = "start";

    $(".final_second").addClass("close");
    $(".go_font").removeClass("close");

    window.addEventListener('devicemotion', runnerRun, false);
}

var leftfoot = true;
function runnerRun(eventData) {
    // 獲取含重力的加速度
    var acceleration = eventData.accelerationIncludingGravity;

    // 獲取當前時間
    var curTime = new Date().getTime();
    var diffTime = curTime - last_update;
    // 固定時間段

    if (diffTime > 100) {
        last_update = curTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        var speed = Math.abs(x + y + z - pre_x - pre_y - pre_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD && shakeTimes < 100) {
            shakeTimes+=2;
            $(".go_font .distance .number .num").html(100 - shakeTimes);

            var footChoose = "";
            if (leftfoot) {
                leftfoot = false;
                footChoose = "";
            } else {
                leftfoot = true;
                footChoose = "_2"
            }

            $("#step4 .run .ready_pic img").attr("src", "/images/p" + runnerRoleID + footChoose + ".png");
            if (shakeTimes % 4 == 0){
                $.connection.hub.start().done(function () {
                    RaceCore.server.runnerShaking(roomID, runnerID, 100 - shakeTimes);
                });
            }
        }

        pre_x = x;
        pre_y = y;
        pre_z = z;
    }
}

function gameResult() {
    game_progress = "result";

    $("body").removeClass("bg2");

    $("#step5 .go_font .distance .award .num").html(runnerRank);

    var winString = "";
    var targetPic = runnerRank == 1 ? "award" : "noaward";
    winString += "<div class='name color" + runnerRoleID + "'>" + runnerName + "</div>";
    winString += "<div class='ready_pic'><img src='/images/" + targetPic + runnerRoleID + ".png'></div>";
    $("#step5 .run").html(winString);


    $("#step4").addClass("close");
    $("#step5").removeClass("close");
}



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