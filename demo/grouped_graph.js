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
                    },
                    {
                        label: 'nVidia GeForce GTX 690 4 GB',
                        value: 285,
                    },
                    {
                        label: 'AMD Radeon HD 7970 3 GB CrossFire',
                        value: 267,
                    },
                    {
                        label: 'Nvidia GeForce GTX 590 3 GB',
                        value: 248,
                    },
                    {
                        label: 'AMD Radeon HD 6990 4 GB',
                        value: 231,
                    },
                    {
                        label: 'nVidia GeForce GTX 680 2 GB',
                        value: 207,
                    },
                    {
                        label: 'nVidia GeForce GTX 580 1.5 GB',
                        value: 193,
                    },
                    {
                        label: 'AMD Radeon HD 7970 3 GB',
                        value: 148,
                    },
                    {
                        label: 'AMD Radeon HD 7950 3 GB',
                        value: 104,
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