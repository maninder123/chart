/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    
//    ----------------------------------------------------------------------------
    //data for the line chart
   var bubbleData = [{
            x: 10,
            y: 20
        }, {
            x: 20,
            y: 30
        }, {
            x: 30,
            y: 40
        }, {
            x: 60,
            y: 40
        }, {
            x: 80,
            y: 5
        }, {
            x: 100,
            y: 60
        }];
    //-------------------------------------------------------------------------
    var lineData = [{
            x: 1,
            y: 5
        }, {
            x: 20,
            y: 20
        }, {
            x: 40,
            y: 10
        }, {
            x: 60,
            y: 40
        }, {
            x: 80,
            y: 5
        }, {
            x: 100,
            y: 60
        }];
//   -----------------------------------------------------------------------------

   var vis = d3.select('#visualisation'),
            WIDTH = 1000,
            HEIGHT = 500,
            MARGINS = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            },
// -----------------------------------------------------------------------------
//preparing x range y range for bubble chart
  xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(bubbleData, function (d) {
            return d.x;
        }), d3.max(bubbleData, function (d) {
            return d.x;
        })])
         yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(bubbleData, function (d) {
            return d.y;
        }), d3.max(bubbleData, function (d) {
            return d.y;
        })]),
//--------------------------------------------------------------------------------
//preparing x range y range for line chart
xRan = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
            return d.x;
        }), d3.max(bubbleData, function (d) {
            return d.x;
        })])
         yRan = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y;
        }), d3.max(bubbleData, function (d) {
            return d.y;
        })]),
 //-----------------------------------------------------------------------------
//preparting x scale y scale
xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5),

 yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
     .orient('left');
//-----------------------------------------------------------------------------
//apending x axis y axis to svg
  vis.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
            .call(xAxis);

    vis.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
            .call(yAxis);
    //--------------------------------------------------------------------------
    //bubble chart
    vis.selectAll("circle")
   .data(bubbleData).enter().append("svg:circle")
   .attr("cx", function(d) { return xRange(d.x);})
   .attr("cy", function(d) {return yRange(d.y)})
   .attr("fill", "red").attr("r", 4)
    //---------------------------------------------------------------------------
    //preparing line 
    var lineFunc = d3.svg.line()
            .x(function (d) {
                return xRan(d.x);
            })
            .y(function (d) {
                return yRan(d.y);
            })
            .interpolate('linear');
////  --------------------------------------------------------------------------
//appending line
vis.append('svg:path')
            .attr('d', lineFunc(lineData))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
//    ----------------------------------------------------------------------------

//var w = 400;
//var h = 400;
//var r = h/2;
//var color = d3.scale.category20c();
//
//var data = [{"label":"Category A", "value":20}, 
//		          {"label":"Category B", "value":50}, 
//		          {"label":"Category C", "value":30}];
//
//
//var vis = d3.select('#chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
//var pie = d3.layout.pie().value(function(d){return d.value;});
//
//// declare an arc generator function
//var arc = d3.svg.arc().outerRadius(r);
//
//// select paths, use arc generator to draw
//var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
//arcs.append("svg:path")
//    .attr("fill", function(d, i){
//        return color(i);
//    })
//    .attr("d", function (d) {
//        // log the result of the arc generator to show how cool it is :)
//        console.log(arc(d));
//        return arc(d);
//    }).on("mouseover", function(d) {
//  d3.select(this).append('svg:title').text("here")
//
//            });
//
//// add the text
//arcs.append("svg:text").attr("transform", function(d){
//			d.innerRadius = 0;
//			d.outerRadius = r;
//    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
//    return data[i].label;}
//		);
        
        
        //------------------------------------------------------------------------
    var zoom = d3.behavior.zoom()
    .x(xRan)
    .y(yRan)
    .on("zoom", zoomed);
svg = d3.select('#visualization')
    .append("svg:svg")
    .attr('WIDTH', WIDTH + MARGINS.left + MARGINS.right)
    .attr('HEIGHT', HEIGHT + MARGINS.top + MARGINS.bottom)
    .call(zoom)
    .append("svg:g")
    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");

function zoomed() {
//    console.log(d3.event.translate);
//    console.log(d3.event.scale);
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.select(".x.grid")
        .call(xRan()
        .tickSize(-HEIGHT, 0, 0)
        .tickFormat(""));
    svg.select(".y.grid")
        .call(yRan()
        .tickSize(-WIDTH, 0, 0)
        .tickFormat(""));
    svg.select(".line")
        .attr("class", "line")
        .attr("d", line);
}
$('#embed').hide();
$("#share").click(function(){
$("#embed").show();
var url=window.location.href;
var string='<iframe src='+url+' height='+HEIGHT +' width='+ WIDTH+'></iframe>';
 $('#embed').val(string);
});
        });
       