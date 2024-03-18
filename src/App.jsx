import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createPDF } from "./utils";

const App = () => {
  // draw a d3 chart
  // with columns x and y with random data
  const chartCtr = useRef(null);
  const chartWrapper = useRef(null);

  const drawChart = () => {
    const data = [
      { x: 10, y: 20 },
      { x: 40, y: 90 },
      { x: 80, y: 50 },
      { x: 160, y: 100 },
      { x: 200, y: 30 },
    ];
    if (!chartCtr.current) return;

    // first clear the chart
    d3.select(chartCtr.current).selectAll("*").remove();

    const svg = d3
      .select(chartCtr.current)
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    /*
      <defs>
    <linearGradient id="gradient1">
      <stop class="stop1" offset="0%" />
      <stop class="stop2" offset="50%" />
      <stop class="stop3" offset="100%" />
    </linearGradient>
  </defs>
      */

    // add these defs
    const defs = svg.append("defs");

    const gradient = defs.append("linearGradient").attr("id", "gradient1");

    gradient
      .append("stop")
      .attr("class", "stop1")
      .attr("offset", "0%")
      .attr("stop-color", "red");
    gradient
      .append("stop")
      .attr("class", "stop2")
      .attr("offset", "50%")
      .attr("stop-color", "orange");
    gradient
      .append("stop")
      .attr("class", "stop3")
      .attr("offset", "100%")
      .attr("stop-color", "yellow");

    // draw axes
    const xScale = d3.scaleLinear().domain([0, 200]).range([0, 500]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([500, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").attr("transform", "translate(0, 500)").call(xAxis);
    svg.append("g").call(yAxis);

    // draw line
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    svg.append("path").datum(data).attr("fill", "none").attr("d", line);

    // draw area
    const area = d3
      .area()
      .x((d) => xScale(d.x))
      .y0(500)
      .y1((d) => yScale(d.y));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#gradient1)")
      .attr("d", area);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 5);

    // draw text
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y))
      .text((d) => `${d.x}, ${d.y}`);
  };

  useEffect(() => {
    drawChart();
  }, []);

  return (
    <>
      <div ref={chartWrapper}>
        <h1 className="headline">Headline for this chart</h1>
        <div id="chart-svg" ref={chartCtr} />
        <p
          className="subtitle"
          style={{
            fontSize: "0.8em",
          }}
        >
          Subtitle for the chart
        </p>
      </div>
      {
        <button onClick={() => createPDF(chartWrapper.current)}>
          Create PDF
        </button>
      }
    </>
  );
};

export default App;
