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
  var width = 43;
  var height = 43;
  var svg = d3.select("body")
              .select("#d" + first.toString())
              .append("svg")
              .attr("id", "d"+first + "-" + second)
              .attr("width", width)
              .attr("height", height)
  svg.append("rect")
     .classed("student",true)
     .attr("x",0)
     .attr("y",0)
     .attr("width",43)
     .attr("height",43)
     .attr("fill","none")
  svg.append("text")
     .attr("x",0)
     .attr("y",25)
     .text("student"+first)
     .style("font-size","10px")
}
//////////////////////////////////////
var correlation=function(data,first,second)
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
  var mx=d3.mean(quizData, function(d){return d.x;})
  var my=d3.mean(quizData,function(d){return d.y;})
  var top=quizData.map(function(d,i)
  {
    return (quizData[i].x-mx)*(quizData[i].y-my);
  })
  var topSum=d3.sum(top);
  var sx=d3.deviation(quizData,function(d){return d.x});
  var sy=d3.deviation(quizData,function(d){return d.y});
  var r=(1/(quizData.length-1))*(topSum/(sx*sy))
  return r;
}
///////////////////////////////////////
var drawColor=function(r,first,second)
{
  var width = 43;
  var height = 43;
  var svg = d3.select("body")
              .select("#d" + first.toString())
              .append("svg")
              .attr("id","d"+first+"-"+second)
              .attr("width", width)
              .attr("height", height)
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

  var width = 43;
  var height = 43;

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
     .attr("r", 1.3)
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
        drawColor(correlation(data,i,j),i,j);
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
      {drawSVG(data,d.x,d.y)
      d3.select("#d"+d.x+"-"+d.x)
        .select(".student")
        .attr("x",0)
        .attr("y",0)
        .attr("width",43)
        .attr("height",43)
        .attr("fill","#329c98")
      console.log(d)
      d3.select("#d"+d.y+"-"+d.y)
        .select(".student")
        .attr("x",0)
        .attr("y",0)
        .attr("width",43)
        .attr("height",43)
        .attr("fill","#329c98")}
    })
    .on("mouseout",function(){
      d3.selectAll("g").remove()
      d3.selectAll(".student")
        .attr("fill","none")
    })
},function(err){console.log(err)})
var color=[{color:"#ce94dc",text:"0<=r<0.3 or -0.3<r<=0"},{color:"#7477bc",text:"0.3<=r<0.6 or -0.6<r<=-0.3"},{color:"#3d314e",text:"0.6<=r<=1 or -1<=r<=-0.6 "}]
var svg=d3.select("body")
          .append("svg")
          .attr("width",200)
          .attr("height",300)
          .attr("id","legend")

svg.selectAll("rect")
   .data(color)
   .enter()
   .append("rect")
   .attr("x",20)
   .attr("y",function(d,i){
     return 20+i*40
   })
   .attr("width",30)
   .attr("height",15)
   .attr("fill",function(d){return d.color})
svg.selectAll("text")
   .data(color)
   .enter()
   .append("text")
   .attr("x",20)
   .attr("y",function(d,i){return 50+i*40})
   .text(function(d){return d.text})
