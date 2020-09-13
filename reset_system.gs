var system_id = "1P0Xs1v1yeOUbj0PhmWmAXD_F2mkwoFQi"
var system_folder_id = "1ZglvAgIDoz3kNEU_tOSU3YG3BLlFNGez"
var sysVariable;
var gloVariable = {};

class Problem{
  constructor(title, type, subtitle, choices, type_function, score){
    this.title = title;
    this.type = type;
    this.subtitle = subtitle;
    this.choices = choices;
    this.type_function = type_function;
    this.score = score;
  }
}

//讀入system.json檔案作為系統變數
function get_systemVariable() {
  content = read_json(system_id)
  sysVariable = content;
  //這周的周檔名字串
  gloVariable.thisWeek = makeWeekTitle(0, 1);
  //上週的周檔名字串
  gloVariable.lastWeek = makeWeekTitle(1, 1);
  return content;
}

function once(){
  /*
  get_systemVariable();
  Logger.log(sysVariable.unregistered);
  */
  get_systemVariable();
  sendToLine("這是操練表系統的測試\n請不要驚慌","蕭善涓");
}

//讀取json檔
function read_json(file_id){
  var jsonFile = DriveApp.getFileById(file_id);
  return JSON.parse(jsonFile.getBlob().getDataAsString());
}

//寫入json檔
function write_json(file_id, content) {
  var jsonFile = DriveApp.getFileById(file_id);
  jsonFile.setContent(JSON.stringify(content));
}

//關閉系統
function shutdown(){
  var content = read_json(system_id);
  closeForm();
  content.enabled = 0;
  Logger.log(content.enabled);
  write_json(system_id, content);
}

//開啟系統
function reboot(){
  var content = read_json(system_id);
  content.enabled = 1;
  write_json(system_id, content);
  openForm();
}

//系統啟動判斷，能啟動為1反之為0
function start(){
  get_systemVariable();
  return sysVariable.enabled;
}

//檢查resident csv檔格式正確與否
function check_resident(string){
  var residents = {};
  var residences = {};
  var groups = {};
  var unregistered = [];
  var category = ["姓名","性別","活力組","住處"];
  var lines = string.split("\r\n");
  let tmp_group = lines[0].split(',')
  let tmp_residence = lines[1].split(',')
  Logger.log(tmp_group, tmp_residence);
  
  for(idx in tmp_group)if(tmp_group[idx]) groups[tmp_group[idx]] = {member:[]};
  for(idx in tmp_residence)if(tmp_residence[idx]) residences[tmp_residence[idx]] = {member:[]};
  Logger.log(groups, residences)
  
  for(let i = 2; i < lines.length;i++){
    var texts = lines[i].split(',');
    if(texts.length <= 1) continue;
    //if(texts.length != 4) return [0, "每行應提供四個資訊，請確認內容中不包含逗號"];
    if(!(texts[1] == 's' || texts[1] == 'b')) return [0, "住戶" + texts[0] + "的性別只能是'b'或's'"];
    for(var text;text < 4;text++) if(!texts[text].length) return [0, "住戶" + texts[0] + "的" + category[text] + "不可為空"];
    residents[texts[0]] = {}
    if(texts[0] in sysVariable.resident){
      if(texts[1] != sysVariable.resident[texts[0]].gender) return [0];
      if("token" in sysVariable.resident[texts[0]]) residents[texts[0]].token = sysVariable.resident[texts[0]].token;
      else unregistered.push(texts[0]);
    }
    else unregistered.push(texts[0]);
    residents[texts[0]]["gender"] = texts[1];
    if(!(texts[2] in groups)) return [0, texts[2] + "活力組不存在"];
    residents[texts[0]]["group"] = texts[2];
    groups[texts[2]].member.push(texts[0]);
    if(!(texts[3] in residences)) return [0, texts[3] + "住處不存在"];
    residents[texts[0]]["residence"] = texts[3];
    residences[texts[3]].member.push(texts[0]);
 }
  sysVariable.resident = residents;
  sysVariable.group = groups;
  sysVariable.residence = residences;
  sysVariable.unregistered = unregistered;
 return [1, ""];
}

