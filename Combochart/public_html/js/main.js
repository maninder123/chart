/**This is the main js file which plots the complete graph in D3LineChart.html */
 
//Clearing Any element in the body before ploting the graph
//d3.select("center").remove();

var                 h = Math.round(window.innerHeight), //Geting the height of the browser (Inner Height)
                    w = Math.round(window.innerWidth),  //Geting the width of the browser (Inner Width)
               margin = 25,
               height = (h * .95) - (2 * margin),       //Seting The total height of our charts
               width  = (w * .95) - (2 * margin),       //Seting The width of our chart
      lineChartHeight = (height * 0.3),                 //Seting The Height of the Line Chart (Bottom)
      areaChartHeight = (height * 0.3),                 //Seting The Height of the area Chart (Middle)
groupedBarChartHeight = (height * 0.4);                 //Seting The Height of the grouped bar chart (Top)

        console.log(height);
        console.log(width);

        
//X-Scale Common For Line Chart and Area Chart
                  xScale = d3.scale.ordinal()
                                 .rangeRoundPoints([0,width]);

//X-Scale For Grouped Bar Chart        
xScaleForGroupedBarChart = d3.scale.ordinal()
                                    .rangeRoundBands([0, width], .1,0);
                                
//X-Scale for Inner Element in Grouped Bar-Chart
xScaleForInnerElementInGroupedBarChart = d3.scale.ordinal();
                
//Y-Scale For Population
   yScaleForPopulation = d3.scale.linear()
                                 .range([lineChartHeight,0]);
                         
//Y-Scale For GDP
          yScaleForGDP = d3.scale.linear()
                                 .range([lineChartHeight,0]);


//Y-Scale For Avg Time Spent On Socia lMedia
   yScaleForAvgTimeSpentOnSocialMedia = d3.scale.linear()
                                          .range([areaChartHeight,0]);
                              
//Y-Scale For Avg Mobile Data Speed
   yScaleForAvgMobileDataSpeed = d3.scale.linear()
                                         .range([areaChartHeight,0]);

//Y-Scale For Grouped Bar Chart
      yScaleForGroupedBarChart = d3.scale.linear()
                                         .domain([-10,110])
                                         .range([groupedBarChartHeight, 0]);
                               
//Defining Color-scale For Bar Chart
                color = d3.scale.ordinal()
                                .range(["#0037C5", "#ff0000", "#e0c918"]);

//Creating X-Axis Common for both area chart and line chart           
                xAxis = d3.svg.axis().scale(xScale).orient("bottom");
                
                xAxisForFroupedBarChart = d3.svg.axis().scale(xScaleForGroupedBarChart).orient("bottom");
        
//Crating Y-Axis For Population Chart
   yAxisForPopulation = d3.svg.axis().scale(yScaleForPopulation).orient("right").ticks(3);
                
//Crating Y-Axis For GDP
          yAxisForGDP = d3.svg.axis().scale(yScaleForGDP).orient("left").ticks(3);

            
//Creating Y-Axis For Grouped Bar Chart
        yAxisForGroupedBarChart = d3.svg.axis()
                                        .scale(yScaleForGroupedBarChart)
                                        .orient("left")
                                        .ticks(5);

//Creating Y-Axis For Avg Mobile Data Speed
     yAxisForAvgMobileDataSpeed = d3.svg.axis()
                                        .scale(yScaleForAvgMobileDataSpeed)
                                        .orient("right")
                                        .ticks(3);

//Creating Y-Axis For Avg Time Spent On SocialMedia
    yAxisForAvgTimeSpentOnSocialMedia = d3.svg.axis()
                                              .scale(yScaleForAvgTimeSpentOnSocialMedia)
                                              .orient("left")
                                              .ticks(3);                        


//Function for creating Main SVG Container
function creatingMainSvg(){
                mainSVG = d3.select("body").append("center")
                                            .append("svg")
                                             .classed("mainSVG",true)
                                             .attr("height", height + (margin * 2)) //Here we are adding two times margin
                                             .attr("width", width + (margin * 2));  // for both height and width for better spacing.
                                     }

