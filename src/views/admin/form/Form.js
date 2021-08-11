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
  CTabs,
  CCardHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { loading } from 'src/reusable'
import { FirestoreCollection } from '@react-firebase/firestore'

const DataTabs = (data) => {
	var tabs = [];
	for(var i = 0;i < data.ids.length;i++){
		
	}
	var tabpanes = [];
}

const Form = () => {

  return (
    <CRow>
	  <FirestoreCollection path="/form/">
	  	{(d) => { return d.isLoading? loading: (
		  <CCol>
			<CCard>
			  <CCardHeader>
				表單
			  </CCardHeader>
			  <CCardBody>
				<CTabs>
				  <CNav variant="tabs">
					<CNavItem>
					  <CNavLink>
						Home
					  </CNavLink>
					</CNavItem>
					<CNavItem>
					  <CNavLink>
						Profile
					  </CNavLink>
					</CNavItem>
					<CNavItem>
					  <CNavLink>
						Messages
					  </CNavLink>
					</CNavItem>
				  </CNav>
				  <CTabContent>
					<CTabPane>
					</CTabPane>
					<CTabPane>
					</CTabPane>
					<CTabPane>
					</CTabPane>
				  </CTabContent>
				</CTabs>
			  </CCardBody>
			  <CCardFooter>
			  </CCardFooter>
			</CCard>
		  </CCol>)}}
	  </FirestoreCollection>
    </CRow>
  )
}

export default Form
