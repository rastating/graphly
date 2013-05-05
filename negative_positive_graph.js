$(function() {
    var negative_positive_data = {
        xLabel: 'Month',
        yLabel: 'Temperature (centigrade)',
        groups: [
            {
                label: 'Month',
                values: [
                    {
                        label: 'Jan',
                        value: -7
                    },
                    {
                        label: 'Feb',
                        value: -4
                    },
                    {
                        label: 'Mar',
                        value: 1
                    },
                    {
                        label: 'Apr',
                        value: 6
                    },
                    {
                        label: 'May',
                        value: 11
                    },
                    {
                        label: 'Jun',
                        value: 13
                    },
                    {
                        label: 'Jul',
                        value: 16
                    },
                    {
                        label: 'Aug',
                        value: 15
                    },
                    {
                        label: 'Sep',
                        value: 11
                    }
                    ,
                    {
                        label: 'Oct',
                        value: 5
                    },
                    {
                        label: 'Nov',
                        value: 1
                    },
                    {
                        label: 'Dec',
                        value: -3
                    }
                ]
            }
        ]
    };
    
    $('#negative-positive-graph').graphly({ 'data' : negative_positive_data, 'width' : 960, 'height' : 400 });
});