//Function for Appending SVG for Line Chart Along with its axes
function creatingLineChartSvg() {
                svgForLineChart = mainSVG.append("g")
                                          .attr("transform", "translate(" + margin + "," + (height + margin - lineChartHeight) + ")")
                                          .append("svg")
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
                                           .attr("height", areaChartHeight)
                                           .attr("width",width);
    
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
                                          .attr("transform", "translate(" + margin + "," + margin + ")")
                                          .append("svg")
                                           .attr("height", groupedBarChartHeight)
                                           .attr("width",width);
    
                                  svgForGroupedBarChart.append("g")
                                                        .attr("class", "yAxisL")
                                                        .call(yAxisForGroupedBarChart);
                                  
                                  svgForGroupedBarChart.append("g")
                                                        .attr("transform", "translate(" + (width) + "," + 0 + ")")
                                                        .call(yAxisForGroupedBarChart);
    
                                        }
                      
//Function For Crating Line Chart. It Takes Input of yScale & Data & Class Name     
function creatingLineChart(yScale,Data,lineName,className) {
                
                  var valueline = d3.svg.line()
                                        .x(function(d) { return xScale(d["ISO Country Code"]); })
                                        .y(function(d) { return Math.round(yScale(d[lineName])); });
                    
                    svgForLineChart.append("path")
                                    .attr("class", className)
                                    .attr("d", valueline(Data));
                    
                      }


//Function For Crating Area Chart. It Takes Input of yScale & Data & Class Name 
function creatingAreaChart(yScale,Data,areaName,className){              
                var valueArea = d3.svg.area()
                                  .x(function(d) { return xScale(d["ISO Country Code"]); })
                                  .y0(areaChartHeight)
                                  .y1(function(d) { return Math.round(yScale(d[areaName])); });
                    
                    svgForAreaChart.append("path")
                                   .attr("class", className)
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
                                     .attr("transform", function(d,i) { return "translate(" + xScaleForGroupedBarChart(d["ISO Country Code"]) + ",0)"; });
                            
                //Creating bars for each update elements 
                country.selectAll("rect")
                     .data(function(d) { return d.socialMediaGroup; })
                     .enter()
                     .append("rect")
                     .attr("width", xScaleForInnerElementInGroupedBarChart.rangeBand())
                     .attr("x", function(d) { return xScaleForInnerElementInGroupedBarChart(d.name); })
                     .attr("y", function(d) { return yScaleForGroupedBarChart(d.value); })
                     .attr("height", function(d) { return (yScaleForGroupedBarChart(0) - yScaleForGroupedBarChart(d.value)); })
                     .style("fill", function(d) { return color(d.name); });

    
}


