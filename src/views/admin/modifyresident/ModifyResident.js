import React, { useState } from "react";
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
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSelect,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FirestoreCollection, FirestoreBatchedWrite } from "@react-firebase/firestore";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  const [group, setGroup] = useState(props.group);
  var [activeTab, setActiveTab] = useState(0);
  const [transferModal, setTransferModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  if(activeTab >= data.ids.length) activeTab = (data.ids.length > 0)? data.ids.length - 1:0;
  var titles = [];
  var contents = [];
  for (var i = 0; i < data.ids.length; i++) {
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
          {data.ids[i]}
      </CDropdownItem>
    );
    var tmp_content = [];
    for (var j = 0; j < data.value[i]["member"].length; j++) {
      tmp_content.push(
		  //ToDo: Change ascent to danger when the name has not been bind
        <CListGroupItem key={j} accent="secondary" color="secondary">
          <CRow className="align-items-center">
            <CCol xs="4" sm="9" md="9" lg="9" style={{color: "#000000"}}>
              {data.value[i]["member"][j]}
            </CCol>
            <CCol>
		  	  <CButtonToolbar justify="end">
				  <CButton variant="ghost" color="dark">
					<CIcon name="cil-swap-horizontal" onClick={function(i, j){setTransferModal([i, j]).bind(null, i, j)}}/>
				  </CButton>
				  <CButton variant="ghost" color="danger" onClick={function(i, j){setDeleteModal({"title": "住戶", "type": "resident","name": data.value[i]["member"][j], "index": [i, j]})}.bind(null, i, j)}>
					<CIcon name="cil-trash" />
				  </CButton>
		  	  </CButtonToolbar>
            </CCol>
          </CRow>
        </CListGroupItem>
      );
    }
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
		<CListGroup accent>
			{tmp_content}
		</CListGroup>
      </CTabPane>
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
			<CDropdownToggle color="info" style={{color: "#FFFFFF"}}>
	  			{data.ids[activeTab]}
			</CDropdownToggle>
			<CDropdownMenu style={{overflow: "auto", maxHeight: "270px"}}>
	  			{titles}
			</CDropdownMenu>
		</CDropdown>
	    <CButton variant="ghost" color="dark" onClick={() => setAddModal({"type": "residence", "title": "住處"})}>
		  <CIcon alt="新增住處" name="cil-library-add"/>
	    </CButton>
	    <CButton variant="ghost" color="danger" onClick={() => setDeleteModal({"type": "residence", "title":"住處", "name": data.ids[activeTab], "index": [activeTab]})}>
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
      />
	  <DeleteModal
	    data={data}
	  	setData={setData}
	  	group={group}
	  	setGroup={setGroup}
	  	show={deleteModal}
	  	setModal={setDeleteModal}
	  />
	  <AddModal
		data={data}
	  	group={props.group}
	  	setData={setData}
	  	setGroup={setGroup}
	  	show={addModal}
	  	setModal={setAddModal}
	  />
    </CCardBody>
  <CCardFooter>
	<CCol align="end">
	  <CButtonToolbar>
        <CButton variant="ghost" color="dark" onClick={() => setAddModal({"type": "resident", "index": activeTab})}>
	  	新增住戶
        </CButton>
	  	<FirestoreBatchedWrite>
	  		{({ addMutationToBatch, commit }) => {
				return (
					<CButton variant="ghost" color="primary" onClick={() =>{
						var pathPrefix = "/residences/";
						for(var idx in data.ids){
							var path = pathPrefix + data.ids[idx] + "/";
							addMutationToBatch({
								path,
								"value": data.value[idx],
								type: "set"
							});
						}
						for(var idx in group.ids){
							var path = pathPrefix + group.ids[idx] + "/";
							addMutationToBatch({
								path,
								"value": group.value[idx],
								type: "set"
							});
						}
						commit().then(() => {alert("儲存完成")});
					}}>
					儲存變更
					</CButton>
				)
				}
			}
	  	</FirestoreBatchedWrite>
	  </CButtonToolbar>
	</CCol>
  </CCardFooter>
</CCard>
  );
};

