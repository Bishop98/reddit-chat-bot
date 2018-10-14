require('dotenv').config();
const sendbird = require('sendbird');
const request = require('request');
const dotenv = require('dotenv');
const os = require('os');
const fs = require('fs');

console.log(process.env.USER_ID);

const credentials = {
  userId: process.env.USER_ID,
  token: process.env.TOKEN
}

let subDataArray = [];

function loadJSON() {
  fs.readFile("chatrooms.json", (err, data)=>{
    subDataArray = JSON.parse(data);
    console.log(subDataArray);
  })
}

function updateJSON() {
  fs.writeFile("chatrooms.json", JSON.stringify(subDataArray), (err)=>{
    if (err) {
      console.warn(err);
    }
  })
}

var sb = new sendbird({appId: "2515BDA8-9D3A-47CF-9325-330BC37ADA13"}); var ch = new sb.ChannelHandler();

var kick = async(url, userId, nick) => {
  sb.GroupChannel.getChannel(url, function(channel, error) {
    if (error) {
      console.warn(error);
      return;
    } else {
      channel.banUserWithUserId(userId, 1, "User Kicked", function(error) {
        if (error) {
          console.error(error)
        }
        console.log("Removed " + nick + " From " + channel.name);
        console.log(""); console.log("");
      })
    }
  });
}


var validate = async (nick, userId, url, sub) => {
  var doVal = false
  var subData = {}
  for (var i = 0; i < subDataArray.length; i++) {
    if (subDataArray[i].subName == sub) {
      if (subDataArray[i].validate) {
        doVal = true;
        subData = subDataArray[i];
        break;
      }
    }
  }
  if (doVal) {
    request('https://www.reddit.com/u/' + nick + '/about.json', function (error, response, body) {
      if (response.statusCode == 200) {
        var karma = Number(JSON.parse(body).data.link_karma) + Number(JSON.parse(body).data.comment_karma);
        var currentTime = new Date();
        var accountCreated = JSON.parse(body).data.created_utc * 1000;
        var accountAge = (currentTime - accountCreated) / 60 / 60 / 24 /1000
        // console.log(accountAge);
        // console.log(karma);

        if (accountAge < subData.minAge) {
          console.log(nick+"'s account is underage and/or doesn't have enough karma");
          kick(url, userId, nick)
        } else {
          console.log(nick + " has joined the channel");
          console.log(""); console.log("");
        }
      } else {
        console.warn("Could not get " + nick + "'s about.json file")
      }
    });
  }
}

sb.connect(credentials.userId, credentials.token, (bot, err) => {
  if (err) console.warn(err.message);;
  console.log("Starting " + bot.nickname);
  loadJSON();
});

ch.onUserJoined = function (channel, user) {
  console.log(user.nickname + " is trying to join " + channel.name);
  validate(user.nickname, user.userId, channel.url, JSON.parse(channel.data).subreddit.name)
};

sb.addChannelHandler("vsdfh64mc93mg0cn367vne4m50bn3b238", ch);
