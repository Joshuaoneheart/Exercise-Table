import { CCol, CRow } from "@coreui/react";
import { FirestoreCollection } from "@react-firebase/firestore";
import DataTabs from "./DataTab";
import loading from "./loading";

const Form = () => {
  return (
    <CRow>
      <FirestoreCollection path="/form/">
        {/* 
            receiving form data from Firebase
            format of d.value
            {
                score: separated by ';',
                section: name of section in which the problem belongs,
                title: title of the problem,
                type: one of MultiChoice, MultiAnswer and Grid,
                選項: separated by ';'
            }
         */}
        {(d) => {
          if (d.isLoading) return loading;
          if (d && d.value) {
            var data = { value: [], sections: [] };
            for (var i = 0; i < d.value.length; i++) {
              d.value[i].id = d.ids[i];
              if (!data.sections.includes(d.value[i].section)) {
                data.sections.push(d.value[i].section);
                data.value.push([]);
              }
              data.value[data.sections.indexOf(d.value[i].section)].push(
                d.value[i]
              );
            }
            return (
              <CCol>
                <DataTabs data={data} metadata={d} />
              </CCol>
            );
          } else return null;
        }}
      </FirestoreCollection>
    </CRow>
  );
};

export default Form;
