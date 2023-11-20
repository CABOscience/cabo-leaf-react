import * as d3 from "d3";

export default {
  drawBox: function (which, spectra_type, spectraGraph) {
    this.which = which;
    this.box = {};
    if (spectra_type == "main") {
      this.box.margin = { top: 0, right: 50, bottom: 80, left: 50 };
      this.box.width =
        0.7 * window.innerWidth - this.box.margin.left - this.box.margin.right; // Use the window's width
      this.box.height =
        0.4 * window.innerWidth - this.box.margin.top - this.box.margin.bottom; // Use the window's height
    } else {
      this.box.margin = { top: 0, right: 50, bottom: 80, left: 75 };
      this.box.width = 740 - this.box.margin.left - this.box.margin.right; // Use the window's width
      this.box.height =
        0.6 * 740 - this.box.margin.top - this.box.margin.bottom; // Use the window's height
    }
    const self = this;
    this.box.svg = d3
      .select("#" + spectraGraph)
      .append("svg")
      .attr(
        "width",
        this.box.width + this.box.margin.left + this.box.margin.right
      )
      .attr(
        "height",
        this.box.height + this.box.margin.top + this.box.margin.bottom
      )
      .append("g")
      .attr(
        "transform",
        "translate(" + this.box.margin.left + "," + this.box.margin.top + ")"
      );
    this.box.x = d3
      .scaleLinear()
      .domain([345, 2500])
      .range([0, this.box.width]);

    // 3. Call the x axis in a group tag
    this.box.xAxis = d3.axisBottom(this.box.x);
    this.box.gxAxis = this.box.svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.box.height + ")")
      .call(this.box.xAxis)
      .style("font-size", "0.9em");

    this.box.svg
      .append("text")
      .attr("y", this.box.height + 0.4 * this.box.margin.bottom)
      .attr("x", this.box.width / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "1.1em")
      .text("wavelength");
    //.text(this.$i18n.t("wavelength"));

    if (which == "both" || which == "reflectance") {
      this.box.y_r = d3
        .scaleLinear()
        .domain([0, 1]) // input
        .range([this.box.height, this.box.height * 0.15]); // output
      this.box.yAxisR = d3.axisLeft(this.box.y_r);
      this.box.gyAxisR = this.box.svg
        .append("g")
        .attr("class", "y axis")
        .call(this.box.yAxisR)
        .style("font-size", "0.9em");
      // Create an axis component with d3.axisLeft
      // text label for the y axis
      this.box.svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -50 - this.box.height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "1.1em")
        .text("reflectance");
      //.text(this.$i18n.t("reflectance"));
    }
    if (which == "both" || which == "transmittance") {
      this.box.y_t = d3
        .scaleLinear()
        .domain([1, 0]) // input
        .range([this.box.height, 0 + this.box.height * 0.15]); // output

      this.box.yAxisT = d3.axisRight(this.box.y_t);
      this.box.gyAxisT = this.box.svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate( " + this.box.width + ", 0 )")
        .call(this.box.yAxisT)
        .style("font-size", "0.9em");

      this.box.svg
        .append("text")
        .attr("y", -this.box.width - 1.1 * this.box.margin.right)
        .attr("x", this.box.margin.right + this.box.height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("transform", "rotate(90)")
        .style("font-size", "1.1em")
        .text("transmittance");
      //.text(this.$i18n.t("transmittance"));
    }

    //clip box to crop when zooming
    this.box.clip = this.box.svg
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip-" + spectra_type)
      .append("SVG:rect")
      .attr("width", this.box.width)
      .attr("height", this.box.height)
      .attr("x", 0)
      .attr("y", 0);

    this.box.zoom = d3
      .zoom()
      .scaleExtent([0.9, 5]) // This controls how much you can unzoom (x1) and zoom (x5)
      //.translateExtent([[0, 0], [this.box.width, this.box.height - this.box.margin.bottom]])
      .extent([
        [0, 0],
        [this.box.width, this.box.height - this.box.margin.bottom],
      ])
      .on("start", this.startZoom)
      .on("zoom", this.updateChart);

    // Define the div for the tooltip
    this.box.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  },
  meanLeafSpectra: function (data, spectra_type, color, animate) {
    data.slice().sort((a, b) => d3.descending(a.wavelength, b.wavelength));
    const self = this;

    if (spectra_type == "main") {
      var stroke_opacity = 1;
      var stroke_width = 2.5;
    } else {
      var stroke_opacity = 0.6;
      var stroke_width = 1.5;
    }

    // Create the scatter variable: where both the circles and the brush take place
    const line_box = this.box.svg
      .append("g")
      .attr("clip-path", "url(#clip-" + spectra_type + ")");

    this.box.svg
      .append("rect")
      .attr("width", this.box.width)
      .attr("height", this.box.height - this.box.margin.bottom)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr(
        "transform",
        "translate(" + this.box.margin.top + "," + this.box.margin.left + ")"
      )
      .call(this.box.zoom)
      .on("wheel", function (event) {
        event.preventDefault();
      });

    if (this.which == "both" || this.which == "reflectance") {
      const reflectance = data.filter((s) => s.r_t == "reflectance");
      const line = d3
        .line()
        .x(function (d) {
          return self.box.x(d.wavelength);
        }) // set the x values for the line generator
        .y(function (d) {
          return self.box.y_r(d.val);
        });

      if (this.showRange == "true") {
        const lineMin = d3
          .line()
          .x(function (d) {
            return self.box.x(d.wavelength);
          }) // set the x values for the line generator
          .y(function (d) {
            return self.box.y_r(d.min);
          });

        const lineMax = d3
          .line()
          .x(function (d) {
            return self.box.x(d.wavelength);
          }) // set the x values for the line generator
          .y(function (d) {
            return self.box.y_r(d.max);
          });

        line_box
          .append("path")
          .datum(reflectance)
          .attr("fill", "none")
          .attr("class", "spectra_r")
          .attr("stroke", color)
          .attr("spectra", "r_min")
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.3)
          .attr("d", lineMin);

        line_box
          .append("path")
          .datum(reflectance)
          .attr("fill", "none")
          .attr("class", "spectra_r")
          .attr("spectra", "r_max")
          .attr("stroke", color)
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.3)
          .attr("d", lineMax);
      }
      const lineyr = line_box
        .append("path")
        .datum(reflectance)
        .attr("fill", "none")
        .attr("class", "spectra_r")
        .attr("spectra", "r")
        .attr("stroke", color)
        .attr("stroke-width", stroke_width)
        .attr("stroke-opacity", stroke_opacity)
        .attr("d", line)
        .on("mouseover", function (event, d) {
          self.box.tooltip.transition().duration(200).style("opacity", 0.9);
          self.box.tooltip
            .html(d[0].scientific_name)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          self.box.tooltip.transition().duration(500).style("opacity", 0);
        });
      if (animate == true) {
        lineyr
          .attr(
            "stroke-dasharray",
            1.5 * this.box.width + " " + 1.5 * this.box.width
          )
          .attr("stroke-dashoffset", 1.5 * this.box.width)
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      }
    }
    if (this.which == "both" || this.which == "transmittance") {
      let transmittance = data.filter((s) => s.r_t == "transmittance");
      /*transmittance.forEach(s => {
					s.avg=1-s.avg;
					s.max=1-s.max;
					s.min=1-s.min;
				})*/

      if (this.showRange == "true") {
        const tlineMin = d3
          .line()
          .x(function (d) {
            return self.box.x(d.wavelength);
          }) // set the x values for the line generator
          .y(function (d) {
            return self.box.y_t(d.min);
          });

        const tlineMax = d3
          .line()
          .x(function (d) {
            return self.box.x(d.wavelength);
          }) // set the x values for the line generator
          .y(function (d) {
            return self.box.y_t(d.max);
          });

        line_box
          .append("path")
          .datum(transmittance)
          .attr("fill", "none")
          .attr("class", "spectra_t")
          .attr("spectra", "t_min")
          .attr("stroke", color)
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.3)
          .attr("d", tlineMin);
        line_box
          .append("path")
          .datum(transmittance)
          .attr("class", "spectra_t")
          .attr("spectra", "t_max")
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.3)
          .attr("d", tlineMax);
      }

      const tline = d3
        .line()
        .x(function (d) {
          return self.box.x(d.wavelength);
        }) // set the x values for the line generator
        .y(function (d) {
          return self.box.y_t(d.val);
        });

      const lineyt = line_box
        .append("path")
        .datum(transmittance)
        .attr("fill", "none")
        .attr("class", "spectra_t")
        .attr("spectra", "t")
        .attr("stroke", color)
        .attr("stroke-width", stroke_width)
        .attr("stroke-opacity", stroke_opacity)
        .attr("d", tline);

      if (animate == true) {
        lineyt
          .attr(
            "stroke-dasharray",
            1.5 * this.box.width + " " + 1.5 * this.box.width
          )
          .attr("stroke-dashoffset", 1.5 * this.box.width)
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      }
    }
  },
  startZoom: function () {
    this.box.startx = this.box.x;
    this.box.starty_t = this.box.y_t;
    this.box.starty_r = this.box.y_r;
  },
  updateChart: function (event) {
    this.showResetZoom = true;
    // recover the new scale
    const newX = event.transform.rescaleX(this.box.x);
    this.box.gxAxis.call(this.box.xAxis.scale(newX));
    if (this.which == "reflectance" || this.which == "both") {
      const newY_R = event.transform.rescaleY(this.box.y_r);
      this.box.gyAxisR.call(this.box.yAxisR.scale(newY_R));
      d3.selectAll(".main-spectra-graph .spectra_r").attr(
        "transform",
        event.transform
      );
    }
    if (this.which == "transmittance" || this.which == "both") {
      const newY_T = event.transform.rescaleY(this.box.y_t);
      this.box.gyAxisT.call(this.box.yAxisT.scale(newY_T));
      d3.selectAll(".main-spectra-graph .spectra_t").attr(
        "transform",
        event.transform
      );
    }
  },
  clear: function (spectraGraph) {
    d3.select("#" + spectraGraph).html("");
  },
};
