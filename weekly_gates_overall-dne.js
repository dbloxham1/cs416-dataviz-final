d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/data/gated_entries_overall.csv').then(data => {

    // Parse the date and time
    const parseTime = d3.timeParse('%Y-%m-%d');
    data.forEach(d => {
        d.service_week = parseTime(d.firstDayOfWeek);
        d.gated_entries = d.gated_entries;
    });

    // Set the dimensions and margins of the graph
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const valueline = d3.line()
        .x(d => x(d.service_week))
        .y(d => y(d.gated_entries));

    // Append the svg object to the body of the page
    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.service_week));
    y.domain([0, d3.max(data, d => d.gated_entries)]);

    // Add the valueline path.
    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline);

    // Add the X Axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y));

}).catch(e => {
    console.log(e);
});
