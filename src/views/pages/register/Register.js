import React from "react";
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
  CInvalidFeedback,
  CLink,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

const Register = (props) => {
  var register_form = React.useRef();
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm innerRef={register_form}>
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
	  			      name="username"
                      type="text"
                      placeholder="Username(請使用本名)"
                      autoComplete="username"
	  				  required
                    />
                    <CInvalidFeedback>Username cannot be empty.</CInvalidFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
	  				  name="email"
                      type="text"
                      placeholder="Email"
                      autoComplete="email"
	  				  required
                    />
                    <CInvalidFeedback>Email cannot be empty.</CInvalidFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
	  				  name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
	  				  required
                    />
                    <CInvalidFeedback>Password cannot be empty.</CInvalidFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
	  				  name="repeat_password"
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
	  				  onChange={(event) => {
						  if(register_form.current.elements.password.value === event.target.value){
							  event.target.classList.remove("is-invalid");
					  	  }
					  }}
	  				  required
                    />
                  <CInvalidFeedback>Please enter the same password as above.</CInvalidFeedback>
                  </CInputGroup>
                  <CRow>
                    <CCol>
                      <CButton color="success" onClick={() => {
						  if(register_form.current.elements.password.value === register_form.current.elements.repeat_password.value){
							  props.firebase.auth().createUserWithEmailAndPassword(register_form.current.email, register_form.current.password).then((userCredential) => {
								  // ToDo: add username to accounts
							  });
						  }
						  else{
							  register_form.current.elements.repeat_password.classList.add("is-invalid");
						  }
					  }}>Create Account</CButton>
                    </CCol>
                    <CCol className="text-right">
                      <CLink to="/login">
                        <CButton color="primary">Back</CButton>
                      </CLink>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
