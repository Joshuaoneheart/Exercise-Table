import { GetWeeklyBaseFromTime, GetWeeklyBase } from "./date";

const GetLastSemester = (semesters) => {
  if (semesters !== null) return semesters[semesters.length - 1];
};
const GetSemesterByWeeklyBase = (week, semesters) => {
  if (semesters)
    for (let s of semesters) {
      if (week < GetWeeklyBaseFromTime(s.start.toDate())) return null;
      if (
        week <= GetWeeklyBaseFromTime(s.end.toDate()) &&
        week >= GetWeeklyBaseFromTime(s.start.toDate())
      )
        return s;
    }
  return null;
};
const IsCurrentSemester = (semester) => {
  return (
    GetWeeklyBase() <= GetWeeklyBaseFromTime(semester.end.toDate()) &&
    GetWeeklyBase() >= GetWeeklyBaseFromTime(semester.start.toDate())
  );
};
export { GetLastSemester, IsCurrentSemester, GetSemesterByWeeklyBase };
