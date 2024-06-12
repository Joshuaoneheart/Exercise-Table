import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import AddFormModal from "components/AddFormModal";
import { DB, firebase } from "db/firebase";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const FormListBody = ({ data }) => {
  const [currentForm, setForm] = useState(null);
  const history = useHistory();
  const fields = [
    { key: "name", label: "名稱", _style: { width: "90%" } },
    { key: "use", label: "", _style: { width: "5%" }, filter: false },
    { key: "delete", label: "", _style: { width: "5%" }, filter: false  },
  ];
  useEffect(() => {
    const GetCurrentForm = async () => {
      if (currentForm === null) {
        const form = await DB.getByUrl("/info/form");
        setForm(form.id);
      }
    };
    GetCurrentForm();
  });
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
        onRowClick={(item) => {
          history.push(`/form/${item.id}`);
        }}
        scopedSlots={{
          use: (item) => {
            if (currentForm === item.id) return <td />;
            else
              return (
                <td>
                  <CButton
                    color="success"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await DB.updateByUrl("/info/form", { id: item.id });
                      setForm(item.id);
                    }}
                  >
                    <CIcon name="cil-check" />
                  </CButton>
                </td>
              );
          },
          delete: (item) => {
            if (currentForm === item.id) return <td />;
            else
              return (
                <td>
                  <CButton
                    variant="outline"
                    color="danger"
                    onClick={async (e) => {
                      e.stopPropagation();
                      let check = window.confirm("確定要刪除此表單嗎？");
                      if (check) {
                        await firebase
                          .firestore()
                          .collection("forms")
                          .doc(item.id)
                          .delete();
                      }
                    }}
                  >
                    <CIcon alt="刪除區塊" name="cil-trash" />
                  </CButton>
                </td>
              );
          },
        }}
      />
    </CCardBody>
  );
};

const FormList = () => {
  const [addModal, setAddModal] = useState(false);
  return (
    <CRow>
      <CCol>
        <CCard>
          <AddFormModal show={addModal} setModal={setAddModal} />
          <CCardHeader>
            <CRow>
              <CCol xs="10" md="11">
                修改表單
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
          <FirestoreCollection path="/forms/">
            {(d) => {
              if (d.isLoading) return loading;
              if (d && d.value) {
                // add "id" to data
                for (var i = 0; i < d.value.length; i++) {
                  d.value[i]["id"] = d.ids[i];
                }
                return <FormListBody data={d.value} />;
              } else return null;
            }}
          </FirestoreCollection>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default FormList;
