//向特定用戶發送line訊息
//如果name = broadcast傳送訊息到gvar_sheet_id["token"]試算表中的type工作表中的每個人
function sendToLine(message, name, type){
  token = [];
  var index = 0;
  if(name == "broadcast"){
    sheet = SpreadsheetApp.openById(gvar_sheet_id["token"]).getSheetByName(type);
    for(let i = 1;i <= sheet.getLastRow();i++){
      range = sheet.getRange(i, 2);
      token[index] = range.getValue();
       Logger.log(token[index]);
      index++;
    }
  }
  else{
    token[index] = getInfo(name);
  }
  //如果填表單的人尚未註冊，傳訊息給開發者
  for(let i = 0;i < token.length;i++){
  if(token[i] == -1){
    sheet = SpreadsheetApp.openById(gvar_sheet_id["token"]).getSheetByName("serving one");
    message = name + "還沒註冊";
    for(let i = 1;i <= sheet.getLastRow();i++){
      var sys_admin = sheet.getRange(i, 2).getValue();
    var options =
  {
      method  : "post",
      payload : "message=" + message,
      headers : {"Authorization" : "Bearer "+ sys_admin},
      muteHttpExceptions : true
  }; 
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
  }
    return;
  }
  var options =
  {
      method  : "post",
      payload : "message=" + message,
      headers : {"Authorization" : "Bearer "+ token[i]},
      muteHttpExceptions : true
  }; 
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
}
//發送每週提醒訊息
function sendWeeklyNotice(){
  var docBody = DocumentApp.openById(gvar_notice_document_id).getBody();
  var message = "\n";
  message += docBody.getText();
  var date = new Date();
  var keyTable = SpreadsheetApp.openById(gvar_sheet_id["record"]);
  var sheet = keyTable.getSheetByName(gvar_thisWeek);
  for(var i = 4;i <= sheet.getLastRow();i++){
    let name = sheet.getRange(i, 2).getValue();
    //如果姓名格並非有填表單的顏色才傳提醒訊息
    if(sheet.getRange(i, 2).getBackground() != gvar_acceptedColor && name != ""){
      sendToLine(message, name);
      sheet.getRange(i, 2).setBackground(gvar_wrongColor);
    }
  }
}
//發送註冊訊息給line Api
function sendRequest(code){
  var message = {
    "grant_type" :'authorization_code',
    "code" : code,
    "redirect_uri" :'https://script.google.com/macros/s/AKfycbzOEcswkkuu7vyLUtg3AITyG6iITw7r1swSWrab/exec?function=registration',
    "client_id" : 'RsaeiNItcqlH8rgeTxBjA8' ,
    "client_secret" :'DFS5gEYOMJSI3p9X6sPdOrm7BdazNPNKGlCOnA2MRIs',
  };
  Logger.log(message)
  message = encodeFormData(message);
  var options = {
    "method" : "POST",
    "payload" : message
   //"headers" : {"Content-Type" : "application/x-www-form-urlencoded"}
  };
  token = UrlFetchApp.fetch("https://notify-bot.line.me/oauth/token",options).getContentText();
  token = JSON.parse(token)["access_token"].toString();
  return token;
}
//將request內容轉乘urlencode格式
function encodeFormData(data) {
    if (!data) return "";    // Always return a string
    var pairs = [];          // To hold name=value pairs
    for (var name in data) {                                  // For each name
         if (!data.hasOwnProperty(name)) continue;            // Skip inherited
         if (typeof data[name] === "function") continue;      // Skip methods
         var value = data[name].toString();                   // Value as string
         name = encodeURIComponent(name.replace(" ", "+"));   // Encode name
         value = encodeURIComponent(value.replace(" ", "+")); // Encode value
         pairs.push(name + "=" + value);   // Remember name=value pair
    }
    return pairs.join('&'); // Return joined pairs separated with &
}
function sendRankToServingOne(individuals, in_number, groups, gp_number){
  message = "操練表系統排名 " + makeWeekTitle(2, 2) + "\n";
  message += "個人獎\n";
  for(let i = 0;i < in_number;i++){
    message += "第" + (i + 1) + "名: "
    message += individuals[i].name + "\n";
    message += "平均分數 " + individuals[i].average + "\n";
    message += "平均晨興天數 " + individuals[i].revivalAvg + "\n\n";
  }
  message += "團體獎\n"
  for(let i = 0;i < gp_number;i++){
    message += "第" + (i + 1) + "名: ";
    message += groups[i].name + "\n";
    message += "平均分數 " + groups[i].average + "\n";
    message += "平均晨興天數 " + groups[i].revivalAvg;
    if(i != gp_number) message += "\n";
  }
  sendToLine(message, "broadcast", "serving one");
  Logger.log(message);
}