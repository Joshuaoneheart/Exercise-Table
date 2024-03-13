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
} from "@coreui/react";
import { useState } from "react";

import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";

const getBadge = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "secondary";
    case "Pending":
      return "warning";
    case "Banned":
      return "danger";
    default:
      return "primary";
  }
};
const Users = () => {
  const [details, setDetails] = useState([]);

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Users</CCardHeader>
          <CCardBody>
            <FirestoreCollection path="/accounts">
              {(d) => {
                if (!d.isLoading)
                  for (var i = 0; i < d.value.length; i++) {
                    d.value[i]["id"] = d.ids[i];
                  }
                return d.isLoading ? (
                  loading
                ) : (
                  <CDataTable
                    items={d.value}
                    fields={[
                      { key: "email", _classes: "font-weight-bold" },
                      "displayName",
                      "role",
                      "registered",
                      "status",
                      {
                        key: "show_details",
                        label: "",
                        _style: { width: "1%" },
                        sorter: false,
                        filter: false,
                      },
                    ]}
                    hover
                    sorter
                    striped
                    columnFilter
                    pagination
                    itemsPerPage={10}
                    scopedSlots={{
                      status: (item) => (
                        <td>
                          <CBadge color={getBadge(item.status)}>
                            {item.status}
                          </CBadge>
                        </td>
                      ),
                      show_details: (item, index) => {
                        return (
                          <td className="py-2">
                            <CButton
                              color="dark"
                              variant="ghost"
                              shape="square"
                              size="sm"
                              onClick={() => {
                                toggleDetails(index);
                              }}
                            >
                              {details.includes(index) ? "Hide" : "Show"}
                            </CButton>
                          </td>
                        );
                      },
                      details: (item, index) => {
                        return (
                          <CCollapse show={details.includes(index)}>
                            <CCardBody>
                              <h4>{item.email}</h4>
                              <p className="text-muted">
                                User since {item.registered}
                              </p>
                              {item.is_active ? (
                                <CButton size="sm" color="danger">
                                  Unbind Account
                                </CButton>
                              ) : (
                                <CButton size="sm" color="info">
                                  Bind Account
                                </CButton>
                              )}
                            </CCardBody>
                          </CCollapse>
                        );
                      },
                    }}
                  />
                );
              }}
            </FirestoreCollection>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;