//Now geting data from CSV File And Extract all the data in an array (its an array of objects) and modify as our requirement. 
d3.csv("Data.csv", function(error, data) {
    
            var            countryCode = [];  
//                            maxPopulation = [],
//                                   GDP = [],
//             avgTimeSpentOnSocialMedia = [],
//                    avgMobileDataSpeed = [];
            
    
            var socialMedia = d3.keys(data[0]).filter(function(key) { return (key == "% use social media")||(key == "% use social media on mobile")||(key == "% bought online on mobile"); });
            //Geting Data For Population & GDP
            data.forEach(function(d){
                         d["Population"] = parseInt(d["Population"].split(",").join(""));
                         d["GDP per capita (nominal)"] = parseInt(d["GDP per capita (nominal)"].split(",").join(""));
                         d["Avg time spent on social media"] = parseFloat(d["Avg time spent on social media"]);
                         d["Avg mobile data speed"] = parseFloat(d["Avg mobile data speed"]);
                         countryCode.push(d["ISO Country Code"]);
                         d.socialMediaGroup = socialMedia.map(function(name) { return {name: name, value: parseInt(d[name])}; });
                     });
            maxPopulation = d3.max(data,function(d){ return d["Population"]});
            maxGDP = d3.max(data,function(d){ return d["GDP per capita (nominal)"]});
            maxAvgMobileDataSpeed = d3.max(data,function(d){ return d["Avg mobile data speed"]});
            maxAvgTimeSpentOnSocialMedia = d3.max(data,function(d){ return d["Avg time spent on social media"]});
//            //*Geting all the age group names from the data (Required For Grouped Bar Chart)
//            var socialMedia = d3.keys(data[0]).filter(function(key) { return (key == "% use social media")||(key == "% use social media on mobile")||(key == "% bought online on mobile"); });
//                                
//            //*Assigning a new Propertie containing an array of to every elements in the data array. (Required for Grouped Bar Chart)
//                data.forEach(function(d) {
//                     d.socialMediaGroup = socialMedia.map(function(name) { return {name: name, value: parseInt(d[name])}; });
//                    
//                });
//                

        xScale.domain(countryCode);
        xScaleForGroupedBarChart.domain(countryCode);
            //Assigning domain for yScaleForPopulation & yScaleForGDP
            yScaleForPopulation.domain([-(maxPopulation/20), maxPopulation+(maxPopulation/4)]);
            yScaleForGDP.domain([-maxGDP/20, maxGDP+maxGDP/4]);
            
            //Assigning domain and range to inner band of each group
            xScaleForInnerElementInGroupedBarChart.domain(socialMedia).rangeRoundBands([0, xScaleForGroupedBarChart.rangeBand()]);
            
            
            
          //Assigning domain for yScaleForAvgMobileDataSpeed & yScaleForAvgTimeSpentOnSocialMedia
            yScaleForAvgMobileDataSpeed.domain([-(maxAvgMobileDataSpeed/25), maxAvgMobileDataSpeed+(maxAvgMobileDataSpeed/5)]);
            yScaleForAvgTimeSpentOnSocialMedia.domain([-(maxAvgTimeSpentOnSocialMedia/25), maxAvgTimeSpentOnSocialMedia+(maxAvgTimeSpentOnSocialMedia/5)]);
    console.log(maxPopulation);         
    console.log(maxGDP);
    
    
            creatingMainSvg();
            
            creatingLineChartSvg();
            creatingAreaChartSvg();
            creatingGroupedBarChartSvg();
    
    
            //Appening X-Axis To mainSVG
            d3.select(".mainSVG").append("g")
                                 .attr("class", "xAxis")
                                 .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
                                 .call(xAxis);
                         
            d3.select(".mainSVG").append("g")
                                 .attr("class", "xAxis")
                                 .attr("transform", "translate(" + margin + "," + (height + margin- lineChartHeight) + ")")
                                 .call(xAxis);
                         
            d3.select(".mainSVG").append("g")
                                 .attr("class", "xAxis")
                                 .attr("transform", "translate(" + margin + "," + (margin + groupedBarChartHeight) + ")")
                                 .call(xAxisForFroupedBarChart);
                         
            creatingLineChart(yScaleForPopulation,data,"Population","Population");
            creatingLineChart(yScaleForGDP,data, "GDP per capita (nominal)","GDPLine");

            creatingAreaChart(yScaleForAvgMobileDataSpeed,data,"Avg mobile data speed","avgMobileDataSpeed");
            creatingAreaChart(yScaleForAvgTimeSpentOnSocialMedia,data, "Avg time spent on social media","avgTimeSpentOnSocialMedia");
            
            creatingGroupedBarChart(data);
            
            svgForAreaChart.selectAll(".bub").data(data).enter().append("circle").attr("class","bub")
                         .attr("cx", function(d){return xScale(d["ISO Country Code"]) ;})
                         .attr("cy",function(d){return yScaleForAvgMobileDataSpeed(d["Avg mobile data speed"]);})
                         .attr("r", "5").attr("fill","red");
            
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


               });

                                
 
                             
                            
                            

