async function init() {
    const margin = {top: 50, left: 50, right: 50, bottom: 50},
        width = d3.select("svg").attr("width") - margin.left - margin.right,
        height = d3.select("svg").attr("height") - margin.top - margin.bottom
    ;

    const parseTime = d3.timeParse('%Y-%m-%d');
    function row(d) {
        d.service_week = parseTime(d['firstDayOfWeek']);
        d.gated_entries = +d['gated_entries'];
        return d;
    }
    const data = await d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/gated_entries_overall.csv', row)
    ;
    const x = d3.scaleTime().range([0,width]);
    const y = d3.scaleLinear().range([height,0]);

    x.domain(d3.extent(data, d => d.service_week));
    y.domain([0, d3.max(data, d => d.gated_entries)]);

    var g = d3.select('#overall')
        .append('path')
        .attr("transform", "translate"+margin.top+","+margin.left+")")
        .selectAll()
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return x(d.service_week);
        })
        .attr("cy", function(d) {
            return y(d.gated_entries);
        })
        .attr("r", 5)
        ;
    var yaxis = d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin.top+","+margin.left+")")
        .call(d3.axisLeft(y))
    ;
    var xaxis = d3.select("svg")
        .append("g")
        .attr("transform","translate("+margin.left+","+(height+margin.top)+")")
        .call(d3.axisBottom(x))
    ;
}