import { Table, Tag, Space } from "antd";
import { TimePicker } from "antd";
import dayjs from "dayjs";

const format = "HH:mm";

const columns = [
  {
    title: "操練項目",
    dataIndex: "topic",
    key: "topic",
    render: (text) => <a>{text}</a>,
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
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
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
    tags: ["nice", "developer"],
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
    tags: ["loser"],
  },
];

const TrackingTable = () => {
  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} bordered />
    </>
  );
};

export default TrackingTable;
