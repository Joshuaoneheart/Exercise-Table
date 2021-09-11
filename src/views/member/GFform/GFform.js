import React, { useState } from 'react'
import {
  CCol,
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
  CInputRadio,
  CInputCheckbox,
  CLabel,
  CTabs,
  CCardHeader,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { loading } from 'src/reusable'
import { FirestoreCollection } from '@react-firebase/firestore'

const GFForm = () => {
  const title = ["家聚會", "小排", "主日"];
  return (
    <CRow>
		  <CCol>
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
		  <CCardFooter>
			<CButton variant="ghost" color="dark">提交表單</CButton>
		  </CCardFooter>
		</CCard>
		  </CCol>
    </CRow>
  )
}

export default Form
