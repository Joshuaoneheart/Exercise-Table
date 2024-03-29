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
  CInvalidFeedback,
  CLink,
  CRow,
} from "@coreui/react";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { DB } from "db/firebase";
import Account from "Models/Account";
import Select from "react-select";
import React, { useEffect, useState } from "react";

const Register = (props) => {
  const register_form = React.useRef();
  const [create, setCreate] = useState(false);
  const [gender, setGender] = useState("男");
  useEffect(() => {
    // if have signed in, sign out
    let checkSignedIn = async () => {
      if (!create && props.firebase.auth().uid) {
        await DB.signOut();
        window.location = window.location.href.replace("register", "/");
      }
    };
    checkSignedIn();
  }, [props, create]);
  return (
    <FirebaseAuthConsumer>
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
                        onChange={(event) => {
                          if (event.target.value) {
                            event.target.classList.remove("is-invalid");
                          }
                        }}
                      />
                      <CInvalidFeedback>
                        Username cannot be empty.
                      </CInvalidFeedback>
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
                        onChange={(event) => {
                          if (event.target.value) {
                            event.target.classList.remove("is-invalid");
                          }
                        }}
                      />
                      <CInvalidFeedback>
                        Email cannot be empty.
                      </CInvalidFeedback>
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
                        onChange={(event) => {
                          if (event.target.value) {
                            event.target.classList.remove("is-invalid");
                          }
                        }}
                      />
                      <CInvalidFeedback>
                        Password cannot be empty.
                      </CInvalidFeedback>
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
                          if (
                            register_form.current.elements.password.value ===
                            event.target.value
                          ) {
                            event.target.classList.remove("is-invalid");
                          }
                        }}
                        required
                      />
                      <CInvalidFeedback>
                        Please enter the same password as above.
                      </CInvalidFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CCol xs="12" md="12" style={{ padding: "0" }}>
                        <Select
                          defaultValue={{
                            value: "男",
                            label: (
                              <span style={{ whiteSpace: "pre" }}>男</span>
                            ),
                          }}
                          options={[
                            {
                              value: "男",
                              label: (
                                <span style={{ whiteSpace: "pre" }}>男</span>
                              ),
                            },
                            {
                              value: "女",
                              label: (
                                <span style={{ whiteSpace: "pre" }}>女</span>
                              ),
                            },
                          ]}
                          onChange={(v) => {
                            setGender(v.value);
                          }}
                          name="gender"
                        />
                      </CCol>
                    </CInputGroup>
                    <CRow>
                      <CCol>
                        <CButton
                          color="success"
                          onClick={(event) => {
                            let pass_flag = true;
                            if (
                              register_form.current.elements.password.value !==
                              register_form.current.elements.repeat_password
                                .value
                            ) {
                              register_form.current.elements.repeat_password.classList.add(
                                "is-invalid"
                              );
                              pass_flag = false;
                            }
                            if (
                              !register_form.current.elements.password.value
                            ) {
                              register_form.current.elements.password.classList.add(
                                "is-invalid"
                              );
                              pass_flag = false;
                            }
                            if (!register_form.current.elements.email.value) {
                              register_form.current.elements.email.classList.add(
                                "is-invalid"
                              );
                              pass_flag = false;
                            }
                            if (
                              !register_form.current.elements.username.value
                            ) {
                              register_form.current.elements.username.classList.add(
                                "is-invalid"
                              );
                              pass_flag = false;
                            }
                            if (pass_flag) {
                              if (
                                /@ntu\.edu\.tw$/.test(
                                  register_form.current.elements.email.value
                                ) ||
                                /@mail\.ntust\.edu\.tw/.test(
                                  register_form.current.elements.email.value
                                )
                              ) {
                                alert(
                                  "請使用非台大或台科大的學校信箱進行註冊，因台大或台科大信箱會擋驗證信"
                                );
                                return;
                              }
                              event.target.disabled = true;
                              setCreate(true);
                              props.firebase
                                .auth()
                                .createUserWithEmailAndPassword(
                                  register_form.current.elements.email.value,
                                  register_form.current.elements.password.value
                                )
                                .then(async (user_data) => {
                                  var date = new Date();
                                  let account = new Account(
                                    {
                                      id: user_data.user.uid,
                                      displayName:
                                        register_form.current.elements.username
                                          .value,
                                      email:
                                        register_form.current.elements.email
                                          .value,
                                      registered:
                                        date.getFullYear() +
                                        "/" +
                                        (date.getMonth() + 1) +
                                        "/" +
                                        date.getDate(),
                                      role: "Member",
                                      status: "Pending",
                                      gender
                                    },
                                    true
                                  );
                                  await props.firebase
                                    .auth()
                                    .currentUser.sendEmailVerification();
                                  await account.save(true);
                                  alert("成功創建帳戶");
                                  await DB.signOut();
                                  window.location =
                                    window.location.href.replace(
                                      "register",
                                      "/"
                                    );
                                })
                                .catch((error) => {
                                  alert(error.message);
                                  event.target.disabled = false;
                                });
                            }
                          }}
                        >
                          Create Account
                        </CButton>
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
    </FirebaseAuthConsumer>
  );
};

export default Register;
