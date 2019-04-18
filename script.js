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

var drawEmpty = function(first, second){
  var width = 50;
  var height = 50;

  // var margins = {
  //   left: 2,
  //   right: 2,
  //   top: 2,
  //   bottom: 2
  // }
  //
  // var width = svg_width + margins.left + margins.right;
  // var height = svg_height + margins.top + margins.bottom;

  var svg = d3.select("body")
              .select("#d" + first.toString())
              .append("svg")
              .attr("id", first + "-" + second)
              .attr("width", width)
              .attr("height", height)
}

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
  console.log(quizData);

  var width = 50;
  var height = 50;

  // var margins = {
  //   left: 2,
  //   right: 2,
  //   top: 2,
  //   bottom: 2
  // }
  //
  // var width = svg_width + margins.left + margins.right;
  // var height = svg_height + margins.top + margins.bottom;

  var svg = d3.select("body")
              .select("#d" + first.toString())
              .append("svg")
              .attr("id", first + "-" + second)
              .attr("width", width)
              .attr("height", height)

  var xScale = d3.scaleLinear()
                 .domain([0, 10])
                 .range([5, width - 5])

  var yScale = d3.scaleLinear()
                 .domain([0, 10])
                 .range([5, height - 5])

  svg.selectAll("circle")
     .data(quizData)
     .enter()
     .append("circle")
     .attr("cx", function(d) {return xScale(d.x);})
     .attr("cy", function(d) {return yScale(d.y);})
     .attr("r", 1.5)

}




dataP.then(function(data) {
  for (var i = 0; i < 23; i++) {
    for (var j = 0; j <23; j++) {
      if (i == j) {
        drawEmpty(i, j);
      }
      else {
        drawSVG(data, i, j);
      }
    }
  }

},
function(err) {
  console.log(err);
})
