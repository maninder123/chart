/**This is the main js file which plots the complete graph in D3LineChart.html */

//Function for initializing all global variables
function init() {
//Clearing Any element in the body before ploting the graph
d3.select("center").remove();

                        h = Math.round(window.innerHeight); //Geting the height of the browser (Inner Height)
                        w = Math.round(window.innerWidth);  //Geting the width of the browser (Inner Width)
                   margin = 25;
                   height = (h * .90) - (2 * margin);       //Seting The total height of our charts
                    width = (w * .98) - (2 * margin);       //Seting The width of our chart
          lineChartHeight = (height * 0.33);                 //Seting The Height of the Line Chart (Bottom)
          areaChartHeight = (height * 0.33);                 //Seting The Height of the area Chart (Middle)
    groupedBarChartHeight = (height * 0.33);                 //Seting The Height of the grouped bar chart (Top)

//X-Scale Common For Line Chart and Area Chart
    xScale = d3.scale.ordinal()
                     .rangeRoundPoints([0, width], 1.75);

//X-Scale For Grouped Bar Chart        
    xScaleForGroupedBarChart = d3.scale.ordinal()
                                       .rangeRoundBands([0, width], .1, .5);

//X-Scale for Inner Element in Grouped Bar-Chart
    xScaleForInnerElementInGroupedBarChart = d3.scale.ordinal();

//Defining Color-scale For Bar Chart
    color = d3.scale.ordinal()
                    .range(["#990033", "#669900", "#0099FF"]);

//Creating X-Axis Common for both area chart and line chart           
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

//Creating X-Axis for Grouped Bar Chart
    xAxisForGroupedBarChart = d3.svg.axis().scale(xScaleForGroupedBarChart).orient("bottom");
    
}

//Function for defining y-scale
function yScale(domain, range) {
//Here for our requirement we are using Linear Scale for Y-Axes           
    var yScale = d3.scale.linear().domain(domain).range(range);
    return yScale;

}

//Function for defining y-axes
function yAxis(yScale, orient, ticks) {

    var yAxes = d3.svg.axis().scale(yScale).orient(orient).ticks(ticks || null);
    return yAxes;

}

//Function that creats svg for indivisual charts
function creatingSvgForChart(chartHeight, translate, yAxisL, yAxisR, className) {
    
    svgForChart = mainSVG.append("g")
                          .attr("transform", "translate(" + translate[0] + "," + translate[1] + ")")
                          .append("svg")
                          .classed(className, true)
                          .attr("height", chartHeight)
                          .attr("width", width);

    svgForChart.append("g")
                .attr("class", "yAxisL")
                .call(yAxisR);

    svgForChart.append("g")
                .attr("class", "yAxisR")
                .attr("transform", "translate(" + (width) + "," + 0 + ")")
                .call(yAxisL);

}

//Function For Crating Line Chart. It Take Inputs of yScale & Data , Line Chart Name & Class Name     
function creatingLineChart(yScale, Data, lineName, className) {

    var valueline = d3.svg.line()
                          .x(function (d) { return xScale(d["ISO Country Code"]); })
                          .y(function (d) { return Math.round(yScale(d[lineName])); });

        d3.select(".svgForLineChart").append("path")
                                      .attr("class", className)
                                      .attr("d", valueline(Data));

}

//Function For Crating Area Chart. It Take Inputs of yScale & Data & Class Name 
function creatingAreaChart(yScale, Data, areaName, className) {
    var valueArea = d3.svg.area()
                           .x(function (d) { return xScale(d["ISO Country Code"]); })
                           .y0(areaChartHeight)
                           .y1(function (d) { return Math.round(yScale(d[areaName])); });

        d3.select(".svgForAreaChart").append("path")
                                      .attr("class", className)
                                      .attr("d", valueArea(Data));

}

