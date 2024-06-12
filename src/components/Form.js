import { CCol } from "@coreui/react";
import DataTabs from "./DataTab";
import loading from "./loading";
import { useEffect, useState } from "react";
import { DB } from "db/firebase";
import { GetProblems } from "utils/problem";

const GatherProblemsBySection = (d) => {
  var data = { value: [], sections: [] };
  for (var i = 0; i < d.length; i++) {
    // assign unique id to problem
    if (!data.sections.includes(d[i].section)) {
      data.sections.push(d[i].section);
      data.value.push([]);
    }
    data.value[data.sections.indexOf(d[i].section)].push(d[i]);
  }
  return data;
};

const Form = ({ default_data, account }) => {
  const [problems, setProblems] = useState(null);
  useEffect(() => {
    const GetData = async () => {
      const { id } = await DB.getByUrl("/info/form");
      setProblems(await GetProblems(id, true));
    };
    if (problems === null) GetData();
  });
  if (problems === null) return loading;
  return (
    <CCol>
      <DataTabs
        data={GatherProblemsBySection(problems)}
        default_data={default_data}
        account={account}
      />
    </CCol>
  );
};

export default Form;
