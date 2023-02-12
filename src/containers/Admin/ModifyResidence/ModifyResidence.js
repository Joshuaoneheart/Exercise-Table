import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonToolbar,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle, CListGroup,
  CListGroupItem, CRow, CTabContent,
  CTabPane
} from "@coreui/react";
import {
  FirestoreBatchedWrite,
  FirestoreCollection
} from "@react-firebase/firestore";
import { loading } from "Components";
import { AddModal, DeleteModal, TransferModal } from "Components/ModifyModal";
import { useState } from "react";

const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  var [activeTab, setActiveTab] = useState(0);
  const [transferModal, setTransferModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  var titles = [];
  var [residences, setResidences] = useState([]);
  var residence_contents = [];
  for (let i = 0; i < residences.length; i++) {
    residence_contents.push([]);
  }
  if (activeTab >= residences.length)
    activeTab = Math.max(residences.length - 1, 0);
  var contents = [];
  var add_modal_options = [];
  for (var i = 0; i < data.ids.length; i++) {
    if (data.value[i].role !== "Member") continue;
    if (!data.value[i].residence) {
      add_modal_options.push(
        <option value={i} key={i}>
          {data.value[i].displayName}
        </option>
      );
      continue;
    }
    if (!residences.includes(data.value[i].residence)) {
      residences.push(data.value[i].residence);
      residence_contents.push([]);
    }
    residence_contents[residences.indexOf(data.value[i].residence)].push(
      //ToDo: Change ascent to danger when the name has not been bind
      <CListGroupItem
        key={
          residence_contents[residences.indexOf(data.value[i].residence)].length
        }
        accent="secondary"
        color="secondary"
      >
        <CRow className="align-items-center">
          <CCol xs="4" sm="9" md="9" lg="9" style={{ color: "#000000" }}>
            {data.value[i].displayName}
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CButton
                variant="ghost"
                color="dark"
                onClick={function (i, activeTab) {
                  setTransferModal({ index: i, group: activeTab });
                }.bind(null, i, activeTab)}
              >
                <CIcon name="cil-swap-horizontal" />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={function (i) {
                  setDeleteModal({
                    title: "住戶",
                    type: "resident",
                    name: data.value[i].displayName,
                    index: i,
                  });
                }.bind(null, i)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </CButtonToolbar>
          </CCol>
        </CRow>
      </CListGroupItem>
    );
  }
  for (let i = 0; i < residences.length; i++) {
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        <CListGroup accent>{residence_contents[i]}</CListGroup>
      </CTabPane>
    );
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
        {residences[i]}
      </CDropdownItem>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol xs="5" md="7" lg="7" xl="8">
            住戶名冊修改
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CDropdown>
                <CDropdownToggle color="info" style={{ color: "#FFFFFF" }}>
                  {residences.length ? residences[activeTab] : null}
                </CDropdownToggle>
                <CDropdownMenu style={{ overflow: "auto", maxHeight: "270px" }}>
                  {titles}
                </CDropdownMenu>
              </CDropdown>
              <CButton
                variant="ghost"
                color="dark"
                onClick={() =>
                  setAddModal({
                    type: "group",
                    page: "residence",
                    index: activeTab,
                    title: "住處",
                  })
                }
              >
                <CIcon alt="新增住處" name="cil-library-add" />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={() =>
                  setDeleteModal({
                    type: "group",
                    title: "住處",
                    page: "residence",
                    name: residences[activeTab],
                    index: activeTab,
                  })
                }
              >
                <CIcon alt="刪除住處" name="cil-trash" />
              </CButton>
            </CButtonToolbar>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <CTabContent>{contents}</CTabContent>
          </CCol>
        </CRow>
        <TransferModal
          data={data}
          setData={setData}
          show={transferModal}
          setModal={setTransferModal}
          groups={residences}
        />
        <DeleteModal
          data={data}
          setData={setData}
          show={deleteModal}
          setModal={setDeleteModal}
          groups={residences}
          group_members={residence_contents}
          setGroups={setResidences}
        />
        <AddModal
          names={add_modal_options}
          data={data}
          setData={setData}
          groups={residences}
          setGroups={setResidences}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter>
        <CCol align="end">
          <CButtonToolbar>
            <CButton
              variant="ghost"
              color="dark"
              onClick={() =>
                setAddModal({
                  type: "resident",
                  index: activeTab,
                  page: "residence",
                })
              }
            >
              新增住戶
            </CButton>{" "}
            <FirestoreBatchedWrite>
              {({ addMutationToBatch, commit }) => {
                return (
                  <CButton
                    variant="ghost"
                    color="primary"
                    onClick={() => {
                      var check = window.confirm("確定儲存修改嗎？");
                      if (!check) return;
                      var pathPrefix = "/accounts/";
                      for (var idx in data.ids) {
                        var path = pathPrefix + data.ids[idx];
                        if (data.value[idx].isChanged) {
                          var tmp = { residence: data.value[idx].residence };
                          addMutationToBatch({
                            path,
                            value: tmp,
                            type: "update",
                          });
                        }
                      }
                      commit()
                        .then(() => {
                          alert("儲存完成");
                        })
                        .catch((error) => {
                          alert(error);
                        });
                    }}
                  >
                    儲存變更
                  </CButton>
                );
              }}
            </FirestoreBatchedWrite>
          </CButtonToolbar>
        </CCol>
      </CCardFooter>
    </CCard>
  );
};

const ModifyResidence = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/accounts/">
          {(d) => {
            return !(d && d.value) ? (
              loading
            ) : (
              <CCol>
                <ModifyCard data={d} />
              </CCol>
            );
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyResidence;
