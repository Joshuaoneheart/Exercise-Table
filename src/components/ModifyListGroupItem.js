import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonToolbar,
  CCol,
  CListGroupItem,
  CRow
} from "@coreui/react";
const ModifyListGroupItem = ({
  key,
  name,
  index,
  setTransferModal,
  setDeleteModal,
  activeTab,
}) => {
  //ToDo: Change ascent to danger when the name has not been bind
  return (
    <CListGroupItem key={key} accent="secondary" color="secondary">
      <CRow className="align-items-center">
        <CCol xs="4" sm="9" md="9" lg="9" style={{ color: "#000000" }}>
          {name}
        </CCol>
        <CCol>
          <CButtonToolbar justify="end">
            <CButton
              variant="ghost"
              color="dark"
              onClick={() => {
                setTransferModal({ index, group: activeTab });
              }}
            >
              <CIcon name="cil-swap-horizontal" />
            </CButton>
            <CButton
              variant="ghost"
              color="danger"
              onClick={() => {
                setDeleteModal({
                  title: "住戶",
                  type: "resident",
                  name,
                  index,
                });
              }}
            >
              <CIcon name="cil-trash" />
            </CButton>
          </CButtonToolbar>
        </CCol>
      </CRow>
    </CListGroupItem>
  );
};

export default ModifyListGroupItem;
