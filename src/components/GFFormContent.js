import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CLabel,
  CRow,
} from "@coreui/react";
import { firebase } from "db/firebase";
import { useState } from "react";
import Select from "react-select";
import { GetWeeklyBase } from "utils/date";
import AddModal from "./AddGFModal";

const saveChange = async (account_id, selected, titles) => {
  // termination situation
  let v = {};
  for (let i = 0; i < titles.length; i++) {
    v[titles[i]] = [];
    for (let value of selected[i]) {
      let id = value.split("|")[0];
      let name = value.split("|")[1];
      let note = value.split("|")[2];
      if (id === "") {
        let res = await firebase.firestore().collection("GF").add({
          name,
          note,
        });
        v[titles[i]].push(res.id);
      } else v[titles[i]].push(id);
    }
  }
  console.log(v);
  await firebase
    .firestore()
    .collection("accounts")
    .doc(account_id)
    .collection("GF")
    .doc(GetWeeklyBase().toString())
    .set(v)
    .then(() => {
      alert("儲存完成");
    })
    .catch((error) => {
      alert(error.message);
    });
};

const GFFormContent = ({ data, account, default_data }) => {
  const titles = ["家聚會", "小排", "主日聚會"];
  const [GFs, setGFs] = useState(data.value);
  const [addModal, setAddModal] = useState(null);
  let default_selected = [];
  let id_to_v = {};
  for (let i = 0; i < GFs.length; i++) {
    id_to_v[GFs[i].id] = GFs[i].id + "|" + GFs[i].name + "|" + GFs[i].note;
  }
  for (let i in titles) {
    var d = default_data;
    if (d && d.value)
      default_selected.push(new Set(d.value[titles[i]].map((x) => id_to_v[x])));
    else default_selected.push(new Set());
  }
  var [selected, setSelected] = useState(default_selected);
  var inputs = [];
  for (let i = 0; i < titles.length; i++) {
    var default_options = [];
    var GF_options = [];
    for (var j = 0; j < GFs.length; j++) {
      if (selected[i].has(id_to_v[GFs[j].id])) {
        default_options.push({
          value: id_to_v[GFs[j].id],
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
        });
      } else
        GF_options.push({
          value: id_to_v[GFs[j].id],
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b> <span>{"      " + GFs[j].note}</span>
            </span>
          ),
        });
    }
    inputs.push(
      <CFormGroup key={i}>
        <CLabel>{titles[i]}</CLabel>
        <Select
          value={default_options}
          defaultValue={default_options}
          isMulti
          isSearchable
          autoFocus
          options={GF_options}
          defaultMenuIsOpen={false}
          onChange={function (setSelected, selected, i, value) {
            var tmp = new Set();
            for (let v of value) {
              tmp.add(v.value);
            }
            selected[i] = tmp;
            setSelected(Array.from(selected));
          }.bind(null, setSelected, selected, i)}
        />
      </CFormGroup>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol style={{ fontSize: "30px" }}>牧養對象邀約</CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CForm
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          {inputs}
        </CForm>

        <AddModal
          data={GFs}
          setData={setGFs}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter>
        <CButton
          variant="ghost"
          color="primary"
          onClick={function (setAddModal) {
            setAddModal(true);
          }.bind(null, setAddModal)}
        >
          新增牧養對象
        </CButton>
        <CButton
          variant="ghost"
          color="dark"
          onClick={() => {
            saveChange(account.id, selected, titles);
          }}
        >
          提交表單
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default GFFormContent;
