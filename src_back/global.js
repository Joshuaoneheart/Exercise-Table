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

//製作出周檔名字串(若在周日運行此函式會回傳上周的一到六ex.3/15 執行 return 3/8~3/14)
//start為開始的那周(為0則回傳這週，為1則回週上週，為n則回傳n週前的)
//span為跨越幾周
function makeWeekTitle(start, span){
  var date = new Date();
  if(start){
    date.setTime(date.getTime() - 7 * start * sysVariable.day);
  }
  var weekStart = new Date();
  var weekEnd;
  if(date.getDay() == 0){
    date.setTime(date.getTime() - sysVariable.day);
  }
  for(let i = 0;i <= 6;i++){
    //找星期六，若找到則往回推6天找出這周範圍
    if(date.getDay() == 6){
      weekEnd = date;
      weekStart.setTime(date.getTime() - 6 * sysVariable.day);
      break;
    }
    date.setTime(date.getTime() + sysVariable.day);
  }
  weekEnd.setTime(weekEnd.getTime() + 7 * (span - 1) * sysVariable.day);
  var title;
  //將周檔名字串更新至全域變數裡
  title = String(weekStart.getMonth() + 1);
  title += "/" + String(weekStart.getDate()) + "~";
  title += String(weekEnd.getMonth() + 1) + "/" + String(weekEnd.getDate())
  return title;
}