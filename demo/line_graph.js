$(function() {
    var line_graph_data = {
        xLabel: 'Month',
        yLabel: 'Closing Price',
        points: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'        
        ],
        groups: [
            {
                label: 'Apple',
                values: [
                    456.48,
                    542.44,
                    599.55,
                    583.98,
                    577.73,
                    584.00,
                    610.76,
                    665.24,
                    667.10,
                    595.32,
                    585.28,
                    532.17
                ]
            },
            {
                label: 'Google',
                values: [
                    580.11,
                    618.25,
                    641.24,
                    604.85,
                    580.86,
                    580.07,
                    632.97,
                    685.09,
                    754.50,
                    680.30,
                    698.37,
                    707.38
                ]
            },
            {
                label: 'Microsoft',
                values: [
                    29.53,
                    31.74,
                    32.26,
                    32.02,
                    29.19,
                    30.59,
                    29.47,
                    30.82,
                    29.76,
                    28.54,
                    26.62,
                    26.71
                ]
            },
            {
                label: 'Netflix',
                values: [
                    120.20,
                    110.73,
                    115.04,
                    80.14,
                    63.44,
                    68.49,
                    56.85,
                    59.72,
                    54.44,
                    79.24,
                    81.71,
                    92.59
                ]
            },
        ]
    };
    
    $('#line-graph').graphly({ 'data': line_graph_data, 'type': 'line', 'width': 900, 'height': 400 });
});