import { loading } from "components";
import { useParams } from "react-router-dom";
import { FirestoreCollection } from "@react-firebase/firestore";

import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CInput,
  CCardFooter,
  CLink,
  CTooltip,
} from "@coreui/react";
import AutoLink from "@uiw/react-auto-link";
import { useContext, useEffect, useState } from "react";
import { DB, firebase } from "db/firebase";
import CIcon from "@coreui/icons-react";
import { AccountContext } from "hooks/context";
import ModifyAnnouncementModal from "components/ModifyAnnouncementModal";
import { GetAccountsMap } from "utils/account";
import { FormatDate } from "utils/date";
const CommentList = ({ comments, accountsMap }) => {
  return comments.map((x) => (
    <>
      <CRow>
        <CCol xs="2" md="1">
          <b>{accountsMap[x.posted_by]}</b>
        </CCol>{" "}
        <CCol>
          <AutoLink text={x.content} />
        </CCol>
      </CRow>
      <hr />
    </>
  ));
};
const AnnouncementCard = ({ init_data, id }) => {
  const account = useContext(AccountContext);
  const [data, setData] = useState(init_data);
  const [comment, setComment] = useState("");
  const [modifyModal, setModifyModal] = useState(false);
  const [accountsMap, setAccountsMap] = useState(null);
  const addComment = async () => {
    await firebase
      .firestore()
      .collection("announcement")
      .doc(id)
      .collection("comments")
      .add({ posted_by: account.id, content: comment });
    setComment("");
  };
  useEffect(() => {
    let FetchAccountsMap = async () => {
      setAccountsMap(await GetAccountsMap(true));
    };
    FetchAccountsMap();
  }, []);
  useEffect(() => {
    const check = async () => {
      if (!data.checked) data.checked = account.id;
      else if (!data.checked.split(";").includes(account.id))
        data.checked += ";" + account.id;
      await DB.updateByUrl("/announcement/" + id, data);
    };
    if (data) check();
  }, [account, data, id]);

  useEffect(() => {
    if (init_data) {
      setData(Object.assign({}, init_data));
    }
  }, [init_data]);
  if (accountsMap === null) return loading;
  return (
    <CCard>
      <CCardHeader>
        <ModifyAnnouncementModal
          id={id}
          show={modifyModal}
          account={account}
          data={data}
          setModal={setModifyModal}
          setData={setData}
        />
        <CRow>
          <CCol xs="10" md="11">
            公告
          </CCol>
          {data && account.id === data.posted_by && (
            <CCol xs="1" md="1">
              <CButton
                variant="outline"
                color="primary"
                onClick={() => {
                  setModifyModal(true);
                }}
              >
                <CIcon name="cil-pencil" />
              </CButton>
            </CCol>
          )}
        </CRow>{" "}
      </CCardHeader>
      <CCardBody>
        {" "}
        <CRow>
          <CCol style={{ fontSize: "18px" }}>
            <h3>{data && data.title}</h3>
            <hr />
            <div width="20%">
              <CRow>
                <CCol lg="3">
                  <b>發佈人</b>
                </CCol>
                <CCol>{accountsMap[data.posted_by]}</CCol>
              </CRow>
              <CRow>
                <CCol lg="3">
                  <b>發布時間</b>
                </CCol>
                <CCol>
                  {data &&
                    data.timestamp &&
                    (data.timestamp.toDate
                      ? FormatDate(data.timestamp.toDate())
                      : FormatDate(data.timestamp))}
                </CCol>
              </CRow>
              <CRow>
                <CCol lg="3">
                  <b>內容</b>
                </CCol>
                <CCol>
                  <div
                    dangerouslySetInnerHTML={{ __html: data && data.content }}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CTooltip
                    placement="top"
                    content={
                      data.checked &&
                      data.checked
                        .split(";")
                        .filter((x) => accountsMap[x])
                        .map((x) => accountsMap[x])
                        .join("<br />")
                    }
                  >
                    <CLink
                      style={{
                        opacity: 0.7,
                        fontSize: 14,
                        color: "aaaaaa",
                      }}
                    >
                      已讀{" "}
                      {data.checked
                        ? data.checked.split(";").filter((x) => accountsMap[x])
                            .length
                        : 0}
                    </CLink>
                  </CTooltip>
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>{" "}
      </CCardBody>
      <CCardFooter>
        <FirestoreCollection path={"/announcement/" + id + "/comments"}>
          {(d) => {
            if (d && d.value) {
              for (let i = 0; i < d.value.length; i++) d.value[i].id = d.ids[i];
              return (
                <CCol>
                  <CommentList comments={d.value} accountsMap={accountsMap} />
                </CCol>
              );
            } else return loading;
          }}
        </FirestoreCollection>
        <CRow>
          <CCol xs="10" md="11">
            <CInput
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  addComment();
                }
              }}
            />
          </CCol>
          <CButton variant="outline" color="primary" onClick={addComment}>
            <CIcon name="cil-send" />
          </CButton>
        </CRow>
      </CCardFooter>
    </CCard>
  );
};
const Announcement = () => {
  let { id } = useParams();
  const [data, setData] = useState(false);
  useEffect(() => {
    const FetchAnnouncement = async () => {
      let tmp = await DB.getByUrl("/announcement/" + id);
      setData(tmp);
    };
    FetchAnnouncement();
  }, [id]);
  return (
    <CRow>
      <CCol>
        {data ? (
          <CCol>
            <AnnouncementCard init_data={data} id={id} />
          </CCol>
        ) : (
          loading
        )}
      </CCol>
    </CRow>
  );
};
export default Announcement;
