/**This is the main js file which plots the complete graph in D3LineChart.html */

//Clearing Any element in the body before ploting the graph
//d3.select("center").remove();

var h = Math.round(window.innerHeight), //Geting the height of the browser (Inner Height)
        w = Math.round(window.innerWidth), //Geting the width of the browser (Inner Width)
        margin = 25,
        height = (h * .90) - (2 * margin), //Seting The total height of our charts
        width = (w * .98) - (2 * margin), //Seting The width of our chart
        lineChartHeight = (height * 0.33), //Seting The Height of the Line Chart (Bottom)
        areaChartHeight = (height * 0.33), //Seting The Height of the area Chart (Middle)
        groupedBarChartHeight = (height * 0.33);                 //Seting The Height of the grouped bar chart (Top)

//X-Scale Common For Line Chart and Area Chart
var xScale = d3.scale.ordinal()
        .rangeRoundPoints([0, width], 1.75);

//X-Scale For Grouped Bar Chart        
xScaleForGroupedBarChart = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, .5);

//X-Scale for Inner Element in Grouped Bar-Chart
xScaleForInnerElementInGroupedBarChart = d3.scale.ordinal();

//Y-Scale For Population
yScaleForPopulation = d3.scale.linear()
        .range([lineChartHeight, 0]);

//Y-Scale For GDP
yScaleForGDP = d3.scale.linear()
        .range([lineChartHeight, 0]);

//Y-Scale For Avg Time Spent On Socia lMedia
yScaleForAvgTimeSpentOnSocialMedia = d3.scale.linear()
        .range([areaChartHeight, 0]);

//Y-Scale For Avg Mobile Data Speed
yScaleForAvgMobileDataSpeed = d3.scale.linear()
        .range([areaChartHeight, 0]);

//Y-Scale For Grouped Bar Chart
yScaleForGroupedBarChart = d3.scale.linear()
        .domain([0, 125])
        .range([groupedBarChartHeight, 0]);

//Defining Color-scale For Bar Chart
color = d3.scale.ordinal()
        .range(["#990033", "#669900", "	#0099FF"]);

//Creating X-Axis Common for both area chart and line chart           
xAxis = d3.svg.axis().scale(xScale).orient("bottom");

//Creating X-Axis Common for Grouped Bar Chart
xAxisForGroupedBarChart = d3.svg.axis().scale(xScaleForGroupedBarChart).orient("bottom");


//Crating Y-Axis For Population Chart
yAxisForPopulation = d3.svg.axis().scale(yScaleForPopulation).orient("right").ticks(4).tickValues([557513534,1115027068,1672540603,2230054137]).tickFormat(function (d) {
    return (d/1000000000).toFixed(1) + "B";
});

//Crating Y-Axis For GDP
yAxisForGDP = d3.svg.axis().scale(yScaleForGDP).orient("left").ticks(4, "s").tickValues([25128,50257,75386,100515]);

//Creating Y-Axis For Grouped Bar Chart
yAxisForGroupedBarChartL = d3.svg.axis()
        .scale(yScaleForGroupedBarChart)
        .orient("left")
        .ticks(4).tickFormat(function (d) {
    return d + "%";
}).tickValues([25,50,75,100]);
;
//Creating Y-Axis For Grouped Bar Chart
yAxisForGroupedBarChartR = d3.svg.axis()
        .scale(yScaleForGroupedBarChart)
        .orient("right")
        .ticks(4).tickFormat(function (d) {
    return d + "%";
}).tickValues([25,50,75,100]);
;

//Creating Y-Axis For Avg Mobile Data Speed
yAxisForAvgMobileDataSpeed = d3.svg.axis()
        .scale(yScaleForAvgMobileDataSpeed)
        .orient("right")
        .ticks(4).tickValues([9,18,27,36])
        .tickFormat(function (d) {
    return d + "Mbps";
});

//Creating Y-Axis For Avg Time Spent On SocialMedia
yAxisForAvgTimeSpentOnSocialMedia = d3.svg.axis()
        .scale(yScaleForAvgTimeSpentOnSocialMedia)
        .orient("left")
        .ticks(4).tickValues([2,4,6,8])
        .tickFormat(function (d) {
    return d + "h";
});


