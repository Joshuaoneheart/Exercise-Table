import { CCol, CRow } from "@coreui/react";
import { Table, InputNumber } from "antd";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { DB } from "db/firebase";
import { GetWeeklyBase } from "utils/date";

// relevant documentation: https://ant.design/components/table
const format = "HH:mm";

const TrackingTable = ({ isChangeable, default_data, account_id }) => {
  let data = [
    {
      topic: "起床時間",
      monday: "00:00",
      tuesday: "00:00",
      wednesday: "00:00",
      thursday: "00:00",
      friday: "00:00",
      saturday: "00:00",
      sunday: "00:00",
    },
    {
      topic: "就寢時間",
      monday: "00:00",
      tuesday: "00:00",
      wednesday: "00:00",
      thursday: "00:00",
      friday: "00:00",
      saturday: "00:00",
      sunday: "00:00",
    },
    {
      topic: "讀書時數",
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    },
  ];
  const columns = [
    {
      title: "",
      dataIndex: "topic",
      key: "topic",
      rowScope: "row",
      width: "60px",
      render: (text) => (
        <div style={{ flexWrap: "nowrap", width: "60px" }}>{text}</div>
      ),
    },
    {
      title: "主日",
      dataIndex: "sunday",
      key: "sunday",
      width: "100px",
      render: (text, record, index) => {
        if (isChangeable) {
          if (record.topic === "讀書時數")
            return (
              <div style={{ flexWrap: "nowrap", width: "100px" }}>
                <InputNumber
                  defaultValue={text}
                  onChange={(v) => {
                    let res = {};
                    res[record.topic + ".sunday"] = v;
                    DB.OnDemandUpdate(
                      "/accounts/" +
                        account_id +
                        "/schedule/" +
                        GetWeeklyBase(),
                      res
                    );
                  }}
                />
              </div>
            );
          return (
            <div style={{ flexWrap: "nowrap", width: "100px" }}>
              <TimePicker
                defaultValue={dayjs(text, format)}
                onChange={(v) => {
                  let res = {};
                  res[record.topic + ".sunday"] = v.format(format);
                  DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/schedule/" + GetWeeklyBase(),
                    res
                  );
                }}
                format={format}
              />
            </div>
          );
        }
        return (
          <div style={{ flexWrap: "nowrap", width: "100px" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "周一",
      dataIndex: "monday",
      key: "monday",
      width: "100px",
      render: (text, record, index) => {
        if (isChangeable) {
          if (record.topic === "讀書時數")
            return (
              <div style={{ flexWrap: "nowrap", width: "100px" }}>
                <InputNumber
                  defaultValue={text}
                  onChange={(v) => {
                    let res = {};
                    res[record.topic + ".monday"] = v;
                    DB.OnDemandUpdate(
                      "/accounts/" +
                        account_id +
                        "/schedule/" +
                        GetWeeklyBase(),
                      res
                    );
                  }}
                />
              </div>
            );
          return (
            <div style={{ flexWrap: "nowrap", width: "100px" }}>
              {" "}
              <TimePicker
                defaultValue={dayjs(text, format)}
                onChange={(v) => {
                  let res = {};
                  res[record.topic + ".monday"] = v.format(format);
                  DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/schedule/" + GetWeeklyBase(),
                    res
                  );
                }}
                format={format}
              />
            </div>
          );
        }
        return (
          <div style={{ flexWrap: "nowrap", width: "100px" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "周二",
      dataIndex: "tuesday",
      key: "tuesday",
      width: "100px",
      render: (text, record, index) => {
        if (isChangeable) {
          if (record.topic === "讀書時數")
            return (
              <div style={{ flexWrap: "nowrap", width: "100px" }}>
                <InputNumber
                  defaultValue={text}
                  onChange={(v) => {
                    let res = {};
                    res[record.topic + ".tuesday"] = v;
                    DB.OnDemandUpdate(
                      "/accounts/" +
                        account_id +
                        "/schedule/" +
                        GetWeeklyBase(),
                      res
                    );
                  }}
                />
              </div>
            );
          return (
            <div style={{ flexWrap: "nowrap", width: "100px" }}>
              <TimePicker
                defaultValue={dayjs(text, format)}
                onChange={(v) => {
                  let res = {};
                  res[record.topic] = {};
                  res[record.topic + ".tuesday"] = v.format(format);
                  DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/schedule/" + GetWeeklyBase(),
                    res
                  );
                }}
                format={format}
              />
            </div>
          );
        }
        return (
          <div style={{ flexWrap: "nowrap", width: "100px" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "周三",
      dataIndex: "wednesday",
      key: "wednesday",
      width: "100px",
      render: (text, record, index) => {
        if (isChangeable) {
          if (record.topic === "讀書時數")
            return (
              <div style={{ flexWrap: "nowrap", width: "100px" }}>
                <InputNumber
                  defaultValue={text}
                  onChange={(v) => {
                    let res = {};
                    res[record.topic + ".wednesday"] = v;
                    DB.OnDemandUpdate(
                      "/accounts/" +
                        account_id +
                        "/schedule/" +
                        GetWeeklyBase(),
                      res
                    );
                  }}
                />
              </div>
            );
          return (
            <div style={{ flexWrap: "nowrap", width: "100px" }}>
              <TimePicker
                defaultValue={dayjs(text, format)}
                onChange={(v) => {
                  let res = {};
                  res[record.topic + ".wednesday"] = v.format(format);
                  DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/schedule/" + GetWeeklyBase(),
                    res
                  );
                }}
                format={format}
              />
            </div>
          );
        }
        return (
          <div style={{ flexWrap: "nowrap", width: "100px" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "周四",
      dataIndex: "thursday",
      key: "thursday",
      width: "100px",
      render: (text, record, index) => {
        if (isChangeable) {
          if (record.topic === "讀書時數")
            return (
              <div style={{ flexWrap: "nowrap", width: "100px" }}>
                <InputNumber
                  defaultValue={text}
                  onChange={(v) => {
                    let res = {};
                    res[record.topic + ".thursday"] = v;
                    DB.OnDemandUpdate(
                      "/accounts/" +
                        account_id +
                        "/schedule/" +
                        GetWeeklyBase(),
                      res
                    );
                  }}
                />
              </div>
            );
          return (
            <div style={{ flexWrap: "nowrap", width: "100px" }}>
              <TimePicker
                defaultValue={dayjs(text, format)}
                onChange={(v) => {
                  let res = {};
                  res[record.topic + ".thursday"] = v.format(format);
                  DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/schedule/" + GetWeeklyBase(),
                    res
                  );
                }}
                format={format}
              />
            </div>
          );
        }
        return (
          <div style={{ flexWrap: "nowrap", width: "100px" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "周五",
      dataIndex: "friday",
      key: "friday",
      width: "100px",
      render: (text, record, index) => {
        if (isChangeable) {
          if (record.topic === "讀書時數")
            return (
              <div style={{ flexWrap: "nowrap", width: "100px" }}>
                <InputNumber
                  defaultValue={text}
                  onChange={(v) => {
                    let res = {};
                    res[record.topic + ".friday"] = v;
                    DB.OnDemandUpdate(
                      "/accounts/" +
                        account_id +
                        "/schedule/" +
                        GetWeeklyBase(),
                      res
                    );
                  }}
                />
              </div>
            );
          return (
            <div style={{ flexWrap: "nowrap", width: "100px" }}>
              <TimePicker
                defaultValue={dayjs(text, format)}
                onChange={(v) => {
                  let res = {};
                  res[record.topic + ".friday"] = v.format(format);
                  DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/schedule/" + GetWeeklyBase(),
                    res
                  );
                }}
                format={format}
              />
            </div>
          );
        }
        return (
          <div style={{ flexWrap: "nowrap", width: "100px" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "周六",
      dataIndex: "saturday",
      key: "saturday",
      width: "100px",
      render: (text, record, index) => {
        if (isChangeable) {
          if (record.topic === "讀書時數")
            return (
              <div style={{ flexWrap: "nowrap", width: "100px" }}>
                <InputNumber
                  defaultValue={text}
                  onChange={(v) => {
                    let res = {};
                    res[record.topic + ".saturday"] = v;
                    DB.OnDemandUpdate(
                      "/accounts/" +
                        account_id +
                        "/schedule/" +
                        GetWeeklyBase(),
                      res
                    );
                  }}
                />
              </div>
            );
          return (
            <div style={{ flexWrap: "nowrap", width: "100px" }}>
              <TimePicker
                defaultValue={dayjs(text, format)}
                onChange={(v) => {
                  let res = {};
                  res[record.topic + ".saturday"] = v.format(format);
                  DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/schedule/" + GetWeeklyBase(),
                    res
                  );
                }}
                format={format}
              />
            </div>
          );
        }
        return (
          <div style={{ flexWrap: "nowrap", width: "100px" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
  ];
  if (default_data) {
    data[0] = Object.assign(data[0], default_data["起床時間"]);
    data[1] = Object.assign(data[1], default_data["就寢時間"]);
    data[2] = Object.assign(data[2], default_data["讀書時數"]);
  }
  return (
    <div style={{ flexWrap: "nowrap", overflowX: "scroll" }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        footer={() => {
          return (
            <>
              <CRow>
                <CCol xs="4" md="1">
                  <p>運動時數</p>
                </CCol>
                <CCol xs="4" md="2">
                  {isChangeable ? (
                    <InputNumber
                      onChange={(v) => {
                        let res = {};
                        res["運動時數"] = v;
                        DB.OnDemandUpdate(
                          "/accounts/" +
                            account_id +
                            "/schedule/" +
                            GetWeeklyBase(),
                          res
                        );
                      }}
                      defaultValue={
                        default_data
                          ? default_data["運動時數"]
                            ? default_data["運動時數"]
                            : 0
                          : 0
                      }
                    />
                  ) : (
                    <p>
                      {default_data
                        ? default_data["運動時數"]
                          ? default_data["運動時數"]
                          : 0
                        : 0}
                    </p>
                  )}
                </CCol>
              </CRow>
            </>
          );
        }}
      />
    </div>
  );
};

export default TrackingTable;
