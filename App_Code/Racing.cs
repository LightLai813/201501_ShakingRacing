using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SignalRace
{

    public class racing : Hub
    {
        public String RaceID { get; set; }

        //Runner送出自己的資料
        public void runnerSubbmit(string roomID, string runnerUniID, string runnerName)
        {
            //通知Game new Runner進入
            Clients.All.newRunnerIn(roomID, runnerUniID, runnerName);
        }

        //Game 回覆Runner其Role
        public void returnOfferRole(string roomID, string runnerUniID, int roleID)
        {
            //Server 通知Runner其ID
            Clients.All.getRole(roomID, runnerUniID, roleID);
        }

        //Game 回覆Runner其Role
        public void tellRunnerGameStart(string roomID, int countDown)
        {
            //Server 通知Runner其ID
            Clients.All.gameStart(roomID, countDown);
        }

        //Runner傳送搖動次數
        public void runnerShaking(string roomID, string runnerUniID, int shakeTimes)
        {
            //Game更新Runner搖動次數
            Clients.All.upDateShakeTimes(roomID, runnerUniID, shakeTimes);
        }

        //Game 發送名次給Runner
        public void sendRunnerRank(string roomID, string runnerUniID, int rank)
        {
            //Runner取得名次
            Clients.All.getOwnRank(roomID, runnerUniID, rank);
        } 
    }
}