//Function For Crating Grouped Bar Chart
function creatingGroupedBarChart(data,xScale,xScaleForInnerElement,yScale) {
    //Creating Each country group in the svg and binding data to them
    var country = d3.select(".svgForGroupedBarChart").selectAll(".country")
                                                     .data(data)
                                                     .enter()
                                                     .append("g")
                                                      .attr("class", "country")
                                                      .attr("transform", function(d,i) { return "translate(" + xScale(d["ISO Country Code"]) + ",0)"; });
                            
    //Creating bars for each update elements 
        country.selectAll("rect")
               .data(function(d) { return d.socialMediaGroup; })
               .enter()
               .append("rect")
                .attr("x", function(d) { return xScaleForInnerElement(d.name); })
                .attr("y", function(d) { return yScale(d.value); })
                .attr("width", xScaleForInnerElement.rangeBand())
                .attr("height", function(d) { return (yScale(0) - yScale(d.value)); })
                .style("fill", function(d) { return color(d.name); });
   
}

function legend(svg,data){
    var legend = d3.select(svg).selectAll(".legend")
                                                    .data(data.slice())
                                                    .enter()
                                                    .append("g")
                                                     .attr("class", "legend")
                                                     .attr("transform", function(d, i) { return "translate(" + (margin + width*0.2*i) + "," + margin + ")"; });

        legend.append("rect")
               .attr("x", function(d, i) {return (margin + width*0.01*i);})
               .attr("width", 30)
               .attr("height", 15)
               .style("fill", color);

        legend.append("text")
               .attr("x", function(d, i) {return ((margin + width*0.01*i) + 32);})
               .attr("y", 7)
               .attr("dy", ".35em")
               .style("text-anchor", "start")
               .text(function(d) { return d; });
}

function cleanTheData(data){    
        countryCode = [];
        socialMedia = d3.keys(data[0]).filter(function (key) {
        return (key == "% use social media") || (key == "% use social media on mobile") || (key == "% bought online on mobile");
    });
    
//Geting Data For Population & GDP
    data.forEach(function (d) {
                            d["Population"] = parseInt(d["Population"].split(",").join(""));
              d["GDP per capita (nominal)"] = parseInt(d["GDP per capita (nominal)"].split(",").join(""));
        d["Avg time spent on social media"] = parseFloat(d["Avg time spent on social media"]);
                 d["Avg mobile data speed"] = parseFloat(d["Avg mobile data speed"]);
                         d.socialMediaGroup = socialMedia.map(function (name) {
            return {name: name, value: parseInt(d[name])};
        });
        countryCode.push(d["ISO Country Code"]);
    });
    }

