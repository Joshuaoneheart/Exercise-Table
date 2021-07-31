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


const ModifyResident = () => {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              住戶名冊修改
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs="4">
                  <CListGroup id="list-tab" role="tablist">
                    <CListGroupItem onClick={() => setActiveTab(0)} action active={activeTab === 0} >Home</CListGroupItem>
                    <CListGroupItem onClick={() => setActiveTab(1)} action active={activeTab === 1} >Profile</CListGroupItem>
                    <CListGroupItem onClick={() => setActiveTab(2)} action active={activeTab === 2} >Messages</CListGroupItem>
                    <CListGroupItem onClick={() => setActiveTab(3)} action active={activeTab === 3} >Settings</CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol xs="8">
                  <CTabContent>
                    <CTabPane active={activeTab === 0} >
	  					<CListGroup>
	  						<CListGroupItem>
	  							<CRow className="align-items-center">							
									<CCol xs="5" sm="9" md="9" lg="10">	
										游一心
									</CCol>
	  								<CCol xs="1" sm="1" md="1">
										<CButton block variant="ghost" color="secondary"><CIcon name="cil-pencil"/></CButton>
	  								</CCol>
	  								<CCol xs="1" sm="1" md="1">
										<CButton block variant="ghost" color="danger"><CIcon name="cil-trash"/></CButton>
	  								</CCol>
	  							</CRow>
	  						</CListGroupItem>
	  						<CListGroupItem color="secondary">石諾盟</CListGroupItem>
	  						<CListGroupItem>曾揚哲</CListGroupItem>
	  						<CListGroupItem color="secondary">王XX</CListGroupItem>
	  						<CListGroupItem>陳XX</CListGroupItem>
	  					</CListGroup>
                    </CTabPane>
                    <CTabPane active={activeTab === 1}>
                      <p>Cupidatat quis ad sint excepteur laborum in esse qui. Et excepteur consectetur ex nisi eu do cillum ad laborum. Mollit et eu officia
                        dolore sunt Lorem culpa qui commodo velit ex amet id ex. Officia anim incididunt laboris deserunt
                        anim aute dolor incididunt veniam aute dolore do exercitation. Dolor nisi culpa ex ad irure in elit eu dolore. Ad laboris ipsum
                        reprehenderit irure non commodo enim culpa commodo veniam incididunt veniam ad.</p>
                    </CTabPane>
                    <CTabPane active={activeTab === 2}>
                      <p>Ut ut do pariatur aliquip aliqua aliquip exercitation do nostrud commodo reprehenderit aute ipsum voluptate. Irure Lorem et laboris
                        nostrud amet cupidatat cupidatat anim do ut velit mollit consequat enim tempor. Consectetur
                        est minim nostrud nostrud consectetur irure labore voluptate irure. Ipsum id Lorem sit sint voluptate est pariatur eu ad cupidatat et
                        deserunt culpa sit eiusmod deserunt. Consectetur et fugiat anim do eiusmod aliquip nulla
                        laborum elit adipisicing pariatur cillum.</p>
                    </CTabPane>
                    <CTabPane active={activeTab === 3}>
                      <p>Irure enim occaecat labore sit qui aliquip reprehenderit amet velit. Deserunt ullamco ex elit nostrud ut dolore nisi officia magna
                        sit occaecat laboris sunt dolor. Nisi eu minim cillum occaecat aute est cupidatat aliqua labore
                        aute occaecat ea aliquip sunt amet. Aute mollit dolor ut exercitation irure commodo non amet consectetur quis amet culpa. Quis ullamco
                        nisi amet qui aute irure eu. Magna labore dolor quis ex labore id nostrud deserunt dolor
                        eiusmod eu pariatur culpa mollit in irure.</p>
                    </CTabPane>
                  </CTabContent>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ModifyResident
