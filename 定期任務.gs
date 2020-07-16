//關閉表單接收回覆功能
function closeForm(){
  if(!start()) return;
  var form = FormApp.openById(sysVariable.id.form);  
  form.setAcceptingResponses(false);
}
//開啟表單接收回覆功能
function openForm(){
  if(!start()) return;
  var form = FormApp.openById(sysVariable.id.form);  
  form.setAcceptingResponses(true);
}
//每周歸零一次表單，並將上周的存到上周表單裡
function refreshSheetWeekly(){
  if(!start()) return;
  var dataFile = DriveApp.getFileById(sysVariable.id.data);
  var data = JSON.parse(jsonFile.getBlob().getDataAsString());
  data[sysVariable.thisWeek] = {};
  jsonFile.setContent(JSON.stringify(data));
}
