import { GetWeeklyBase, GetWeeklyBaseFromTime } from "utils/date";

const { DB } = require("db/firebase");
const { useState, useEffect } = require("react");

const useSemester = () => {
  const [semester, setSemester] = useState(null);
  const [semesters, setSemesters] = useState(null);
  useEffect(() => {
    if (semesters === null) {
      const getSemester = async () => {
        const data = await DB.getByUrl("/info/semester");
        setSemesters(data.semesters);
        let current = new Date();
        let tmp = null;
        for (let s of data.semesters) {
          if (current < s.start.toDate()) break;
          tmp = s;
          if (current <= s.end.toDate() && current >= s.start.toDate()) break;
        }
        setSemester(tmp);
      };
      getSemester();
    }
  });
  const getLastSemester = () => {
    if (semesters !== null) return semesters[semesters.length - 1];
  };
  const getSemesterByWeeklyBase = (week) => {
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
  const isCurrentSemester = () => {
    return (
      GetWeeklyBase() <= GetWeeklyBaseFromTime(semester.end.toDate()) &&
      GetWeeklyBase() >= GetWeeklyBaseFromTime(semester.start.toDate())
    );
  };
  return {
    semester,
    semesters,
    setSemester,
    getLastSemester,
    isCurrentSemester,
    getSemesterByWeeklyBase,
  };
};
export default useSemester;
