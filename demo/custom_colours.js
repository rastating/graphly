$(function() {
    var custom_colours_data = {
        xLabel: 'Games',
        yLabel: 'Total Sales',
        groups: [
            {
                label: 'Games',
                values: [
                    {
                        label: 'Half Life',
                        value: 9300000,
                        color: '#636F57'
                    },
                    {
                        label: 'HL: Opposing Force',
                        value: 1100000,
                        color: '#78AB46'
                    },
                    {
                        label: 'HL: Blue Shift',
                        value: 800000,
                        color: '#66CD00'
                    },
                    {
                        label: 'Counter Strike',
                        value: 4200000,
                        color: '#7FFF00'
                    },
                    {
                        label: 'CS:CZ',
                        value: 2900000,
                        color: '#9CBA7F'
                    },
                    {
                        label: 'CS:S',
                        value: 2100000,
                        color: '#3CB371'
                    },
                    {
                        label: 'Half-Life 2',
                        value: 6500000,
                        color: '#43D58C'
                    },
                    {
                        label: 'HL2: Episode One',
                        value: 1400000,
                        color: '#808A87'
                    },
                    {
                        label: 'The Orange Box',
                        value: 3000000,
                        color: '#40E0D0'
                    }
                ]
            }
        ]
    };
    
    $('#custom-colours').graphly({ 'data' : custom_colours_data, 'width' : 960, 'height' : 400, removeBorders: true });
});