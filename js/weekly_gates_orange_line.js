// Load the data from the CSV file
function initialChart(){
    d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/data/gated_entries_by_week_route.csv').then(data => {
        // Parse the date and convert gated_entries to number
        const parseTime = d3.timeParse('%Y-%m-%d');
        const timeFormat = d3.timeFormat('%Y-%m-%d');
        data = data.filter(d => d.route_short === 'Orange').map(d => {
            d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
            d.gated_entries = +d.gated_entries;
            return d;
        });

        // Set the dimensions and margins of the graph
        const margin = {top: 20, right: 75, bottom: 20, left: 75};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        const svg = d3.select('#orange')
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
        var tooltipWidth = 100;
        var tooltipHeight = 50;

        const line = d3.line()
            .x(d => x(d.firstDayOfWeek))
            .y(d => y(d.gated_entries));
    
        svg.append('path')
            .style("stroke","orange")
            .data([data])
            .attr('class', 'line')
            .attr('d', line);

        // Add the scatterplot points
        var points = svg.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", d => x(d.firstDayOfWeek))
            .attr("cy", d => y(d.gated_entries))
            .attr("r", 20)
            .attr('fill','transparent')
        ; 

        points.on('mouseover', function(event, d) {
            tooltip.style('visibility', 'visible');
            var xPosition = event.pageX - tooltipWidth / 2;
            var yPosition = event.pageY - tooltipHeight;
            tooltip.style('left', xPosition + 'px')
                .style('top', yPosition + 'px')
                .html('Beginning of Week: ' + timeFormat(d.firstDayOfWeek) + '<br>' + 'Gated Entries: ' + d3.format(',.2f')(d.gated_entries));
            })
            .on('mouseout', function() {
                tooltip.style('visibility', 'hidden');
        });

        // Add the X Axis
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append('g')
            .call(d3.axisLeft(y));

        const annotations = [
            {
                note: {
                    title: 'Mar 9, 2020',
                    label: 'COVID Shutdown Begins'
                },
                data: {firstDayOfWeek: '2020-03-09', gated_entries: 659755},
                dy: 100,
                dx: 50,
                subject: {
                    radius: 15
                }
            }, {
                note: {
                    title: 'Aug 22, 2022',
                    label: 'Month-long Line Shutdown Begins'
                },
                data: {firstDayOfWeek: '2022-08-29', gated_entries: 46514},
                dy: -30,
                dx: -50,
                subject: {
                    radius: 15
                }
            }, {
                note: {
                    title: 'Mar 28, 2022',
                    label: 'Garage Collapse at Government Center'
                },
                data: {firstDayOfWeek: '2022-03-28', gated_entries: 388382},
                dy: -100,
                dx: -30,
                subject: {
                    radius: 15
                }
            }, {//437218
                note: {
                    title: 'Jul 21, 2022',
                    label: 'Train Catches Fire Between Assembly and Wellington'
                },
                data: {firstDayOfWeek: '2022-07-18', gated_entries: 437218},
                dy: -50,
                dx: 50,
                subject: {
                    radius: 15
                }
            }
        ];
   
        window.makeAnnotations = d3.annotation()
            .annotations(annotations)
            .type(d3.annotationCalloutCircle)
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
};
