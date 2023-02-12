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
  CDropdownToggle,
  CListGroup,
  CRow,
  CTabContent,
  CTabPane
} from "@coreui/react";
import { FirestoreBatchedWrite } from "@react-firebase/firestore";
import { useState } from "react";
import ModifyListGroupItem from "./ModifyListGroupItem";
import { AddModal, DeleteModal, TransferModal } from "./ModifyModal";
/*
format of page
string(group or residence)
*/
const ModifyCard = ({ default_data, page, title }) => {
  const [data, setData] = useState(default_data);
  var [activeTab, setActiveTab] = useState(0);
  const [transferModal, setTransferModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  var titles = [];
  var [groups, setGroups] = useState([]);
  var group_members = [];
  for (let i = 0; i < groups.length; i++) group_members.push([]);

  if (activeTab >= groups.length) activeTab = Math.max(groups.length - 1, 0);
  var contents = [];
  var add_modal_options = [];
  var group_name = page === "group" ? "活力組" : "住處";
  for (var i = 0; i < data.ids.length; i++) {
    // remove Admin resident
    if (data.value[i].role !== "Member") continue;
    if (!data.value[i][page]) {
      // add a resident into addmodal options if he is not in any group
      add_modal_options.push(
        <option value={i} key={i}>
          {data.value[i].displayName}
        </option>
      );
      continue;
    }
    // maintain list of groups
    if (!groups.includes(data.value[i][page])) {
      groups.push(data.value[i][page]);
      group_members.push([]);
    }
    group_members[groups.indexOf(data.value[i][page])].push(
      <ModifyListGroupItem
        index={i}
        key={group_members[groups.indexOf(data.value[i][page])].length}
        name={data.value[i].displayName}
        setTransferModal={setTransferModal}
        setDeleteModal={setDeleteModal}
        activeTab={activeTab}
      />
    );
  }
  for (let i = 0; i < groups.length; i++) {
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        <CListGroup accent>{group_members[i]}</CListGroup>
      </CTabPane>
    );
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
        {groups[i]}
      </CDropdownItem>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol xs="5" md="7" lg="7" xl="8">
            {title}
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CDropdown>
                <CDropdownToggle color="info" style={{ color: "#FFFFFF" }}>
                  {groups.length ? groups[activeTab] : null}
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
                    page: "group",
                    title: group_name,
                  })
                }
              >
                <CIcon alt={"新增" + group_name} name="cil-library-add" />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={() =>
                  setDeleteModal({
                    type: "group",
                    title: group_name,
                    name: groups[activeTab],
                    index: activeTab,
                  })
                }
              >
                <CIcon alt={"刪除" + group_name} name="cil-trash" />
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
          page={page}
          show={transferModal}
          setModal={setTransferModal}
          groups={groups}
        />
        <DeleteModal
          data={data}
          setData={setData}
          page={page}
          show={deleteModal}
          setModal={setDeleteModal}
          groups={groups}
          setGroups={setGroups}
          group_members={group_members}
        />
        <AddModal
          names={add_modal_options}
          data={data}
          page={page}
          setData={setData}
          groups={groups}
          setGroups={setGroups}
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
                  page,
                  index: activeTab,
                  title: "住戶",
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
                          var tmp = {};
                          tmp[page] = data.value[idx][page];
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

export default ModifyCard;
