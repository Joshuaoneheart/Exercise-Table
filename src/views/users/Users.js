import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CDataTable,
  CRow
} from '@coreui/react'

import { FirestoreCollection } from "@react-firebase/firestore";

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
const loading = (
<div className="pt-3 text-center">
   <div className="sk-spinner sk-spinner-pulse"></div>
</div>
)

const Users = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }
  const [details, setDetails] = useState([])

const toggleDetails = (index) => {
	const position = details.indexOf(index)
	let newDetails = details.slice()
    if (position !== -1) {
	 	newDetails.splice(position, 1)
    } else {
		newDetails = [...details, index]
   	}
	setDetails(newDetails)
}

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  return (
    <CRow>
      <CCol xl={9}>
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
	  		  <FirestoreCollection path="/accounts">
	  			{d => {
					if(!d.isLoading) for(var i = 0;i < d.value.length;i++){
						d.value[i]["id"] = d.ids[i];
					}
					return d.isLoading? loading:(
				  <CDataTable
					items={d.value}
					fields={[
					  { key: 'email', _classes: 'font-weight-bold' },
					   'displayName', 'role', 'registered', 'status',
						{
						  key: 'show_details',
						  label: '',
						  _style: { width: '1%' },
						  sorter: false,
						  filter: false
						}
					]}
					hover
					sorter
					striped
					columnFilter
					pagination
					itemsPerPage={10}
					activePage={page}
					scopedSlots = {{
					  'status':
						(item)=>(
						  <td>
							<CBadge color={getBadge(item.status)}>
							  {item.status}
							</CBadge>
						  </td>
						),
					'show_details':
						(item, index)=>{
							return (
									<td className="py-2">
									  <CButton
										color="dark"
										variant="ghost"
										shape="square"
										size="sm"
										onClick={()=>{toggleDetails(index)}}
									  >
										{details.includes(index) ? 'Hide' : 'Show'}
									  </CButton>
									</td>
									)
						},
					'details':
						(item, index)=>{
							  return (
										<CCollapse show={details.includes(index)}>
										  <CCardBody>
											<h4>
											  {item.email}
											</h4>
											<p className="text-muted">User since: {item.registered}</p>
								  				{item.status === "Active" && 
											<CButton size="sm" color="danger">Unbind Account</CButton>}
								  				{item.status !== "Active" &&
											<CButton size="sm" color="info">Bind Account</CButton>}
										  </CCardBody>
										</CCollapse>
									  )
					  	}
					}}
				  />
				)}}
	  		  </FirestoreCollection>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
