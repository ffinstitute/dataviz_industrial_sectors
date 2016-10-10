// D3js - Profitability of Industrial Sectors
var color=d3.scale.category20c();
var height = 400;

//var x = d3.scale.ordinal().rangeBands([0, width]);

var years=[2000,2005,2010,2015];

function updateGraph() {

    //console.info('updateGraph()',vis);
    width=$('div.container').width();
    var xScale = d3.scale.linear().range([50, width-150]);
    var yScale = d3.scale.linear().range([height-50, 0]);//PCT
    
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
        .ticks(5)
        .tickFormat(function(d){return d})
        ;
    
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6);

    var line = d3.svg.line()
        //.interpolate("basis")
        .interpolate("linear")
        .x(function(d) { return xScale(d[0]); })
        .y(function(d) { return yScale(d[1]); });


    
    vis.attr("width", width ).attr("height", 400 );
    // x.domain(data.map(function(d,i) { return i; }));
    xScale.domain([2000,2015]);//2000  2005    2010    2015
    yScale.domain([3, 22]);
    
    //y1.domain([0, 0.25]);

    // delete prev axis
    vis.selectAll('.axis').remove();

    // x-axis to svg
    vis.append("g").attr("class", "x axis")
        .attr("transform", "translate(0,360)")
        .style("font-size","16px")
        .call(xAxis);
    

    vis.append("g")
        .attr("class", "y axis")
        .style("font-size","16px")
        .attr("transform", "translate(30,10)")
        .call(yAxis)
    
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -25)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("%");
    

    var vline= vis.selectAll("line.vline").data(years);
    vline.enter().append("line")
        .attr("class","vline")
        .attr("stroke","#aaaaaa")
        .style("stroke-dasharray", ("3, 3"))
        //.style("opacity",0.5)
        .attr("stroke-width",1)
        .style('shape-rendering','crispEdges');
    
    vline.transition()
        .attr("x1",function(d){return xScale(d);})
        .attr("x2",function(d){return xScale(d);})
        .attr("y1",0).attr("y2",height-40);

   
    




    //console.log(data.length)
    vis.selectAll(".group").remove();

    var group = vis.selectAll(".group")
        .data(data)
        .enter().append("g")
        .attr("class", "group");
            
    
    group.append("path")
        .attr("d", function(d) { return line(d.d); })
        .attr("class", "line")
        .style("cursor", "pointer")
        .style("stroke", function(d){
            //console.warn(d);
            return '#cccccc';
            return color(d.name);
        })
        .attr("stroke-width", 2)
        .style('opacity', 0.5)
        .attr("fill", "none")
        /*
        .on("mouseover", function(d){
            d3.select(this).style('stroke-width', 4);
            d3.select(this).style('opacity', 1);
        })
        //.on("mousemove", mm1)
        .on("mouseout", function(d){
            d3.select(this).style('stroke-width', 2);
            d3.select(this).style('opacity', 0.5);
        })
        */
        ;
          
    group.append("text")
        .datum(function(d) { return {name: d.name, offset:+d.offset_y, value: d.d[d.d.length - 1]}; })
        .attr("transform", function(d) { 
            //console.log(d);
            return "translate(" + xScale(d.value[0]) + "," + (yScale(d.value[1])+d.offset) + ")";
        })
        .attr("x", 5)
        .attr("dy", ".35em")
        .attr("fill", "#444444")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .style("cursor", "pointer")
        .style('opacity', 0.5)
        .text(function(d) { return d.name; });


    group
    .on("mouseover",function(d){
        
        if(_last){
            d3.select(_last).select('path').attr("stroke-width", 2).style('opacity', 0.5).style('stroke','#cccccc');
            d3.select(_last).select('text').style('opacity', 0.5);
        }
        
        d3.select(this).select('path').attr("stroke-width", 4).style('opacity', 1).style('stroke','#cc0000');
        d3.select(this).select('text').style('opacity', 1).style('font-weight','bold');
        var htm="Sector: <b>"+d.name+"</b><hr />";
        htm+="<table>";
        htm+="<thead><th width=60>Year</th><th>ROCE</th>";
        for(var i in d.d){
            var o=d.d[i];
            //console.log(o);
            htm+="<tr><td>"+o[0];
            htm+="<td style='text-align:right'>"+o[1]+"%</td>";    
        }
        htm+="</table>";
        ttover(htm);
        _last=this;
    }).on("mousemove",function(){
        ttmove();
    }).on("mouseout",function(d){
        //console.warn(d);
        //d3.select(this).select('path').attr("stroke-width", 2).style('opacity', 0.5).style('stroke','#cccccc');
        //d3.select(this).select('text').style('opacity', 0.5);
        ttout();
    });

}

var _last=null;

// data part
var data=[];


$(function() {

    //refresh();//compute and redraw graph
    d3.tsv("data.tsv", function(error, json){
        
        if (error) {
            return console.error(error);
        }
        
        //console.log(json);
        
        data=[];
        for(var i in json){
            var o=json[i];
            //console.log(o);
            var d=[];
            d.push([2000,+o['2000']]);
            d.push([2005,+o['2005']]);
            d.push([2010,+o['2010']]);
            d.push([2015,+o['2015']]);
            data.push({'name':o.Sector,'offset_y':o.offset,'d':d});
        }
        //console.info(data);
        updateGraph();
    });

    console.info('d3.version',d3.version);
    
    width=$('div.container').width();
    vis = d3.select("div#graph1").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "vis");

    ttdiv = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 1e-6);
    
});

var t;

d3.select(window).on('resize', function(){  
    
    clearTimeout(t);
    t=setTimeout(function()
    {
        // all resizable graph should be updated here
        console.log('resizeEnd');
        updateGraph();
    },300);//update all graph
});
