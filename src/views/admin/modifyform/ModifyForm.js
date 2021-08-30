import React, { useState } from "react";
import {
  CButton,
  CButtonToolbar,
  CCol,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
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
import { loading } from 'src/reusable'
import { FirestoreCollection } from "@react-firebase/firestore";
const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  var [activeTab, setActiveTab] = useState(0);
  const [modifyModal, setModifyModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  if(data.ids.length <= activeTab) activeTab = (data.ids.length > 0)? data.ids.length - 1: 0;
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
    for (var j = 0; j < data.value[i]["problem"].length; j++) {
      tmp_content.push(
        <CListGroupItem accent="secondary" color="secondary" key={j}>
          <CRow className="align-items-center">
            <CCol xs="5" sm="9" md="9" lg="10" style={{color:"#000000"}}>
              {data.value[i]["problem"][j]["title"]}
            </CCol>
            <CCol>
		  	<CButtonToolbar justify="end">
              <CButton
                variant="ghost"
                color="dark"
                onClick={function (i, j) {
                  setModifyModal([i, j]);
                }.bind(null, i, j)}
              >
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton variant="ghost" color="danger" onClick={function(i, j){
				  setDeleteModal({"type": "problem", "title": "問題", "index": [i, j], "name": data.value[i]["problem"][j].title});
			  }.bind(null, i, j)}>
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
	  <CCol>
	  表單修改
	  </CCol>
	  <CCol>
	  	<CButtonToolbar justify="end">
	  		<CDropdown>
	  			<CDropdownToggle color="info" style={{color: "#FFFFFF"}}>{data.ids[activeTab]}</CDropdownToggle>
	  			<CDropdownMenu style={{overflow:"auto", maxHeight: "270px"}}>{titles}</CDropdownMenu>
	  		</CDropdown>
	  		<CButton variant="ghost" color="dark" onClick={function(){setAddModal({"title": "區塊", "type": "block"});}}>
	  			<CIcon alt="新增區塊" name="cil-library-add" />
	  		</CButton>
	  		<CButton variant="ghost" color="danger" onClick={function(activeTab){setDeleteModal({"type": "block", "title": "區塊", "name": data.ids[activeTab], "index": [activeTab]});}.bind(null, activeTab)}>
	  			<CIcon alt="刪除區塊" name="cil-trash" />
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
      <ModifyModal
        data={data}
        setData={setData}
        show={modifyModal}
        setModal={setModifyModal}
      />
	  <DeleteModal
	    data={data}
	  	setData={setData}
	  	show={deleteModal}
	  	setModal={setDeleteModal}
	  />
	  <AddModal
		data={data}
	  	setData={setData}
	  	show={addModal}
	  	setModal={setAddModal}
	  />
    </CCardBody>
  <CCardFooter>
	<CButtonToolbar>
		<CButton variant="ghost" color="dark" onClick={function(activeTab){setAddModal({"type": "problem", "title": "問題", "index": activeTab});}.bind(null, activeTab)}>新增問題</CButton>
	  	<FirestoreBatchedWrite>
	  		{({ addMutationToBatch, commit }) => {
				return (
					<CButton variant="ghost" color="primary" onClick={() =>{
						var check = window.confirm("確定儲存修改嗎？");
						if(!check) return;
						var pathPrefix = "/form/";
						for(idx in data.ids){
							var path = pathPrefix + data.ids[idx] + "/";
							addMutationToBatch({
								path,
								"value": data.value[idx],
								type: "set"
							});
						}
						commit().then(() => {alert("儲存完成")}).catch((error) => {console.log(error)});
					}}>
					儲存變更
					</CButton>
				)
				}
			}
	  	</FirestoreBatchedWrite>
	</CButtonToolbar>
  </CCardFooter>
</CCard>
);
};

const AddModal = (props) => {
  var [type, setType] = useState("MultiChoice");
  if(props.show == null){
	  return null;
  }
  var form = React.createRef();
  var writeData = () => {
	var data = props.data;
	switch(props.show.type){
		case "problem":
			var tmp = {};
			tmp["title"] = form.current.elements.title.value;
			tmp["type"] = form.current.elements.type.value;
			tmp["score"] = form.current.elements.score.value;
			if (tmp["type"] !== "MultiAnswer")
			  tmp["選項"] = form.current.elements.option.value;
			if (tmp["type"] !== "MultiChoice")
			  tmp["子選項"] = form.current.elements.suboption.value;
			var data = props.data;
			data.value[props.show.index]["problem"].push(tmp);
			break;
		case "block":
			data.value.push({"problem": []});
			data.ids.push(form.current.elements.name.value);
			break;
	}
	props.setData(data);
	props.setModal(null);
	setType("MultiChoice");
  };
  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
		setType("MultiChoice");
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
	  		{(props.show.type === "problem") && (<>
			  <CFormGroup row inline>
              <CCol md="3">
                <CLabel>標題</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="title" required />
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>類型</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect
                  onChange={function (type, setType, event) {
					  if(type !== event.target.value) setType(event.target.value);
                  }.bind(null, type, setType)}
                  name="type"
                  defaultValue="MultiChoice"
                >
                  <option value="MultiChoice">單選題</option>
                  <option value="MultiAnswer">多選題</option>
                  <option value="Grid">單選網格題</option>
                </CSelect>
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>分數</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="score" required />
              </CCol>
            </CFormGroup>
			{(type !== "MultiAnswer") && (
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>選項</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="option" required />
              </CCol>
            </CFormGroup>)}
            {(type !== "MultiChoice") && (
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>子選項</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="suboption" required/>
                </CCol>
              </CFormGroup>
            )}</>)}
	  		{(props.show.type === "block") && (
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>區塊名稱</CLabel>
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
        <CButton color="secondary" onClick={() => {props.setModal(null);setType("MultiChoice")}}>
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
	  switch(props.show.type){
		  case "problem":
			  data.value[props.show.index[0]]["problem"].splice(props.show.index[1], 1);
			  break;
		  case "block":
			  data.value.splice(props.show.index[0], 1);
			  data.ids.splice(props.show.index[0], 1);
			  break;
	  }
	  props.setData(data);
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

const ModifyModal = (props) => {
  var data = null;
  if (props.show != null)
    data = props.data.value[props.show[0]]["problem"][props.show[1]];
  let [type, setType] = useState("");
  var form = React.createRef();
  var writeData = () => {
    var tmp = {};
    tmp["title"] = form.current.elements.title.value;
    tmp["type"] = form.current.elements.type.value;
    tmp["score"] = form.current.elements.score.value;
    if (tmp["type"] !== "MultiAnswer")
      tmp["選項"] = form.current.elements.option.value;
	if (tmp["type"] !== "MultiChoice")
      tmp["子選項"] = form.current.elements.suboption.value;
    data = props.data;
    data.value[props.show[0]]["problem"][props.show[1]] = tmp;
    props.setData(data);
    props.setModal(null);
  };

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
                <CLabel>標題</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="title" defaultValue={data["title"]} />
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>類型</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect
                  onChange={function (type, setType, event) {
					  if(type !== event.target.value) setType(event.target.value);
                  }.bind(null, type, setType)}
                  name="type"
                  defaultValue={data["type"]}
                >
                  <option value="MultiChoice">單選題</option>
                  <option value="MultiAnswer">多選題</option>
                  <option value="Grid">單選網格題</option>
                </CSelect>
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>分數</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="score" defaultValue={data["score"]} />
              </CCol>
            </CFormGroup>
			{(type !== "MultiAnswer") && (
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>選項</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="option" defaultValue={data["選項"]} />
              </CCol>
            </CFormGroup>)}
            {(type !== "MultiChoice") && (
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>子選項</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="suboption" defaultValue={data["子選項"]} />
                </CCol>
              </CFormGroup>
            )}
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

const ModifyForm = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/form/">
          {(d) => {
            return d.isLoading ? (
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

export default ModifyForm;
