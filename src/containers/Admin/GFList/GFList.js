import CIcon from "@coreui/icons-react";
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
} from "@coreui/react";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import { Link } from "react-router-dom";
const GFListBody = ({ data }) => {
  const fields = [
    { key: "name", _style: { width: "7%" } },
    { key: "school", label: "學校", _style: { width: "7%" } },
    { key: "department", label: "科系", _style: { width: "20%" } },
    { key: "grade", label: "年級", _style: { width: "7%" } },
    { key: "note", label: "備註", _style: { width: "50%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  return (
    <CCardBody>
      <CDataTable
        items={data}
        fields={fields}
        columnFilter
        tableFilter
        itemsPerPage={10}
        hover
        sorter
        pagination
        scopedSlots={{
          show_details: (item) => {
            return (
              <Link to={"/GF/" + item.id}>
                <CIcon name="cil-info" style={{marginTop: "40%"}}/>
              </Link>
            );
          },
        }}
      />
    </CCardBody>
  );
};
const GFList = () => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>福音朋友資料</CCardHeader>
          <FirestoreCollection path="/GF/">
            {(d) => {
              if (d.isLoading) return loading;
              if (d && d.value) {
                // add "id" to data
                for (var i = 0; i < d.value.length; i++) {
                  d.value[i]["id"] = d.ids[i];
                }
                return <GFListBody data={d.value} />;
              } else return null;
            }}
          </FirestoreCollection>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default GFList;
