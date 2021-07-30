import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Login = (props) => {
  var username = React.createRef();
  var password = React.createRef();
  console.log(username)
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
			  <CCard className="p-4">
				<CCardBody>
				  <CForm>
					<h1>Login</h1>
					<p className="text-muted">Sign In to your account</p>
					<CInputGroup className="mb-3">
					  <CInputGroupPrepend>
						<CInputGroupText>
						  <CIcon name="cil-user" />
						</CInputGroupText>
					  </CInputGroupPrepend>
					  <CInput innerRef={username} type="text" placeholder="Username" autoComplete="username" />
					</CInputGroup>
					<CInputGroup className="mb-4">
					  <CInputGroupPrepend>
						<CInputGroupText>
						  <CIcon name="cil-lock-locked" />
						</CInputGroupText>
					  </CInputGroupPrepend>
					  <CInput innerRef={password}  type="password" placeholder="Password" autoComplete="current-password" />
					</CInputGroup>
					<CRow>
					  <CCol xs="6">
						<CButton color="primary" className="px-4" onClick={() => props.firebase.auth().signInWithEmailAndPassword(username.current.value, password.current.value).catch((error) => window.alert("Error : " + error.message))}>Login</CButton>
					  </CCol>
					  <CCol xs="6" className="text-right">
						<CButton color="link" className="px-0">Forgot password?</CButton>
					  </CCol>
					</CRow>
				  </CForm>
				</CCardBody>
			  </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
