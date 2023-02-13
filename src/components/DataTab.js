import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CForm,
    CRow,
    CTabContent,
    CTabPane,
    CTabs
} from "@coreui/react";
import { useRef, useState } from "react";
import FormFooter from "./FormFooter";
import Problem from "./Problem";

const DataTabs = ({ data, is_footer, account, metadata, default_data }) => {
  const [section, setSection] = useState(0);
  var form = useRef();
  var tabs = [];
  var tabpanes = [];
  for (var i = 0; i < data.sections.length; i++) {
    tabs.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setSection(i);
        }.bind(null, i)}
      >
        {data.sections[i]}
      </CDropdownItem>
    );
    var tabContents = [];
    for (var j = 0; j < data.value[i].length; j++) {
      var problem = data.value[i][j];
      tabContents.push(
        <Problem
          name={data.value[i].id}
          data={problem}
          default_data={
            default_data && default_data.value
              ? default_data.value[problem.id]
              : undefined
          }
          key={j}
        />
      );
    }
    tabpanes.push(<CTabPane key={i}>{tabContents}</CTabPane>);
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol style={{ fontSize: "30px" }}>表單</CCol>
          <CCol align="end">
            <CDropdown>
              <CDropdownToggle color="info">
                {data.sections[section]}
              </CDropdownToggle>
              <CDropdownMenu>{tabs}</CDropdownMenu>
            </CDropdown>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CForm innerRef={form}>
          <CTabs activeTab={section}>
            <CTabContent>{tabpanes}</CTabContent>
          </CTabs>
        </CForm>
      </CCardBody>
      {is_footer && (
        <FormFooter form={form} account={account} metadata={metadata} />
      )}
    </CCard>
  );
};

export default DataTabs;