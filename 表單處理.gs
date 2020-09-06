//取得表單的回覆
function getFormResponse() {
  //if(!start()) return;
  start();
  //獲得資料
  var dataFile = DriveApp.getFileById(sysVariable.id.data);
  var data = JSON.parse(dataFile.getBlob().getDataAsString());
  var form = FormApp.openById(sysVariable.id.form);
  //取得表單回覆內容
  var formResponse = form.getResponses();
  //處理表單上問答內容
  var last = formResponse.length - 1;
  //取得表單上的項目
  var itemResponses = formResponse[last].getItemResponses();
  var total_score = 0; 
  var url = formResponse[last].getEditResponseUrl(); 
  var name = itemResponses[0].getResponse();
  var gender = (sysVariable.resident[name].gender == "b")? "弟兄":"姊妹";
  data[sysVariable.thisWeek][name] = {};
  var index = 1;
  for(var i = 0;i < sysVariable.problem_number;i++)
  {
    if(itemResponses[index].getItem().getType() == "PageBreakItem") index++;
    while(sysVariable.problem[i].title != itemResponses[index].getItem().getTitle()) i++;
    var content = itemResponses[index].getResponse();
    var problem = sysVariable.problem[i];
    if(Array.isArray(content) && problem.type != "a2"){
      content = content.map(x => get_format_function(problem.type)(x));
    }
    else content = get_format_function(problem.type)(content);
    let score = get_score_function(problem.type)(problem, content);
    total_score += score;
    data[sysVariable.thisWeek][name][i] = [content, score];
    index++;
  }
  dataFile.setContent(JSON.stringify(data));
  //儲存回饋
  saveFeedback(formResponse[last].getTimestamp(),itemResponses[itemResponses.length - 1].getResponse());
  //取得填寫表單時間
  var broadcast = "\n" + formResponse[last].getTimestamp() + "\n";
  //做出傳送到line裡的文字
  broadcast +=  name + gender + "\n";
  broadcast += "你的分數是："+ total_score + "分/151分" + "\n";
  broadcast += "點擊以下連結修改你已提交的表單：" + "\n" + url;
  sendToLine(broadcast, name);
  //送出表單到Line
  Logger.log(broadcast)
}
  
//儲存回饋
function saveFeedback(time, feedback){
  if(feedback == "" || feedback == "測試") return;
  Logger.log("aaa")
  var keyTable = SpreadsheetApp.openById(sysVariable.id.feedback);
  var sheet = keyTable.getSheetByName("feedback");
  Logger.log(keyTable)
  var range = sheet.getRange(sheet.getLastRow() + 1,1,1,2);
  range.setValues([[time,feedback]]);
}