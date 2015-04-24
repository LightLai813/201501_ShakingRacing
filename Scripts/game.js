var roomID; //房間ID
var gameID; //場次別
var roleBox = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; //角色箱
var runnerList = []; //玩家集合
var runnerLeftDiss = [];
var winList = []; //名次順序
var RaceCore; //連線Core

var timer;//timer
var gameTime = 30*60;//遊戲時間，預設30秒

var game_progress; //遊戲進度

//Runner Object
function Runner(uniID, roleID, runnerName) {
    this.uniID = uniID;
    this.roleID = roleID;
    this.name = runnerName;
    this.rank = 0;
}

$(document).ready(function () {
    roomID = Date.now();//取得房間序號
    gameID = Get_URL_Parameter("game");//取得場次代號

    //建立QRcode
    $(".qrcode img").attr("src", "http://chart.apis.google.com/chart?cht=qr&chs=280x280&chl=http://" + location.hostname + "/mobile_name.aspx?room=" + roomID);
    $("#GameTarget").html("TEAM " + gameID);

    preloadImg(intoIntro);

    //建立core
    RaceCore = $.connection.racing;

    //接收Server newRunnerIn 訊號(新進人員)
    RaceCore.client.newRunnerIn = function (returnRoomID, runnerUniID, runnerName) {
        if (returnRoomID == roomID && roleBox.length > 0 && game_progress == "waiting") {

            //給予Runner ID
            var randomIndex = randomNum(0, roleBox.length - 1);

            var runnerRoleID = roleBox[randomIndex];

            //新增Runner資料到runnerList
            runnerList.push(new Runner(runnerUniID, runnerRoleID, runnerName));

            //新增畫面等待Runner
            addWaitingRunner();

            //回覆Server 新進Runner 其Role
            $.connection.hub.start().done(function () {
                RaceCore.server.returnOfferRole(roomID, runnerUniID, runnerRoleID);
            });

            //將角色從箱子中拿走
            roleBox.splice(randomIndex, 1);

            //設定Runner剩餘里程
            runnerLeftDiss[runnerUniID] = 100;
        }
    }

    //更新各Runner搖動次數
    RaceCore.client.upDateShakeTimes = function (returnRoomID, runnerUniID, leftDistance) {
        if (returnRoomID == roomID && game_progress == "start") {
            //抵達終點判斷
            if (leftDistance <= 0) {
                runnerLeftDiss[runnerUniID] = -1;
                winList.push(runnerUniID);
                $.connection.hub.start().done(function () {
                    RaceCore.server.sendRunnerRank(roomID, runnerUniID, winList.length);
                });

                $(".run_people #runner" + runnerUniID).css("top", "-818px");
            }else{
                //更新跑者位置
                var runnerPos = -(818 - (leftDistance * 6.25));
                runnerLeftDiss[runnerUniID] = leftDistance;

                $(".run_people #runner" + runnerUniID).css("top", runnerPos + "px");
                $(".run_people #runner" + runnerUniID + " .run_pic").toggleClass("leftfoot").toggleClass("rightfoot");
            }

            
        }
    }
});

//進入遊戲首頁
function intoIntro() {
    game_progress = "intro";
    $("#IntroPage .loading").addClass("close");

    //開始鍵動作
    $(".btn_start").unbind().bind("click", function () {
        intoWaiting();
    });
}

//進入等待畫面
function intoWaiting() {
    $("#IntroPage").addClass("close");
    $(".bg2, .step1").removeClass("close");
    game_progress = "waiting";

    //fakeGuts("546662245", "嘎嘎嘎");
    //fakeGuts("2156654", "嘻嘻嘻");
    //fakeGuts("5422145", "呱呱呱");
    //fakeGuts("85789123", "啦啦啦");
    //fakeGuts("546748662245", "哇哇哇");

    //點擊QRcode開始遊戲
    $(".qrcode").unbind().bind("click", function () {
        beginGame();
    });
}

//新增等待跑者
function addWaitingRunner() {
    var runnerID = parseInt(runnerList.length);
    
    var runnerString = "";
    runnerString += "<div class='p" + runnerID + "' id='runner" + runnerList[runnerID-1].uniID + "'>";
    runnerString += "<div class='name color" + runnerList[runnerID-1].roleID + "'>" + runnerList[runnerID-1].name + "</div>";
    runnerString += "<div class='ready_pic'><img src='images/noaward" + runnerList[runnerID-1].roleID + ".png'></div>";
    runnerString += "</div>";
    
    $(".ready_people").append(runnerString);
    
    //增加點擊跑者移除之 的事件
    $(".ready_people #runner" + runnerList[runnerID-1].uniID).unbind().bind("click", function () {
                                               removeWaitingGuts($(this));
                                             });
}

