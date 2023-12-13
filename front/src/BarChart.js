/*
 * Project 2
 * BarChart component JavaScript source code
 *
 * Author: Denis Gracanin, Craig Huang
 * Version: 1.0
 */
// Uses Project 1 solution skeleton code
import "./BarChart.css";
import React, { useEffect } from "react";
import { Box } from "@mui/system";
import * as d3 from "d3";

let svg = null;

let didMount = true;

// Settings
const settings = {
  viewBox: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  title: {
    x: 0,
    y: 0,
    width: 100,
    height: 10,
    baseline: 5,
  },
  labels: {
    x: 5,
    y: 95,
    width: 95,
    height: 5,
    baseline: 2,
  },
  values: {
    x: 0,
    y: 10,
    width: 5,
    height: 90,
    baseline: 4.5,
    min: 0,
    max: 7,
    step: 0.5,
  },
  lines: {
    margin: 1.5,
  },
  bars: {
    x: 5,
    y: 10,
    width: 95,
    height: 85,
    ratio: 0.7,
  },
};

const BarChart = (props) => {
  // State for hovering over rect
  const [hoverIndex, setHoverIndex] = React.useState(null);

  // Method for when user is hovering over rect
  const handleIsHovering = (index) => {
    setHoverIndex(index);
  };

  // Method for when user stops hovering over rect
  const handleIsNotHovering = () => {
    setHoverIndex(null);
  };

  // Reference for component
  let myReference = React.createRef();
  // Get dataset through props
  let dataset = props.dataset;
  // Calculate the max value of the data to scale other rectangles
  if (dataset) {
    settings.values.max = Math.max(
      ...dataset.data.map((x) => Object.values(x)[1])
    );
  }
  // Initialization
  const init = () => {
    let container = d3.select(myReference.current);
    container.selectAll("*").remove();
    // Create a viewbox that contains the bar chart
    svg = container
      .append("svg")
      .attr(
        "viewBox",
        settings.viewBox.x +
          " " +
          settings.viewBox.y +
          " " +
          settings.viewBox.width +
          " " +
          settings.viewBox.height
      )
      .attr("preserveAspectRatio", "none")
      .style("width", "100%")
      .style("height", "100%")
      .style("border", "none");
  };
  // Paint method, renders svg items within the view box
  const paint = () => {
    if (!dataset) {
      return;
    }
    // Clear svg
    svg.selectAll("*").remove();
    // Horizontal lines
    svg
      .append("g")
      .attr("id", "lines")
      .selectAll("line")
      .data(
        d3.range(
          (settings.values.max - settings.values.min) / settings.values.step
        )
      )
      .enter()
      .append("line")
      .attr("x1", settings.values.x + settings.values.width)
      .attr(
        "x2",
        settings.values.x +
          settings.values.width +
          settings.bars.width -
          settings.lines.margin
      )
      .attr("y1", (item, index) => {
        return (
          settings.labels.y -
          (index * settings.bars.height) /
            ((settings.values.max - settings.values.min) / settings.values.step)
        );
      })
      .attr("y2", (item, index) => {
        return (
          settings.labels.y -
          (index * settings.bars.height) /
            ((settings.values.max - settings.values.min) / settings.values.step)
        );
      });
    // Bars
    svg
      .append("g")
      .attr("id", "bars")
      .selectAll("rect")
      .data(dataset.data)
      .enter()
      .append("rect")
      // Set the x attribute
      .attr("x", (item, index) => {
        return (
          settings.bars.x +
          ((1 - settings.bars.ratio + index) * settings.bars.width) /
            (dataset.data.length + 1 - settings.bars.ratio)
        );
      })
      // Set the y attribute
      .attr("y", (item, index) => {
        return (
          settings.labels.y -
          (Object.values(item)[1] * settings.bars.height) /
            (settings.values.max - settings.values.min)
        );
      })
      // Set the width attribute
      .attr(
        "width",
        (settings.bars.ratio * settings.bars.width) /
          (dataset.data.length + 1 - settings.bars.ratio)
      )
      // Set the height attribute
      .attr("height", (item, index) => {
        return (
          (Object.values(item)[1] * settings.bars.height) /
          (settings.values.max - settings.values.min)
        );
      })
      // Fill rectangles red based on selected status
      .attr("fill", (item, index) => {
        const selectedBars = props.selected;
        return selectedBars.includes(index) ? "red" : "";
      })
      // On click, handle selecting an item
      .on("click", (_, data) => {
        const index = dataset.data.indexOf(data);
        props.selectHandler(index);
      })
      // On hover, handle the hover
      .on("mouseenter", (_, data) => {
        const index = dataset.data.indexOf(data);
        handleIsHovering(index);
      })
      // On unhover, handle the unhover
      .on("mouseleave", handleIsNotHovering);

    // Tooltip when the cursor hovers
    if (hoverIndex !== null) {
      // Get the data of the current rect being hovered over
      const data = dataset.data[hoverIndex];
      // The tooltip is stationary
      const tooltipX = settings.viewBox.width;
      const tooltipY = settings.viewBox.height / 2 - 40;

      svg
        .append("g")
        .attr("id", "tooltip")
        .append("text")
        .attr("x", tooltipX)
        .attr("y", tooltipY)
        .style("font-size", "3px")
        .style("text-anchor", "end")
        // The text will be X Label: X value, Y Label: Y value
        .text(
          `${Object.keys(data)[0]} = ${Object.values(data)[0]}, ${
            Object.keys(data)[1]
          } = ${Object.values(data)[1]}`
        );
    }

    // Title
    svg
      .append("g")
      .attr("id", "title")
      .append("text")
      .attr("x", (settings.title.x + settings.title.width) / 2)
      .attr(
        "y",
        settings.title.y + settings.title.height - settings.title.baseline
      )
      .text(dataset.title);
    // Append the horizontal values
    svg
      .append("g")
      .attr("id", "labels")
      .selectAll("text")
      .data(dataset.data)
      .enter()
      .append("text")
      .attr("x", (item, index) => {
        return (
          settings.labels.x +
          ((1 - settings.bars.ratio + index + settings.bars.ratio / 2) *
            settings.bars.width) /
            (dataset.data.length + 1 - settings.bars.ratio)
        );
      })
      .attr(
        "y",
        settings.labels.y + settings.labels.height - settings.labels.baseline
      )
      .text((item, index) => {
        return Object.values(item)[0];
      });
    // Append vertical values
    svg
      .append("g")
      .attr("id", "values")
      .selectAll("text")
      .data(
        d3.range(
          (settings.values.max - settings.values.min) / settings.values.step
        )
      )
      .enter()
      .append("text")
      .attr("x", settings.values.x + settings.values.width / 2)
      .attr("y", (item, index) => {
        return (
          settings.values.y +
          settings.values.height -
          settings.values.baseline -
          (index * settings.bars.height) /
            ((settings.values.max - settings.values.min) / settings.values.step)
        );
      })
      .text((item, index) => {
        return (item / 2.0).toFixed(1);
      });

    // x-axis label
    svg
      .append("g")
      .attr("id", "title")
      .append("text")
      .style("text-anchor", "middle")
      .style("font-size", "2px")
      .attr("x", settings.viewBox.width / 2)
      .attr("y", settings.viewBox.height)
      .text(Object.keys(props.dataset.data[0])[0]);

    // y-axis label
    svg
      .append("g")
      .attr("id", "title")
      .append("text")
      .style("text-anchor", "start")
      .style("font-size", "2px")
      .attr("x", 0)
      .attr("y", settings.viewBox.height - 90)
      .text(Object.keys(props.dataset.data[0])[1]);
  };

  // Use effect method
  useEffect(() => {
    if (didMount) {
      didMount = false;
      init();
      window.addEventListener("resize", () => {
        paint();
      });
    }
    paint();
  });

  // Return a box with the reference
  return <Box ref={myReference} sx={props.sx}></Box>;
};

export default BarChart;
