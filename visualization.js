d3.csv("mock_stock_data.csv").then(function(data) {
    data.forEach(function(d) {
        d.date = new Date(d.date);
        d.value = +d.value;
    });

    const svg = d3.select("body").append("svg")
        .attr("width", 600)
        .attr("height", 600);

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
});
Create dynamic stock visualization using D3.js