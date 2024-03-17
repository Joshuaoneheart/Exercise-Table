import CIcon from "@coreui/icons-react";
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
  CLink,
  CRow,
} from "@coreui/react";
import React from "react";

const Login = (props) => {
  var username = React.useRef();
  var password = React.useRef();
  let login = () => {
    localStorage.setItem("username", username.current.value);
    localStorage.setItem("password", password.current.value);
    props.firebase
      .auth()
      .signInWithEmailAndPassword(
        username.current.value,
        password.current.value
      )
      .catch((error) => window.alert("Error : " + error.message));
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CCol>
          <CRow className="justify-content-center">
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p className="text-muted">Sign In to your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      defaultValue={
                        localStorage.getItem("username")
                          ? localStorage.getItem("username")
                          : ""
                      }
                      innerRef={username}
                      type="text"
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      defaultValue={
                        localStorage.getItem("password")
                          ? localStorage.getItem("password")
                          : ""
                      }
                      innerRef={password}
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      onKeyUp={(event) => {
                        if (event.key === "Enter") {
                          login();
                        }
                      }}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol>
                      <CButton color="primary" onClick={login}>
                        Login
                      </CButton>
                    </CCol>
                    <CCol className="text-right">
                      <CLink to="/register">
                        <CButton color="primary">Register</CButton>
                      </CLink>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CRow>
        </CCol>
      </CContainer>
    </div>
  );
};

export default Login;
