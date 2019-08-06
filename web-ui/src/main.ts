import d3 = require("d3");

var canvas = d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", 500);

d3.json("myDemo.json")
.then(function(data){
    var treemap = d3.tree()
        .size([500, 500])
    
    var nodes = d3.hierarchy(data, function(d){
        return d.children;
    })
    nodes = treemap(nodes)
    console.log(treemap);
})
.catch(function(error){
    console.log(error);
});
