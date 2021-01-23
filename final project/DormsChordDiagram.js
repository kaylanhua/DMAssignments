// Note: still have to create color gradient/change color scheme for final chord diagram
// Right now the colors are randomized

import ReactDOM from 'react-dom';
import './../index.css';
import App from './../App';
import reportWebVitals from './../reportWebVitals';

import React, { Component } from 'react';
import { extent, max, descending, tickStep, range } from 'd3';
import { json } from 'd3-fetch';
import { select, selectAll, event as currentEvent } from 'd3-selection';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector, sum } from 'd3-array';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { line, curveBasis, arc } from 'd3-shape';
import { format } from 'd3-format';
import { chord, ribbon } from 'd3-chord';

// import data2019 from './../assets/data/dorms_matches.json';
import data2020 from "./../assets/data/dorms_matches2020.json";
import data2019 from "../assets/data/dorms_matches.json";
import Select from "../assets/components/Select";

const d3 = {
    select,
    selectAll,
    path,
    descending,
    format,
    chord,
    scaleOrdinal,
    scaleLinear,
    scaleTime,
    schemeCategory10,
    line,
    json,
    extent,
    max,
    curveBasis,
    bisector,
    ribbon,
    arc,
    sum,
    tickStep,
    range
};

const schools2019 = [
    'Boston College',
    'Brown',
    'Carleton',
    'Claremont Colleges',
    'Columbia',
    'Cornell',
    'Harvard University',
    'MIT',
    'UChicago',
    'UW Madison',
    'WashU',
    'Wellesley',
    'Yale',
];

const schools2020 = [
    "BC",
    "Brown",
    "CMU",
    "Carleton",
    "Claremont",
    "Columbia",
    "Dartmouth",
    "Harvard",
    "MIT",
    "McGill",
    "NYU",
    "Princeton",
    "Tufts",
    "UC Berkeley",
    "UCLA",
    "UCSD",
    "UChicago",
    "UNLV",
    "UPenn",
    "UW",
    "UW Madison",
    "Vanderbilt",
    "WashU",
    "Wellesley",
    "Wesleyan",
    "Williams",
    "Yale"
];

const years = [
    '2019',
    '2020'
];

class DormsChordDiagram extends Component {

    constructor(props){
        // super(props);
        super(props);
        this.state = {
            school: 'Harvard',
            year: '2020'
        };
        // this.createChord = this.createChord.bind(this);
    }

    componentDidMount() {
        var data;
        if (this.state.year === '2020'){
            data = data2020;
        } else {
            data = data2019;
        }
        this.createChord(data[this.state.school]);
    }

