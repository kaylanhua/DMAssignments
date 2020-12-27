// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// I added
import React, { Component } from 'react';
import { json, extent, max, descending } from 'd3';
import { select, selectAll, event as currentEvent } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemePaired, schemeCategory10 } from 'd3-scale-chromatic';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveBasis } from 'd3-shape';
import { drag } from 'd3-drag';
import { csv } from 'd3-request';

import data from './wealth-health-2014.csv';

const d3 = {
    select,
    selectAll,
    path,
    descending,
    scaleOrdinal,
    scaleLinear,
    scaleTime,
    schemeCategory10,
    line,
    json,
    extent,
    max,
    curveBasis,
    schemePaired,
    axisBottom,
    axisLeft,
    bisector,
    timeMinute,
    timeDay,
    timeFormat,
    drag,
};

class Chart extends Component {
    constructor(props){
        super(props);
        this.createChart = this.createChart.bind(this);

    }

    componentDidMount() {
        this.createChart();
    }
    componentDidUpdate() {
        this.createChart();
    }
    createChart() {
        const node = this.node;
        console.log("createChart called");
        var width = 700,
            height = 500;

        var regions = [];

        csv(data, function(data) {
            console.log("first data log: ");
            console.log(data);
            data.forEach( function (d) {
                d.LifeExpectancy = +d.LifeExpectancy;
                d.Income = +d.Income;
                d.Population = +d.Population;
                if (!regions.includes(d.Region)) {
                    regions.push(d.Region);
                }
            });

            data.sort(function(x, y){
                return d3.descending(x.Population, y.Population);
            })

            createVisualization(data);
        });

        var createVisualization = function(data) {
            console.log(regions);
            console.log(data);
            // Step 2: Append a new SVG area with D3
            // The ID of the target div container in the html file is #chart-area
            // Use the margin convention with 50 px of bottom padding and 30 px of padding on other sides!
            var margin = {top: 30, right: 30, bottom: 50, left: 30};
            var width = 700 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var svg = d3.select(".chart-area").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("id", "chart-area")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Step 3: Create linear scales by using the D3 scale functions
            // You will need an income scale (x-axis) and a scale function for the life expectancy (y-axis).
            // Call them incomeScale and lifeExpectancyScale.
            // Use d3.min() and d3.max() for the input domain
            // Use the variables height and width for the output range

            var padding = 10;

            var incomeScale = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    // goes from min to max income value
                    return d.Income;
                }))
                .range([padding, width-padding]);

            var lifeExpectancyScale = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    // goes from min to max LE value
                    return d.LifeExpectancy;
                }))
                .range([height - padding, padding]);


            // Step 4: Try the scale functions
            // You can call the functions with example values and print the result to the web console.

            console.log(incomeScale(2000));
            console.log(lifeExpectancyScale(80));

            // Step 5: Map the countries to SVG circles
            // Use select(), data(), enter() and append()
            // Instead of setting the x- and y-values directly,
            // you have to use your scale functions to convert the data values to pixel measures

            var circles = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle");

            // Step 6: Use your scales (income and life expectancy) to create D3 axis functions

            var xAxis = d3.axisBottom(incomeScale);
            var yAxis = d3.axisLeft(lifeExpectancyScale);


            // Step 7: Append the x- and y-axis to your scatterplot
            // Add the axes to a group element that you add to the SVG drawing area.
            // Use translate() to change the axis position

            svg.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0," + (height) + ")")
                .call(xAxis);
            svg.append("g")
                .attr("class", "yAxis")
                .call(yAxis);


            // Step 8: Refine the domain of the scales
            // Notice that some of the circles are positioned on the outer edges of the svg area
            // You can include buffer values to widen the domain and to prevent circles and axes from overlapping

            // DONE ABOVE IN STEP 3

            // Step 9: Label your axes

            svg.append("text")
                .text("Income per Person (USD)")
                .attr("x", width * 17/20)
                .attr("y", height - padding);
            svg.append("text")
                .text("Life Expectancy (years)")

            // Step 10: Add a scale function for the circle radius
            // Create a population-dependent linear scale function. The radius should be between 4 - 30px.
            // Then use the scale function to specify a dynamic radius

            var cRadius = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    // goes from min to max income value
                    return d.Population;
                }))
                .range([4, 30]);

            var linearColor = d3.scaleLinear()
                .domain([0,100])
                .range(["darkgreen","lightgreen"]);

            var countryColor = d3.scaleOrdinal()
                .domain(["Sub-Saharan Africa", "South Asia", "East Asia & Pacific", "Middle East & North Africa", "America", "Europe & Central Asia"])
                .range(d3.schemeCategory10)
            // .paddingInner(0.05);


            var circleAttributes = circles
                .attr("cx", function(d) {
                    return (incomeScale(d.Income));
                })
                .attr("cy", function (d) {
                    return (lifeExpectancyScale(d.LifeExpectancy));
                })
                .attr("r", function (d) {
                    return (cRadius(d.Population));
                })
                .attr("fill", function (d) {
                    return (countryColor(d.Region));
                });

            // Step 11: Change the drawing order
            // Larger circles should not overlap or cover smaller circles.
            // Sort the countries by population before drawing them.

            // Step 12: Color the circles (countries) depending on their regions
            // Use a D3 color scale



        };
    }
    render() {
        return <svg ref={node => this.node = node}
                    width={500} height={500}>
        </svg>
    }
}
export default Chart




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
