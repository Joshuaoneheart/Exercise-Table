import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CListGroup,
  CRow,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import Groups from "Models/Groups";
import Select from "react-select";
import { useState } from "react";
import ModifyListGroupItem from "./ModifyListGroupItem";
import { AddModal, DeleteModal, TransferModal } from "./ModifyModal";
/*
format of page
string(group or residence)
*/
const ModifyCard = ({ default_data, page, title, map }) => {
  var [activeTab, setActiveTab] = useState(1);
  const [transferModal, setTransferModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  var titles = [];
  var [groups, setGroups] = useState(
    new Groups(default_data.value, default_data.ids, map)
  );
  var group_members = [];
  groups.groupBy(page);
  if (activeTab > groups.length - 1) activeTab = Math.max(groups.length - 1, 0);
  var contents = [];
  var add_modal_options = [];
  var group_name = page === "group" ? "活力組" : "住處";
  for (let i = 0; i < groups.list[0].length; i++) {
    // add a resident into addmodal options if he is not in any group
    if (
      groups.getAccount(0, i).role !== "Admin" &&
      groups.getAccount(0, i).status === "Active"
    )
      add_modal_options.push(
        <option value={groups.getAccount(0, i).id} key={i}>
          {groups.getAccount(0, i).displayName}
        </option>
      );
  }
  for (var i = 1; i < groups.length; i++) {
    // maintain list of groups
    group_members.push([]);
    for (let j = 0; j < groups.list[i].length; j++) {
      group_members[group_members.length - 1].push(
        <ModifyListGroupItem
          index={[i, j]}
          key_name={group_members[group_members.length - 1].length}
          name={groups.getAccount(i, j).displayName}
          setTransferModal={setTransferModal}
          setDeleteModal={setDeleteModal}
          activeTab={activeTab}
        />
      );
    }
  }
  for (let i = 0; i < group_members.length; i++) {
    contents.push(
      <CTabPane key={i} active={activeTab === i + 1}>
        <CListGroup accent>{group_members[i]}</CListGroup>
      </CTabPane>
    );
  }
  for (let i = 1; i < groups.names.length; i++) {
    titles.push({
      idx: i,
      value: groups.names[i],
      label: <span style={{ whiteSpace: "pre" }}>{groups.names[i]}</span>,
    });
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol>{title}</CCol>
          <CCol xs="4" md="3">
            <Select
              style={{ width: "80%" }}
              value={{
                idx: activeTab,
                value: groups.names[activeTab],
                label: (
                  <span style={{ whiteSpace: "pre" }}>
                    {groups.names[activeTab]}
                  </span>
                ),
              }}
              isSearchable
              options={titles}
              onChange={(v) => {
                setActiveTab(v.idx);
              }}
            />
          </CCol>
          <CCol xs="3" md="2">
            <CRow alignHorizontal="end" style={{ padding: "inherit" }}>
              <CButtonGroup>
                <CButton
                  variant="outline"
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
                  variant="outline"
                  color="danger"
                  onClick={() =>
                    setDeleteModal({
                      type: "group",
                      title: group_name,
                      id: groups.ids[activeTab],
                      index: activeTab,
                    })
                  }
                >
                  <CIcon alt={"刪除" + group_name} name="cil-trash" />
                </CButton>
              </CButtonGroup>
            </CRow>
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
          page={page}
          show={transferModal}
          setModal={setTransferModal}
          groups={groups}
          setGroups={setGroups}
        />
        <DeleteModal
          page={page}
          show={deleteModal}
          setModal={setDeleteModal}
          groups={groups}
          setGroups={setGroups}
          group_members={group_members}
        />
        <AddModal
          names={add_modal_options}
          page={page}
          groups={groups}
          setGroups={setGroups}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter align="right">
        <CButtonGroup>
          <CButton
            variant="outline"
            color="dark"
            onClick={() =>
              setAddModal({
                type: "resident",
                page,
                groups: groups.names[activeTab],
                index: activeTab,
                title: "住戶",
              })
            }
          >
            新增住戶
          </CButton>
          <CButton
            variant="outline"
            color="primary"
            onClick={async () => {
              var check = window.confirm("確定儲存修改嗎？");
              if (!check) return;
              await groups.save(page);
              alert("儲存完成");
            }}
          >
            儲存變更
          </CButton>
        </CButtonGroup>
      </CCardFooter>
    </CCard>
  );
};

export default ModifyCard;
