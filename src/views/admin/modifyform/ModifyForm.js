import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
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
  var titles = [];
  var contents = [];
  for(var i = 0;i < data.ids.length;i++){
	titles.push(<CListGroupItem key={i} onClick={function(i){setActiveTab(i)}.bind(null, i)} action active={activeTab === i}>{data.ids[i]}</CListGroupItem>)
	var tmp_content = [];
	console.log(data.value[i]);
	for(var j = 0;j < data.value[i]["problem"].length;j++){
		tmp_content.push(
			<CListGroupItem key={j}>
				<CRow className="align-items-center">							
					<CCol xs="5" sm="9" md="9" lg="10">	
						{data.value[i]["problem"][j]["title"]}
					</CCol>
					<CCol xs="1" sm="1" md="1">
						<CButton block variant="ghost" color="secondary"><CIcon name="cil-pencil"/></CButton>
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
			</CCardBody>
  )
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
	  			<ModifyCard data={d} />
			  </CCard>
			</CCol>);}}
	    </FirestoreCollection>
      </CRow>
    </>
  )
}

export default ModifyForm
