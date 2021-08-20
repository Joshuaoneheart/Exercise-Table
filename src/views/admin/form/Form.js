import React, { useState } from 'react'
import {
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CCardFooter,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputRadio,
  CInputCheckbox,
  CLabel,
  CTabs,
  CCardHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { loading } from 'src/reusable'
import { FirestoreCollection } from '@react-firebase/firestore'
const Problem = (props) => {
	var frame = [];
	var option_style={color: "#000000", fontSize: "20px"};
	var title_style={color: "#636f83"};
	var button_style={height: "20px", width: "20px"};
	console.log(props.data);
	switch(props.data.type){
		case "Grid":
			var option_row = [];
			var row = [];
			option_row.push(<CCol></CCol>);
			for(var option of props.data["選項"].split(";")){
				option_row.push(<CCol style={Object.assign({}, option_style, {textAlign: "center"})}>{option}</CCol>)
			}
			for(var suboption of props.data["子選項"].split(";")){
				var subframe = [];
				subframe.push(<CCol style={option_style}>{suboption}</CCol>);
				for(var option of props.data["選項"].split(";")){
					subframe.push(
						<CCol style={{display: "flex", alignItems: "center",justifyContent: "center"}}>
					   		<CInputRadio className="form-check-input" name={suboption} value={option} style={Object.assign({}, button_style, {marginLeft: "2px"})}/>
						</CCol>
					)
				}
				row.push(
					<CRow>
						{subframe}
					</CRow>
				)
			}
			frame.push(
				<>
					<CRow>
						{option_row}
					</CRow>
					{row}
				</>
			)
			break;
		case "MultiChoice":
			for(var option of props.data["選項"].split(";")){
				frame.push(
				<CFormGroup variant="checkbox">
				   <CInputRadio className="form-check-input" name={props.data.title} value={option} style={button_style}/>
				   <CLabel variant="checkbox" style={Object.assign({}, option_style, {marginLeft:"10px"})}>{option}</CLabel>
				</CFormGroup>);
			}
			break;
		case "MultiAnswer":
			for(var option of props.data["子選項"].split(";")){
				frame.push(
				<CFormGroup variant="checkbox">
				   <CInputCheckbox className="form-check-input" name={props.data.title} value={option} style={button_style} />
				   <CLabel variant="checkbox" style={Object.assign({}, option_style, {marginLeft:"10px"})}>{option}</CLabel>
				</CFormGroup>);
			}
			break;
	}
	return (
		<>
		<CFormGroup style={{marginBottom:"25px"}}>
			<h4 style={title_style}>{props.data.title}</h4>
			<hr />
			<CCol>
				{frame}
			</CCol>
		</CFormGroup>
		</>
	)
}

const DataTabs = (props) => {
	var data = props.data;
	const [section, setSection] = useState(0);
	var tabs = [];
	var tabpanes = [];
	for(var i = 0;i < data.ids.length;i++){
		tabs.push(<CDropdownItem key={i} onClick={function(i){setSection(i);}.bind(null, i)}>{data.ids[i]}</CDropdownItem>)
		var tabContents = [];
		for(var j = 0;j < data.value[i]["problem"].length;j++){
			var problem = data.value[i]["problem"][j];
			tabContents.push(<Problem data={problem} key={j}/>);
		}
		tabpanes.push(
			<CTabPane key={i}>
				{tabContents}
			</CTabPane>)
	}
	return (
		<CCard>
		  <CCardHeader>
		  <CRow className="align-items-center">
			  <CCol style={{fontSize:"30px"}}>表單</CCol>
			  <CCol align="end">
				  <CDropdown>
					<CDropdownToggle color="info">
						{data.ids[section]}
					</CDropdownToggle>
					<CDropdownMenu>
						{tabs}
					</CDropdownMenu>
				  </CDropdown>
			  </CCol>
		  </CRow>
		  </CCardHeader>
		  <CCardBody>
			<CForm>
				<CTabs activeTab={section}>
				  <CTabContent>
					{tabpanes}
				  </CTabContent>
				</CTabs>
			</CForm>
		  </CCardBody>
		{props.submitable && <CCardFooter>
		  </CCardFooter>}
		</CCard>
	);
}

const Form = () => {

  return (
    <CRow>
	  <FirestoreCollection path="/form/">
	  	{(d) => { return d.isLoading? loading: (
		  <CCol>
			<DataTabs data={d}/>
		  </CCol>)}}
	  </FirestoreCollection>
    </CRow>
  )
}

export default Form
