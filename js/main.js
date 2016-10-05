// Dataviz template


var color=d3.scale.category20c();

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


//var x = d3.scale.ordinal().rangeBands([0, width]);
var x = d3.scale.linear().range([10, width]);
var y1 = d3.scale.linear().range([200, 0]);
var y2 = d3.scale.linear().range([400, 240]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    //.ticks(5);


var yAxis = d3.svg.axis()
    .scale(y1)
    .orient("left")
    .ticks(6);

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left")
    .ticks(6);

    //.ticks(10, "%");

var svg = d3.select("#graph1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var color1='#c00';
var color2='#999';



function refresh(){
    getData();
    update();
}


function update() {

    //console.log('update()');
    // x.domain(data.map(function(d,i) { return i; }));
    x.domain([0,data.length-1]);
    
    
    var y1max=Math.max(d3.max(data, function(d) { return d.p1; }),d3.max(data, function(d) { return d.p2; }))
    y1.domain([0, y1max]);
    
    //y1.domain([0, 0.25]);
    y2.domain([0, 1.2]);


    // delete prev axis
    svg.selectAll('.axis').remove();

    // x-axis to svg
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 200 + ")")
        .call(xAxis);
    
    // x-axis to svg (a copy)
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 400 + ")")
        .call(xAxis);


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("x", 360)
        .attr("y", 200)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("k")
    
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis2)
    .append("text")
        .attr("x", 360)
        .attr("y", 400)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("k")
    .append("text")
        .attr("x", -240)
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cumulative value")


    var b1= svg.selectAll(".bar1").data(data);

    
    if ($("input[name='rad1']:checked").val()=="bubble") {
        //bubble
        b1.enter().append("circle")
            .attr("class", "bar1")
            .attr("fill", color1 )
            .attr("cx", function(d,i) { return x(i); })
            .attr("cy", function(d) { return 200; })
            .attr("r", 1)
            .on("mouseover", mouseover)
            .on("mousemove", mm1)
            .on("mouseout", mouseout);

        b1.transition(500)
            .attr("cx", function(d,i) { return x(i); })
            .attr("cy", function(d) { return y1(d.p1); })
            .attr("r", function(d,i){return Math.max(2,width/4/data.length);});

    } else {
        //rect
        b1.enter().append("rect")
            .attr("class", "bar1")
            .attr("fill", color1 )
            .attr("x", function(d,i) { return x(i); })
            .attr("y", function(d) { return 200; })
            .attr("width", 1)
            .attr("height", 1 )
            .on("mouseover", mouseover)
            .on("mousemove", mm1)
            .on("mouseout", mouseout);

        b1.transition(500)
            .attr("x", function(d,i) { return x(i); })
            .attr("y", function(d) { return y1(d.p1); })
            .attr("width", function(d,i){return width/2/data.length;})
            .attr("height", function(d){ return 200 - y1(d.p1); } );
    }
    
    b1.exit().remove(); 
    

}



/**
 * Tooltip
 */
var ttdiv = d3.select("body").append("div")
.attr("class", "tooltips")
.style("opacity", 1e-6);

function mouseover(){
    ttdiv.transition().duration(200).style("opacity", 1);
}



function ttleft(){
  var max = $("body").width()-$("div.tooltips").width() - 20;
    return  Math.min( max , d3.event.pageX + 10 ) + "px";
}


function mouseout(){
    ttdiv.transition().duration(200).style("opacity", 1e-6);
}




// data part
var data=[];
function getData(){
    data=[];
    return data;
}


// form //
//$("input[name='rad1']").tooltip();
//$("input[name='rad2']").tooltip();


$(function() {

    refresh();//compute and redraw graph
    updateLabels();    
    getData();

    console.info('main.js');

});

var t;
d3.select(window).on('resize', function(){  
    
    clearTimeout(t);
    t=setTimeout(function()
    {
        // all resizable graph should be updated here
        console.log('resizeEnd');
        //updateGraph();
    },500);//update all graph
});
