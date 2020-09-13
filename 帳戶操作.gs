//新增帳戶(Token 網頁使用的函式)
//正常回傳值為0
//錯誤碼
//-1:該住戶已存在
function register(name, token){
  //如住戶不在名冊中，回傳-1
  get_systemVariable();
  Logger.log(name, sysVariable.unregistered.includes(name), token);
  if(sysVariable.unregistered.includes(name)){
    sysVariable.resident[name]["token"] = token;
    sysVariable.unregistered.splice(sysVariable.unregistered.indexOf(name), 1);
    write_json(system_id, sysVariable);
  }
  else return -1;
  return 1;
}

//刪除帳戶 需要全部重寫
function deleteResident(name){
  sysVariable.startRow = 4;
  if(name in sysVariable.resident){
    var jsonFile = DriveApp.getFileById(system_id);
    delete sysVariable.group[sysVariable.resident[name].gender + sysVariable.resident[name].group][sysVariable.group[sysVariable.resident[name].gender + sysVariable.resident[name].group].indexOf(name)];
    delete sysVariable.residence[sysVariable.resident[name].residence][sysVariable.residence[sysVariable.resident[name].residence].indexOf(name)];
    jsonFile.setContent(JSON.stringify(sysVariable));
  }
  else return -1;
  var recordSheet = SpreadsheetApp.openById(sysVariable.id.record).getSheetByName(gloVariable.thisWeek);
  line = getLine(name, recordSheet, 2);
  if(line != -1)
  recordSheet.deleteRow(line);
  return 0;
}
//刪除活力組
//正常回傳值為0
//錯誤碼
//-1:尚有住戶未刪除
//-2:活力組不存在
function deleteGroup(name, gender){
  if((gender + name) in sysVariable.group){
    delete sysVariable.group[gender + name];
  }
  else return -2;
  var recordSheet = SpreadsheetApp.openById(sysVariable.id.record).getSheetByName(gloVariable.thisWeek);
  //若為姊妹活力組，找分隔線的位置
  if(dealGender(gender) == "bs"){
    for(let i = gvar_startRow;i < recordSheet.getLastRow();i++){
      if(recordSheet.getRange(i, 1).getBackground() == sysVariable.sisterColor){
          sysVariable.startRow = i;
          break;
      }
    }
  }
  var line = getLine(name, recordSheet, 1);
  //若活力組不存在則回傳2
  if(line < 0) return 2;
  Logger.log(line);
  //若尚有住戶未刪除則回傳-1
  if(!recordSheet.getRange(line - 1, 2).isBlank()) return -1;
  var jsonFile = DriveApp.getFileById(system_id);
  jsonFile.setContent(JSON.stringify(sysVariable));
  recordSheet.deleteRow(line);
  return 0;
}