function plotTheChart(data){
    init();
    
    var maxGDP = d3.max(data, function (d) {
                        return d["GDP per capita (nominal)"];
            }),
        maxPopulation = d3.max(data, function (d) {
                        return d["Population"];
            }),
        maxAvgMobileDataSpeed = d3.max(data, function (d) {
                        return d["Avg mobile data speed"];
            }),
        maxAvgTimeSpentOnSocialMedia = d3.max(data, function (d) {
                        return d["Avg time spent on social media"];
            });

    var yScaleForGDP = yScale([0, 2 * maxGDP], [lineChartHeight, 0]),
        yScaleForPopulation = yScale([0, 2 * maxPopulation],[lineChartHeight, 0]),
        yScaleForGroupedBarChart = yScale([0, 120], [groupedBarChartHeight, 0]),
        yScaleForAvgMobileDataSpeed = yScale([0, 2 * maxAvgMobileDataSpeed], [areaChartHeight, 0]),
        yScaleForAvgTimeSpentOnSocialMedia = yScale([0, 2 * maxAvgTimeSpentOnSocialMedia], [areaChartHeight, 0]);

    var yAxisForGDP = yAxis(yScaleForGDP, "left", 4),
        yAxisForPopulation = yAxis(yScaleForPopulation, "right", 4),
        yAxisForGroupedBarChart = yAxis(yScaleForGroupedBarChart, "left", 4),
        yAxisForAvgMobileDataSpeed = yAxis(yScaleForAvgMobileDataSpeed, "left", 4),
        yAxisForAvgTimeSpentOnSocialMedia = yAxis(yScaleForAvgTimeSpentOnSocialMedia, "right", 4);
            
        xScale.domain(countryCode);
        xScaleForGroupedBarChart.domain(countryCode);
    
//  Assigning domain and range to inner band of each group
        xScaleForInnerElementInGroupedBarChart.domain(socialMedia).rangeRoundBands([0,xScaleForGroupedBarChart.rangeBand()]);


        mainSVG = d3.select("body").append("center")
                                    .append("svg")
                                     .classed("mainSVG", true)
                                     .attr("height", height + (margin * 2)) //Here we are adding two times margin
                                     .attr("width", width + (margin * 2));  // for both height and width for better spacing.


//Appening X-Axis for Line Chart To mainSVG
        d3.select(".mainSVG").append("g")
                              .attr("class", "xAxis")
                              .attr("transform", "translate(" + margin + "," + (height + margin - (lineChartHeight - yScaleForGDP(0))) + ")")
                              .call(xAxis);

//Appening X-Axis for Area Chart To mainSVG
        d3.select(".mainSVG").append("g")
                              .attr("class", "xAxis")
                              .attr("transform", "translate(" + margin + "," + (height + margin - lineChartHeight - (areaChartHeight - yScaleForAvgTimeSpentOnSocialMedia(0))) + ")")
                              .call(xAxis);

//Appening X-Axis For Grouped Bar Chart
        d3.select(".mainSVG").append("g")
                              .attr("class", "xAxis")
                              .attr("transform", "translate(" + margin + "," + (height + margin - lineChartHeight - areaChartHeight - (groupedBarChartHeight - yScaleForGroupedBarChart(0))) + ")")
                              .call(xAxisForGroupedBarChart);
    
    
    creatingSvgForChart(lineChartHeight, [ margin , (height + margin - lineChartHeight)],yAxisForGDP, yAxisForPopulation, "svgForLineChart");
    creatingSvgForChart(areaChartHeight, [ margin , (height + margin - lineChartHeight - areaChartHeight)], yAxisForAvgMobileDataSpeed,yAxisForAvgTimeSpentOnSocialMedia, "svgForAreaChart");
    creatingSvgForChart(groupedBarChartHeight, [ margin , (height + margin - lineChartHeight - areaChartHeight - groupedBarChartHeight)], yAxisForGroupedBarChart,yAxisForGroupedBarChart, "svgForGroupedBarChart");
        
    creatingLineChart(yScaleForPopulation,data,"Population","Population");
    creatingLineChart(yScaleForGDP,data, "GDP per capita (nominal)","GDPLine");

    creatingAreaChart(yScaleForAvgMobileDataSpeed,data,"Avg mobile data speed","avgMobileDataSpeed");
    creatingAreaChart(yScaleForAvgTimeSpentOnSocialMedia,data, "Avg time spent on social media","avgTimeSpentOnSocialMedia");
            
    creatingGroupedBarChart(data,xScaleForGroupedBarChart,xScaleForInnerElementInGroupedBarChart,yScaleForGroupedBarChart);
    
    legend(".svgForGroupedBarChart",socialMedia);
    legend(".svgForLineChart",["GDP per capita (nominal)","Population"]);
    legend(".svgForAreaChart",["Avg mobile data speed","Avg time spent on social media"]);
}
        
function sortDataAndReplotTheChart(data,sortValue){
    
    data.sort(function(a,b){ return (a[sortValue] - b[sortValue]);});
    plotTheChart(data);
    
}       
       
d3.csv("Data.csv", function (error, data) {
    cleanTheData(data);
    plotTheChart(data);
    
    d3.selectAll("g.yAxisL g.tick").append("line")
                                            .classed("grid-line", true)
                                            .attr("x1", 0)
                                            .attr("y1", 0)
                                            .attr("x2", width)
                                            .attr("y2", 0);
  
    $(document).ready(function(){
    $(".select-box select").change(function(){
        sortDataAndReplotTheChart(data, $(this).val());
    });
    
    $("svgForGroupedBarChart")
    
});
    
});


