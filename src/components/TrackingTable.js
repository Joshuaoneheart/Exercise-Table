import { Table, Tag, Space } from "antd";
import { TimePicker } from "antd";
import dayjs from "dayjs";

// relevant documentation: https://ant.design/components/table
const format = "HH:mm";

const columns = [
  {
    title: "操練項目",
    dataIndex: "topic",
    key: "topic",
    rowScope: "row",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "主日",
    dataIndex: "sunday",
    key: "sunday",
    render: (text) => <TimePicker defaultValue={dayjs(text)} format={format} />,
  },
  {
    title: "周一",
    dataIndex: "monday",
    key: "monday",
    render: (text) => <TimePicker defaultValue={dayjs(text)} format={format} />,
  },
  {
    title: "周二",
    dataIndex: "tuesday",
    key: "tuesday",
    render: (text) => <TimePicker defaultValue={dayjs(text)} format={format} />,
  },
  {
    title: "周三",
    dataIndex: "wednesday",
    key: "wednesday",
    render: (text) => <TimePicker defaultValue={dayjs(text)} format={format} />,
  },
  {
    title: "周四",
    dataIndex: "thursday",
    key: "thursday",
    render: (text) => <TimePicker defaultValue={dayjs(text)} format={format} />,
  },
  {
    title: "周五",
    dataIndex: "friday",
    key: "friday",
    render: (text) => <TimePicker defaultValue={dayjs(text)} format={format} />,
  },
  {
    title: "周六",
    dataIndex: "saturday",
    key: "saturday",
    render: (text) => <TimePicker defaultValue={dayjs(text)} format={format} />,
  },
];

const data = [
  {
    topic: "起床時間",
    monday: dayjs(),
    tuesday: dayjs(),
    wednesday: dayjs(),
    thursday: dayjs(),
    friday: dayjs(),
    saturday: dayjs(),
    sunday: dayjs(),
  },
  {
    topic: "就寢時間",
    monday: dayjs(),
    tuesday: dayjs(),
    wednesday: dayjs(),
    thursday: dayjs(),
    friday: dayjs(),
    saturday: dayjs(),
    sunday: dayjs(),
  },
];

const tracking = [
  {
    topic: "就寢時間",
    monday: 10,
    tuesday: 10,
    wednesday: 10,
    thursday: 10,
    friday: 10,
    saturday: 10,
    sunday: 10,
  },
];

const TrackingTable = () => {
  let trackingColumn = columns.map((col) =>
    Object.assign({}, col, { render: undefined })
  );
  console.log(columns);
  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} bordered />
      {/* It might work better if you set a fixed size for each column field */}
      <Table
        columns={trackingColumn}
        dataSource={tracking}
        pagination={false}
        showHeader={false}
        bordered
      />
    </>
  );
};

export default TrackingTable;