const AddModal = (props) => {
  if(props.show == null){
	  return null;
  }
  var form = React.createRef();
  var writeData = () => {
	var data = props.data;
	var group = props.group;
	switch(props.show.type){
		case "resident":
			var data = props.data;
			var tmp = {};
			tmp["name"] = form.current.elements.name.value;
			tmp["group"] = form.current.elements.group.value;
			tmp["residence"] = data.ids[props.show.index];
			data.value[props.show.index]["member"].push(tmp["name"]);
			group.value[group.ids.indexOf(tmp["group"])]["member"].push(tmp["name"]);
			break;
		case "residence":
			data.value.push({"member": []});
			data.ids.push(form.current.elements.name.value);
			break;
	}
	props.setData(data);
	props.setGroup(group);
	props.setModal(null);
  };
  var options = [];
  for(var i in props.group.ids){
	  options.push(<option value={props.group.ids[i]} key={i}>{props.group.ids[i]}</option>)
  }
  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>新增{props.show.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
          <CForm
            innerRef={form}
            action=""
            method="post"
            encType="multipart/form-data"
            className="form-horizontal"
          >
	  		{(props.show.type === "resident") && (<>
			  <CFormGroup row inline>
              <CCol md="3">
                <CLabel>姓名</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="name" required />
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>活力組</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect
                  name="group"
                >
					{options}
                </CSelect>
              </CCol>
            </CFormGroup>
            </>)}
	  		{(props.show.type === "residence") && (
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>住處名稱</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="name" required/>
                </CCol>
              </CFormGroup>
			)}
          </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          新增
        </CButton>{" "}
        <CButton color="secondary" onClick={() => {props.setModal(null);}}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const DeleteModal = (props) => {
  if(props.show === null) return null;
  var deleteData = () => {
	  var data = props.data;
	  var group = props.group;
	  switch(props.show.type){
		  case "resident":
			  if(!("delete_resident" in data)) data["delete_resident"] = [];
			  data["delete_resident"].push(data.value[props.show.index[0]]["member"][props.show.index[1]]);
			  for(var i in group.ids){
				  var tmp = group.value[i]["member"].indexOf(data.value[props.show.index[0]]["member"][props.show.index[1]]);
				  if(tmp !== -1){
					  group.value[i]["member"].splice(tmp, 1);
					  break;
				  }
			  }
			  data.value[props.show.index[0]]["member"].splice(props.show.index[1], 1);
			  break;
		  case "residence":
			  if(data.value[props.show.index[0]].length !== 0){
				  alert("住處內尚有住戶，請將所有住戶刪除後再刪除住處");
				  break;
			  }
			  data.value.splice(props.show.index[0], 1);
			  data.ids.splice(props.show.index[0], 1);
			  break;
	  }
	  props.setData(data);
	  props.setGroup(group);
	  props.setModal(null);
  }
  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
	  color="danger"
    >
      <CModalHeader closeButton>
        <CModalTitle>刪除{props.show.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        確認刪除{props.show.title} {props.show.name} 嗎？
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={deleteData}>
          確認
        </CButton>{" "}
        <CButton color="secondary" onClick={() => props.setModal(null)}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const TransferModal = (props) => {
  var data = null;
  if(props.show == null) return null;
  var form = React.createRef();
  var writeData = () => {
    var tmp = form.current.elements.residence.value;
    data = props.data;
    data.value[props.show[0]]["problem"][props.show[1]] = tmp;
    props.setData(data);
    props.setModal(null);
  };
  var residences_option = data.ids;
  residences_option.splice(props.show.index, 1);
  

  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>修改問題</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {data !== null && (
          <CForm
            innerRef={form}
            action=""
            method="post"
            encType="multipart/form-data"
            className="form-horizontal"
          >
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>移動至</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect
                  name="residence"
                >
					{residences_option}
                </CSelect>
              </CCol>
            </CFormGroup>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          儲存修改
        </CButton>{" "}
        <CButton color="secondary" onClick={() => props.setModal(null)}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const ModifyResident = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/residences/">
          {(d) => {
            return d.isLoading ? (
              loading
            ) : (
              <CCol>
				<FirestoreCollection path="/groups/">
				{(g) => {return g.isLoading? loading: <ModifyCard data={d} group={g} />}}
				</FirestoreCollection>
              </CCol>
            );
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyResident;
