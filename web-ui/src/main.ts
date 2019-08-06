import d3 = require("d3");

const data: any = {
    "name": "Max",
    "value": 100,
    "children": [
        {
            "name" : "Sylvia",
            "value":  75,
            "children": [
                {"name" : "Craig", "value": 25},
                {"name" : "Robin", "value": 25},
                {"name" : "Anna", "value": 25}
            ]
        },
        {
            "name": "David",
            "value": 75,
            "children": [
                {"name": "Jeff", "value": 25},
                {"name": "Buffy", "value": 25}
            ]
        },
        {
            "name" : "Mr X",
            "value": 75
        }

    ]
};

const svg = d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", 500);
svg.data(data);

const treemap = d3.tree()
    .size([500, 500]);
let nodes = d3.hierarchy(data, function(d) {
        return d.children;
    });

nodes = treemap(nodes);
console.log(treemap);
