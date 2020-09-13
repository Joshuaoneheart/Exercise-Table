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
  var data = read_json(sysVariable.id.data);
  data[gloVariable.thisWeek] = {};
  data["unfilled"] = [];
  jsonFile.setContent(JSON.stringify(data));
  write_json(sysVariable.id.data, data);
}
