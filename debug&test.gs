//若有記錄錯誤或無法復原之更動，可重新記錄該週數據
//待優化和加註解
function recheckRecord() {
  var whichWeek = 2;//要重新記錄第前幾周的回覆
  var sheet = makeWeekTitle(whichWeek, 1);
  var form = FormApp.openById(gvar_exercising_table_form_id);  
  //取得表單回覆內容
  var formResponse = form.getResponses();
  //設定該週開始與截止時間
  var weekStart = new Date(year=2020,month=2,day=15);//星期一時間
  var weekEnd = new Date(year=2020,month=2,day=16);//下星期一時間
  gvar_nameRow = getLine(name, gvar_sheet_id["record"], sheet, 2);
  var last = formResponse.length - 1;
  var start = 0;
  clearRecord(gvar_sheet_id["record"], sheet, 0)
  for(var i = 0;i <= last;i++){
    var timestamp = formResponse[i].getTimestamp();
      if(timestamp - weekStart > 0){
      start = i;
      break;
    }
  }
  for(var i = start;i <= last;i++){
    gvar_startCol = 3;
      var timestamp = formResponse[i].getTimestamp();
      if(timestamp - weekEnd > 0){
          break;
      }    
      var itemResponses = formResponse[i].getItemResponses();
      var gender = dealGender(itemResponses[0].getResponse());
      if(gender == 2){
         gvar_startRow = 51;
      }
      else{
         gvar_startRow = 3;
      }
    
      var name = itemResponses[2].getResponse();
      gvar_nameRow = getLine(name, gvar_sheet_id["record"], sheet, 2);
      Logger.log(timestamp, name);
      //if(!SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(sheet).getRange(gvar_nameRow,3).isBlank()) continue;
      var subjectIndex = 0;  
      for(var j = 0;j < itemResponses.length;j++)
      {
          subjectIndex = enumerateSubjectIndex(itemResponses[j].getItem().getTitle())
          //儲存
          saveRes(itemResponses[j], gvar_nameRow, subjectIndex, sheet);
      }
  }
}
//測試函數
function test(){
  var a = dealOnTime;
  Logger.log(a);
  Logger.log(a("準時到"))
}