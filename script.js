var dataP = d3.json("classData.json")

var groupArray = []
var addGroup = function() {
  for (var i = 0; i < 23; i++) {
    groupArray.push("d" + i.toString());
  }
}
addGroup();

d3.select("body")
  .selectAll("div")
  .data(groupArray)
  .enter()
  .append("div")
  .attr("id", function(d) {return d;})
/////////////////////////////////
var drawEmpty = function(first, second){
  var width = 50;
  var height = 50;
  var svg = d3.select("body")
              .select("#d" + first.toString())
              .append("svg")
              .attr("id", "d"+first + "-" + second)
              .attr("width", width)
              .attr("height", height)
  svg.append("text")
     .attr("x",0)
     .attr("y",30)
     .text("student "+first)
     .style("font-size","12px")
}
//////////////////////////////////////
var drawColor=function(data,first,second)
{
  var quizData = [];
  var addData = function(data) {
    for (var i = 0; i < 38; i++) {
      quizData.push ({
      x: data[first].quizes[i].grade,
      y: data[second].quizes[i].grade});
    }
  }
  addData(data);

  var width = 50;
  var height = 50;
  var svg = d3.select("body")
              .select("#d" + first.toString())
              .append("svg")
              .attr("id","d"+first+"-"+second)
              .attr("width", width)
              .attr("height", height)

var mx=d3.mean(quizData, function(d){return d.x;})
var my=d3.mean(quizData,function(d){return d.y;})
var top=quizData.map(function(d,i)
{
  return (quizData[i].x-mx)*(quizData[i].y-my);
})
var topSum=d3.sum(top);
var sx=d3.deviation(quizData,function(d){return d.x});
var sy=d3.deviation(quizData,function(d){return d.y});
var r=(1/(quizData.length-1))*(topSum/sx*sy)
if(Math.abs(r)<=0.3)
{
  svg.append("rect")
     .attr("x",0)
     .attr("y",0)
     .attr("width",width)
     .attr("height",height)
     .attr("fill","#ce94dc")
}
else if(Math.abs(r)<=0.6)
{
  svg.append("rect")
     .attr("x",0)
     .attr("y",0)
     .attr("width",width)
     .attr("height",height)
     .attr("fill","#7477bc")
}
else
{
  svg.append("rect")
     .attr("x",0)
     .attr("y",0)
     .attr("width",width)
     .attr("height",height)
     .attr("fill","#3d314e")
}
}
//////////////////////////////////////////////
var drawSVG = function(data, first, second) {
  var quizData = [];
  var addData = function(data) {
    for (var i = 0; i < 38; i++) {
      quizData.push ({
      x: data[first].quizes[i].grade,
      y: data[second].quizes[i].grade});
    }
  }
  addData(data);

  var width = 50;
  var height = 50;

  var svg = d3.select("#d"+first+"-"+second)
  var xScale = d3.scaleLinear()
                 .domain([0, 10])
                 .range([5, width - 5])

  var yScale = d3.scaleLinear()
                 .domain([0, 10])
                 .range([5, height - 5])

  svg.append("g")
     .selectAll("circle")
     .data(quizData)
     .enter()
     .append("circle")
     .attr("cx", function(d) {return xScale(d.x);})
     .attr("cy", function(d) {return yScale(d.y);})
     .attr("r", 1.5)
     .attr("fill","#f8f5fd")
     .style("pointer-events","none")

}
/////////////////////////
dataP.then(function(data) {
  for (var i = 0; i < 23; i++) {
    for (var j = 0; j <23; j++) {
      if (i == j) {
        drawEmpty(i, j);
      }
      else {
        drawColor(data,i,j);
      }
    }
  }
},
function(err) {
  console.log(err);
})
var pair=[]
for (var i = 0; i < 23; i++) {
  for (var j = 0; j <23; j++) {
    pair.push({x:i,y:j})
  }
}
dataP.then(function(data){
  d3.selectAll("svg")
    .data(pair)
    .on("mouseover",function(d){
      if(d.x!=d.y)
      {drawSVG(data,d.x,d.y)}
    })
    .on("mouseout",function(){
      d3.selectAll("g").remove()
    })
},function(err){console.log(err)})
