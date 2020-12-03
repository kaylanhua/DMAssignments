// Part 1: In-meeting activity
var padding = 10;
var width = 800,
    height = 400;

var svg = d3.select("#chart-area1")
    .append("svg")
    .attr("width", 800)
    .attr("height", 200)
    .append("g");

var textLine = svg.append("text")
    .attr("x", 20)
    .attr("y", 100)
    .text("Orders");


function updateVisualization(orders) {
    // console.log(orders);

    // Step 1: Append new circles for new orders
    // The color of the circle should be brown for coffee orders and green for tea
    // Radius should vary with the price
    var circles = svg.selectAll("circle").data(orders);
    circles.enter()
        .append("circle")
        .merge(circles)
        .transition()
        .attr("fill", function (d) {
            if (d.product == "coffee") {
                return "brown";
            } else {
                return "green";
            }
        })
        .attr("r", function (d) {
            return (d.price * 20);
        })
        .attr("cx", function (d, index) {
            return index * 150 + 200;
        })
        .attr("cy", 100)

    // Step 2: Delete elements that have been removed from orders
    circles.exit().transition().duration(100).remove();

    // Step 3: Update the text label
    textLine.text("Orders: " + orders.length);
}


// -------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------



// Part 2: Assignment - Synthesis of everything we've learned!
var companies = [];
loadData();

d3.select("#ranking-type").on("change", updateBarChart);

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
    // data getter
    get: function() { return _data; },
    // data setter
    set: function(value) {
        _data = value;
        // update the visualization each time the data property is set by using the equal sign (e.g. data = [])
        updateBarChart()
    }
});



// Step 1: Define an SVG drawing area with our margin conventions. Append
// the drawing area to the div with id chart-area2

var margin = {top: 30, right: 30, bottom: 50, left: 30}

var svg2 = d3.select("#chart-area2")
    .append("svg")
    .attr("width", 800)
    .attr("height", 500);
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // .append("g");

var xAxisGroup = svg2.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .attr("class", "x-axis axis");
var yAxisGroup = svg2.append("g")
    .attr("transform", "translate(" + 50 + ", 0)")
    .attr("class", "y-axis axis");

// Step 2: Create scales for x and y.
// Hint: You should use scaleBand() for x. What should you use for y?
console.log("companies array: " + companies);



function loadData() {
    d3.csv("data/coffee-house-chains.csv", function(error, csv) {

        // Step 3: Get the data ready: change numeric fields to being numbers!

        csv.forEach( function (d) {
            d.stores = +d.stores;
            d.revenue = +d.revenue;
            if (!companies.includes(d.Region)) {
                companies.push(d.company);
            }
        });
        console.log("newly pushed companies: " + companies);

        // Store csv data in global variable
        data = csv;

        // updateVisualization gets automatically called within the data = csv call;
        // basically(whenever the data is set to a value using = operator);
        // see the definition above: Object.defineProperty(window, 'data', { ...

    });
}

// Render visualization
function updateBarChart() {

    var data = window.data;

    data.sort(function (a, b) {
        if (option === "stores") {
            return d3.descending(a.stores, b.stores);
        } else {
            return d3.descending(a.revenue, b.revenue);
        }
    });
    console.log(data);

    var xScale = d3.scaleBand()
        .domain(companies)
        //     ["Starbucks", "Tim Hortons", "Panera Bread", "Costa Coffee", "Dunkin Brands", "Krispy Kreme", "Caffé Nero", "Einstein Noah"]
        // )
        .range([padding, width-padding])
        .paddingInner(0.6)
        .paddingOuter(0.5)
        .align(0.5);

    var yScale = d3.scaleLinear()
        .range([height - padding, padding]);

    // Step 6: Get the currently selected option from the select box using D3
    var option = d3.select("#ranking-type").property("value");
    console.log(option);

    // Step 5: Sort the coffee house chains by number of stores,
    // and display the sorted data in the bar chart. Use the sort function
    // and provide it with an anonymous function.

    // companies = [];
    // data.forEach(function (d) {
    //     companies.push(d.company);
    // });
    // console.log("array of companies, sorted: " + companies);

    // Step 7: Change the scales, the sorting and the dynamic
    // properties in a way that they correspond to the selected option
    // (stores or revenue).
    // Hint: You can access JS object properties with bracket notation (product["price"])

    // Step 4: Implement the bar chart for number of stores worldwide
    // -  Specify domains for the two scales
    // -  Implement the enter-update-exit sequence for rect elements
    // -  Use class attribute bar for the rects

    xScale.domain(companies);
    yScale.domain([0, d3.max(data, function (d) {
        if (option === "stores") {
            return d.stores;
        } else {
            return d.revenue;
        }
    })]);

    var rectangles = svg2.selectAll("rect").data(data);
    rectangles.enter()
        .append("rect")
        .merge(rectangles)
        .attr("x", function (d) {
            return xScale(d.company);
        })
        .attr("y", function (d) {
            if (option === "stores") {
                return yScale(d.stores);
            } else {
                return yScale(d.revenue);
            }
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            if (option === "stores") {
                return height - yScale(d.stores);
            } else {
                return height - yScale(d.revenue);
            }
        })
        .transition()
        .duration(100)
        .attr("fill", "brown");

    rectangles.exit().remove();


    // Step 8: Append dynamic axes.
    // Use the following HTML class attributes:
    // x-axis and axis for the x-axis
    // y-axis and axis for the y-axis

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // svg2.append("g")
    //     .attr("class", "x-axis")
    //     .attr("transform", "translate(0," + (height) + ")")
    //     .call(xAxis);
    // svg2.append("g")
    //     .attr("class", "y-axis")
    //     .attr("transform", "translate(" + 50 + ", 0)")
    //     .call(yAxis);

    // Step 9: Add transitions to the bars/rectangles of your chart

    svg2.select(".y-axis")
        .transition()
        .duration(100)
        .call(yAxis);
    svg2.select(".x-axis")
        .transition()
        .duration(100)
        .call(xAxis);

    // d3.selectAll("rect") or rectangles
    //     .transition()
    //     .duration(100);

    // Step 10: Add transitions to the x and y axis
}