function init() {
//Clearing Any element in the body before ploting the graph
    d3.select("center").remove();

    tempheight = Math.round(window.innerHeight) - 100; //Geting the height of the browser (Inner Height)
    if (tempheight < 550) {
        h = 550;
    } else {
        h = tempheight;
    }
    w = Math.round(window.innerWidth);  //Geting the width of the browser (Inner Width)
    margin = (w <= 600) ? 40 : 50;

    height = (h * .80) - 20;                   //Seting The total height of our charts
    width = (w * .95) - (2 * margin);      //Seting The width of our chart
    lineChartHeight = (height * 0.33);                //Seting The Height of the Line Chart (Bottom)
    areaChartHeight = (height * 0.33);               //Seting The Height of the area Chart (Middle)
    groupedBarChartHeight = (height * 0.33);              //Seting The Height of the grouped bar chart (Top)


//X-Scale Common For Line Chart and Area Chart
    xScale = d3.scale.ordinal()
            .rangeRoundPoints([0, width], 1);
    

//X-Scale For Grouped Bar Chart        
    xScaleForGroupedBarChart = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, .1);
    

//X-Scale for Inner Element in Grouped Bar-Chart
    xScaleForInnerElementInGroupedBarChart = d3.scale.ordinal();
    

//Defining Color-scale For Bar Chart

    color = d3.scale.ordinal()
            .range(["rgb(0, 71, 163)", "rgb(0, 150, 245)", "rgb(160, 200, 255)"]);
    

//Creating X-Axis Common for both area chart and line chart           
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    

//Creating X-Axis for Grouped Bar Chart
    xAxisForGroupedBarChart = d3.svg.axis()
            .scale(xScaleForGroupedBarChart).orient("bottom");

}
//------------------------------------------------------------------------------
/**
 * Function for defining y-scale (It's a linear scale)
 * @param {array} domain y-axis domain
 * @param {array} range y-axis range
 * 
 */

function yScale(domain, range) {

    var yScale = d3.scale.linear().domain(domain).range(range);
    return yScale;

}
//------------------------------------------------------------------------------
/**
 * Function for creating Y-Axis
 * @param {object} yScale scale which returned with domain and range
 * @param {string} orient orientation of yscale
 * @param {string} ticks yaxis ticks
 * @param {array} tickValues tick values of yaxis
 */
function yAxisGenerator(yScale, orient, ticks, tickValues) {

    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient(orient)
            .ticks((ticks === "undefined") ? null : ticks)
            .tickValues((tickValues === "undefined") ? null : tickValues);
    return yAxis;
}
//-------------------------------------------------------------------------------
/**
 * Function for appending y-axis
 * @param {object} svg for appending y-axis on svg
 * @param {string} translate For transform y axis
 * @param {string} className contains class name
 */
function appendYaxis(svg, yAxis, translate, className) {
    
    svg.append("g")
            .attr("class", className)
            .attr("transform", "translate(" + translate[0] + "," + translate[1] + ")")
            .call(yAxis);
}
//------------------------------------------------------------------------------
/**
 * Function that creats svg for indivisual charts
 *@param {object} parentNode For creating chart on parent node
 *@param {string} chartHeight height of the chart
 *@param {string} chartWidth width of the chart
 *@param {string} translate transform for svg
 *@param {string}className contains name of the class for svg
 */
function creatingSvgForChart(parentNode, chartHeight, chartWidth, translate, className) {

    var SVG = parentNode.append("g")
            .attr("transform", "translate(" + translate[0] + "," + translate[1] + ")")
            .append("svg")
            .classed(className, true)
            .attr("height", chartHeight)
            .attr("width", chartWidth);
    return(SVG);

}
//------------------------------------------------------------------------------
/**
 * Function For Crating Line Chart
 * @param {array} Data Line chart data
 * @param {object} yScale yscale for line chart
 * @param {string} lineName name of the line
 * @param {object} parentNode For creating line chart on parent node
 * @param {string} className Contains name of the class
 * 
 */

