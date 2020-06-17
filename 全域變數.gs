//弟兄姊妹
class person{
  constructor(name, first, second){
    this.name=name;
    this.Score=[first, second];
    this.Revival = [0, 0];
    this.average = 0;
    this.revivalAvg = 0;
  }
  getAvg(){
    for(let i = 0;i < this.Revival.length;i++){
      this.revivalAvg += this.Revival[i];
    }
    this.revivalAvg /= 2;
    for(let i = 0;i < this.Score.length;i++){
      this.average += this.Score[i];
    }
    this.average /= 2;
  }
}
////活力組
class group{
  constructor(name, members, firstWeekRevival, firstScore, secondWeekRevival, secondScore){
    this.name=name;
    this.members = members;
    this.Revival = [firstWeekRevival, secondWeekRevival];
    this.Score = [firstScore, secondScore];
    this.revivalAvg = 0;
    this.average = 0;
  }
  getAvg(){
    for(let i = 0;i < this.Revival.length;i++){
      this.revivalAvg += this.Revival[i];
    }
    this.revivalAvg /= 2;
    for(let i = 0;i < this.Score.length;i++){
      this.average += this.Score[i];
    }
    this.average /= 2;
  }
}
//一天的毫秒數
var gvar_day = 24*3600*1000;
//紀錄表單符號
var gvar_performance = ["╳","△","○"];
//searchCol的起始欄
var gvar_startCol = 3;
//getline的起始列
var gvar_startRow = 4;
//這周的周檔名字串
var gvar_thisWeek = makeWeekTitle(0, 1);
//上週的周檔名字串
var gvar_lastWeek = makeWeekTitle(1, 1);
//這個回覆人姓名的所在列數
var gvar_nameRow;
//儲存列樹的動態規劃，以subjectIndex當作index
var gvar_dp_col = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//紀錄台科大的活力組
var gvar_ntust = ["BC1","BD1","BD2","BD3","SD1"]
//紀錄台大的活力組
var gvar_ntu = ["BA1","BA2","BA3","BB1","BC2","SA1","SA2","SB1","SB2","SC1","SC2","SD2"];
//製作標記已填表單的顏色
var gvar_acceptedColor = "#7dd181";
//製作標記未填表單的顏色
var gvar_wrongColor = "#ff0000";
//回覆表單中分隔弟兄姊妹的分隔線顏色
var gvar_partingLineColor = "#f4cccc";
//試算表ID map
var gvar_sheet_id = {feedback :"1xoy_RWUGJG3u5O3EW2Bi2Q-uiYojjDbJlfxKR7WWsss", record:"1gLB5LxBQZcqTiyqdUMPGvvyH93LjDahpDlxZOcsiAeY",
                     residence:"1iMVrTkJ88TNrISNsphIlOl-tyLVZXW0gZBbk7Zprnh4", token :"19uFo65lHXjZuwWArK4PXGYO54h7pIDESdGvMIPZav4E",
                     temperary_response:"1KgRKf3N36RZolStWqJdWAcRsCcn9UawbmHMZtKgDNW4"};
//操練表表單ID
var gvar_exercising_table_form_id = "1at--4Hm1XLjrJbQkREfBdGA4dbpTZDnkCnyDxBg6rXo";
//提醒文檔的ID
var gvar_notice_document_id = "1nlf7xdYaP5p3Vhl3OWiTbU7n9_vcdHyayR2kiT6xK38";
//儲存每人表現
var gvar_individuals;
//儲存各組表現
var gvar_groups;


