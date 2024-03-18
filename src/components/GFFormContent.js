import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
} from "@coreui/react";
import { firebase } from "db/firebase";
import { useEffect, useState } from "react";
import Select from "react-select";
import { GetWeeklyBase } from "utils/date";
import AddModal from "./AddGFModal";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";

const saveChange = async (account_id, selected, titles, notes) => {
  let v = {};
  for (let i = 0; i < titles.length; i++) {
    v[titles[i]] = [];
    for (let j = 0; j < selected[i].length; j++) {
      let value = selected[i][j];
      // let index = parseInt(value.split("|")[0]);
      let id = value.split("|")[1];
      // let name = value.split("|")[2];
      // let school = value.split("|")[3];
      // let department = value.split("|")[4];
      // let grade = value.split("|")[5];
      // let type = value.split("|")[6];
      // let note = value.split("|")[7];
      if (id in notes[i]) v[titles[i]].push({ id, note: notes[i][id] });
      else v[titles[i]].push(id);
    }
  }
  v["week_base"] = GetWeeklyBase();
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
  const [GFs, setGFs] = useState(data);
  const [addModal, setAddModal] = useState(false);
  let default_selected = [];
  let default_notes = [];
  let id_to_v = {};
  for (let i = 0; i < GFs.length; i++) {
    id_to_v[GFs[i].id] =
      i +
      "|" +
      GFs[i].id +
      "|" +
      GFs[i].name +
      "|" +
      GFs[i].school +
      "|" +
      GFs[i].department +
      "|" +
      GFs[i].grade +
      "|" +
      GFs[i].type +
      "|" +
      GFs[i].note;
  }
  for (let i in titles) {
    var d = default_data;
    default_notes.push({});
    if (d && d.value) {
      default_selected.push(
        d.value[titles[i]]
          .map((x) => {
            if (typeof x === "string") return id_to_v[x];
            else return id_to_v[x.id];
          })
          .filter((element) => element !== undefined)
      );
      for (let x of d.value[titles[i]]) {
        if (typeof x !== "string") default_notes[i][x.id] = x.note;
      }
    } else default_selected.push([]);
  }
  var [selected, setSelected] = useState(default_selected);
  var [notes, setNotes] = useState(default_notes);
  useEffect(() => {
    const titles = ["家聚會", "小排", "主日聚會"];
    let id_to_v = {};
    for (let i = 0; i < GFs.length; i++) {
      id_to_v[GFs[i].id] =
        i +
        "|" +
        GFs[i].id +
        "|" +
        GFs[i].name +
        "|" +
        GFs[i].school +
        "|" +
        GFs[i].department +
        "|" +
        GFs[i].grade +
        "|" +
        GFs[i].type +
        "|" +
        GFs[i].note;
    }
    let default_selected = [];
    let default_notes = [];
    for (let i in titles) {
      var d = default_data;
      default_notes.push({});
      if (d && d.value) {
        default_selected.push(
          d.value[titles[i]]
            .map((x) => {
              if (typeof x === "string") return id_to_v[x];
              else return id_to_v[x.id];
            })
            .filter((element) => element !== undefined)
        );
        for (let x of d.value[titles[i]]) {
          if (typeof x !== "string") default_notes[i][x.id] = x.note;
        }
      } else default_selected.push([]);
    }
    setSelected(default_selected);
    setNotes(default_notes);
  }, [default_data, GFs]);
  var inputs = [];
  for (let i = 0; i < titles.length; i++) {
    var default_options = [];
    var GF_options = [];
    for (var j = 0; j < GFs.length; j++) {
      if (selected[i].includes(id_to_v[GFs[j].id])) {
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
              <b>{GFs[j].name}</b>{" "}
              <span>
                {"      " +
                  GFs[j].school +
                  " " +
                  GFs[j].department +
                  " " +
                  GFs[j].grade +
                  " " +
                  GFs[j].type +
                  " " +
                  GFs[j].note +
                  " "}
              </span>
              <Link to={"/GF/" + GFs[j].id}>
                <CIcon name="cil-info" />
              </Link>
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
            selected[i] = value.map((x) => x.value);
            setSelected(Array.from(selected));
          }.bind(null, setSelected, selected, i)}
        />
      </CFormGroup>
    );
  }
  let note_list = [];
  for (let i = 0; i < selected[0].length; i++) {
    note_list.push(
      <CRow key={i} className="align-items-center">
        <CCol xs="3" md="2">
          <CLabel>{selected[0][i].split("|")[2]}</CLabel>
        </CCol>
        <CCol xs="9" md="10">
          <CInput
            defaultValue={notes[0][selected[0][i].split("|")[1]]}
            onChange={(e) => {
              let tmp = Array.from(notes);
              tmp[0][selected[0][i].split("|")[1]] = e.target.value;
              setNotes(tmp);
            }}
          />
        </CCol>
      </CRow>
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
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {inputs}
        </CForm>

        <AddModal
          data={GFs}
          setData={setGFs}
          show={addModal}
          setModal={setAddModal}
          account={account}
        />
        {!!note_list.length && (
          <>
            <CRow className="align-items-center" style={{ paddingTop: "10px" }}>
              <CCol>
                <h3>家聚會備註</h3>
              </CCol>
            </CRow>
            {note_list}
          </>
        )}
      </CCardBody>
      <CCardFooter align="right">
        <CButtonGroup>
          <CButton
            variant="outline"
            color="primary"
            onClick={function (setAddModal) {
              setAddModal(true);
            }.bind(null, setAddModal)}
          >
            新增牧養對象
          </CButton>
          <CButton
            variant="outline"
            color="dark"
            onClick={() => {
              saveChange(account.id, selected, titles, notes);
            }}
          >
            提交表單
          </CButton>
        </CButtonGroup>
      </CCardFooter>
    </CCard>
  );
};

export default GFFormContent;
