// Load the data from the CSV file
d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/data/gated_entries_by_week_route.csv').then(data => {
    // Parse the date and convert gated_entries to number
    const parseTime = d3.timeParse('%Y-%m-%d');
    data = data.filter(d => d.route_short === 'Green').map(d => {
        d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
        d.gated_entries = +d.gated_entries;
        return d;
    });

    glxPoint = data.filter(d => d.firstDayOfWeek === '2022-03-21').map(d => {
        d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
        d.gated_entries = +d.gated_entries;
        return d;
    });

    // Set the dimensions and margins of the graph
    const margin = {top: 20, right: 75, bottom: 20, left: 75};
    const width = d3.select("svg").attr("width") - margin.left - margin.right;
    const height = d3.select("svg").attr("height") - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select('#green')
                  .append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define the scales
    const xScale = d3.scaleTime()
                     .domain(d3.extent(data, d => d.firstDayOfWeek))
                     .range([0, width]);
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.gated_entries)])
                     .range([height, 0]);

    const line = d3.line()
        .x(d => xScale(d.firstDayOfWeek))
        .y(d => yScale(d.gated_entries));

    // Add the scatterplot points
    
    svg.append('path')
        .style("stroke","green")
        .data([data])
        .attr('class', 'line')
        .attr('d', line);

    // Add the X Axis
    svg.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(xScale));

    // Add the Y Axis
    svg.append('g')
       .call(d3.axisLeft(yScale));

    //Plot individual points
    svg.append("svg")
        .data(glxPoint)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.service_week))
        .attr("cy", d => y(d.gated_entries))
        .attr("r", 5)
    ;
});