//Function for creating Main SVG Container
function creatingMainSvg() {
    mainSVG = d3.select("body").append("center")
            .append("svg")
            .classed("mainSVG", true)
            .attr("height", height + (margin * 2)) //Here we are adding two times margin
            .attr("width", width + (margin * 2));  // for both height and width for better spacing.
}

//Function for Appending SVG for Line Chart Along with its axes
function creatingLineChartSvg() {
    svgForLineChart = mainSVG.append("g")
            .attr("transform", "translate(" + margin + "," + (height + margin - lineChartHeight) + ")")
            .append("svg")
            .attr("class", "svgForLineChart")
            .attr("height", lineChartHeight)
            .attr("width", width);

    svgForLineChart.append("g")
            .attr("class", "yAxisL")
            .call(yAxisForPopulation);

    svgForLineChart.append("g")
            .attr("class", "yAxisR")
            .attr("transform", "translate(" + (width) + "," + 0 + ")")
            .call(yAxisForGDP);

}

//Function for Appending SVG for Area Chart Along with its axes
function creatingAreaChartSvg() {
    svgForAreaChart = mainSVG.append("g")
            .attr("transform", "translate(" + margin + "," + (height + margin - lineChartHeight - areaChartHeight) + ")")
            .append("svg")
            .attr("class", "svgForAreaChart")
            .attr("height", areaChartHeight)
            .attr("width", width);

    svgForAreaChart.append("g")
            .attr("class", "yAxisL")
            .call(yAxisForAvgMobileDataSpeed);

    svgForAreaChart.append("g")
            .attr("class", "yAxisL")
            .attr("transform", "translate(" + (width) + "," + 0 + ")")
            .call(yAxisForAvgTimeSpentOnSocialMedia);

}


//Function for Appending SVG for Grouped Bar Chart Along with its axes
function creatingGroupedBarChartSvg() {
    svgForGroupedBarChart = mainSVG.append("g")
            .attr("transform", "translate(" + margin + "," + (height + margin - lineChartHeight - areaChartHeight - groupedBarChartHeight) + ")")
            .append("svg")
            .attr("class", "svgForGroupedBarChart")
            .attr("height", groupedBarChartHeight)
            .attr("width", width);

    svgForGroupedBarChart.append("g")
            .attr("class", "yAxisL")
            .call(yAxisForGroupedBarChartR);

    svgForGroupedBarChart.append("g")
            .attr("transform", "translate(" + (width) + "," + 0 + ")")
            .call(yAxisForGroupedBarChartL);

}

//Function For Crating Line Chart. It Takes Input of yScale & Data & Class Name     
function creatingLineChart(yScale, Data, lineName, className) {

    var valueline = d3.svg.line()
            .x(function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .y(function (d) {
                return Math.round(yScale(d[lineName]));
            });

    svgForLineChart.append("path")
            .attr("class", className)
            .attr("data-legend", className)
            .attr("d", valueline(Data));
}


//Function For Crating Area Chart. It Takes Input of yScale & Data & Class Name 
function creatingAreaChart(yScale, Data, areaName, className) {
    var valueArea = d3.svg.area()
            .x(function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .y0(areaChartHeight)
            .y1(function (d) {
                return Math.round(yScale(d[areaName]));
            });

    svgForAreaChart.append("path")
            .attr("class", className)
            .attr("data-legend", className)
            .attr("d", valueArea(Data));

}

//Function For Crating Area Chart. It Takes Input of yScale & Data & Class Name 
function creatingGroupedBarChart(data) {
    //Creating Each country group in the svg and binding data to them
    var country = svgForGroupedBarChart.selectAll(".country")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "country")
            .attr("transform", function (d, i) {
                return "translate(" + xScaleForGroupedBarChart(d["ISO Country Code"]) + ",0)";
            });
    
    //Creating bars for each update elements 
    country.selectAll("rect")
            .data(function (d) {
                return d.socialMediaGroup;
            })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return xScaleForInnerElementInGroupedBarChart(d.name);
            })
            .attr("y", function (d) {
                return yScaleForGroupedBarChart(d.value);
            })
            .attr("width", xScaleForInnerElementInGroupedBarChart.rangeBand())
            .attr("height", function (d) {
                return (yScaleForGroupedBarChart(0) - yScaleForGroupedBarChart(d.value));
            })
            .style("fill", function (d) {
                return color(d.name);
            })
            .append("svg:title").text(function (d) {
        return (d.name + ": " + d.value)
    });

}

