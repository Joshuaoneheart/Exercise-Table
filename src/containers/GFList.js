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
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18n";

const GFListCard = ({ data }) => {
  const { t } = useTranslation("translation", { i18n })
  const [addModal, setAddModal] = useState(false);
  const account = useContext(AccountContext);
  const [d, setD] = useState(data);
  const fields = [
    { key: "name", label: t("姓名"), _style: { width: "7%" } },
    { key: "school", label: t("學校"), _style: { width: "7%" } },
    { key: "department", label: t("科系"), _style: { width: "20%" } },
    { key: "grade", label: t("年級"), _style: { width: "7%" } },
    { key: "type", label: t("身份"), _style: { width: "7%" } },
    { key: "note", label: t("備註"), _style: { width: "50%" } },
  ];
  const history = useHistory();
  useEffect(() => {
    setD(data);
  }, [data]);
  
  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol xs="10" md="11">
            {t("牧養對象資料")}
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
          clickableRows
          onRowClick={(item) => {
            history.push(`/GF/${item.id}`)
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
              return <GFListCard data={data} />;
            } else return null;
          }}
        </FirestoreCollection>
      </CCol>
    </CRow>
  );
};
export default GFList;
