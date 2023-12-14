import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getCABOApi } from "../../helpers/api";
import { basicColors, traitsTable } from "../../helpers/constants";

const TraitDensity = (props: any) => {
  const {
    type,
    trait,
    traitVal,
    traitGraph,
    traitSelection,
    traitType,
    indexCat,
    speciesList,
  } = props;
  const densityRef = useRef(null);

  useEffect(() => {
    const getAllValuesForOneTrait = async (trait: string) => {
      try {
        getCABOApi(
          "/traits/all/",
          {
            params: {
              trait: trait,
              table: traitsTable[trait],
            },
          },
          "get"
        ).then((res) => {
          density(res.data);
        });
      } catch (error) {
        console.error(error);
      }
    };
    getAllValuesForOneTrait(props.trait);
  }, [trait]);

  const density = (data: any) => {
    // set the dimensions and margins of the graph
    var self = this;
    data = data[0][trait].split(",").map(function (item: any) {
      return parseFloat(item);
    });
    data.sort(function (a: any, b: any) {
      return a - b;
    });
    var margin = { top: 15, right: 30, bottom: 30, left: 50 },
      width = 450 - margin.left - margin.right;
    if (traitSelection !== undefined) {
      var height = 120 - margin.top - margin.bottom;
      var plot_height = height - 40;
    } else {
      var height = 75 - margin.top - margin.bottom;
      var plot_height = height;
    }
    // append the svg object to the body of the page
    var svg = d3
      .select("#" + traitGraph)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the x Axis
    var tmin = data[Math.floor(data.length * 0.03)];
    var tmax = data[data.length - Math.floor(data.length * 0.03)];
    var x = d3.scaleLinear().domain([tmin, tmax]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + plot_height + ")")
      .call(d3.axisBottom(x));

    // Compute kernel density estimation
    var kde = kernelDensityEstimator(
      kernelEpanechnikov((tmax - tmin) / 40),
      x.ticks(50)
    );
    var density = kde(data);
    density.push([density[density.length - 1][0], 0]);
    density.unshift([density[0][0], 0]);
    var maxy = 0;
    density.map(function (item) {
      maxy = Math.max(item[1], maxy);
    });

    var y = d3.scaleLinear().range([plot_height, 0]).domain([0, maxy]);

    if (traitType === "overall") {
      var densityColor = "#ececec";
    } else {
      var densityColor = basicColors[indexCat];
    }

    // Plot the area
    svg
      .append("path")
      .attr("class", "mypath")
      .datum(density)
      //.attr("fill", "#69b3a2")
      .attr("fill", densityColor)
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d[0]);
          })
          .y(function (d) {
            return y(d[1]);
          })
      );
    if (traitVal !== true) {
      svg
        .append("line")
        .attr("x1", x(traitVal))
        .attr("y1", plot_height)
        .attr("x2", x(traitVal))
        .attr("y2", 0)
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "none");
    }
    if (type === "overall") {
      var jitterWidth = 10;
      svg
        .selectAll("circle")
        .data(Object.values(traitSelection))
        .enter()
        .append("circle")
        .attr("cy", function (d) {
          return 65 + Math.random() * jitterWidth;
        })
        .attr("cx", function (d: any) {
          return x(parseFloat(d[trait]));
        })
        .attr("r", 5)
        .style("fill", function (d: any) {
          return basicColors[speciesList.indexOf(d.scientific_name)];
        })
        .style("fill-opacity", 0.3)
        .style("stroke-opacity", 0)
        .attr("stroke-width", 0);
    }
  };

  const kernelDensityEstimator = (kernel: any, X: any) => {
    return function (V) {
      return X.map(function (x) {
        return [
          x,
          d3.mean(V, function (v) {
            return kernel(x - v);
          }),
        ];
      });
    };
  };

  const kernelEpanechnikov = (k: any) => {
    return function (v) {
      return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
    };
  };

  return (
    <div
      id={`trait-graph-${props.trait}-${props.indexCat}`}
      ref={densityRef}
    ></div>
  );
};

export default TraitDensity;