//製作出周檔名字串(若在周日運行此函式會回傳上周的一到六ex.3/15 執行 return 3/8~3/14)
//start為開始的那周(為0則回傳這週，為1則回週上週，為n則回傳n週前的)
//span為跨越幾周
function makeWeekTitle(start, span){
  var date = new Date();
  if(start){
    date.setTime(date.getTime() - 7 * start * gvar_day);
  }
  var weekStart = new Date();
  var weekEnd;
  if(date.getDay() == 0){
    date.setTime(date.getTime() - gvar_day);
  }
  for(let i = 0;i <= 6;i++){
    //找星期六，若找到則往回推6天找出這周範圍
    if(date.getDay() == 6){
      weekEnd = date;
      weekStart.setTime(date.getTime() - 6 * gvar_day);
      break;
    }
    date.setTime(date.getTime() + gvar_day);
  }
  weekEnd.setTime(weekEnd.getTime() + 7 * (span - 1) * gvar_day);
  var title;
  //將周檔名字串更新至全域變數裡
  title = String(weekStart.getMonth() + 1);
  title += "/" + String(weekStart.getDate()) + "~";
  title += String(weekEnd.getMonth() + 1) + "/" + String(weekEnd.getDate())
  return title;
}
//將已過兩週報表內容做成個人物件
function getIndividuals(){
  var firstWeek = makeWeekTitle(2, 1);
  var firstSheet = SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(firstWeek);
  var j = 0;
  //將名字與物件index做一對一對應
  var map = {};
  var firstLastCol = firstSheet.getLastColumn();
  var firstLastRow = firstSheet.getLastRow();
  var individuals = [];
  var firstNameValues = firstSheet.getRange(4, 2, firstLastRow - 3,1).getValues();
  var firstRevivalValues = firstSheet.getRange(4, 12, firstLastRow - 3,1).getValues();
  var firstScoreValues = firstSheet.getRange(4, firstLastCol,firstLastRow - 3,1).getValues();
  for(var i = 0;i < firstNameValues.length;i++){
    if(firstNameValues[i][0].length != 0){
      var name = firstNameValues[i][0];
      var score = firstScoreValues[i][0];
      var firstRevival = firstRevivalValues[i][0];
      individuals[j] = new person(name,score,0);
      individuals[j].Revival[0] = firstRevival;
      map[name] = j;
      j++;
    }
  }
  var secondWeek = gvar_lastWeek;
  var secondSheet = SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(secondWeek);
  var secondLastCol = secondSheet.getLastColumn();
  var secondLastRow = secondSheet.getLastRow();
  var secondNameValues = secondSheet.getRange(4, 2, secondLastRow - 3,1).getValues();
  var secondRevivalValues = secondSheet.getRange(4, 12, secondLastRow - 3,1).getValues();
  var secondScoreValues = secondSheet.getRange(4, secondLastCol, secondLastRow - 3,1).getValues();
  var totalRevivalAvg = (firstSheet.getRange(88, 12).getValue() + secondSheet.getRange(88, 12).getValue()) / 2;
  for(var i = 0;i < secondNameValues.length;i++){
    if(secondNameValues[i][0].length != 0){
      var name = secondNameValues[i][0];
      var score = secondScoreValues[i][0];
      var secondRevival = secondRevivalValues[i][0];
      let index;
      if(name in map){
        index = map[name];
      }
      else{
        index = individuals.length;
        individuals[index] = new person(name,0,score);
      }
      individuals[index].Score[1] = score;
      individuals[index].Revival[1] = secondRevival;
      individuals[index].getAvg();
      if(individuals[index].revivalAvg < 5 && individuals[index].revivalAvg < totalRevivalAvg){
        individuals[index].average=0;
      }
    }
  }
  return individuals;
}
//將已過兩週報表內容做成團體物件
function getGroups(){
  var firstWeek = makeWeekTitle(2, 1);
  var firstSheet = SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(firstWeek);
  var j = 0;
  //將名字與物件index做一對一對應
  var map = {};
  var firstLastCol = firstSheet.getLastColumn();
  var firstLastRow = firstSheet.getLastRow();
  var groups = [];
  var prev = 4;
  var j = 0;
  var firstNameValues = firstSheet.getRange(4, 1,firstLastRow - 3,1).getValues();
  var firstRevivalValues = firstSheet.getRange(4, 12,firstLastRow - 3,1).getValues();
  var firstScoreValues = firstSheet.getRange(4, firstLastCol,firstLastRow - 3,1).getValues();
  for(var i = 4;i < firstNameValues.length;i++){
    if(firstNameValues[i][0].length != 0 && !isChina(firstNameValues[i][0])){
      let name = firstNameValues[i][0];
      let score = firstScoreValues[i][0];
      let members = firstSheet.getRange(prev, 2,i - prev + 4,1).getValues();
      let col = searchCol(gvar_sheet_id["record"], firstWeek, 1, 2) + 9;
      if(i < 50) name = "B" + name;
      else name = "S" + name;
      let revival = firstRevivalValues[i][0];
      groups[j] = new group(name, members, revival, score, 0, 0);
      map[name] = j;
      prev = i + 5;
      j++;    
    }
  }
  //Logger.log(map);
  var secondWeek = gvar_lastWeek;
  var secondSheet = SpreadsheetApp.openById(gvar_sheet_id["record"]).getSheetByName(secondWeek);
  var secondLastCol = secondSheet.getLastColumn();
  var secondLastRow = secondSheet.getLastRow();
  var secondNameValues = secondSheet.getRange(4, 1, secondLastRow - 3,1).getValues();
  var secondScoreValues = secondSheet.getRange(4, secondLastCol, secondLastRow - 3,1).getValues();
  var secondRevivalValues = secondSheet.getRange(4, 12,secondLastRow - 3,1).getValues();
  var totalRevivalAvg = (firstSheet.getRange(88, 12).getValue() + secondSheet.getRange(88, 12).getValue()) / 2;
  var col = searchCol(gvar_sheet_id["record"], secondWeek, 1, 2) + 9;
  for(var i = 4;i < secondNameValues.length;i++){
    if(secondNameValues[i][0].length != 0 && !isChina(secondNameValues[i][0])){
      var name = secondNameValues[i][0];
      let score = secondScoreValues[i][0];
      if(i < 50) name = "B" + name;
      else name = "S" + name;
      let revival = secondRevivalValues[i][0];
      groups[map[name]].Revival[1] = revival;
      groups[map[name]].Score[1] = score;
      groups[map[name]].getAvg();
      //Logger.log(groups[map[name]]);
      if(groups[map[name]].revivalAvg < 5 && groups[map[name]].revivalAvg < totalRevivalAvg){
        groups[map[name]].average=0;
      }
    }
  }
  return groups;
}
function get_sheet_id_map(){
//reset時用，取得每學期的各種sheet
}