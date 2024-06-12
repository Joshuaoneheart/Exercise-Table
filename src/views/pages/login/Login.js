import CIcon from "@coreui/icons-react";
import { message } from "antd";
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
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { firebase } from "db/firebase"
import React, { useState } from "react";

const ForgetPasswdModal = ({ show, setModal }) => {
  const [email, setEmail] = useState("")
  const submit = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      message.success("重置密碼信已寄出")
    } catch (e) {
      message.error(e.message)
    }
  }
  return (
    <CModal
      show={show}
      size="lg"
      onClose={() => {
        setModal(false);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>{"忘記密碼"}</CModalTitle>
      </CModalHeader>
      <CModalBody><CRow><CCol md="3">
        <CLabel>{"請輸入電子郵件"}</CLabel>
      </CCol>
        <CCol xs="12" md="9">
          <CInput required onChange={(e) => {
            setEmail(e.target.value)
          }} />
        </CCol></CRow>
        <br />
        <CModalFooter>
          <CButton variant="outline"
            onClick={() => {
              submit()
            }}
            color="dark">送出</CButton>
        </CModalFooter>
      </CModalBody></CModal>)
}

const Login = (props) => {
  const [modal, setModal] = useState(false)
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
      .catch((error) => message.error(error.message, 1.5));
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <ForgetPasswdModal show={modal} setModal={setModal} />
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
                  <br />
                  <CRow>
                    <CLink onClick={() => { setModal(true) }}>
                      Forget password
                    </CLink>
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
