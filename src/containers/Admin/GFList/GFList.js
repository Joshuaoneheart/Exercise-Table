import CIcon from "@coreui/icons-react";
import {
  CRow,
  CButton,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
} from "@coreui/react";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import AddGFModal from "components/AddGFModal";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const GFListCard = ({ data }) => {
  const [addModal, setAddModal] = useState(false);
  const [d, setD] = useState(data);
  const fields = [
    { key: "name", label: "姓名", _style: { width: "7%" } },
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
  useEffect(() => {
    setD(data);
  }, [data]);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol md="11">福音朋友資料</CCol>
          <CCol md="1">
            <CButton
              variant="ghost"
              color="primary"
              onClick={() => {
                setAddModal(true);
              }}
            >
              <CIcon name="cil-plus" />
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <AddGFModal
          show={addModal}
          setModal={setAddModal}
          data={d}
          setData={setD}
        />
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
                <td>
                  <Link to={"/GF/" + item.id}>
                    <CIcon name="cil-info" />
                  </Link>
                </td>
              );
            },
          }}
        />
      </CCardBody>
    </CCard>
  );
};
const GFList = () => {
  return (
    <CRow>
      <CCol>
        <FirestoreCollection path="/GF/">
          {(d) => {
            if (d.isLoading) return loading;
            if (d && d.value) {
              // add "id" to data
              for (var i = 0; i < d.value.length; i++) {
                d.value[i]["id"] = d.ids[i];
              }
              return <GFListCard data={d.value} />;
            } else return null;
          }}
        </FirestoreCollection>
      </CCol>
    </CRow>
  );
};
export default GFList;