function creatingLineChart(Data, yScale, lineName, parentNode, className) {

    var valueline = d3.svg.line()
            .x(function (d) {
                return xScale(d[ "ISO Country Code" ]);
            })
            .y(function (d) {
                return Math.round(yScale(d[ lineName ]));
            });

    parentNode.append("path")
            .attr("class", className)
            .attr("d", valueline(Data));

}
//------------------------------------------------------------------------------
/**
 * Function For Crating Area Chart. 
 * @param {array} Data Data for area chart
 * @param {object} yScale area chart y scale
 * @param {string} areaName name of areachart
 * @param {object} parentNode For creating area chart on parent node
 * @param {String} className contains name for class
 *
 */

function creatingAreaChart(Data, yScale, areaName, parentNode, className) {
    var valueArea = d3.svg.area()
            .x(function (d) {
                return xScale(d[ "ISO Country Code" ]);
            })
            .y0(areaChartHeight)
            .y1(function (d) {
                return yScale(d[ areaName ]);
            });

    parentNode.append("path")
            .attr("class", className)
            .attr("d", valueArea(Data));

}
//-----------------------------------------------------------------------------
/**
 * Function For Crating Grouped Bar Chart
 *@param {array} Data Data for grouped bar chart
 *@param {object} parentNode For creating grouped bar chart on parentnode
 *@param {object} xScale x-scale for chart
 *@param {object} yScale y-scale for chart
 *@param {object} xScaleForInnerElement x-scale for inner element
 *@param {string} groupName name for group
 *@param {array} innerElementsObject contains all the data for bar chart
 */
function creatingGroupedBarChart(Data, parentNode, xScale, yScale, xScaleForInnerElement, groupName, innerElementsObject) {

    //Creating Each country group in the svg and binding data to them
    var country = parentNode.selectAll(".country")
            .data(Data)
            .enter()
            .append("g")
            .attr("class", "country")
            .attr("transform", function (d) {
                return "translate(" + xScale(d[ groupName ]) + ",0)";
            })
            .attr("title", function (d) {
                return (
                        "Country: " + d[ "Country" ] + "</br>" +
                        "Population: " + d[ "Population" ] + "</br>" +
                        "GDP Per Capita ( Nominal ): " + d[ "GDP Per Capita ( Nominal )" ] + "</br>" +
                        "% Use Social Media: " + d[ "% Use Social Media" ] + "</br>" +
                        "% Use Social Media on Mobile: " + d[ "% Use Social Media on Mobile" ] + "</br>" +
                        "% Bought Online on Mobile: " + d[ "% Bought Online on Mobile" ] + "</br>" +
                        "Avg Time Spent on Social Media: " + d[ "Avg Time Spent on Social Media" ] + "</br>" +
                        "Avg mobile Data Speed: " + d[ "Avg mobile Data Speed" ]

                        );
            });
    //Creating bars for each update elements 
    country.selectAll("rect")
            .data(function (d) {
                return d[ innerElementsObject ];
            })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return xScaleForInnerElement(d.name);
            })
            .attr("y", function (d) {
                return yScale(d.value);
            })
            .attr("width", xScaleForInnerElement.rangeBand())
            .attr("height", function (d) {
                return (yScale(0) - yScale(d.value));
            })
            .style("fill", function (d) {
                return color(d.name);
            });

}
//------------------------------------------------------------------------------
/**
 * Function For Crating Bubble Chart
 *@param {array} Data Data for bubble chart
 *@param {object} yScale Bubble chart y-scale
 *@param {String} lineName contains name for cy
 *@param {object} parentNode creating bubble chart on its parent node
 *@param {String} className contains name of class for bubble
 *@param (String} bubbleColor contains name of color
 */
