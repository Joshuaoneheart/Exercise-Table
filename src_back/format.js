//處理準時到
function dealOnTime(content){
  if(content.includes("準時到"))return 2;
   else if(content.includes("有到")) return 1;
   return 0;
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
    return "b";
  }
  else if(gender.includes("姊妹")){
    return "s";
  }
  return -1;
}

function get_format_function(type){
  var format_function = function(x){return x;};
  switch(type){
    case "a1":
      format_function = dealOnTime;
      break;
    case "a2":
      format_function = function(x){return x.length;};
      break;
    case "a3":
      format_function = parseInt;
      break;
    case "c1":
      format_function = dealHave;
      break;
    case "d1":
      format_function = dealOnTime;
      break;
    case "d3":
      format_function = dealHave;
      break;
  }
  return format_function;
}

function get_score_function(type){
  var score_function;
  switch(type){
    case "a1":
      score_function = function(problem, response){
        var score = 0;
        for(let i = 0;i < response.length;i++){
          score += problem.score[response[i]];
        }
        return score;
      }
      break;
    case "a2": case "b1": case "c1":
      score_function = function(problem, response){
        return response * problem.score;
      }
      break;
    case "a3":
      score_function = function(problem, response){
        var score = 0;
        for(let i = 0;i < response.length;i++){
          score += problem.score * response[i];
        }
        return score;
      }
      break;
    case "d1":
      score_function = function(problem, response){
        var score = 0;
        for(let i = 0;i < response.length;i++){
          if(response[i]) score += problem.score[response[i]][i];
        }
        return score;
      }
      break;
    case "d2":
      score_function = function(problem, response){
        var score = 0;
        for(let i = 0;i < response.length;i++){
          score += response[i] * problem.score[i];
        }
        return score;
      }
    case "d3":
      score_function = function(problem, response){
        var score = 0;
        for(let i = 0;i < response.length;i++){
          score += response[i] * problem.score[i];
        }
        return score;
      }
      break;
  }
  return score_function;
}