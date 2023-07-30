// Load the data from the CSV file
d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/data/gated_entries_overall.csv').then(data => {
    // Parse the date and convert gated_entries to number
    const parseTime = d3.timeParse('%Y-%m-%d');
    const timeFormat = d3.timeFormat('%Y-%m-%d');
    data.forEach(d => {
        d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
        d.gated_entries = +d.gated_entries;
    });

    // Set the dimensions and margins of the graph
    const margin = {top: 20, right: 75, bottom: 20, left: 75};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

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
    var tooltipWidth = 100;
    var tooltipHeight = 50;

    const line = d3.line()
        .x(d => x(d.firstDayOfWeek))
        .y(d => y(d.gated_entries));

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
        /*.on('mousemove', function(event, d) {
            var xPosition = event.pageX - tooltipWidth / 2;
            var yPosition = event.pageY - tooltipHeight - 10;
            tooltip.style('left', xPosition + 'px')
                .style('top', yPosition + 'px')
                .html('Date: ' + timeFormat(d.firstDayOfWeek) + '<br>' + 'Entries: ' + d.gated_entries);
        });*/

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

    //'2020-03-09' and 1991675
    const annotations = [
        {
            note: {
                title: 'Mar 9, 2020',
                label: 'COVID Shutdown Begins'
            },
            data: {firstDayOfWeek: '2020-03-09', gated_entries: 1991675},
            dy: 100,
            dx: 50,
            subject: {
                radius: 15
            }
        }, {
            note: {
                title: 'End of Dec 2022',
                label: 'Holiday Dip in Riders'
            },
            data: {firstDayOfWeek: '2022-12-26', gated_entries: 1022033},
            dy: 50,
            dx: 20,
            subject: {
                radius: 15
            }
        }, {
            note: {
                title: 'End of Dec 2021',
                label: 'Holiday Dip in Riders + Resurging Covid Wave'
            },
            data: {firstDayOfWeek: '2021-12-27', gated_entries: 842841},
            dy: 30,
            dx: 50,
            subject: {
                radius: 15
            }
        }, {
            note: {
                title: 'End of Dec 2020',
                label: 'Small Holiday Dip in Riders'
            },
            data: {firstDayOfWeek: '2020-12-28', gated_entries: 476489},
            dy: 15,
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