function creaingBubbleChart(Data, yScale, lineName, parentNode, className, bubbleColor) {

    parentNode.selectAll(className)
            .data(Data)
            .enter()
            .append("circle")
            .attr("class", className)
            .attr("cx", function (d) {
                return (xScale(d[ "ISO Country Code" ]));
            })
            .attr("cy", function (d) {
                return yScale(d[ lineName ]);
            })
            .attr("r", "2").attr("fill", bubbleColor)
            .attr("title", function (d) {
                return (
                        "Country: " + d[ "Country" ] + "</br>" +
                        "Population: " + d[ "Population" ] + "</br>" +
                        "GDP Per Capita ( Nominal ): " + d[ "GDP Per Capita ( Nominal )" ] + "</br>" +
                        "% Use Social Media: " + d[ "% Use Social Media" ] + "</br>" +
                        "% Use Social Media on Mobile: " + d[ "% Use Social Media on Mobile" ] + "</br>" +
                        "% Bought Online on Mobile: " + d[ "% Bought Online on Mobile" ] + "</br>" +
                        "Avg Time Spent on Social Media: " + d[ "Avg Time Spent on Social Media" ] + "</br>" +
                        "Avg mobile Data Speed: " + d[ "Avg mobile Data Speed" ]

                        );
            });

}
//------------------------------------------------------------------------------
/**
 * Function For Plot Legends
 * @param {object} svg lengend appending on svg
 * @param {array} data Data for legends plotting
 */
function legend(svg, data) {

    var legendHeight = (width < 500) ? 7 : 12,
            legendWidth = (width < 500) ? 13 : 18,
            yValueOfText = (width < 500) ? 4 : 8;


    var noOflegends = data.slice().length;
    var legend = svg.selectAll(".legend")
            .data(data.slice())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                if ((width < 400) && (noOflegends == 3)) {
                    if (i == 0) {
                        var yTranslate = 15
                        var xTranslate = 0
                    }
                    else if (i == 1) {
                        var yTranslate = 25
                        var xTranslate = 0
                    } else {
                        var yTranslate = 35
                        var xTranslate = 0
                    }

                }
                else if ((width < 400) && (noOflegends == 2)) {
                    if (i == 0) {
                        var yTranslate = 35;
                        var xTranslate = 0
                    }
                    else if (i == 1) {
                        var yTranslate = 45;
                        var xTranslate = 0
                    }
                }
                else {
                    yTranslate = (height * 0.33 * 0.25) - 5;
                    xTranslate = (width / noOflegends) * i

                }
                return "translate( " + (xTranslate) + "," + yTranslate + " )";
            });

    legend.append("rect")
            .attr("x", function (d) {
                return (margin * 0.1);
            })
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", color);

    legend.append("text")
            .attr("x", function (d, i) {
                return (margin * 0.20 + legendWidth);
            })
            .attr("y", (parseInt(yValueOfText)))
            .attr("dy", ".30em")
            .style("text-anchor", "start")
            .text(function (d) {
                return d;
            });

}
//------------------------------------------------------------------------------
/**
 * Function for clean the data
 * @param {array} data Data to be cleaned
 */