function removeWaitingGuts(target) {
    //取得欲被移除Runner之位置
    var runner_pos = target.attr("class");
    runner_pos = parseInt(runner_pos.replace("p", ""));
    
    //取得欲被移除Runner之roleID
    var runnerRoleID = runnerList[runner_pos-1].roleID;
    
    //從畫面移除該Runner
    target.remove();
    
    //從runnerList移除該Runner
    runnerList.splice(runner_pos-1, 1);
    
    //重新設定其他Runners之ID和位置
    for(var i=runner_pos;i<=runnerList.length;i++){
        $(".ready_people .p" + parseInt(i+1)).attr("class","p" + i);
    }
    
    //把被刪掉的角色重新加回roleBox
    roleBox.push(runnerRoleID);
}

/********畫面測試*************************************************/
function fakeGuts(runnerUniID, runnerName) {
    var leftDiss =  randomNum(10, 100);


    //給予Runner ID
    var randomIndex = randomNum(0, roleBox.length - 1);
    var runnerRoleID = roleBox[randomIndex];

    //新增Runner資料到runnerList
    runnerList.push(new Runner(runnerUniID, runnerRoleID, runnerName + leftDiss));


    //新增畫面等待Runner
    addWaitingRunner();

    //將角色從箱子中拿走
    roleBox.splice(randomIndex, 1);

    runnerLeftDiss[runnerUniID] = leftDiss;
}
/********畫面測試*************************************************/

//遊戲開始
function beginGame() {
    //計算位移距離，讓隊伍置中
    var moveCount = 6 - parseInt(runnerList.length / 2);
    
    //將Runner配置到畫面中
    for (var i = 0; i < runnerList.length; i++) {
        var runnerString = "";
        runnerString += "<div id='runner" + runnerList[i].uniID + "' class='p" + parseInt(i + moveCount) + "'>";
        runnerString += "<div class='name color" + runnerList[i].roleID + "'>" + runnerList[i].name + "</div>";
        runnerString += "<div class='run_pic role" + runnerList[i].roleID + " leftfoot'></div>";
        runnerString += "</div>";

        $(".run_people").append(runnerString);
    }


    $(".step1").addClass("close");
    $(".step2").removeClass("close");

    game_progress = "ready";
    
    //進入倒數
    countDown();
}

//倒數處理
function countDown() {
    $(".final_second").removeClass("close");
    $.connection.hub.start().done(function () {
        RaceCore.server.tellRunnerGameStart(roomID, 4);
    });
    $("#count3").show().fadeOut(1000, "linear", function () {

        $("#count3").remove();
        $.connection.hub.start().done(function () {
            RaceCore.server.tellRunnerGameStart(roomID, 3);
        });
        $("#count2").show().fadeOut(1000, "linear", function () {

            $("#count2").remove();
            $.connection.hub.start().done(function () {
                RaceCore.server.tellRunnerGameStart(roomID, 2);
            });
            $("#count1").show().fadeOut(1000, "linear", function () {

                $("#count1").remove();
                $.connection.hub.start().done(function () {
                    RaceCore.server.tellRunnerGameStart(roomID, 1);
                });
                $("#count0").show().fadeOut(1000, "linear", function () {

                    $("#count0").remove();
                    $.connection.hub.start().done(function () {
                        RaceCore.server.tellRunnerGameStart(roomID, 0);
                    });
                    $(".final_second").addClass("close");
                    startGame();
                });
            });
        });
    });
}

//遊戲開始
function startGame() {
    game_progress = "start";
    timerCountDown();
}

//遊戲結束判斷
function timerCountDown() {
    if (timer) window.cancelAFrame(timer);
    
    gameTime--;

    //當30秒過去，或所有Runner都抵達終點，則進入遊戲結果頁
    if (gameTime <= 0 || winList.length >= runnerList.length) {
        if (winList.length < runnerList.length) noCompeleteRunners();
        else gameResult();
    } else {
        timer = window.requestAFrame(timerCountDown);
    }
}