function legend(svg, data) {
    var legend = svg.selectAll(".legend")
            .data(data.slice())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(" + (2*margin + width * 0.2 * i) + "," + 2*margin + ")";
            });

    legend.append("rect")
            .attr("x", function (d, i) {
                return (margin + width * 0.01 * i);
            })
            .attr("width", 30)
            .attr("height", 15)
            .style("fill", color);

    legend.append("text")
            .attr("x", function (d, i) {
                return ((margin + width * 0.01 * i) + 32);
            })
            .attr("y", 7)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function (d) {
                return d;
            });
}

function sortDataAndReplotTheChart(data,sortValue){
        countryCode = [];
        data.sort(function(a,b){ return (a[sortValue] - b[sortValue]);});
        console.log(data);
        data.forEach(function (d){
            countryCode.push(d["ISO Country Code"]);    
        });
    xScale.domain(countryCode);
    xScaleForGroupedBarChart.domain(countryCode);
    color.range(["#990033", "#669900", "#0099FF"]);
    
    $(".xAxis").remove();
    $(".svgForLineChart").remove();
    $(".svgForAreaChart").remove();
    $(".svgForGroupedBarChart").remove();
    
    creatingLineChartSvg();
    creatingAreaChartSvg();
    creatingGroupedBarChartSvg();
    
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
    
    
    creatingGroupedBarChart(data);

    creatingLineChart(yScaleForPopulation, data, "Population", "Population");
    creatingLineChart(yScaleForGDP, data, "GDP per capita (nominal)", "GDPLine");

    creatingAreaChart(yScaleForAvgMobileDataSpeed, data, "Avg mobile data speed", "avgMobileDataSpeed");
    creatingAreaChart(yScaleForAvgTimeSpentOnSocialMedia, data, "Avg time spent on social media", "avgTimeSpentOnSocialMedia");
        console.log(countryCode);
        
        
     
    //Adding Bubbles To Area Chart
    svgForAreaChart.selectAll(".bub1").data(data).enter().append("circle").attr("class", "bub1")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForAvgMobileDataSpeed(d["Avg mobile data speed"]);
            })
            .attr("r", "3").attr("fill", "red")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "Avg. Mobile Data Speed: " + d["Avg mobile data speed"] + "Mbps");
    });

    svgForAreaChart.selectAll(".bub2").data(data).enter().append("circle").attr("class", "bub2")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForAvgTimeSpentOnSocialMedia(d["Avg time spent on social media"]);
            })
            .attr("r", "3").attr("fill", "gray")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "Avg. Time Spent On Social Media: " + d["Avg time spent on social media"]+"h");
    });

svgForLineChart.selectAll(".bub3").data(data).enter().append("circle").attr("class", "bub3")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForPopulation(d["Population"]);
            })
            .attr("r", "2").attr("fill", "#003300")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "Population: " + d["Population"]);
    });
svgForLineChart.selectAll(".bub4").data(data).enter().append("circle").attr("class", "bub4")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForGDP(d["GDP per capita (nominal)"]);
            })
            .attr("r", "2").attr("fill", "#FF5722")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "GDP Per Capita: " + d["GDP per capita (nominal)"]);
    });

    d3.selectAll("g.yAxisL g.tick").append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);

    d3.selectAll("g.yAxisR g.tick").append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);


    legend(svgForGroupedBarChart, socialMedia);
    color.range(["#E07628", "rgba(254, 181, 6, 0.34)"]);
    legend(svgForAreaChart, ["Avg time spent on social media", "Avg mobile data speed"]);
    color.range(["#003300", "#FF5722"]);
    legend(svgForLineChart, ["GDP per capita (nominal)", "Population"]);

    
}


