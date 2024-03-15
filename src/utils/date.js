// 2021/9/19(Sunday) 24:00
const BaseDate = new Date(2021, 8, 19, 24).getTime();
const GetWeeklyBase = () => {
  var now = new Date().getTime();
  return Math.floor((now - BaseDate) / 7 / 86400000);
};

const GetWeeklyBaseFromTime = (date) => {
  var now = new date.getTime();
  return Math.floor((now - BaseDate) / 7 / 86400000);
};

const WeeklyBase2String = (base) => {
  var end = new Date((base + 1) * 7 * 86400000 + BaseDate - 1);
  var start = new Date(base * 7 * 86400000 + BaseDate);
  return `${start.getMonth() + 1}/${start.getDate()}-${
    end.getMonth() + 1
  }/${end.getDate()}`;
};

export { BaseDate, GetWeeklyBase, WeeklyBase2String, GetWeeklyBaseFromTime };