//處理問題的格式並新增問題
function add_problem(argu){
  var title = argu[0];
  var type = argu[1];
  var subtitle = [];
  var choices = [];
  var score;
  var type_function;
  var testInteger = function(x){return Number.isInteger(x)};
  switch(type){
    case "a1":
      if(!Number.isInteger(parseInt(argu[3]))) return [0, "準時到的分數必須是數字"];
      if(!Number.isInteger(parseInt(argu[4]))) return [0, "有到的分數必須是數字"];
      subtitle = argu[2].split(' ').map(x => "星期" + x);
      score = [0, parseInt(argu[4]), parseInt(argu[3])];
      type_function = function(form){
        var item = form.addGridItem();
        item.setTitle(this.title);
        item.setRows(this.subtitle);
        item.setColumns(["準時到", "有到","沒到"]);
        item.setRequired(true);
        return item;
      }
      break;
    case "a2":
      if(!Number.isInteger(score = parseInt(argu[3]))) return [0, "分數必須是數字"];
      choices = argu[2].split(' ').map(x => "星期" + x);
      type_function = function(form){
        var item = form.addCheckboxItem();
        item.setTitle(this.title);
        item.setChoiceValues(this.choices);
        item.setRequired(false);
        return item;
      }
      break;
    case "a3":
      if(!Number.isInteger(parseInt(argu[3]))) return [0, "最大個數必須是數字"];
      if(!Number.isInteger(score = parseInt(argu[4]))) return [0, "分數必須是數字"];
      subtitle = argu[2].split(' ').map(x => "星期" + x);
      choices = Array.from(Array(parseInt(argu[3]) + 1).keys()).map(x => x + argu[5]).reverse();
      type_function = function(form){
        var item = form.addGridItem();
        item.setTitle(this.title);
        item.setRows(this.subtitle);
        item.setColumns(this.choices);
        item.setRequired(true);
        return item;
      }
      break;
    case "b1":
      if(!Number.isInteger(parseInt(argu[2]))) return [0, "最大個數必須是數字"];
      if(!Number.isInteger(score = parseInt(argu[3]))) return [0, "分數必須是數字"];
      choices = Array.from(Array(parseInt(argu[2]) + 1).keys());
      type_function = function(form){
        var item = form.addMultipleChoiceItem();
        item.setTitle(this.title);
        item.setChoiceValues(this.choices);
        item.setRequired(true);
        return item;
      }
      break;
    case "c1":
      if(!Number.isInteger(score = parseInt(argu[2]))) return [0, "分數必須是數字"];
      type_function = function(form){
        var item = form.addMultipleChoiceItem();
        item.setTitle(this.title);
        item.setChoiceValues(["有","沒有"]);
        item.setRequired(true);
        return item;
      }
      break;
    case "d1":
      var number = parseInt(argu[2]);
      if(!Number.isInteger(number)) return [0, "項數必須是數字"];
      if(!argu[3 + number].split(' ').map(x => parseInt(x)).every(testInteger)) return [0, "準時到的分數都必須是數字，請確認主題個數與項數一致"];
      if(!argu[3 + number + 1].split(' ').map(x => parseInt(x)).every(testInteger)) return [0, "有到的分數都必須是數字，請確認主題個數與項數一致"];
      subtitle = [];
      for(var i = 0;i < number;i++) subtitle.push(argu[3 + i]);
      score = [0, argu[3 + number + 1].split(' ').map(x => parseInt(x)), argu[3 + number].split(' ').map(x => parseInt(x))];
      type_function = function(form){
        var item = form.addGridItem();
        item.setTitle(this.title);
        item.setRows(this.subtitle);
        item.setColumns(["準時到", "有到","沒到"]);
        item.setRequired(true);
        return item;
      }
      break;
    case "d2":
      var number = parseInt(argu[2]);
      if(!Number.isInteger(number)) return [0, "項數必須是數字"];
      if(!Number.isInteger(parseInt(argu[3 + number]))) return [0, "次數必須是數字，請確認主題個數與項數一致"];
      if(!argu[3 + number + 1].split(' ').map(x => parseInt(x)).every(testInteger)) return [0];
      for(let i = 0;i < problem.number;i++) subtitle.push(argu[3 + i]);
      choices = Array.from(Array(parseInt(argu[3 + number]) + 1).keys());
      score = argu[3 + number + 1].split(' ').map(x => parseInt(x));
      type_function = function(form){
        var item = form.addGridItem();
        item.setTitle(this.title);
        item.setRows(this.subtitle);
        item.setColumns(this.choices);
        item.setRequired(true);
        return item;
      }
      break;
    case "d3":
      var number = parseInt(argu[2]);
      if(!Number.isInteger(number)) return [0, "項數必須是數字"];
      if(!argu[3 + number].split(' ').map(x => parseInt(x)).every(testInteger)) return [0, "分數必須是數字，請確認主題個數與項數一致"];
      for(var i = 0;i < number;i++) subtitle.push(argu[3 + i]);
      score = argu[3 + number].split(' ').map(x => parseInt(x));
      type_function = function(form){
        var item = form.addGridItem()();
        item.setTitle(this.title);
        item.setRows(this.subtitle);
        item.setColumns(["有","沒有"]);
        item.setRequired(true);
        return item;
      }
      break;
  }
  var problem = new Problem(title, type, subtitle, choices, type_function, score);
  gloVariable.problem.push(problem);
  return [1];
}

