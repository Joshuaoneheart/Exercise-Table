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
import { AccountContext } from "hooks/context";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
const GFListCard = ({ data }) => {
  const [addModal, setAddModal] = useState(false);
  const account = useContext(AccountContext);
  const [d, setD] = useState(data);
  const fields = [
    { key: "name", label: "姓名", _style: { width: "7%" } },
    { key: "school", label: "學校", _style: { width: "7%" } },
    { key: "department", label: "科系", _style: { width: "20%" } },
    { key: "grade", label: "年級", _style: { width: "7%" } },
    { key: "type", label: "身份", _style: { width: "7%" } },
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
          <CCol xs="10" md="11">
            牧養對象資料
          </CCol>
          <CCol xs="1" md="1">
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
          account={account}
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
  const account = useContext(AccountContext);
  return (
    <CRow>
      <CCol>
        <FirestoreCollection path="/GF/">
          {(d) => {
            if (d.isLoading) return loading;
            if (d && d.value) {
              // add "id" to data
              const data = [];
              for (var i = 0; i < d.value.length; i++) {
                if (
                  account.role === "Admin" ||
                  account.gender === d.value[i].gender
                )
                  data.push(Object.assign(d.value[i], { id: d.ids[i] }));
              }
              console.log(data);
              return <GFListCard data={data} />;
            } else return null;
          }}
        </FirestoreCollection>
      </CCol>
    </CRow>
  );
};
export default GFList;
