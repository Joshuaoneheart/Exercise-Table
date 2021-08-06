import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
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
  CTabPane
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { FirestoreCollection } from "@react-firebase/firestore";
const loading = (
 <div className="pt-3 text-center">
	 <div className="sk-spinner sk-spinner-pulse"></div>
 </div>
)
const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  const [activeTab, setActiveTab] = useState(0)
  const [modal, setModal] = useState(null);
  var titles = [];
  var contents = [];
  for(var i = 0;i < data.ids.length;i++){
	titles.push(<CListGroupItem key={i} onClick={function(i){setActiveTab(i)}.bind(null, i)} action active={activeTab === i}>{data.ids[i]}</CListGroupItem>)
	var tmp_content = [];
	for(var j = 0;j < data.value[i]["problem"].length;j++){
		tmp_content.push(
			<CListGroupItem key={j}>
				<CRow className="align-items-center">							
					<CCol xs="5" sm="9" md="9" lg="10">	
						{data.value[i]["problem"][j]["title"]}
					</CCol>
					<CCol xs="1" sm="1" md="1">
						<CButton block variant="ghost" color="secondary" onClick={function(i, j){setModal([i, j]);}.bind(null, i, j)}><CIcon name="cil-pencil"/></CButton>
					</CCol>
					<CCol xs="1" sm="1" md="1">
						<CButton block variant="ghost" color="danger"><CIcon name="cil-trash"/></CButton>
					</CCol>
				</CRow>
			</CListGroupItem>
		)
	}
	contents.push(
		<CTabPane key={i} active={activeTab === i} >
			{tmp_content}
		</CTabPane>
	)
  }
  return ( 
			<CCardBody>
			  <CRow>
				<CCol xs="4">
				  <CListGroup id="list-tab" role="tablist">
	  				{titles}
				  </CListGroup>
				</CCol>
				<CCol xs="8">
				  <CTabContent>
	  				{contents}
				  </CTabContent>
				</CCol>
			  </CRow>
	  		  <ModifyModal data={data} setData={setData} show={modal} setModal={setModal}/>
			</CCardBody>
  )
}

const ModifyModal = (props) => {
	var data = null;
	if(props.show != null) data = props.data.value[props.show[0]]["problem"][props.show[1]]; 
	const [isGrid, setGrid] = useState((data === null)? false : (data["type"] === "Grid"));
	var form = React.createRef();
	
	var writeData = () => {
		var tmp = {};
		tmp["title"] = form.current.elements.title.value;
		tmp["type"] = form.current.elements.type.value;
		tmp["score"] = form.current.elements.score.value;
		tmp["選項"] = form.current.elements.option.value;
		if(tmp["type"] === "Grid") tmp["子選項"] = form.current.elements.suboption.value;
		data = props.data;
		data.value[props.show[0]]["problem"][props.show[1]] = tmp;
		props.setData(data);
		props.setModal(null);
	}

	return (
		<CModal show={props.show !== null} onClose={() => {props.setModal(null)}}>
			<CModalHeader closeButton>
				<CModalTitle>修改問題</CModalTitle>
			</CModalHeader>
			<CModalBody>
				{(data !== null) &&
				(<CForm innerRef={form} action="" method="post" encType="multipart/form-data" className="form-horizontal">
					<CFormGroup row>
						<CCol md="3">
							<CLabel>標題</CLabel>
						</CCol>
						<CCol xs="12" md="9">
							<CInput name="title" defaultValue={data["title"]}/>
						</CCol>
					</CFormGroup>
					<CFormGroup row>
						<CCol md="3">
							<CLabel>類型</CLabel>
						</CCol>
						<CCol xs="12" md="9">
							<CSelect onChange={function(isGrid, setGrid, event){if((event.target.value === "Grid") ^ isGrid) setGrid(event.target.value === "Grid")}.bind(null, isGrid, setGrid)} name="type" defaultValue={data["type"]}>
								<option value="MultiChoice">單選題</option>
								<option value="MultiAnswer">多選題</option>
								<option value="Grid">單選網格題</option>
							</CSelect>
						</CCol>
					</CFormGroup>
					<CFormGroup row>
						<CCol md="3">
							<CLabel>分數</CLabel>
						</CCol>
						<CCol xs="12" md="9">
							<CInput name="score" defaultValue={data["score"]}/>
						</CCol>
					</CFormGroup>
					<CFormGroup row>
						<CCol md="3">
							<CLabel>選項</CLabel>
						</CCol>
						<CCol xs="12" md="9">
							<CInput name="option" defaultValue={data["選項"]}/>
						</CCol>
					</CFormGroup>
					{(isGrid) &&(
					<CFormGroup row>
						<CCol md="3">
							<CLabel>子選項</CLabel>
						</CCol>
						<CCol xs="12" md="9">
							<CInput name="suboption" defaultValue={data["子選項"]}/>
						</CCol>
					</CFormGroup>)}
				</CForm>)
				}
			</CModalBody>
			<CModalFooter>
				<CButton color="primary" onClick={writeData}>儲存修改</CButton>{' '}
				<CButton color="secondary" onClick={() => props.setModal(null)}>取消</CButton>
			</CModalFooter>
		</CModal>
	);
}

const ModifyForm = () => {
  return (
    <>
      <CRow>
	    <FirestoreCollection path="/form/">
	  {d => {return d.isLoading? loading: (<CCol>
			  <CCard>
				<CCardHeader>
				  表單修改
				</CCardHeader>
	  			<ModifyCard data={d}/>
			  </CCard>
			</CCol>);}}
	    </FirestoreCollection>
      </CRow>
    </>
  )
}

export default ModifyForm
