/**This is the main js file which plots the complete graph in D3LineChart.html */

//Function for initializing all global variables
function init() {
//Clearing Any element in the body before ploting the graph
d3.select( "center" ).remove();

                        h = Math.round( window.innerHeight ); //Geting the height of the browser (Inner Height)
                        w = Math.round( window.innerWidth );  //Geting the width of the browser (Inner Width)
                   margin = ( w <= 480 ) ? 40 : 50;
                   height = ( h * .90 ) - ( 2 * margin );       //Seting The total height of our charts
                    width = ( w * .95 ) - ( 2 * margin );       //Seting The width of our chart
          lineChartHeight = ( height * 0.33 );                //Seting The Height of the Line Chart (Bottom)
          areaChartHeight = ( height * 0.33 );                //Seting The Height of the area Chart (Middle)
    groupedBarChartHeight = ( height * 0.33 );                //Seting The Height of the grouped bar chart (Top)

//X-Scale Common For Line Chart and Area Chart
    xScale = d3.scale.ordinal()
                     .rangeRoundPoints( [ 0, width ], 1 );

//X-Scale For Grouped Bar Chart        
    xScaleForGroupedBarChart = d3.scale.ordinal()
                                       .rangeRoundBands( [ 0, width ], .1, .1 );

//X-Scale for Inner Element in Grouped Bar-Chart
    xScaleForInnerElementInGroupedBarChart = d3.scale.ordinal();

//Defining Color-scale For Bar Chart
    color = d3.scale.ordinal()
                    .range( [ "#5A9BD4" ,"#7AC36A", "#FAA75B" ] );

//Creating X-Axis Common for both area chart and line chart           
    xAxis = d3.svg.axis().scale( xScale ).orient( "bottom" );

//Creating X-Axis for Grouped Bar Chart
    xAxisForGroupedBarChart = d3.svg.axis()
                                .scale( xScaleForGroupedBarChart ).orient( "bottom" );
    
}

//Function for defining y-scale (It's a linear scale)
function yScale( domain, range ) {
    
    var yScale = d3.scale.linear().domain( domain ).range( range );
    return yScale;

}

//Function for creating Y-Axis
function yAxisGenerator( yScale, orient, ticks, tickValues ) {
    
    var yAxis = d3.svg.axis()
                  .scale( yScale )
                  .orient( orient )
                  .ticks( ( ticks === "undefined" ) ? null : ticks )
                  .tickValues( ( tickValues === "undefined" ) ? null : tickValues );
        return yAxis;
}

function appendYaxis( svg, yAxis, translate, className ) {
        svg.append( "g" )
            .attr( "class", className )
            .attr( "transform", "translate(" + translate[0] + "," + translate[1] + ")" )
            .call( yAxis );
}

//Function that creats svg for indivisual charts
function creatingSvgForChart( parentNode, chartHeight, chartWidth, translate, className ) {
    
    var SVG = parentNode.append( "g" )
                        .attr( "transform", "translate(" + translate[0] + "," + translate[1] + ")" )
                        .append( "svg" )
                        .classed( className, true )
                        .attr( "height", chartHeight )
                        .attr( "width", chartWidth );
        return(SVG);        
  
}

//Function For Crating Line Chart. It Take Inputs of Data , Parent Element of the line chart x-value & y-value for line generator & Class Name.     
function creatingLineChart( Data, yScale, lineName, parentNode, className ) {

    var valueline = d3.svg.line()
                          .x( function(d) { return xScale( d[ "ISO Country Code" ] ); } )
                          .y( function(d) { return Math.round( yScale( d[ lineName ] ) ); } );

        parentNode.append( "path" )
                   .attr( "class", className )
                   .attr( "d", valueline( Data ) );

}

//Function For Crating Area Chart. It Take Inputs of Data , Parent Element of the line chart x-value & y-value for line generator & Class Name. 
function creatingAreaChart( Data, yScale, areaName, parentNode, className ) {
    var valueArea = d3.svg.area()
                           .x( function (d) { return xScale( d[ "ISO Country Code" ] ); } )
                           .y0( areaChartHeight )
                           .y1( function (d) { return yScale( d[ areaName ] ); } );

        parentNode.append( "path" )
                   .attr( "class", className )
                   .attr( "d", valueArea( Data ) );

}

