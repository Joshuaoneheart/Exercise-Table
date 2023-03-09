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
import Groups from "Models/Groups";
import { useState } from "react";
import ModifyListGroupItem from "./ModifyListGroupItem";
import { AddModal, DeleteModal, TransferModal } from "./ModifyModal";
/*
format of page
string(group or residence)
*/
const ModifyCard = ({ default_data, page, title }) => {
  var [activeTab, setActiveTab] = useState(0);
  const [transferModal, setTransferModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  var titles = [];
  var [groups, setGroups] = useState(
    new Groups(default_data.value, default_data.ids)
  );
  var group_members = [];
  groups.groupBy(page);
  if (activeTab >= groups.length - 1) activeTab = Math.max(groups.length - 2, 0);
  var contents = [];
  var add_modal_options = [];
  var group_name = page === "group" ? "活力組" : "住處";

  for (var i = 0; i < groups.length; i++) {
    // remove Admin resident
    if (!groups.ids[i]) {
      // add a resident into addmodal options if he is not in any group
      for (let j = 0; j < groups.list[i].length; j++) {
        add_modal_options.push(
          <option value={j} key={i}>
            {groups.getAccount(i, j).displayName}
          </option>
        );
      }
    } else {
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
  }
  for (let i = 0; i < group_members.length; i++) {
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        <CListGroup accent>{group_members[i]}</CListGroup>
      </CTabPane>
    );
  }
  for (let i = 0; i < groups.names.length; i++) {
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
        {groups.names[i]}
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
                  {groups.names.length ? groups.names[activeTab] : null}
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
                    name: groups.names[activeTab],
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
                  groups: groups.names[activeTab],
                  index: activeTab,
                  title: "住戶",
                })
              }
            >
              新增住戶
            </CButton>{" "}
            <CButton
              variant="ghost"
              color="primary"
              onClick={async () => {
                var check = window.confirm("確定儲存修改嗎？");
                if (!check) return;
                await groups.save();
                alert("儲存完成");
              }}
            >
              儲存變更
            </CButton>
          </CButtonToolbar>
        </CCol>
      </CCardFooter>
    </CCard>
  );
};

export default ModifyCard;
