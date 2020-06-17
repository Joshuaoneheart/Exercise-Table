//清除特定列中的回覆內容,如row = 0則清除全部回覆內容
function clearRecord(spreadSheet, sheet, row) {
  var sheet = SpreadsheetApp.openById(spreadSheet).getSheetByName(sheet);
  var rowNum;
  if(row == 0){
    rowNum = sheet.getLastRow() - 2;
    row = gvar_startRow;
  }
  else{
    rowNum = 1;
  }
  for(let i = 3;i <= sheet.getLastColumn();i++){
    range = sheet.getRange(2, i);
    if(enumerateSubjectIndex(range.getValue())){
      Logger.log(i);
      range = sheet.getRange(row, i, rowNum, 1);
      range.clearContent()
    }
  }
}
//儲存回答分項項目
function saveRes(Response, row, subjectIndex, sheet){
  var writeTable = SpreadsheetApp.openById(gvar_sheet_id["record"]);
  var writeSheet = writeTable.getSheetByName(sheet);
  var col = searchCol(gvar_sheet_id["record"], sheet, subjectIndex, 2);
  if(col <= 0) return;
  var title = Response.getItem().getTitle();
  var content = Response.getResponse();
  switch(subjectIndex){
    case 1:case 14:
      range = writeSheet.getRange(row, col, 1, content.length);
        var values = [[]];
        for(let i = 0;i < content.length;i++){
          values[0][i] = gvar_performance[dealOnTime(content[i])];
        }
        range.clearContent();
        range.setValues(values);
        gvar_startCol += content.length;
      break;
    case 2: case 3: case 4:
      range = writeSheet.getRange(row, col);
      range.clearContent();
      range.setValue(content.length);
      gvar_startCol += 1;
      break;
    case 5: case 8: case 9: case 10: case 11:
      range = writeSheet.getRange(row, col);
      content = Response.getResponse();
      range.setValue(dealPlus(content));
      gvar_startCol += 1;
      break;
    case 6: case 7: case 12: case 13: case 15:
      range = writeSheet.getRange(row, col);
        content = Response.getResponse();
        range.clearContent();
        switch(dealHave(content)){
            case 1:
            content = gvar_performance[2];
            break;
            case 0:
            content = gvar_performance[0];
            break;
        }
        range.setValue(content);
        gvar_startCol += 1;
      break;
     case 16:
        range = writeSheet.getRange(row, col, 1, content.length);
        var values = [[]];
        for(let i = 0;i < content.length;i++){
          values[0][i] = dealPiece(content[i]);
        }
        range.clearContent();
        range.setValues(values);
        gvar_startCol += content.length;
      break;
    case 17:
      range = writeSheet.getRange(row, col);
      range.clearContent();
      range.setValue(content);
      gvar_startCol += 1;
      break;
    default:
      break;
  }
}
//暴搜
//取得指定試算表裡指定欄位指定字串所在的行號
function getLine(str, SpreadSheet, sheet, col){
  var keyTable = SpreadsheetApp.openById(SpreadSheet);
  var sheet = keyTable.getSheetByName(sheet);
  for(var i = gvar_startRow;i <= sheet.getLastRow();i++){
    if(str == sheet.getRange(i, col).getValue()){
      return i;
    }
  }
  return -1;
}
//搜尋某一試算表中特定列的欄位
function searchCol (SpreadSheet, Sheet, subjectIndex, row){
  if(!subjectIndex) return 0;
  if(gvar_dp_col[subjectIndex] != 0) return gvar_dp_col[subjectIndex]; 
  var Table = SpreadsheetApp.openById(SpreadSheet);
  var Sheet = Table.getSheetByName(Sheet);
  for(var col = gvar_startCol;col <= Sheet.getLastColumn();col++){
    if(enumerateSubjectIndex(Sheet.getRange(row,col).getValue()) == subjectIndex){
      gvar_dp_col[subjectIndex] = col;
      return col;
    }
  }
  return -1;
}