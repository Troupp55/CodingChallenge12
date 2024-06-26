d3.csv("mock_stock_data.csv").then(function(data) {
    data.forEach(function(d) {
        d.date = new Date(d.date);
        d.value = +d.value;
    });

    const svg = d3.select("svg");
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    x.domain(d3.extent(data, d => d.date));
    y.domain(d3.extent(data, d => d.value));

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y));

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    g.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Date: ${d.date}<br/>Value: ${d.value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Dropdown for filtering by stock name
    const stockNames = Array.from(new Set(data.map(d => d.stockName)));
    const dropdown = d3.select("body").append("select")
        .on("change", function() {
            const selectedStock = d3.select(this).property("value");
            const filteredData = data.filter(d => d.stockName === selectedStock);
            updateChart(filteredData);
        });

    dropdown.selectAll("option")
        .data(stockNames)
        .enter().append("option")
        .text(d => d);

    function updateChart(filteredData) {
        x.domain(d3.extent(filteredData, d => d.date));
        y.domain(d3.extent(filteredData, d => d.value));

        g.select(".line")
            .datum(filteredData)
            .transition()
            .duration(750)
            .attr("d", line);

        g.selectAll("circle")
            .data(filteredData)
            .transition()
            .duration(750)
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value));
    }
});