function cleanTheData(data) {

    countryCode = [];
    country = [];
    socialMedia = d3.keys(data[0]).filter(function (key) {

        return (key == "% Use Social Media") || (key == "% Use Social Media on Mobile") || (key == "% Bought Online on Mobile");
    });

    //Geting Data For Population & GDP
    data.forEach(function (d) {

        d[ "Population" ] = parseInt(d[ "Population" ].split(",").join(""));
        d[ "Avg mobile Data Speed" ] = parseFloat(d[ "Avg mobile Data Speed" ]);
        d[ "GDP Per Capita ( Nominal )" ] = parseInt(d[ "GDP Per Capita ( Nominal )" ].split(",").join(""));
        d[ "Avg Time Spent on Social Media" ] = parseFloat(d[ "Avg Time Spent on Social Media" ]);
        d["% Use Social Media"] = parseInt(d["% Use Social Media"]);
        d["% Bought Online on Mobile"] = parseInt(d["% Bought Online on Mobile"]);
        d["% Use Social Media on Mobile"] = parseInt(d["% Use Social Media on Mobile"]);

        d[ "socialMediaGroup" ] = socialMedia.map(function (name) {
            return {name: name, value: parseInt(d[ name ])};
        });

        countryCode.push(d[ "ISO Country Code" ]);
        country.push(d[ "Country" ]);
    });

    maxGDP = d3.max(data, function (d) {
        return d[ "GDP Per Capita ( Nominal )" ];
    }),
            maxPopulation = d3.max(data, function (d) {
                return d["Population"];
            }),
            maxAvgMobileDataSpeed = d3.max(data, function (d) {
                return d[ "Avg mobile Data Speed" ];
            }),
            maxAvgTimeSpentOnSocialMedia = d3.max(data, function (d) {
                return d[ "Avg Time Spent on Social Media" ];
            });

}
//------------------------------------------------------------------------------
/**
 * 
 * Function for plot chart container
 */
