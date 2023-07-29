// Load the data from the CSV file
d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/data/gated_entries_overall.csv').then(data => {
    // Parse the date and convert gated_entries to number
    const parseTime = d3.timeParse('%Y-%m-%d');
    data.forEach(d => {
        d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
        d.gated_entries = +d.gated_entries;
    });

    // Set the dimensions and margins of the graph
    const margin = {top: 20, right: 75, bottom: 20, left: 75};
    const width = d3.select("svg").attr("width") - margin.left - margin.right;
    const height = d3.select("svg").attr("height") - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select('#overall')
                  .append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define the scales
    const x = d3.scaleTime()
                     .domain(d3.extent(data, d => d.firstDayOfWeek))
                     .range([0, width]);
    const y = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.gated_entries)])
                     .range([height, 0]);

    var tooltip = d3.select('#tooltip');

    const line = d3.line()
        .x(d => x(d.firstDayOfWeek))
        .y(d => y(d.gated_entries));

    // Add the scatterplot points
    /* svg.selectAll()
        .data(data.filter(d => d.firstDayOfWeek.getTime() >= new Date('2020-03-08').getTime() && d.firstDayOfWeek.getTime() < new Date('2020-03-15').getTime()))
        .enter()
        .append('circle')
        .attr("cx", d => x(d.firstDayOfWeek))
        .attr("cy", d => y(d.gated_entries))
        .attr("r", 6)
        .on("mouseover",function(d){
            tooltip.style("opacity",1)
                .style("left",(d.pageX)+"px")
                .style("top",(d.pageY-60)+"px")
                .html("COVID Shutdown Begins")
            ;
        })
        .on("mouseout",function(){
            tooltip.style("opacity",0)
            ;
        })
    ; */

    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line);

    // Add the X Axis
    svg.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
       .call(d3.axisLeft(y));

    const timeFormat = d3.timeFormat('%Y-%m-%d');
    //'2020-03-09' and 1991675
    const annotations = [
        {
            note: {
                label: 'COVID Shutdown Begins'
            },
            data: {firstDayOfWeek: '2020-03-09', gated_entries: 1991675},
            dy: 100,
            dx: 50
        }
    ];

    window.makeAnnotations = d3.annotation()
        .annotations(annotations)
        .type(d3.annotationCalloutElbow)
        .accessors({
            x: d => x(parseTime(d.firstDayOfWeek)),
            y: d => y(d.gated_entries)
        })
        .accessorsInverse({
            firstDayOfWeek: d => timeFormat(x.invert(d.x)),
            gated_entries: d => y.invert(d.y)
        })

    svg.append('g')
        .attr('class','annotation-test')
        .call(makeAnnotations)
    ;

    svg.selectAll('g.annotation-connector, g.annotation-note')
        .classed('hidden',true)
    ;
});