//Function For Crating Grouped Bar Chart
function creatingGroupedBarChart( Data, parentNode, xScale, yScale, xScaleForInnerElement, groupName, innerElementsObject ) {
    //Creating Each country group in the svg and binding data to them
    var country = parentNode.selectAll( ".country" )
                            .data(Data)
                            .enter()
                            .append( "g" )
                             .attr( "class", "country" )
                             .attr( "transform", function(d) { return "translate(" + xScale( d[ groupName ] ) + ",0)"; } );
                            
    //Creating bars for each update elements 
        country.selectAll( "rect" )
               .data( function(d) { return d[ innerElementsObject ]; } )
               .enter()
               .append( "rect" )
                .attr( "x", function(d) { return xScaleForInnerElement( d.name ); } )
                .attr( "y", function(d) { return yScale( d.value ); } )
                .attr( "width", xScaleForInnerElement.rangeBand() )
                .attr( "height", function(d) { return ( yScale(0) - yScale( d.value ) ); } )
                .style( "fill", function(d) { return color( d.name ); } )
                .attr( "title", function(d) {
                            return ( "Country: " + d[ "country" ] + "</br>" + d.name + ": " + d.value );
                        } );
   
}

function creaingBubbleChart( Data, yScale, lineName, parentNode, className, bubbleColor ) {
    
    parentNode.selectAll( className ).data( Data ).enter().append( "circle" ).attr( "class", className )
            .attr( "cx", function(d) {
                return ( xScale( d[ "ISO Country Code" ] ) );
            } )
            .attr( "cy", function(d) {
                return yScale( d[ lineName ] );
            } )
            .attr( "r", "2" ).attr( "fill", bubbleColor )
            .attr( "title", function(d) {
                            console.log("miku");
                            return ( "Country: " + d[ "Country" ] + "</br>" + lineName + ": " + d[ lineName ] );
                        } );
    
}

function legend(svg, data) {
    var legendHeight = ( h < 480 ) ? 5 : 15,
        legendWidth =  ( w < 480 ) ? 20 : 40,
        yValueOfText = ( h < 480 ) ? 2 : 7;
    var legend = svg.selectAll( ".legend" )
                    .data( data.slice() )
                    .enter()
                    .append( "g" )
                     .attr( "class", "legend" )
                     .attr( "transform", function (d, i) {
                return "translate( " + ( width * 0.33 * i ) + "," + height * 0.06 + " )";
            } );

        legend.append( "rect" )
                .attr( "x", function(d) {
                    return ( margin * 0.5 );
                } )
                .attr( "width", legendWidth )
                .attr( "height", legendHeight )
                .style( "fill", color );

        legend.append( "text" )
                .attr( "x", function( d, i ) {
                    return ( margin*0.55 + legendWidth );
                })
                .attr( "y", yValueOfText )
                .attr( "dy", ".35em" )
                .style( "text-anchor", "start" )
                .text(function (d) {
                    return d;
            });
}

function cleanTheData( data ) {
    
    countryCode = [];
    socialMedia = d3.keys( data[0] ).filter( function( key ) {
            
    return (key == "% use social media") || (key == "% use social media on mobile") || (key == "% bought online on mobile");    
    });
    
    //Geting Data For Population & GDP
    data.forEach( function (d) {
                    
                                        d[ "Population" ] = parseInt( d[ "Population" ].split( "," ).join( "" ) );
                             d[ "Avg mobile data speed" ] = parseFloat( d[ "Avg mobile data speed" ] );
                          d[ "GDP per capita (nominal)" ] = parseInt(d[ "GDP per capita (nominal)" ].split( "," ).join( "" ) );
                    d[ "Avg time spent on social media" ] = parseFloat( d[ "Avg time spent on social media" ] );
                    
        d[ "socialMediaGroup" ] = socialMedia.map( function(name) {
                                                    return { name: name, value: parseInt( d[ name ] ), country: d["Country"] };
                                                    });
        countryCode.push( d[ "ISO Country Code" ] );
    });
}

