// PART I: Manipulating the DOM

// Step 1: Select the body of the HTML document and append an h2 element
// with the text "We're learning D3!"
d3.select("body").append("h2").text("We're learning D3!");


// Step 2: Select the body again and append a div with the id dynamic-content
d3.select("body").append("div").attr("id", "dynamic-content");


// Step 3: Select the div you just created (using its id!) and append a
// paragraph with some text of your choice (you can also style this if you want!)
d3.select("#dynamic-content").append("p").text("This is Kayla's paragraph.");


// PART II: Binding data

var schools = [
    { name: "Harvard", signups: 4695, region: "Northeast" },
    { name: "UW Madison", signups: 4232, region: "Midwest" },
    { name: "WashU", signups: 3880, region: "Midwest" },
    { name: "Brown", signups: 2603, region: "Northeast" },
    { name: "UChicago", signups: 2088, region: "Midwest" },
    { name: "UW", signups: 2042, region: "West" }
];

// Step 1: Append a new SVG element to HTML document with D3
// (width = 500px, height = 500px)
var svg = d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", 500);

// Step 2: Append a new SVG circle for every object in the schools array
var circles = svg.selectAll("circle")
    .data(schools)
    .enter()
    .append("circle");

// Step 3: Define the following dynamic properties for each circle:
//   - Position: set the x/y coordinates and make sure that the circles don’t overlap each other
//   - Radius: schools with over 3500 signups should be twice as big as schools with less than 2500 signups
//   - Colors: use a different color for each region
//   - Border: add a border to every circle (SVG property: stroke)
var circleAttributes = circles
    .attr("cx", function(d, index) {
        return ((index + 1) * 50);
    })
    .attr("cy", function (d) { return 300; })
    .attr("r", function (d) {
        var returnR;
        if (d.signups < 2500) { returnR = 8;
        } else if (d.signups < 3500) { returnR = 12;
        } else { returnR = 16; }
        return returnR;
    })
    .attr("fill", function (d) {
        var returnColor;
        if (d.region == "Northeast") { returnColor = "blue";
        } else if (d.region == "Midwest") { returnColor = "green";
        } else if (d.region == "West") { returnColor = "yellow";
        } else { returnColor = "black"; }
        return returnColor;
    })
    .style("stroke", "black");

// PART III: Loading data
var europeanUnion = ["Austria", "Belgium", "Bulgaria", "Croatia",
    "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France",
    "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania",
    "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania",
    "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"];

// Step 1: Use D3 to load the CSV file "cities.csv". then, print the data
// to the console and inspect it in your browser
d3.csv("data/cities.csv", function(data) {
    console.log(data);

    // Step 2: Filter the dataset: Filter the dataset to only include cities that are
    // part of the EU.
    var euCities = data.filter(function(row) {
        // Step 4: Prepare the data - each value of the CSV file is stored as a string,
        // but we want numerical values to be numbers.
        row.population = parseInt(row.population);
        row.x = parseInt(row.x);
        row.y = parseInt(row.y);
        return (europeanUnion.includes(row.country));
    })
    console.log(euCities);

    var svg = d3.select("body").append("svg")
        .attr("width", 700)
        .attr("height", 550);

    var circles = svg.selectAll("circle")
        .data(euCities)
        .enter()
        .append("circle");

// Step 5: Draw an SVG circle for each city in the filtered dataset
//   - All the elements (drawing area + circles) should be added dynamically with D3
//   - SVG container: width = 700px, height = 550px
//   - Use the x/y coordinates from the dataset to position the circles

    var circleAttributes = circles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        // Step 6: Change the radius of the circle to be data-dependent
        //   - The radius should be 4px for cities with population less than one million
        //   - The radius for all other cities should be 8px
        .attr("r", function (d) {
            var returnR;
            if (d.population < 1000000) { returnR = 4;
            } else { returnR = 8; }
            return returnR;
        })
        .attr("fill", function (d) {
            var returnColor;
            if (d.region == "Northeast") { returnColor = "blue";
            } else if (d.region == "Midwest") { returnColor = "green";
            } else if (d.region == "West") { returnColor = "yellow";
            } else { returnColor = "black"; }
            return returnColor;
        })
        .style("stroke", "black");

    // Step 7: Add labels with the names of the European cities
    //   - Use the SVG text element
    //   - All the elements should be the class of city-label
    //   - The labels should only be visible for cities with population greater
    //   than one million (use opacity)
    var text = svg.selectAll("text")
        .data(euCities)
        .enter()
        .append("text")
            .text( function (d) {
                var returnText;
                if (d.population > 1000000) { returnText = d.city;
                } else { returnText = ""; }
                return returnText;
            })
            // .attr("text-anchor", middle);
            .attr("x", (d) => (d.x + 10))
            .attr("y", (d) => (d.y) + 20);

});

// Step 3: Append a new paragraph to your HTML document that shows the
// number of EU countries
var numEU = europeanUnion.length;
d3.select("body").append("p").text(`There are ${numEU} countries in the EU.`);

// Optional bonus step: add tooltips displaying the country for each city
// https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73
