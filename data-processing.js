d3.csv("mock_stock_data.csv").then(function(data) {
    // Parse the data
    data.forEach(function(d) {
        d.date = new Date(d.date);
        d.value = +d.value;
    });

    // Filter data by stock name and date range
    function filterData(stockName, startDate, endDate) {
        return data.filter(d => 
            d.stockName === stockName && 
            d.date >= startDate && 
            d.date <= endDate
        );
    }

    // Example usage of filterData function
    const filteredData = filterData("AAPL", new Date("2022-01-01"), new Date("2022-12-31"));
    console.log(filteredData);
});
