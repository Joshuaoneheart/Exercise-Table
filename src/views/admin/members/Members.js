import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CForm,
  CInput,
  // CListGroup,
  // CListGroupItem,
  CRow,
  // CTabContent,
  // CTabPane
} from '@coreui/react'
import {
  // CChart,
  // CChartBar,
  // CChartHorizontalBar,
  // CChartLine,
  // CChartDoughnut,
  CChartRadar,
  // CChartPie,
  CChartPolarArea,
} from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
// import { FirestoreCollection } from "@react-firebase/firestore";

const loading = (
 <div className="pt-3 text-center">
	 <div className="sk-spinner sk-spinner-pulse"></div>
 </div>
)
// TODO:
// 1. Set a function that takes input from firebase and renders the charts accordingly

// FIXME:
// 1. Write a proper function to handle the rendering part
const RenderBarRadar = () => {
    // This servers purely as an example
    const radar = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(179,181,198,0.2)',
        borderColor: 'rgba(179,181,198,1)',
        pointBackgroundColor: 'rgba(179,181,198,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
        data: [65, 59, 90, 81, 56, 55, 40],
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,99,132,1)',
        data: [28, 48, 40, 19, 96, 27, 100],
      },
    ],
  }; 
    return (
     <CRow className="col-md-6">
        <CCol>
          <h4>Radar</h4>
          <div className="chart-wrapper">
            <CChartRadar datasets={radar.datasets} labels={radar.labels}/>
          </div>
          <hr />
        </CCol>
      </CRow> 
    )
}
const RenderPolarArea = () => {
 const polar = {
    datasets: [
      {
        data: [
          11,
          16,
          7,
          3,
          14,
        ],
        backgroundColor: [
          '#FF6384',
          '#4BC0C0',
          '#FFCE56',
          '#E7E9ED',
          '#36A2EB',
        ],
        label: 'My dataset' // for legend
      }],
    labels: [
      'Red',
      'Green',
      'Yellow',
      'Grey',
      'Blue',
    ],
  };
    return(
     <CRow className="col-md-6">
        <CCol>
          <h4>Polar Area</h4>
          <div className="chart-wrapper">
            <CChartPolarArea datasets={polar.datasets} labels={polar.labels}/>
          </div>
          <hr />
        </CCol>
      </CRow> 

    )
}

const ModifyCard = () => {
    return (
        <CCardBody>
            Hello
        </CCardBody>
    )
}

const Members = () => {
  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
			<CCol xs="5" sm="9" md="9" lg="10">	
             <CDropdown>   
              <CDropdownToggle caret color="info">
                <CIcon name="cil-user"/> User              
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem header> List of Users</CDropdownItem>
                <CDropdownItem> Hey </CDropdownItem>
                <CDropdownItem> Hello </CDropdownItem>
              </CDropdownMenu>
             </CDropdown>
			</CCol>
             <CForm inline>
               <CInput
                 className="mr-sm-2"
                 placeholder="Search"
                 size="sm"
              />
              <CButton color="dark" type="submit" size="sm" ><CIcon name="cil-search" size="sm"/></CButton>
            </CForm>
          </CRow>
        </CCardHeader>
        <RenderBarRadar />
        <RenderPolarArea />
      </CCard>
    </>
  )  
}

export default Members
