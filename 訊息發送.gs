//向特定用戶發送line訊息
//如果name = broadcast傳送訊息到gvar_sheet_id["token"]試算表中的type工作表中的每個人
function sendToLine(message, name){
  var token = [];
  var index = 0;
  //廣播給所有住戶(name需指定為broadcast)
  if(name == "broadcast"){
    for(person in Object.keys(sysVariable.resident)){
      token.push(sysVariable.resident[person].token);
    }
  }
  else{
    token = [sysVariable.resident[name].token];
  }
  //測試
  token = ["yAmgC64jDyZbsmg0UkMngrceWOV2JpnZO3HJnh3y8dN"]
  //測試
  //如果填表單的人尚未註冊，傳訊息給開發者
  for(let i = 0;i < token.length;i++){
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
  if(!start()) return;
  var docBody = DocumentApp.openById(sysVariable.id.notice_document).getBody();
  var message = "\n";
  message += docBody.getText();
  sendToLine(message,"broadcast")
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
  message = encodeFormData(message);
  var options = {
    "method" : "POST",
    "payload" : message
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