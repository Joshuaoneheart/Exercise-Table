import { useEffect, useRef } from "react";
import * as d3 from "d3";
/* data: list of {label, value(unnormalized), color, text_color}*/
const VerticalBarChart = ({ data, max_bar, width, height, top_data }) => {
  const svgRef = useRef();
  useEffect(() => {
    const radius = 135.72;
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    const xScale = d3
      .scaleLinear()
      .domain([0, max_bar])
      .range([0, width -168]);
    for (let i = 0; i < top_data.length; i++) {
      svg
        .append("rect")
        .attr("x", 120 - width / 2)
        .attr("y", i * 18 + 3 - height / 2)
        .attr("fill", top_data[i].color)
        .attr("width", xScale(top_data[i].value))
        .attr("height", 12);
      svg
        .append("text")
        .attr("fill", top_data[i].text_color)
        .text(top_data[i].label)
        .attr("x", 40 - width / 2)
        .attr("y", i * 18 + 13 - height / 2)
        .attr("class", "content-medium");
      svg
        .append("text")
        .attr("fill", top_data[i].text_color)
        .text(top_data[i].value)
        .attr("x", 128 - width / 2 + xScale(top_data[i].value))
        .attr("y", i * 18 + 13 - height / 2)
        .attr("class", "content-medium");
    }
    let padding = top_data.length ? top_data.length * 18 + 12 : 0;
    for (let i = 0; i < data.length; i++) {
        svg
          .append("rect")
          .attr("x", 120 - width / 2)
          .attr("y", padding + i * 18 + 3 - height / 2)
          .attr("fill", data[i].color)
          .attr("width", xScale(data[i].value))
          .attr("height", 12);
        svg
          .append("text")
          .attr("fill", data[i].text_color)
          .text(data[i].label)
          .attr("x", 40 - width / 2)
          .attr("y", padding + i * 18 + 13 - height / 2)
          .attr("class", "content-medium");
        svg
          .append("text")
          .attr("fill", data[i].text_color)
          .text(data[i].value)
          .attr("x", 128 - width / 2 + xScale(data[i].value))
          .attr("y", padding + i * 18 + 13 - height / 2)
          .attr("class", "content-medium");
      }
}, [data, width, height]);
  return <svg ref={svgRef} />;
};
export default VerticalBarChart;