function plotTheChartCointer() {

    yScaleForGDP = yScale([0, Math.round(1.6 * maxGDP)], [lineChartHeight, 0]),
            yScaleForPopulation = yScale([0, Math.round(1.6 * maxPopulation)], [lineChartHeight, 0]),
            yScaleForGroupedBarChart = yScale([0, 100], [groupedBarChartHeight, 0]),
            yScaleForAvgMobileDataSpeed = yScale([0, Math.round(1.65 * maxAvgMobileDataSpeed)], [areaChartHeight, 0]),
            yScaleForAvgTimeSpentOnSocialMedia = yScale([0, Math.round(1.6 * maxAvgTimeSpentOnSocialMedia)], [areaChartHeight, 0]);

    xScale.domain(countryCode);
    xScaleForGroupedBarChart.domain(countryCode);
    xScaleForInnerElementInGroupedBarChart.domain(socialMedia)
            .rangeRoundBands([0, xScaleForGroupedBarChart.rangeBand()]);

    var yAxisForGDP = yAxisGenerator(yScaleForGDP, "right", 3, [25128, 50257, 75386]),
            yAxisForPopulation = yAxisGenerator(yScaleForPopulation, "left", 3, [557513534, 1115027068, 1672540603]),
            yAxisForAvgMobileDataSpeed = yAxisGenerator(yScaleForAvgMobileDataSpeed, "left", 3, [8, 16, 24]),
            yAxisForAvgTimeSpentOnSocialMedia = yAxisGenerator(yScaleForAvgTimeSpentOnSocialMedia, "right", 3, [2, 4, 6]),
            yAxisForGroupedBarChartL = yAxisGenerator(yScaleForGroupedBarChart, "left", 3, [30, 60, 90]),
            yAxisForGroupedBarChartR = yAxisGenerator(yScaleForGroupedBarChart, "right", 3, [30, 60, 90]);

    yAxisForGDP.tickFormat(function (d) {
        return parseInt(d / 1000) + "K";
    });
    yAxisForPopulation.tickFormat(function (d) {
        return (d / 10e8).toFixed(1) + "B";
    });
    yAxisForAvgMobileDataSpeed.tickFormat(function (d) {
        return d + "Mbps";
    });
    yAxisForAvgTimeSpentOnSocialMedia.tickFormat(function (d) {
        return d + "h";
    });
    yAxisForGroupedBarChartL.tickFormat(function (d) {
        return d + "%";
    });
    yAxisForGroupedBarChartR.tickFormat(function (d) {
        return d + "%";
    });

    mainSvg = d3.select("#chart-container")
            .append("svg")
            .classed("mainSvg", true)
            .attr("height", (h * .80))
            .attr("width", (w * .95))
            .attr("preserveAspectRatio", "xMinYMin meet");


    appendYaxis(mainSvg, yAxisForGDP, [(width + margin), (height - lineChartHeight)], "yAxisR");
    appendYaxis(mainSvg, yAxisForPopulation, [margin, (height - lineChartHeight)], "yAxisL");
    appendYaxis(mainSvg, yAxisForAvgMobileDataSpeed, [margin, (height - lineChartHeight - areaChartHeight)], "yAxisL");
    appendYaxis(mainSvg, yAxisForAvgTimeSpentOnSocialMedia, [(width + margin), (height - lineChartHeight - areaChartHeight)], "yAxisR");
    appendYaxis(mainSvg, yAxisForGroupedBarChartL, [margin, (height - lineChartHeight - areaChartHeight - groupedBarChartHeight)], "yAxisL");
    appendYaxis(mainSvg, yAxisForGroupedBarChartR, [(width + margin), (height - lineChartHeight - areaChartHeight - groupedBarChartHeight)], "yAxisR");

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
            .attr("x2", -(width))
            .attr("y2", 0);

    d3.selectAll("g.tick line:first-child").style("opacity", 1);

    //Appening X-Axis for Line Chart To mainSVG
    mainSvg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate( " + margin + ", " + (height - (lineChartHeight - yScaleForGDP(0))) + " )")
            .call(xAxis);

    //Appening X-Axis for Area Chart To mainSVG
    mainSvg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate( " + margin + ", " + (height - lineChartHeight - (areaChartHeight - yScaleForAvgTimeSpentOnSocialMedia(0))) + " )")
            .call(xAxis);

    //Appening X-Axis For Grouped Bar Chart
    mainSvg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate( " + margin + ", " + (height - lineChartHeight - areaChartHeight - (groupedBarChartHeight - yScaleForGroupedBarChart(0))) + ")")
            .call(xAxisForGroupedBarChart);

    addingFlagsToXaxis();

    svgForLineChart = creatingSvgForChart(mainSvg, lineChartHeight, width, [margin, (height - lineChartHeight)], "svgForLineChart"),
            svgForAreaChart = creatingSvgForChart(mainSvg, areaChartHeight, width, [margin, (height - lineChartHeight - areaChartHeight)], "svgForAreaChart"),
            svgForGroupedBarChart = creatingSvgForChart(mainSvg, groupedBarChartHeight, width, [margin, (height - lineChartHeight - areaChartHeight - groupedBarChartHeight)], "svgForGroupedBarChart");

    var fontSize;

    if (width < 600)
        fontSize = 10;
    else
        fontSize = 14;

    svgForLineChart.append("text")
            .attr("y", (lineChartHeight * 0.20))
            .attr("x", 20)
            .text("Economic")
            .style({"font-size": fontSize, "font-weight": "bold"});

    svgForAreaChart.append("text")
            .attr("y", (areaChartHeight * 0.20))
            .attr("x", 20)
            .text("Speed & Usage")
            .style({"font-size": fontSize, "font-weight": "bold"});

    svgForGroupedBarChart.append("text")
            .attr("y", (groupedBarChartHeight * 0.10) - 2)
            .attr("x", 20)
            .text("Population")
            .style({"font-size": fontSize, "font-weight": "bold"});

}
//------------------------------------------------------------------------------
/**
 * Function for plot the chart
 * @param {array} data Data for plotting chart
 */
