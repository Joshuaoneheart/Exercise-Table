import Col from "./Col";
import Row from "./Row";

const Tab = ({ titles, setActive, active, tabStyle }) => {
  return (
    <Row className="tab" style={tabStyle}>
      {titles.map((x, i) => (
        <Col
          onClick={() => setActive(i)}
          className={
            "primary-medium tab-cell" + (active === i ? " tab-active" : "")
          }
          key={`tab-${i}`}
        >
          {x}
        </Col>
      ))}
      <Col className="tab-fill"></Col>
    </Row>
  );
};
export default Tab;