    componentDidUpdate() {
        var schools;
        var data;
        if (this.state.year === '2020'){
            data = data2020;
            schools = schools2020;
        } else {
            data = data2019;
            schools = schools2019;
        }

        if (!schools.includes(this.state.school)) {
            if (this.state.year === '2020') {
                this.setState({ school: 'Harvard' });
                this.createChord(data['Harvard']);
            } else {
                this.setState({ school: 'Harvard University' });
                this.createChord(data['Harvard University']);
            }
        } else {
            this.createChord(data[this.state.school]);
        }

    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    // componentDidMount() {
    //     this.createChord();
    // }
    // componentDidUpdate() {
    //     this.createChord();
    // }

    createChord(selectedData) {
        const node = this.node;
        console.log("createChord called successfully");

        // --------global variables-------
        var margin = {top: 30, right: 30, bottom: 50, left: 30};
        var width = 700 - margin.left - margin.right;
        var height = width;

        var outerRadius = width * 0.4 - 60;
        var innerRadius = outerRadius - 10;

        var formatValue = d3.format(".3~");
        var chord = d3.chord()
            .padAngle(10 / innerRadius)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        var ribbon = d3.ribbon()
            .radius(innerRadius - 1)
            .padAngle(1/innerRadius);

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        //--------end of global variables--------

        console.log("right before json is loaded");


        console.log("first data log: ");
        console.log(data2020);

        // Doesn't work for MIT, NYU, and UNLV for some reason.
        // var input = data2020.Princeton;
        var input = selectedData;

        // ---create index array: ["Canaday": 0, "Mather": 1, ..]---
        var namesArray = []
        var houseIndex = [];
        var i = 0;
        for (var house in input.link_repeats){
            namesArray.push(house);
            houseIndex[house] = i;
            i += 1;
        }
        // console.log(houseIndex) this works

        // ---for each house compute top 3, result: [["house1", 32], ["house2", 40], ["house3", 8]]---
        var dataMatrix = [];
        console.log(namesArray);
        for (var house in input.link_repeats) {
            var matches = [];
            var values = [];

            // find match values
            for (var match in input.link_repeats[house]){
                if (namesArray.includes(match)) {
                    matches.push([match, input.link_repeats[house][match]]);
                    values.push(input.link_repeats[house][match]);
                }
            }

            var sorted_val = values.sort(function(a, b) {
                return b - a;
            });

            var threshold = sorted_val[2];
            console.log("threshold: " + threshold);
            var top3 = [];

            for (let i = 0; i < matches.length; i++) {
            // && matches[i][1] > 0
                if (matches[i][1] >= threshold ) {
                    top3.push(matches[i]);
                }
            }

            var houseData = []
            for(let i = 0; i < namesArray.length; i++){
                houseData.push(0);
            }

            for(let i = 0; i < 3; i++){
                houseData[houseIndex[top3[i][0]]] = top3[i][1];
            }

            dataMatrix.push(houseData);
            // console.log(dataMatrix);
            // console.log(top3);
            // console.log(matches);
            // console.log(values);
            // console.log(sorted_val);

        }

        var colorsArray = [];
        for(let i = 0; i < namesArray.length; i++) {
            colorsArray.push('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));
        }
        console.log(colorsArray);

        var data = Object.assign(
            dataMatrix, {
                names: namesArray,
                colors: colorsArray
            });
        //--------end of loading data---------

        console.log("createVisualization is called");

        // Load data
        var names = data.names === undefined ? d3.range(data.length) : data.names;
        var colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors;


        // Define variables
        var color = d3.scaleOrdinal(names, colors);
        var tickStep = d3.tickStep(0, d3.sum(data.flat()), 100);
        function ticks({startAngle, endAngle, value}) {
            const k = (endAngle - startAngle) / value;
            return d3.range(0, value, tickStep).map(value => {
                return {value, angle: value * k + startAngle};
            });
        }

        d3.select('#dorms-chord')
            .select('svg')
            .remove();


        var svg = d3.select("#dorms-chord").append("svg")
            .attr("id", "chart-area")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .append("g")
            .attr("id", "chart-area");

        var chords = chord(data);

        var group = svg.selectAll("g")
            .append("g")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .data(chords.groups)
            .enter().append("g")
            .join("g");

        group.append("path")
            .attr("fill", d => color(names[d.index]))
            .attr("d", arc);

        group.append("title")
            .text(d => `${names[d.index]} ${formatValue(d.value)}`);

        var groupTick = group.append("g")
            .selectAll("g")
            .data(ticks)
            .join("g")
            .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

        groupTick.append("line")
            .attr("stroke", "currentColor")
            .attr("x2", 6);

        groupTick.append("text")
            .attr("x", 8)
            .style("font-size", 5)
            .attr("dy", "0.35em")
            .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
            .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
            .text(d => formatValue(d.value));

        group.select("text")
            .attr("font-weight", "bold")
            .text(function(d) {
                return this.getAttribute("text-anchor") === "end"
                    ? `↑ ${names[d.index]}`
                    : `${names[d.index]} ↓`;
            });

        svg.append("g")
            .attr("fill-opacity", 0.8)
            .selectAll("path")
            .data(chords)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("fill", d => color(names[d.source.index]))
            .attr("d", ribbon)
            .append("title")
            .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

    }
    render() {
        var schools;
        if (this.state.year === '2020'){
            schools = schools2020;
        } else {
            schools = schools2019;
        }

        const { school, year } = this.state;
        // return <svg ref={node => this.node = node}
        //             width={500} height={500}>
        // </svg>

        return (
            <div className="dorms-matches-container">
                <div className="stats-header">Matches between dorms:</div>
                <Select
                    className="stats-select"
                    handleInputChange={this.handleInputChange}
                    name="year"
                    placeholder="Year"
                    value={year}
                    values={years}
                />
                <Select
                    className="stats-select"
                    handleInputChange={this.handleInputChange}
                    name="school"
                    placeholder="School"
                    value={school}
                    values={schools}
                />

                <div id="dorms-chord"></div>
                {/*<div id="top-dorms"></div>*/}
            </div>
        );

        // return (<div id="dorms-chord"></div>);
    }
}

export default DormsChordDiagram
reportWebVitals();


