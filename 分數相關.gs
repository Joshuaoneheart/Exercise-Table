//partition 子函式
function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}
//qsort 子函式
function partition(items, left, right){
    var pivot   = items[Math.floor((right + left) / 2)].average, //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i].average > pivot) {
            i++;
        }
        while (items[j].average < pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}
//排序
function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}
//獲得每兩週分數前三高的弟兄姊妹
function getTop(number){
  gvar_individuals = getIndividuals()
  quickSort(gvar_individuals, 0, gvar_individuals.length - 1);
  output = [];
  for(var i = 0;i < number;i++){
    output[i] = gvar_individuals[i];
  }
  Logger.log(output);
  return output;
}
//獲得每兩週分數前兩高的活力組
function getTopGroup(number){
  gvar_groups = getGroups();
  quickSort(gvar_groups, 0, gvar_groups.length - 1);
  output = [];
  var index = 0;
  for(var i = 0;i < number;i++){
    if(gvar_groups[i].revivalAvg < 5){
      number++;
      continue;
    }
    output[index] = gvar_groups[i];
    index++;
  }
  Logger.log(output);
  return output;
}
function getRank(){
  if(!start()) return;
  sendRankToServingOne(getTop(3), 3, getTopGroup(2), 2);
}