//未完成遊戲玩家名次排序
function noCompeleteRunners() {
    var noCompeleteRunnersArray = [];
    for (var i = 0; i < runnerList.length; i++) {
        if (runnerLeftDiss[runnerList[i].uniID] >= 0) {
            noCompeleteRunnersArray.push(new runnerRankObject(runnerList[i].uniID ,runnerLeftDiss[runnerList[i].uniID]));
        }
    }

    noCompeleteRunnersArray.sort(sortRank);

    for (var i = 0; i < noCompeleteRunnersArray.length; i++) {
        winList.push(noCompeleteRunnersArray[i].uniID);
        $.connection.hub.start().done(function () {
            RaceCore.server.sendRunnerRank(roomID, noCompeleteRunnersArray[i].uniID, winList.length);
        });
    }

    gameResult();
}

function runnerRankObject(runnerUniID, runnerLeftDiss) {
    this.uniID = runnerUniID;
    this.leftDiss = runnerLeftDiss;
}

function sortRank(a, b) {

    return a.leftDiss - b.leftDiss
}

//遊戲結果
function gameResult(){
    game_progress = "result";

    //顯示場次
    $(".bg3 .team").html("TEAM " + gameID);
    //設定前三名Runner資訊
    for (var i = 1; i <= winList.length; i++) {
        if(i<=3){
            var winnerIndex = getRunnerInfo(winList[parseInt(i - 1)]);
            $(".bg3 .no" + i).html("<div class='awardname color" + runnerList[winnerIndex].roleID + "'>" + runnerList[winnerIndex].name + "</div><div class='award_pic'><img src='/images/award" + runnerList[winnerIndex].roleID + ".png'></div>");
        }
    }
    
    $(".step2, .bg2").addClass("close");
    $(".bg3").removeClass("close");
    fireworkAnimate();
}

function fireworkAnimate(){
    $(".bg3 .bomb1").fadeIn(500,"linear",function(){ });
    $(".bg3 .bomb2").fadeIn(500,"linear",function(){ });
}

function getRunnerInfo(uniID) {
   
    var targetIndex = "";
    for(var i=0;i<runnerList.length;i++){
        if(runnerList[i].uniID == uniID){
            targetIndex = i;
            return targetIndex;
        }
    }
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

//隨機數字
function randomNum(min, max) {
    var Num = Math.round(Math.random() * ((max + 1) - min) + min);
    if (Num > max) {
        Num = randomNum(min, max);
    }
    return Num;
}


// 各 Browsers 的 requestAnimationFrame() 處理
window.requestAFrame = (function () {
                        return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        // if all else fails, use setTimeout
                        function (callback) {
                        return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
                        };
                        })();

// 各 Browsers 的 cancelAnimationFrame() 處理
window.cancelAFrame = (function () {
                       return window.cancelAnimationFrame ||
                       window.webkitCancelAnimationFrame ||
                       window.mozCancelAnimationFrame ||
                       window.oCancelAnimationFrame ||
                       function (id) {
                       window.clearTimeout(id);
                       };
})();


//預先載入圖片
var imgArray = ['/images/award1.png',
        '/images/award2.png',
        '/images/award3.png',
        '/images/award4.png',
        '/images/award5.png',
        '/images/award6.png',
        '/images/award7.png',
        '/images/award8.png',
        '/images/award9.png',
        '/images/award10.png',
        '/images/award11.png',

        '/images/bg1.gif',
        '/images/bg2.gif',
        '/images/bg3.gif',

        '/images/bomb1.png',
        '/images/bomb2.png',

        '/images/btn_start.png',

        '/images/noaward1.png',
        '/images/noaward2.png',
        '/images/noaward3.png',
        '/images/noaward4.png',
        '/images/noaward5.png',
        '/images/noaward6.png',
        '/images/noaward7.png',
        '/images/noaward8.png',
        '/images/noaward9.png',
        '/images/noaward10.png',
        '/images/noaward11.png',

        '/images/plat.png',

        '/images/run1.png',
        '/images/run2.png',
        '/images/run3.png',
        '/images/run4.png',
        '/images/run5.png',
        '/images/run6.png',
        '/images/run7.png',
        '/images/run8.png',
        '/images/run9.png',
        '/images/run10.png',
        '/images/run11.png'
];

var total = imgArray.length;
var imgLoaded = 0;
function preloadImg(callback) {
    for (var i in imgArray) {
        $("<img />").load(function () {
            imgLoaded++;
            if (imgLoaded == total) {
                //when all images loaded we hide start up image.
                $('.start_up').hide();
            }
        }).error(function () {
            imgLoaded++;
            if (imgLoaded == total) {
                //when all images loaded even error in img loading, we hide startup image.
                $('.start_up').hide();
            }
        }).attr("src", imgArray[i]);
    }

    if (callback) callback();
}