function plotTheChart(data) {
    creatingLineChart(data, yScaleForPopulation, "Population", svgForLineChart, "Population");
    creatingLineChart(data, yScaleForGDP, "GDP Per Capita ( Nominal )", svgForLineChart, "GDPLine");

    creatingAreaChart(data, yScaleForAvgMobileDataSpeed, "Avg mobile Data Speed", svgForAreaChart, "avgMobileDataSpeed");
    creatingAreaChart(data, yScaleForAvgTimeSpentOnSocialMedia, "Avg Time Spent on Social Media", svgForAreaChart, "avgTimeSpentOnSocialMedia");

    creatingGroupedBarChart(data, svgForGroupedBarChart, xScaleForGroupedBarChart, yScaleForGroupedBarChart, xScaleForInnerElementInGroupedBarChart, "ISO Country Code", "socialMediaGroup");

    creaingBubbleChart(data, yScaleForPopulation, "Population", svgForLineChart, "PopulationBoB", "#003300");
    creaingBubbleChart(data, yScaleForGDP, "GDP Per Capita ( Nominal )", svgForLineChart, "GDPLineBoB", "#FF5722");
    creaingBubbleChart(data, yScaleForAvgMobileDataSpeed, "Avg mobile Data Speed", svgForAreaChart, "avgMobileDataSpeedBoB", "rgb(175, 113, 42)");
    creaingBubbleChart(data, yScaleForAvgTimeSpentOnSocialMedia, "Avg Time Spent on Social Media", svgForAreaChart, "avgTimeSpentOnSocialMediaBoB", "rgb(255, 178, 0)");

    legend(svgForGroupedBarChart, socialMedia);
    color.range(["#E07628", "rgba(254, 181, 6, 0.34)"]);
    legend(svgForAreaChart, ["Avg Time Spent on Social Media", "Avg mobile Data Speed"]);
    color.range(["#003300", "#FF5722"]);
    legend(svgForLineChart, ["GDP Per Capita ( Nominal )", "Population"]);
    addTooltips();

}
//-----------------------------------------------------------------------------
/**
 * Function for sort and replot the chart
 * @param {array} data Data for after sorting to replot the chart
 * @param {string} sortValue contains sorted value
 */
function sortDataAndReplotTheChart(data, sortValue) {
    if (sortValue !== undefined) {
        data.sort(function (a, b) {
            return (a[ sortValue ] - b[ sortValue ]);
        });
        countryCode = [];
        country = [];
        data.forEach(function (d) {
            countryCode.push(d[ "ISO Country Code" ]);
            country.push(d[ "Country" ]);
        });

        xScale.domain(countryCode);
        xScaleForGroupedBarChart.domain(countryCode);
        color.range(["rgb(0, 71, 163)", "rgb(0, 150, 245)", "rgb(160, 200, 255)"]);
    }

    $(".mainSvg").remove();
    plotTheChartCointer();
    plotTheChart(data);


}
//------------------------------------------------------------------------------
/**
 * 
 * Function for adding tooltips
 */
function addTooltips() {

    $(document).ready(function () {

        $('.country').tooltipsy();
        $('.PopulationBoB').tooltipsy();
        $('.GDPLineBoB').tooltipsy();
        $('.avgTimeSpentOnSocialMediaBoB').tooltipsy();
        $('.avgMobileDataSpeedBoB').tooltipsy();

    });

}
//------------------------------------------------------------------------------
/**
 * 
 * Function for adding flags to x-axis
 */
function addingFlagsToXaxis() {
    d3.select(".mainSvg").selectAll(".xAxis").each(function () {
        d3.select(this).selectAll(".tick").selectAll("*").remove();

        d3.select(this).selectAll(".tick")
                .data(country)
                .append("image")
                .style("border", "1px solid black")
                .attr("x", -xScaleForGroupedBarChart.rangeBand() / 2)
                .attr("height", 15)
                .attr("width", xScaleForGroupedBarChart.rangeBand())
                .attr("xlink:href", function (d) {
                    return ("images/country_flags/" + d + ".png");
                });


    });
}
//------------------------------------------------------------------------------
/**
 * Retreiving Data from Data.csv file
 * @param {string} error error 
 * @param {array} data Data for clean ,plot container,plot chart
 * */

