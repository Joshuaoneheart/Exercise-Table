import { firebase, DB } from "db/firebase";
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

const GetAccountsMap = async (include_admin) => {
  let accounts = await DB.getByUrl("/accounts");
  let accountsMap = {};
  await accounts.forEach((doc) => {
    if (!include_admin && doc.data().role === "Admin") return;
    if (doc.data().status === "Pending") return;
    accountsMap[doc.id] = doc.data().displayName;
  });
  return accountsMap;
};
export { GetSemesterData, GetAccountsMap };
