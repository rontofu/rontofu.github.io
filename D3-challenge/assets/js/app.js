// @TODO: YOUR CODE HERE!

// Set up chart
var svgWidth = 960;
var svgHeight = 550;

var margin = {
  top: 20,
  right: 40,
  bottom: 50,
  left: 45
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an svg wrapper & append a svg group

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import and format data

d3.csv("/assets/data/data.csv").then(function(stateData) {

    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
  });

// Add axis labels
    
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 3)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");
      
chartGroup.append("text")
    .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 25})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

// Create scaling functions  

    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

// Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);  

// Add axis

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 9)
        .attr("fill", "lightblue")
        .attr("opacity", ".7")
        .attr("stroke", "white");    

        chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "9px")
        .selectAll("tspan")
        .data(stateData)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare -.02);
        })
        .text(function(data) {
            return data.abbr
        });

// Implement tooltip (bonus)

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, 70])
        .style("position", "absolute")
        .style("background", "lightblue")
        .style("pointer-events", "none")
        .html(function(d) {
            return (`${d.state}<br>Population In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
        });      

    chartGroup.call(toolTip);   
       
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
   
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

});