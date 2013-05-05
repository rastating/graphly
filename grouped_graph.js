$(function() {
    var grouped_graph_data = {
        xLabel: 'GPU / Settings',
        yLabel: 'FPS',
        groups: [
            {
                label: 'Tessellation Disabled',
                values: [
                    {
                        label: 'nVidia GeForce GTX 680 2 GB SLi',
                        value: 296,
                        color: '#636F57'
                    },
                    {
                        label: 'nVidia GeForce GTX 690 4 GB',
                        value: 285,
                        color: '#78AB46'
                    },
                    {
                        label: 'AMD Radeon HD 7970 3 GB CrossFire',
                        value: 267,
                        color: '#66CD00'
                    },
                    {
                        label: 'Nvidia GeForce GTX 590 3 GB',
                        value: 248,
                        color: '#7FFF00'
                    },
                    {
                        label: 'AMD Radeon HD 6990 4 GB',
                        value: 231,
                        color: '#9CBA7F'
                    },
                    {
                        label: 'nVidia GeForce GTX 680 2 GB',
                        value: 207,
                        color: '#3CB371'
                    },
                    {
                        label: 'nVidia GeForce GTX 580 1.5 GB',
                        value: 193,
                        color: '#43D58C'
                    },
                    {
                        label: 'AMD Radeon HD 7970 3 GB',
                        value: 148,
                        color: '#808A87'
                    },
                    {
                        label: 'AMD Radeon HD 7950 3 GB',
                        value: 104,
                        color: '#40E0D0'
                    }
                ]
            },
            {
                label: 'Tessellation Enabled',
                values: [
                    {
                        label: 'nVidia GeForce GTX 680 2 GB SLi',
                        value: 245
                    },
                    {
                        label: 'nVidia GeForce GTX 690 4 GB',
                        value: 240
                    },
                    {
                        label: 'AMD Radeon HD 7970 3 GB CrossFire',
                        value: 223
                    },
                    {
                        label: 'Nvidia GeForce GTX 590 3 GB',
                        value: 198
                    },
                    {
                        label: 'AMD Radeon HD 6990 4 GB',
                        value: 171
                    },
                    {
                        label: 'nVidia GeForce GTX 680 2 GB',
                        value: 142
                    },
                    {
                        label: 'nVidia GeForce GTX 580 1.5 GB',
                        value: 141
                    },
                    {
                        label: 'AMD Radeon HD 7970 3 GB',
                        value: 123
                    },
                    {
                        label: 'AMD Radeon HD 7950 3 GB',
                        value: 87
                    }
                ]
            }
        ]
    }; 
    
    $('#grouped-graph').graphly({ 'data' : grouped_graph_data, 'showLabels' : true, 'width' : 960, 'height' : 400 });
});