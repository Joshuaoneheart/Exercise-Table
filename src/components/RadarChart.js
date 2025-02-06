import { useEffect, useRef } from "react";
import * as d3 from "d3";
/* dataset: {
    data: (num_data, num_points), the value of each layer
    group: (num_data), the group index of each layer
    label: (num_data, num_points, num of lines), the label for each point, maximum 2 line
    legend: (num_data), the legend label of each layer
    color: (num_data), the color of each layer
    stroke: (num_data), the color of stroke
    disabled: (num_data), if the legend is clickable
} */
const RadarChart = ({
  width,
  height,
  dataset,
  num_points,
  curChart,
  setCurChart,
}) => {
  const svgRef = useRef();
  useEffect(() => {
    let exit = true;
    for (let item of dataset.data) if (item.length >= num_points) exit = false;
    if (exit) return;
    const radius = 135.72;
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    const legend = svg
      .append("g")
      .attr("transform", `translate(${32 - width / 2}, ${32 - height / 2})`);
    for (let i = 0; i < dataset.data.length; i++) {
      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", i * 28)
        .attr("r", 3.5)
        .attr("opacity", 1)
        .attr("fill", dataset.stroke[i])
        .on("click", () => {
          if (!dataset.disabled[i] && dataset.data[i].length) setCurChart(i);
        });
      legend
        .append("text")
        .attr("class", "content-medium")
        .attr("x", 11)
        .attr("fill", i === curChart ? dataset.stroke[i] : "rgb(0 0 0 / 40%)")
        .attr("y", i * 28 + 4)
        .text(dataset.legend[i])
        .on("click", () => {
          if (!dataset.disabled[i] && dataset.data[i].length) setCurChart(i);
        });
    }
    const angleSlice = (2 * Math.PI) / num_points;
    for (let i = 0; i < num_points; i++) {
      const angle = i * angleSlice - 0.5 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle) + 36;
      const rScale = d3.scaleLinear().domain([0, 1.15]).range([0, radius]);
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 36)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#AFAFAF")
        .attr("stroke-width", 1.3)
        .attr("stroke-dasharray", "2 2");
      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 2.7)
        .attr("fill", "#AFAFAF");
      // 標籤
      svg
        .append("text")
        .attr("x", x * 1.15)
        .attr("y", y * (y > 0 ? 1.18 : 1.35))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("class", "content-regular")
        .text(dataset.label[curChart][i][0]);
      svg
        .append("text")
        .attr("x", x * 1.15)
        .attr("y", y * (1.15 + (y > 0 ? 0.2 : 0.02)))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("class", "content-regular")
        .text(dataset.label[curChart][i][1]);
      const lineGenerator = d3
        .lineRadial()
        .angle((d, i) => i * angleSlice)
        .radius((d) => {
          return ((d + 0.15) / 1.15) * radius;
        })
        .curve(d3.curveLinearClosed);
      for (let j = 0; j < dataset.data.length; j++) {
        if (
          dataset.group[j] !== dataset.group[curChart] ||
          j === curChart ||
          dataset.data[j].length < num_points
        )
          continue;
        svg
          .append("path")
          .datum(dataset.data[j])
          .attr("fill", dataset.color[j])
          .attr("stroke", d3.color(dataset.stroke[j]))
          .attr("stroke-width", 1.3)
          .attr("opacity", 0.07)
          .attr("d", lineGenerator)
          .attr("transform", "translate(0, 36)");
        svg
          .append("circle")
          .attr("cx", rScale(dataset.data[j][i] + 0.15) * Math.cos(angle))
          .attr("cy", rScale(dataset.data[j][i] + 0.15) * Math.sin(angle))
          .attr("r", 5)
          .attr("fill", dataset.stroke[j])
          .attr("opacity", 0.07)
          .attr("transform", "translate(0, 36)");
      }

      svg
        .append("path")
        .datum(dataset.data[curChart])
        .attr("fill", dataset.color[curChart])
        .attr("stroke", d3.color(dataset.stroke[curChart]))
        .attr("stroke-width", 1)
        .attr("d", lineGenerator)
        .attr("transform", "translate(0, 36)");
      svg
        .append("circle")
        .attr("cx", rScale(dataset.data[curChart][i] + 0.15) * Math.cos(angle))
        .attr("cy", rScale(dataset.data[curChart][i] + 0.15) * Math.sin(angle))
        .attr("r", 5)
        .attr("fill", dataset.stroke[curChart])
        .attr("transform", "translate(0, 36)");
    }
  }, [dataset, num_points, width, setCurChart, curChart, height]);
  return <svg ref={svgRef} />;
};
export default RadarChart;