d3.csv("Data.csv", function (error, data) {
    init();
    cleanTheData(data);
    plotTheChartCointer();
    plotTheChart(data);

    $(document).ready(function () {

        $("select").change(function () {
            sortDataAndReplotTheChart(data, $(this).val());
        });

        $("#chart-container").on("click", ".svgForGroupedBarChart .legend:eq(0)", function () {
            $(".country rect:nth-child(1)").toggle();

            if (parseFloat($(".svgForGroupedBarChart .legend:eq(0)").css("opacity")).toFixed(1) == 0.4)
                $(".svgForGroupedBarChart .legend:eq(0)").css("opacity", "1");

            else
                $(".svgForGroupedBarChart .legend:eq(0)").css("opacity", "0.4");
        });

        $("#chart-container").on("click", ".svgForGroupedBarChart .legend:eq(1)", function () {
            $(".country rect:nth-child(2)").toggle();
            if (parseFloat($(".svgForGroupedBarChart .legend:eq(1)").css("opacity")).toFixed(1) == 0.4)
                $(".svgForGroupedBarChart .legend:eq(1)").css("opacity", "1");

            else
                $(".svgForGroupedBarChart .legend:eq(1)").css("opacity", "0.4");
        });

        $("#chart-container").on("click", ".svgForGroupedBarChart .legend:eq(2)", function () {
            $(".country rect:nth-child(3)").toggle();
            if (parseFloat($(".svgForGroupedBarChart .legend:eq(2)").css("opacity")).toFixed(1) == 0.4)
                $(".svgForGroupedBarChart .legend:eq(2)").css("opacity", "1");

            else
                $(".svgForGroupedBarChart .legend:eq(2)").css("opacity", "0.4");
        });

        $("#chart-container").on("click", ".svgForAreaChart .legend:eq(0)", function () {
            $(".avgTimeSpentOnSocialMedia").toggle();
            $(".avgTimeSpentOnSocialMediaBoB").toggle();
            if (parseFloat($(".svgForAreaChart .legend:eq(0)").css("opacity")).toFixed(1) == 0.4)
                $(".svgForAreaChart .legend:eq(0)").css("opacity", "1");

            else
                $(".svgForAreaChart .legend:eq(0)").css("opacity", "0.4");
        });

        $("#chart-container").on("click", ".svgForAreaChart .legend:eq(1)", function () {
            $(".avgMobileDataSpeed").toggle();
            $(".avgMobileDataSpeedBoB").toggle();
            if (parseFloat($(".svgForAreaChart .legend:eq(1)").css("opacity")).toFixed(1) == 0.4)
                $(".svgForAreaChart .legend:eq(1)").css("opacity", "1");

            else
                $(".svgForAreaChart .legend:eq(1)").css("opacity", "0.4");
        });

        $("#chart-container").on("click", ".svgForLineChart .legend:eq(0)", function () {
            $(".GDPLine").toggle();
            $(".GDPLineBoB").toggle();
            if (parseFloat($(".svgForLineChart .legend:eq(0)").css("opacity")).toFixed(1) == 0.4)
                $(".svgForLineChart .legend:eq(0)").css("opacity", "1");

            else
                $(".svgForLineChart .legend:eq(0)").css("opacity", "0.4");
        });

        $("#chart-container").on("click", ".svgForLineChart .legend:eq(1)", function () {
            $(".Population").toggle();
            $(".PopulationBoB").toggle();
            if (parseFloat($(".svgForLineChart .legend:eq(1)").css("opacity")).toFixed(1) == 0.4)
                $(".svgForLineChart .legend:eq(1)").css("opacity", "1");

            else
                $(".svgForLineChart .legend:eq(1)").css("opacity", "0.4");
        });

        $('#embed').hide();
        /*on click of embed button sharing chart*/
        $("#share").click(function () {
            $("#embed").toggle();
            var url = "http://ahextechnologies.com/test-d3/index.html"
            var string = '<iframe src=' + url + ' height=750 width=100% marginheight=0 marginwidth=0 frameborder=0></iframe>';

            $("#embed").val(string);
            $("#embed").select();
        });
        /*Replot chart according window resize*/
        $(window).resize(function () {
            init();
            sortDataAndReplotTheChart(data);

        });

    });

});
//-------------------------------------------------------------------------------

