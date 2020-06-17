//新增帳戶(Token 網頁使用的函式)
//正常回傳值為0
//錯誤碼
//-1:該住戶已存在
//-2:該住處不存在
//-3:該活力組不存在
function addResident(name, residence, gender, group, token){
  //如住戶在名冊中，回傳-1
  //if(getLine(group, gvar_sheet_id["record"] ,gvar_thisWeek, 1) != -1) return -1;
  //寫進token試算表中
  var tokenSheet = SpreadsheetApp.openById(gvar_sheet_id["token"]).getSheetByName("resident");
  tokenSheet.getRange(tokenSheet.getLastRow() + 1, 1, 1, 2).setValues([[name, token]]);
  //寫進回覆紀錄試算表中
  var recordSheet = SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(gvar_thisWeek);
  //若為姊妹，找分隔線的位置
  if(dealGender(gender) == 2){
    for(let i = gvar_startRow;i < recordSheet.getLastRow();i++){
      if(recordSheet.getRange(i, 1).getBackground() == gvar_partingLineColor){
          gvar_startRow = i;
          break;
      }
    }
  }
  Logger.log(gvar_startRow);
  //找到活力組所在列數
  var line = getLine(group, gvar_sheet_id["record"] ,gvar_thisWeek, 1);
  //若活力組不存在，回傳-3
  Logger.log(line);
  if(line == -1) return -3;
  recordSheet.insertRows(line);
  recordSheet.getRange(line - 1, 2, 1, recordSheet.getLastColumn() - 1).copyTo(recordSheet.getRange(line, 2, 1, recordSheet.getLastColumn() - 1));
  clearRecord(gvar_sheet_id["record"], gvar_thisWeek, line);
  recordSheet.getRange(line, 2).setValue(name);
  //寫進住處名冊裡
  var residenceSheet = SpreadsheetApp.openById(gvar_sheet_id["residence"]).getSheetByName(residence);
  //若住處名冊不存在，回傳-2
  if(residenceSheet == null) return -2;
  residenceSheet.getRange(residenceSheet.getLastRow() + 1, 1).setValue(name);
  return 0;
}
//刪除帳戶
function deleteResident(name, residence){
   //從token試算表中刪除
  var tokenSheet = SpreadsheetApp.openById(gvar_sheet_id["token"]).getSheetByName("resident");
  gvar_startRow = 1;
  var line = getLine(name, gvar_sheet_id["token"] ,"resident", 1);
  if(line != -1)
  tokenSheet.deleteRow(line);
  //從回覆紀錄試算表中刪除
  gvar_startRow = 4;
  var recordSheet = SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(gvar_thisWeek);
  line = getLine(name, gvar_sheet_id["record"],gvar_thisWeek, 2);
  if(line != -1)
  recordSheet.deleteRow(line);
  //從住處名冊裡刪除
  gvar_startRow = 1;
  var residenceSheet = SpreadsheetApp.openById(gvar_sheet_id["residence"]).getSheetByName(residence);
  line = getLine(name, gvar_sheet_id["residence"] ,residence, 1);
  Logger.log(line);
  if(line != -1)
  residenceSheet.deleteRow(line);
  return 0;
}
//刪除活力組
//正常回傳值為0
//錯誤碼
//-1:尚有住戶未刪除
//2:活力組不存在
function deleteGroup(name, gender){
  var recordSheet = SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(gvar_thisWeek);
  //若為姊妹活力組，找分隔線的位置
  if(dealGender(gender) == 2){
    for(let i = gvar_startRow;i < recordSheet.getLastRow();i++){
      if(recordSheet.getRange(i, 1).getBackground() == gvar_partingLineColor){
          gvar_startRow = i;
          break;
      }
    }
  }
  var line = getLine(name, gvar_sheet_id["record"],gvar_thisWeek, 1);
  //若活力組不存在則回傳2
  if(line < 0) return 2;
  Logger.log(line);
  //若尚有住戶未刪除則回傳-1
  if(!recordSheet.getRange(line - 1, 2).isBlank()) return -1;
   recordSheet.deleteRow(line);
  return 0;
}