//檢查problem csv檔格式正確與否，回傳[正確與否(bool), 錯誤訊息]
function check_problem(string){
  string = string.split("\r\n");
  var section = [];
  var section_index = 0;
  var onset = 2;
  gloVariable.problem = [];
  sysVariable.semester = string[0].split(',')[0];
  sysVariable.problem_number = parseInt(string[1].split(',')[0]);
  for(var i = 0;i < sysVariable.problem_number;i++){
    var line = string[i + onset].split(',');
    var title = line[0].split(' ')[0];
    if(title == 'B'){
      if(section_index) section[section_index - 1].push(i);
      if(line[0].substring(2).length){
        section.push([line[0].substring(2), i]);
        section_index++;
      }
      else return [0, "第" + (i + onset +　1) + "行的分區標題為空"];
      onset++;
    }
    line = string[i + onset].split(',');
    var result = add_problem(line);
    if(!result[0]) return [0, "第" + (i + onset +　1) + "行的" + result[1]];
  }
  section[section_index - 1].push(sysVariable.problem_number - 1);
  sysVariable.section = section;
  sysVariable.problem = gloVariable.problem;
  return [1, ""];
}

//系統重置函式
function reset(resident, problem){
  //取得sysVariable
  if(start()) return [-1, "系統未關閉"];
  var form = FormApp.openById(sysVariable.id.form);
  //存下上個系統的學期資料
  var semester = sysVariable.semester;
  // 對上傳文檔做格式檢查並預備system.json內資料
  var resident_out = check_resident(resident);
  var problem_out = check_problem(problem);
  Logger.log(resident_out, problem_out)
  if(!resident_out[0]) return [-2, resident_out[1]];
  else if(!problem_out[0]) return [-3, problem_out[1]];
  Logger.log(sysVariable.problem);
  Logger.log(sysVariable.resident);
  Logger.log(sysVariable.unregistered);
  
  //備份之前系統資料
  var system_folder = DriveApp.getFolderById(system_folder_id);
  var backup_folder = DriveApp.createFolder("操練表系統" + semester);
  var files = system_folder.getFiles();
  while(files.hasNext()){
    let file = files.next();
    file.makeCopy(backup_folder);
  }
  files = system_folder.getFiles();
  while(files.hasNext()){
    //因為表單複製時會莫名多出一份副本，故把副本刪除
    let file = files.next();
    Logger.log(file.getName(),file.getName().includes("副本"));
    if(file.getName().includes("副本")) {
      file.setTrashed(true);
   }
  }
  
  
  //更動表單
  //刪除所有回覆
  form.deleteAllResponses();
  //刪除原有表單的題目
  while(form.getItems().length > 2){
    form.deleteItem(2);
  }
  var item = form.addMultipleChoiceItem();
  item.setChoiceValues(Object.keys(sysVariable.resident).sort(function(a, b){
    if(sysVariable.resident[a].gender == 'b') return -1;
    else if(sysVariable.resident[b].gender == 'b') return 1;
    else if(b[0] > a[0]) return -1;
    else return 1;
  }))
  item.setTitle("我的名字是");
  item.setRequired(true);
  var section = 0;
  for(let i = 0;i < sysVariable.problem.length;i++){
    if(i == sysVariable.section[section][2]) section++;
    if(section < sysVariable.section.length){
      if(i == sysVariable.section[section][1]){
        item = form.addPageBreakItem();
        item.setTitle(sysVariable.section[section][0]);
      }
    }
    sysVariable.problem[i].type_function(form);
  }
  item = form.addPageBreakItem();
  item.setTitle("填寫完畢")
  item = form.addTextItem();
  item.setTitle("回饋/ Feedback")
  Logger.log(sysVariable.problem)
  
  //寫入system.json及重置data.json
  var data = {};
  //紀錄最後一次重置系統的時間
  sysVariable.last_change = JSON.stringify(new Date());
  
  //寫入系統變數並清空資料
  write_json(system_id, sysVariable);
  write_json(sysVariable.id.data, data);
  return [0];
}