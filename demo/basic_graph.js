$(function() {
    var basic_graph_data = {
        xLabel: 'Month',
        yLabel: 'Closing Price',
        groups: [
            {
                label: 'Months',
                values: [
                    {
                        label: 'Jan',
                        value: 120.20
                    },
                    {
                        label: 'Feb',
                        value: 110.73
                    },
                    {
                        label: 'Mar',
                        value: 115.04
                    },
                    {
                        label: 'Apr',
                        value: 80.14
                    },
                    {
                        label: 'May',
                        value: 63.44
                    },
                    {
                        label: 'Jun',
                        value: 68.49
                    },
                    {
                        label: 'Jul',
                        value: 56.85
                    },
                    {
                        label: 'Aug',
                        value: 59.72
                    },
                    {
                        label: 'Sep',
                        value: 54.44
                    },
                    {
                        label: 'Oct',
                        value: 79.24
                    },
                    {
                        label: 'Nov',
                        value: 81.71
                    },
                    {
                        label: 'Dec',
                        value: 92.59
                    }
                ]
            }
        ]
    };
    
    $('#basic-graph').graphly({ 'data' : basic_graph_data });
});