function plotTheChart( data ) {
    
    //Appening X-Axis for Line Chart To mainSVG
        mainSvg.append( "g" )
                .attr( "class", "xAxis" )
                .attr( "transform", "translate( " + margin + ", " + ( height + margin - ( lineChartHeight - yScaleForGDP(0) ) ) + ")" )
                .call( xAxis );

    //Appening X-Axis for Area Chart To mainSVG
        mainSvg.append( "g" )
                .attr( "class", "xAxis" )
                .attr( "transform", "translate( " + margin + ", " + ( height + margin - lineChartHeight - ( areaChartHeight - yScaleForAvgTimeSpentOnSocialMedia(0) ) ) + ")" )
                .call( xAxis );

    //Appening X-Axis For Grouped Bar Chart
        mainSvg.append( "g" )
                .attr( "class", "xAxis" )
                .attr( "transform", "translate( " + margin + ", " + ( height + margin - lineChartHeight - areaChartHeight - ( groupedBarChartHeight - yScaleForGroupedBarChart(0) ) ) + ")" )
                .call( xAxisForGroupedBarChart );
        
    var svgForLineChart = creatingSvgForChart( mainSvg, lineChartHeight, width, [ margin, ( height + margin - lineChartHeight ) ], "svgForLineChart" ),
        svgForAreaChart = creatingSvgForChart( mainSvg, areaChartHeight, width, [ margin, ( height + margin - lineChartHeight - areaChartHeight ) ], "svgForAreaChart" ),
        svgForGroupedBarChart = creatingSvgForChart( mainSvg, groupedBarChartHeight, width, [margin, ( height + margin - lineChartHeight - areaChartHeight - groupedBarChartHeight ) ], "svgForGroupedBarChart" );
    
        creatingLineChart( data, yScaleForPopulation, "Population", svgForLineChart, "Population" );
        creatingLineChart( data, yScaleForGDP, "GDP per capita (nominal)", svgForLineChart, "GDPLine" );
    
        creatingAreaChart( data, yScaleForAvgMobileDataSpeed, "Avg mobile data speed", svgForAreaChart, "avgMobileDataSpeed" );
        creatingAreaChart( data, yScaleForAvgTimeSpentOnSocialMedia, "Avg time spent on social media", svgForAreaChart, "avgTimeSpentOnSocialMedia" );

        creatingGroupedBarChart( data, svgForGroupedBarChart, xScaleForGroupedBarChart, yScaleForGroupedBarChart, xScaleForInnerElementInGroupedBarChart, "ISO Country Code", "socialMediaGroup" );
        
        creaingBubbleChart( data, yScaleForPopulation, "Population", svgForLineChart, "PopulationBoB", "#003300" );
        creaingBubbleChart( data, yScaleForGDP, "GDP per capita (nominal)", svgForLineChart, "GDPLineBoB", "#FF5722" );
        creaingBubbleChart( data, yScaleForAvgMobileDataSpeed, "Avg mobile data speed", svgForAreaChart, "avgMobileDataSpeedBoB", "rgb(175, 113, 42)" );
        creaingBubbleChart( data, yScaleForAvgTimeSpentOnSocialMedia, "Avg time spent on social media", svgForAreaChart, "avgTimeSpentOnSocialMediaBoB", "rgb(255, 178, 0)" );
        
        legend(svgForGroupedBarChart, socialMedia);
        color.range(["#E07628", "rgba(254, 181, 6, 0.34)"]);
        legend(svgForAreaChart, ["Avg time spent on social media", "Avg mobile data speed"]);
        color.range(["#003300", "#FF5722"]);
        legend(svgForLineChart, ["GDP per capita (nominal)", "Population"]);
}

function sortDataAndReplotTheChart( data, sortValue ) {
    
    data.sort( function( a, b ) { return ( a[ sortValue ] - b[ sortValue ] ); } );
    countryCode = [];
    
    data.forEach( function(d) {
                    countryCode.push( d[ "ISO Country Code" ] );
                    });
    
    xScale.domain( countryCode );
    xScaleForGroupedBarChart.domain( countryCode );
    color.range( [ "#2ecd71", "#3598DB", "#F39C11" ] );
    
    $(".xAxis").remove();
    $(".svgForLineChart").remove();
    $(".svgForAreaChart").remove();
    $(".svgForGroupedBarChart").remove();
    
    plotTheChart(data);
    
}
       
