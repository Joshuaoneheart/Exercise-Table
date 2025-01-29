// 2021/9/19(Sunday) 24:00
const BaseDate = new Date(2021, 8, 19, 24).getTime();
const GetWeeklyBase = () => {
  var now = new Date().getTime();
  return Math.floor((now - BaseDate) / 7 / 86400000);
};

const WeeklyBase2StartDate = (base) => {
  return new Date(base * 7 * 86400000 + BaseDate);
}

const GetWeeklyBaseFromTime = (date) => {
  var now = date.getTime();
  return Math.floor((now - BaseDate) / 7 / 86400000);
};

const WeeklyBase2String = (base) => {
  var end = new Date((base + 1) * 7 * 86400000 + BaseDate - 1);
  var start = WeeklyBase2StartDate(base)
  return `${start.getMonth() + 1}/${start.getDate()}-${
    end.getMonth() + 1
  }/${end.getDate()}`;
};

const WeeklyBase2YearString = (base) => {
  var end = new Date((base + 1) * 7 * 86400000 + BaseDate - 1);
  var start = new Date(base * 7 * 86400000 + BaseDate);
  if (start.getFullYear() === end.getFullYear())
    return `${start.getFullYear()} ${start.getMonth() + 1}/${start.getDate()}-${
      end.getMonth() + 1
    }/${end.getDate()}`;
  else
    return `${start.getFullYear()} ${
      start.getMonth() + 1
    }/${start.getDate()}-${end.getFullYear()} ${
      end.getMonth() + 1
    }/${end.getDate()}`;
};

const FormatDate = (date) => {
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let m = date.getMonth() + 1,
    d = date.getDate();
  if (m < 10) m = `0${m}`;
  if (d < 10) d = `0${d}`;
  return (
    date.getFullYear() +
    "/" +
    m +
    "/" +
    d +
    "(" +
    weekday[date.getDay()] +
    ")" +
    " " +
    (date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()) +
    ":" +
    (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes())
  );
};

const registFormat = (item) => {
  let D;
  if (typeof item.registered === "string") {
    let textSplit = item.registered.split("/");
    D = new Date(
      parseInt(textSplit[0]),
      parseInt(textSplit[1]) - 1,
      parseInt(textSplit[2])
    );
  } else {
    D = item.registered.toDate();
  }
  return FormatDate(D);
};

export {
  BaseDate,
  WeeklyBase2StartDate,
  GetWeeklyBase,
  WeeklyBase2String,
  WeeklyBase2YearString,
  GetWeeklyBaseFromTime,
  FormatDate,
  registFormat,
};