//Now geting data from CSV File And Extract all the data in an array (its an array of objects) and modify as our requirement. 
d3.csv("Data.csv", function (error, data) {

            countryCode = [],
            socialMedia = d3.keys(data[0]).filter(function (key) {
        return (key == "% use social media") || (key == "% use social media on mobile") || (key == "% bought online on mobile");
    });
    //Geting Data For Population & GDP
    data.forEach(function (d) {
        d["Population"] = parseInt(d["Population"].split(",").join(""));
        d["GDP per capita (nominal)"] = parseInt(d["GDP per capita (nominal)"].split(",").join(""));
        d["Avg time spent on social media"] = parseFloat(d["Avg time spent on social media"]);
        d["Avg mobile data speed"] = parseFloat(d["Avg mobile data speed"]);
        d["% use social media"] = parseInt(d["% use social media"]);
        d["% use social media on mobile"] = parseInt(d["% use social media on mobile"]);
        d["% bought online on mobile"] = parseInt(d["% bought online on mobile"]);
        d.socialMediaGroup = socialMedia.map(function (name) {
            return {name: name, value: parseInt(d[name])};
        });
        countryCode.push(d["ISO Country Code"]);
    });

    maxGDP = d3.max(data, function (d) {
        return d["GDP per capita (nominal)"]
    });
    maxPopulation = d3.max(data, function (d) {
        return d["Population"]
    });
    maxAvgMobileDataSpeed = d3.max(data, function (d) {
        return d["Avg mobile data speed"]
    });
    maxAvgTimeSpentOnSocialMedia = d3.max(data, function (d) {
        return d["Avg time spent on social media"]
    });

    xScale.domain(countryCode);
    xScaleForGroupedBarChart.domain(countryCode);

    //Assigning domain and range to inner band of each group
    xScaleForInnerElementInGroupedBarChart.domain(socialMedia).rangeRoundBands([0, xScaleForGroupedBarChart.rangeBand()]);

    //Assigning domain for yScaleForPopulation & yScaleForGDP
    yScaleForPopulation.domain([0, Math.round(2 * maxPopulation)]);
    yScaleForGDP.domain([0, Math.round(2 * maxGDP)]);

    //Assigning domain for yScaleForAvgMobileDataSpeed & yScaleForAvgTimeSpentOnSocialMedia
    yScaleForAvgMobileDataSpeed.domain([0, Math.round(2.6 * maxAvgMobileDataSpeed)]);
    yScaleForAvgTimeSpentOnSocialMedia.domain([0, Math.round(2.6 * maxAvgTimeSpentOnSocialMedia)]);

    creatingMainSvg();
    creatingLineChartSvg();
    creatingAreaChartSvg();
    creatingGroupedBarChartSvg();

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

    creatingGroupedBarChart(data);

    creatingLineChart(yScaleForPopulation, data, "Population", "Population");
    creatingLineChart(yScaleForGDP, data, "GDP per capita (nominal)", "GDPLine");

    creatingAreaChart(yScaleForAvgMobileDataSpeed, data, "Avg mobile data speed", "avgMobileDataSpeed");
    creatingAreaChart(yScaleForAvgTimeSpentOnSocialMedia, data, "Avg time spent on social media", "avgTimeSpentOnSocialMedia");



    //Adding Bubbles To Area Chart
    svgForAreaChart.selectAll(".bub1").data(data).enter().append("circle").attr("class", "bub1")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForAvgMobileDataSpeed(d["Avg mobile data speed"]);
            })
            .attr("r", "3").attr("fill", "red")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "Avg. Mobile Data Speed: " + d["Avg mobile data speed"] + "Mbps");
    });

    svgForAreaChart.selectAll(".bub2").data(data).enter().append("circle").attr("class", "bub2")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForAvgTimeSpentOnSocialMedia(d["Avg time spent on social media"]);
            })
            .attr("r", "3").attr("fill", "gray")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "Avg. Time Spent On Social Media: " + d["Avg time spent on social media"]+"h");
    });

svgForLineChart.selectAll(".bub3").data(data).enter().append("circle").attr("class", "bub3")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForPopulation(d["Population"]);
            })
            .attr("r", "2").attr("fill", "#003300")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "Population: " + d["Population"]);
    });