d3.csv( "Data.csv", function( error, data ) {
    init();
    cleanTheData( data );
    
    var maxGDP = d3.max( data, function(d) {
                        return d[ "GDP per capita (nominal)" ];
            }),
        maxPopulation = d3.max( data, function(d) {
                        return d["Population"];
            }),
        maxAvgMobileDataSpeed = d3.max( data, function(d) {
                        return d[ "Avg mobile data speed" ];
            }),
        maxAvgTimeSpentOnSocialMedia = d3.max( data, function(d) {
                        return d[ "Avg time spent on social media" ];
            });

        yScaleForGDP = yScale( [ 0, Math.round( 1.6 * maxGDP ) ], [ lineChartHeight, 0 ] ),
        yScaleForPopulation = yScale([ 0, Math.round( 1.6 * maxPopulation ) ], [ lineChartHeight, 0 ] ),
        yScaleForGroupedBarChart = yScale([ 0, 100 ], [ groupedBarChartHeight, 0 ] ),
        yScaleForAvgMobileDataSpeed = yScale([ 0, Math.round( 1.65 * maxAvgMobileDataSpeed ) ], [ areaChartHeight, 0 ] ),
        yScaleForAvgTimeSpentOnSocialMedia = yScale([ 0, Math.round( 1.6 * maxAvgTimeSpentOnSocialMedia ) ], [ areaChartHeight, 0 ]);
            
        xScale.domain(countryCode);
        xScaleForGroupedBarChart.domain(countryCode);
        xScaleForInnerElementInGroupedBarChart.domain(socialMedia)
                                              .rangeRoundBands([0,xScaleForGroupedBarChart.rangeBand()]);
    
    var yAxisForGDP = yAxisGenerator( yScaleForGDP, "right", 3, [25128, 50257, 75386] ),
        yAxisForPopulation = yAxisGenerator( yScaleForPopulation, "left", 3, [557513534, 1115027068, 1672540603] ),
        yAxisForAvgMobileDataSpeed = yAxisGenerator( yScaleForAvgMobileDataSpeed, "left", 3, [8, 16, 24] ),
        yAxisForAvgTimeSpentOnSocialMedia = yAxisGenerator( yScaleForAvgTimeSpentOnSocialMedia, "right", 3, [2, 4, 6] ),
        yAxisForGroupedBarChartL = yAxisGenerator( yScaleForGroupedBarChart, "left", 3, [30, 60, 90] ),
        yAxisForGroupedBarChartR = yAxisGenerator( yScaleForGroupedBarChart, "right", 3, [30, 60, 90] );
        
        yAxisForGDP.tickFormat( function(d) { return parseInt( d / 1000 ) + "K"; } );
        yAxisForPopulation.tickFormat( function(d) { return ( d / 10e8 ).toFixed(1) + "B"; } );
        yAxisForAvgMobileDataSpeed.tickFormat( function(d) { return d + "Mbps"; } );
        yAxisForAvgTimeSpentOnSocialMedia.tickFormat( function(d) { return d + "h"; } );
        yAxisForGroupedBarChartL.tickFormat( function(d) { return d + "%"; } );
        yAxisForGroupedBarChartR.tickFormat( function(d) { return d + "%"; } );
        
        mainSvg = d3.select("body")
                    .append("center")
                     .append( "svg" )
                      .classed( "mainSvg", true )
                      .attr( "height", ( h * .90 ) )
                      .attr( "width", ( w * .95 ) );
        
    
        appendYaxis( mainSvg, yAxisForGDP, [ ( width + margin ), ( height + margin - lineChartHeight ) ], "yAxisR" );
        appendYaxis( mainSvg, yAxisForPopulation, [ margin, ( height + margin - lineChartHeight ) ], "yAxisL" );
        appendYaxis( mainSvg, yAxisForAvgMobileDataSpeed, [ margin, ( height + margin - lineChartHeight - areaChartHeight ) ], "yAxisL" );
        appendYaxis( mainSvg, yAxisForAvgTimeSpentOnSocialMedia, [ ( width + margin ), ( height + margin - lineChartHeight - areaChartHeight ) ], "yAxisR" );
        appendYaxis( mainSvg, yAxisForGroupedBarChartL, [ margin, ( height + margin - lineChartHeight - areaChartHeight - groupedBarChartHeight ) ], "yAxisL" );
        appendYaxis( mainSvg, yAxisForGroupedBarChartR, [ ( width + margin ), ( height + margin - lineChartHeight - areaChartHeight - groupedBarChartHeight ) ], "yAxisR" );

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
    
    d3.selectAll("g.tick line:first-child").style("opacity",1);
    plotTheChart(data);
        
    $( document ).ready( function() {
        
        $( ".select-box select" ).change( function() {
            sortDataAndReplotTheChart( data, $( this ).val() );
        });

        $(".mainSvg" ).on( "click", ".svgForGroupedBarChart .legend:eq(0)", function() {
            $(".country rect:nth-child(1)").toggle();

            if ( parseFloat( $( ".svgForGroupedBarChart .legend:eq(0)" ).css( "opacity" ) ).toFixed(1) == 0.4 )
                $( ".svgForGroupedBarChart .legend:eq(0)" ).css( "opacity", "1" );

            else
                $( ".svgForGroupedBarChart .legend:eq(0)" ).css( "opacity", "0.4" );
        });

        $( ".mainSvg" ).on( "click", ".svgForGroupedBarChart .legend:eq(1)", function() {
            $( ".country rect:nth-child(2)" ).toggle();
            if ( parseFloat( $( ".svgForGroupedBarChart .legend:eq(1)" ).css( "opacity" )).toFixed(1) == 0.4 )
                $( ".svgForGroupedBarChart .legend:eq(1)" ).css( "opacity", "1" );

            else
                $( ".svgForGroupedBarChart .legend:eq(1)" ).css( "opacity", "0.4" );
        });

        $( ".mainSvg" ).on( "click", ".svgForGroupedBarChart .legend:eq(2)", function() {
            $( ".country rect:nth-child(3)" ).toggle();
            if ( parseFloat( $( ".svgForGroupedBarChart .legend:eq(2)" ).css( "opacity" )).toFixed(1) == 0.4 )
                $( ".svgForGroupedBarChart .legend:eq(2)" ).css( "opacity", "1" );

            else
                $( ".svgForGroupedBarChart .legend:eq(2)" ).css( "opacity", "0.4" );
        });

        $( ".mainSvg" ).on( "click", ".svgForAreaChart .legend:eq(0)", function() {
            $( ".avgTimeSpentOnSocialMedia" ).toggle();
            $( ".avgTimeSpentOnSocialMediaBoB" ).toggle();
            if ( parseFloat( $(".svgForAreaChart .legend:eq(0)" ).css( "opacity" ) ).toFixed(1) == 0.4 )
                $( ".svgForAreaChart .legend:eq(0)" ).css( "opacity", "1" );

            else
                $( ".svgForAreaChart .legend:eq(0)" ).css( "opacity", "0.4" );
        });

        $( ".mainSvg" ).on( "click", ".svgForAreaChart .legend:eq(1)", function() {
            $( ".avgMobileDataSpeed" ).toggle();
            $( ".avgMobileDataSpeedBoB" ).toggle();
            if ( parseFloat( $( ".svgForAreaChart .legend:eq(1)" ).css( "opacity" )).toFixed(1) == 0.4 )
                $( ".svgForAreaChart .legend:eq(1)" ).css( "opacity", "1" );

            else
                $( ".svgForAreaChart .legend:eq(1)" ).css( "opacity", "0.4" );
        });

        $( ".mainSvg" ).on( "click", ".svgForLineChart .legend:eq(0)", function() {
            $( ".GDPLine" ).toggle();
            $( ".GDPLineBoB" ).toggle();
            if ( parseFloat( $( ".svgForLineChart .legend:eq(0)" ).css( "opacity" ) ).toFixed(1) == 0.4 )
                $( ".svgForLineChart .legend:eq(0)" ).css( "opacity", "1" );

            else
                $(".svgForLineChart .legend:eq(0)" ).css( "opacity", "0.4" );
        });

        $( ".mainSvg" ).on( "click", ".svgForLineChart .legend:eq(1)", function() {
            $( ".Population" ).toggle();
            $( ".PopulationBoB" ).toggle();
            if ( parseFloat( $( ".svgForLineChart .legend:eq(1)" ).css( "opacity" ) ).toFixed(1) == 0.4 )
                $( ".svgForLineChart .legend:eq(1)" ).css( "opacity", "1" );

            else
                $( ".svgForLineChart .legend:eq(1)" ).css( "opacity", "0.4" );
        });

        $( '#embed' ).hide();
        $( "#share" ).click( function() {
            $( "#embed" ).toggle();
            var url = window.location.href;
            var string = '<iframe src=' + url + ' height=' + h + ' width=' + w + '></iframe>';
            $( "#embed" ).val( string );
            $( "#embed" ).select();
        });
        $('.country rect').tooltipsy();
        $('.PopulationBoB').tooltipsy();
        $('.GDPLineBoB').tooltipsy();
        $('.avgTimeSpentOnSocialMediaBoB').tooltipsy();
        $('.avgMobileDataSpeedBoB').tooltipsy();
        
//        
//        $(window).resize(function(){
//            sortDataAndReplotTheChart();
//});

    });
    
});
