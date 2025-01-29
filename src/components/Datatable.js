/*
fields: {
  value: ...,
  label: ...
}
*/
const Datatable = ({
  fields,
  content,
  start,
  maxDisplay,
  onRowClick,
  tableStyle,
  tableClassName,
}) => {
  let titles = [];
  for (let i = 0; i < fields.length; i++) {
    titles.push(
      <th className="content-medium" key={i}>
        {fields[i].label}
      </th>
    );
  }
  let body = [];
  for (let i = start; i < Math.min(start + maxDisplay, content.length); i++) {
    let row = [];
    for (let j = 0; j < fields.length; j++) {
      if (fields[j].value in content[i])
        row.push(
          <td className="secondary-medium" key={`td-${i}-${j}`}>
            {content[i][fields[j].value]}
          </td>
        );
      else row.push(<td key={`td-${i}-${j}`}></td>);
    }
    body.push(
      <tr
        onClick={() => {
          if (onRowClick) onRowClick(content[i]);
        }}
        key={`tr-${i}`}
      >
        {row}
      </tr>
    );
  }
  return (
    <div className="datatable-container">
      <table className={"datatable " + tableClassName} style={tableStyle}>
        <thead>
          <tr>{titles}</tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
};
export default Datatable;
