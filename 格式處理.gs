//處理準時到
function dealOnTime(content){
  if(content.includes("準時到"))return 2;
   else if(content.includes("有到")) return 1;
   return 0;
}
//處理篇數
function dealPiece(content){
 if(content.includes("2篇"))return 2;
   else if(content.includes("1篇")) return 1;
   return 0;
}
//處理表單回答中的"3+"
function dealPlus(number){
  if(number.includes("3+")) return "3";
  else return number;
}
//處理有或沒有
function dealHave(content){
  if(content.includes("沒有")){
    return 0;
  }
  return 1;
}
//判斷是弟兄或姊妹
function dealGender(gender){
  if(gender.includes("弟兄")){
    return 1;
  }
  else if(gender.includes("姊妹")){
    return 2;
  }
  return -1;
}
/*將每個項目一一對應到一個index
1->晨興
2->讀經
3->個人禱告
4->就寢
5->活力組
6->福音湧流
7->福音出訪
8->搭伙
9->讀經小組
10->邀來主日
11->家聚會
12->飯前/飯後
13->守望禱告
14->聚會操練
15->聚會申言
16->生命讀經
17->共同追求
99->回饋
*/
function enumerateSubjectIndex(str){
  if(str.includes("晨興享受"))return 1;
     else if(str.includes("讀經(按個人進度)") || str.includes("讀經(天)")) return 2;
     else if(str.includes("個人禱告")) return 3;
     else if(str.includes("就寢"))return 4;
     else if(str.includes("活力組")) return 5;
     else if(str.includes("福音湧流")) return 6;
     else if(str.includes("福音出訪")) return 7;
     else if(str.includes("搭伙")) return 8;
     else if(str.includes("讀經小組")) return 9;
     else if(str.includes("邀來主日")) return 10;
     else if(str.includes("家聚會") || str.includes("牧養總人次")) return 11;
     else if(str.includes("飯前/飯後") || str.includes("飯食服事")) return 12;
     else if(str.includes("守望禱告")) return 13;
     else if(str.includes("聚會操練") || str.includes("校園、社區排") || str.includes("禱告聚會") || str.includes("集中晚禱") || str.includes("主日申言訓練") || str.includes("主日擘餅聚會")) return 14;
     else if(str.includes("聚會申言")) return 15;
     else if(str.includes("讀生命讀經")) return 16;
     else if(str.includes("共同追求")) return 17;
     else if(str.includes("回饋")) return 99;
return 0;
}
function isChina(s){   
var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;   
if(!patrn.exec(s)){   
return false;   
}  
else{   
return true;   
} 
}