svgForLineChart.selectAll(".bub4").data(data).enter().append("circle").attr("class", "bub4")
            .attr("cx", function (d) {
                return xScale(d["ISO Country Code"]);
            })
            .attr("cy", function (d) {
                return yScaleForGDP(d["GDP per capita (nominal)"]);
            })
            .attr("r", "2").attr("fill", "#FF5722")
            .append("svg:title").text(function (d) {
        return ("Country: " + d["Country"] + "\n" + "GDP Per Capita: " + d["GDP per capita (nominal)"]);
    });

    d3.selectAll("g.yAxisL g.tick").append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);

    d3.selectAll("g.yAxisR g.tick").append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);


    legend(svgForGroupedBarChart, socialMedia);
    color.range(["#E07628", "rgba(254, 181, 6, 0.34)"]);
    legend(svgForAreaChart, ["Avg time spent on social media", "Avg mobile data speed"]);
    color.range(["#003300", "#FF5722"]);
    legend(svgForLineChart, ["GDP per capita (nominal)", "Population"]);


    $(document).ready(function () {
        $(".select-box select").change(function () {
            sortDataAndReplotTheChart(data, $(this).val());
        });

        $(".mainSVG").on("click", ".svgForGroupedBarChart .legend:eq(0)",function () {
            $(".country rect:nth-child(1)").toggle(400);
            
           if(parseFloat($(".svgForGroupedBarChart .legend:eq(0)").css("opacity")).toFixed(1) == 0.4)
              $(".svgForGroupedBarChart .legend:eq(0)").css("opacity" ,"1");

          else
              $(".svgForGroupedBarChart .legend:eq(0)").css("opacity" ,"0.4"); 
        });

        $(".mainSVG").on("click", ".svgForGroupedBarChart .legend:eq(1)",function () {
            $(".country rect:nth-child(2)").toggle(400);
            if(parseFloat($(".svgForGroupedBarChart .legend:eq(1)").css("opacity")).toFixed(1) == 0.4)
              $(".svgForGroupedBarChart .legend:eq(1)").css("opacity" ,"1"); 
     
          else
              $(".svgForGroupedBarChart .legend:eq(1)").css("opacity" ,"0.4"); 
        });

        $(".mainSVG").on("click", ".svgForGroupedBarChart .legend:eq(2)", function () {
            $(".country rect:nth-child(3)").toggle(400);
            if(parseFloat($(".svgForGroupedBarChart .legend:eq(2)").css("opacity")).toFixed(1) == 0.4)
              $(".svgForGroupedBarChart .legend:eq(2)").css("opacity" ,"1"); 
     
          else
              $(".svgForGroupedBarChart .legend:eq(2)").css("opacity" ,"0.4"); 
        });

        $(".mainSVG").on("click", ".svgForAreaChart .legend:eq(0)",function () {
            $(".avgTimeSpentOnSocialMedia").toggle();
            $(".bub2").toggle();
            if(parseFloat($(".svgForAreaChart .legend:eq(0)").css("opacity")).toFixed(1) == 0.4)
              $(".svgForAreaChart .legend:eq(0)").css("opacity" ,"1"); 
     
          else
              $(".svgForAreaChart .legend:eq(0)").css("opacity" ,"0.4"); 
        });

        $(".mainSVG").on("click", ".svgForAreaChart .legend:eq(1)" ,function () {
            $(".avgMobileDataSpeed").toggle();
            $(".bub1").toggle();
            if(parseFloat($(".svgForAreaChart .legend:eq(1)").css("opacity")).toFixed(1) == 0.4)
              $(".svgForAreaChart .legend:eq(1)").css("opacity" ,"1"); 
     
          else
              $(".svgForAreaChart .legend:eq(1)").css("opacity" ,"0.4"); 
        });

        $(".mainSVG").on("click", ".svgForLineChart .legend:eq(0)" ,function () {
            $(".GDPLine").toggle();
            $(".bub4").toggle();
            if(parseFloat($(".svgForLineChart .legend:eq(0)").css("opacity")).toFixed(1) == 0.4)
              $(".svgForLineChart .legend:eq(0)").css("opacity" ,"1"); 
     
          else
              $(".svgForLineChart .legend:eq(0)").css("opacity" ,"0.4"); 
        });

        $(".mainSVG").on("click", ".svgForLineChart .legend:eq(1)",function () {
            $(".Population").toggle();
            $(".bub3").toggle();
            if(parseFloat($(".svgForLineChart .legend:eq(1)").css("opacity")).toFixed(1) == 0.4)
              $(".svgForLineChart .legend:eq(1)").css("opacity" ,"1"); 
     
          else
              $(".svgForLineChart .legend:eq(1)").css("opacity" ,"0.4");
        });
        
    });
});