//處理外部傳來的get request (在網址後加上?[key]=[value])
function doGet(e){
  var para = e.parameter;
  Logger.log(para.function);
  //根據function的value提供不同的網站服務
  if(para.function == "test"){
    return HtmlService.createHtmlOutputFromFile('test.html');
  }
  else if(para.function == "registration"){
    return HtmlService.createHtmlOutputFromFile('Token.html');
  }
}

//取得表單的回覆
function getFormResponse() {
  var form = FormApp.openById(gvar_exercising_table_form_id);  
  //取得表單回覆內容
  var formResponse = form.getResponses();
  //處理表單上問答內容
  var last = formResponse.length - 1;
  //取得表單上的項目
  var itemResponses = formResponse[last].getItemResponses();    
  //將表單每一項問答組成訊息
  var score = 0;
  var subScore = 0;
  var subjectIndex = 0; 
  var url = formResponse[last].getEditResponseUrl(); 
  var name = itemResponses[2].getResponse();
  gvar_nameRow = getLine(name, gvar_sheet_id["record"], gvar_thisWeek, 2);
  var gender = itemResponses[0].getResponse();
  for(var i = 0;i < itemResponses.length;i++)
  {
    //Logger.log(itemResponses[i].getItem().getTitle(),itemResponses[i].getResponse());
    subjectIndex = enumerateSubjectIndex(itemResponses[i].getItem().getTitle())
    //儲存回覆
    saveRes(itemResponses[i], gvar_nameRow, subjectIndex, gvar_thisWeek)
    //儲存回饋
    if(subjectIndex == 99){
      saveFeedback(formResponse[last].getTimestamp(),itemResponses[i].getResponse());
      break;
    }
  }
  //標記此人已填寫(用綠色)
  var writeTable = SpreadsheetApp.openById(gvar_sheet_id["record"]);
  var writeSheet = writeTable.getSheetByName(gvar_thisWeek);
  writeSheet.getRange(gvar_nameRow, 2).setBackground(gvar_acceptedColor);
  //取得問題分數
  var score = writeSheet.getRange(gvar_nameRow, writeSheet.getLastColumn()).getValue();
  //取得填寫表單時間
  var broadcast = "\n" + formResponse[last].getTimestamp() + "\n";
  //做出傳送到line裡的文字
  broadcast +=  name + gender + "\n";
  broadcast += "你的分數是："+ score + "分/151分" + "\n";
  broadcast += "點擊以下連結修改你已提交的表單：" + "\n" + url;
  sendToLine(broadcast, name);
  //送出表單到Line
  Logger.log(broadcast)
}
  
//儲存回饋
function saveFeedback(time, feedback){
  if(feedback == "") return;
  var keyTable = SpreadsheetApp.openById(gvar_sheet_id["feedback"]);
  var sheet = keyTable.getSheetByName("feedback");
  var range = sheet.getRange(sheet.getLastRow() + 1,1,1,2);
  range.setValues([[time,feedback]]);
}

//取得Token試算表裡指定名字的token
function getInfo(name){
  var keyTable = SpreadsheetApp.openById(gvar_sheet_id["token"]);
  var sheet = keyTable.getSheetByName("resident");
  for(var i = 1;i <= sheet.getLastRow();i++){
    if(name == sheet.getRange(i, 1).getValue()){
      return sheet.getRange(i, 2).getValue();
    }
  }
  return -1;
}
//將註冊好的token和名字存到token試算表裡