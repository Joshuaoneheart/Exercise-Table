//關閉表單接收回覆功能
function closeForm(){
  var FORMNAME = "台大台科大弟兄姊妹之家 個人操練表";  
  var formHandle = DriveApp.getFilesByName(FORMNAME).next();
  var form = FormApp.openById(formHandle.getId());  
  form.setAcceptingResponses(false);
}
//開啟表單接收回覆功能
function openForm(){
  var FORMNAME = "台大台科大弟兄姊妹之家 個人操練表";  
  var formHandle = DriveApp.getFilesByName(FORMNAME).next();
  var form = FormApp.openById(formHandle.getId());  
  form.setAcceptingResponses(true);
}
//每周歸零一次表單，並將上周的存到上周表單裡
function refreshSheetWeekly(){
  var Table = SpreadsheetApp.openById(gvar_sheet_id["record"]);
  var sheet = Table.getSheetByName(gvar_lastWeek);
  //製作表單副本
  var newsheet = sheet.copyTo(Table);
  //副本改名
  newsheet.setName(gvar_thisWeek);
  //清空新表單內內容
  clearRecord(gvar_sheet_id["record"], newsheet.getName(), 0);
  for(let i = gvar_startRow;i < newsheet.getLastRow();i++){
    if(!newsheet.getRange(i, 2).isBlank())
    newsheet.getRange(i, 2).setBackground("#ffffff");
  }
}
//刪除過期回覆
function deleteExpiredResponses(){
  //刪除表單回復
  var form = FormApp.openById(gvar_exercising_table_form_id);
  var date = new Date();
  var deleteNum = 0;
  var responses = form.getResponses();
  date = date.setDate(date.getDate() - 14);
  for(var i = 0;i < responses.length;i++){
    if(responses[i].getTimestamp() - date < 0){
      form.deleteResponse(responses[i].getId());
      deleteNum++;
    }
  }
  //刪除試算表中紀錄
  var sheet = SpreadsheetApp.openById(gvar_sheet_id["temperary_response"]).getSheetByName("Responses");
  if(deleteNum != 0)
  sheet.deleteRows(2, 2 + deleteNum);
  //刪除試算表中回覆
}
