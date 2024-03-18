import { firebase } from "db/firebase";
import { GetWeeklyBaseFromTime } from "./date";
const GetSemesterData = async (id, semester) => {
  let data = { value: [], ids: [] };
  const tmp = await firebase
    .firestore()
    .collection("accounts")
    .doc(id)
    .collection("data")
    .where("week_base", ">=", GetWeeklyBaseFromTime(semester.start.toDate()))
    .get();
  await tmp.forEach((doc) => {
    data.value.push(doc.data());
    data.ids.push(doc.id);
  });
  return data;
};
export { GetSemesterData };
