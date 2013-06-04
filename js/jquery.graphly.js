// Copyright (C) 2013 rastating
//
// Version 0.3.4
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.

(function($){
    $.fn.graphly = function(options) {  
        
        var settings = $.extend({
            'data'          : null,
            'type'          : 'bar',
            'paddingTop'    : 1,
            'paddingLeft'   : 1,
            'paddingBottom' : 1,
            'paddingRight'  : 1,
            'showLabels'    : true,
            'showLegend'    : true,
            'width'         : null,
            'height'        : null,
            'theme'         : 'default',
            'removeBorders' : false,
            'customTheme'   : null
        }, options);
        
        var globals = {
            'width'             : 0,
            'height'            : 0,
            'paddingTop'        : settings.paddingTop,
            'paddingLeft'       : settings.paddingLeft,
            'paddingBottom'     : settings.paddingBottom,
            'paddingRight'      : settings.paddingRight,
            'barCount'          : 0,
            'largestValue'      : 0,
            'smallestValue'     : 0,
            'largestLabelWidth' : 0,
            'colors'            : new Array(),
            'borderColors'      : new Array(),
            'top'               : 0,
            'left'              : 0,
            'bottom'            : 0,
            'right'             : 0,
            'decimalCount'      : 0
        };
        
        var methods = {
            initialize : function(canvas, ctx) {
                var barCount = 0;
                var largestValue = null;
                var smallestValue = null;
                var largestLabel = null;
                var decimalCount = null;
                
                // If we're using a line graph and the default theme, switch to a
                // slightly different version of the default theme which is more
                // suited to line graphs due to the possibility of overlapping.
                if (settings.type == 'line' && settings.theme == 'default') {
                    settings.theme = 'default-line-graph';   
                }
                
                // If a custom theme was specified, set it as the theme to use
                // otherwise load the theme by name.
                if (settings.customTheme == null) {
                    methods.loadTheme(settings.theme);
                }
                else {
                   $.each(settings.customTheme.colors, function(i, color) {
                        globals.colors[i] = color.fill; 
                        globals.borderColors[i] = color.stroke;
                    });
                }

                // Cache the dimensions of the current canvas.
                globals.width = settings.width == null ? $(canvas).width() : settings.width;
                globals.height = settings.height == null ? $(canvas).height() : settings.height;
                
                // Setup a default padding of 15 pixels.
                globals.paddingLeft = settings.paddingLeft < 15 ? 15 : settings.paddingLeft;
                globals.paddingTop = settings.paddingTop < 15 ? 15 : settings.paddingTop;
                globals.paddingRight = settings.paddingRight < 15 ? 15 : settings.paddingRight;
                globals.paddingBottom = settings.paddingBottom < 15 ? 15 : settings.paddingBottom;
                    
                $.each(settings.data.groups, function(i, group) {
                    // Calculate the dimensions of the current label and update
                    // the largest label width, if it's a line graph and required.
                    if (settings.type == 'line') {
                        var currentLabelWidth = ctx.measureText(group.label).width;
                        if (largestLabel == null || largestLabel < currentLabelWidth) {
                            largestLabel = currentLabelWidth;   
                        }
                    }
                    
                    $.each(group.values, function(i, entity) {
                        var value = settings.type == 'bar' ? entity.value : entity;
                        
                        // Update the largest value, if needed.
                        if (largestValue == null || largestValue < value) {
                            largestValue = value;   
                        }
                        
                        // Update the smallest value, if needed.
                        if (smallestValue == null || smallestValue > value) {
                            smallestValue = value;   
                        }
                        
                        // Update the decimal count value, if needed.
                        var currentDecimalPlaces = methods.getDecimalPlaces(value);
                        if (decimalCount == null || decimalCount < currentDecimalPlaces) {
                            decimalCount = currentDecimalPlaces;
                        }
                        
                        // Calculate the dimensions of the current label and update
                        // the largest label width, if needed.
                        if (settings.type == 'bar') {
                            var currentLabelWidth = ctx.measureText(entity.label).width;
                            if (largestLabel == null || largestLabel < currentLabelWidth) {
                                largestLabel = currentLabelWidth;   
                            }
                        }
                        
                        // If a custom colour has been specified, copy it into
                        // the copy of __graphly_bar_colors stored in globals.
                        if (entity.color != undefined) {
                            globals.colors[i] = entity.color;   
                        }
                        
                        // Increment the bar count.
                        barCount += 1;
                    });
                });                
                
                // Save the calculated values into the globals array.
                globals.barCount = barCount;
                globals.largestValue = largestValue;
                globals.smallestValue = smallestValue;
                globals.largestLabelWidth = largestLabel;
                globals.decimalCount = decimalCount;
            },
            loadTheme : function(themeName) {                
                $.each(__graphly_themes.themes, function(i, theme) {
                    if (theme.name == themeName) {
                        $.each(theme.colors, function(i, color) {
                            globals.colors[i] = color.fill; 
                            globals.borderColors[i] = color.stroke;
                        });
                        
                        return false;
                    }
                });
            },
            getFillColor : function(index) {
                if (index >= globals.colors.length) {
                    return '#9ed162';
                }
                else {
                    return globals.colors[index];
                }
            },
            getStrokeColor: function(index) {
                if (index >= globals.borderColors.length) {
                    return '#7ea74e';   
                }
                else {
                    return globals.borderColors[index];   
                }
            },
            drawVerticalLabel : function(ctx, x, y) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(270 * Math.PI / 180);
                ctx.translate(-x, -y);
                ctx.fillText(settings.data.yLabel, x, y);
                ctx.restore();
            },
            drawLegend : function(ctx) {
                var x = globals.width - globals.paddingRight + 15;
                var y = globals.paddingTop + 5;
                var offset = y;
                var labels = new Array();
                
                // Loop through the groups to get a distinct list of labels.
                $.each(settings.data.groups, function(i, group) {
                    if (settings.type == 'bar') {
                        $.each(group.values, function(i, entity) {
                            if ($.inArray(entity.label, labels) == -1) {
                                labels[labels.length] = entity.label;   
                            }
                        });
                    }
                    else {
                        if ($.inArray(group.label, labels) == -1) {
                            labels[labels.length] = group.label;   
                        }
                    }
                });
                
                ctx.save();
                ctx.font = "bold 14px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                ctx.fillText('Legend', x, offset);
                ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                
                // Draw each label and a small rectangle with a matching colour.
                $.each(labels, function(i, label) {
                    offset += 16;
                    ctx.beginPath();
                    ctx.rect(x, offset, 11, 11);
                    ctx.fillStyle = methods.getFillColor(i);
                    ctx.fill();
                    ctx.closePath();
                    ctx.textBaseline = 'top';
                    ctx.fillText(label, x + 13, offset - 1);
                });
                
                ctx.restore();
            },
            drawValueLabels : function(ctx) {
                var totalSteps = (globals.smallestValue * -1) + globals.largestValue;
                var chartHeight = globals.bottom - globals.top;
                var labelGap = chartHeight / 10;
                var largestLabel = null;
                var labels = new Array();
                
                ctx.save();
                ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'right';
                ctx.strokeStyle = "#CCCCCC";
                ctx.lineWidth = 1;
                
                // Calculate the label values and dimensions.
                for (var i = 0; i <= 10; i++) {
                    var value = i < 10 ? (totalSteps - (totalSteps * ((i * 10) / 100))) - (globals.smallestValue * -1) : globals.smallestValue;
                    var dimensions = ctx.measureText(methods.roundToFixed(value, globals.decimalCount));
                    if (largestLabel == null || largestLabel < dimensions.width) {
                        largestLabel = dimensions.width;
                    }
                    
                    labels[i] = methods.roundToFixed(value, globals.decimalCount);
                }
                
                // Increment the left margin by the largest label width.
                globals.left += largestLabel;
                
                // Draw the labels and the horizontal markers.
                $.each(labels, function(i, label) {
                    ctx.fillText(label, globals.left, globals.top + (i * labelGap));
                    ctx.beginPath();
                    ctx.moveTo(globals.left + 5, Math.round(globals.top + (i * labelGap)) + 0.5);
                    ctx.lineTo(globals.right, Math.round(globals.top + (i * labelGap)) + 0.5);
                    ctx.stroke();
                    ctx.closePath();
                });
                
                ctx.restore();
            },
            drawBars : function(ctx) {
                ctx.save();
                ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                globals.left += 5;
                
                var x = globals.left;
                var chartWidth = globals.right - globals.left;
                var groupSpacing = 15;
                var barWidth = (chartWidth - (groupSpacing * (settings.data.groups.length + 1))) / globals.barCount;
                var totalSteps = (globals.smallestValue * -1) + globals.largestValue;
                var stepHeight = (globals.bottom - globals.top) / totalSteps;
                var zeroPoint = globals.bottom - ((globals.smallestValue * -1) * stepHeight);
                
                // Reduce the fill width of the bar if we are using borders
                if (!settings.removeBorders) {
                    barWidth -= 9 // 4 pixels of border space + 5 for bar spacing
                }
                
                $.each(settings.data.groups, function(i, group) {
                    x += groupSpacing;
                    
                    $.each(group.values, function(i, entity) {
                        // Draw the bar
                        var barHeight = (entity.value * stepHeight) * -1;
                        if (!settings.removeBorders) {
                            barHeight += 2;
                        }
                        
                        ctx.beginPath();
                        ctx.rect(x, zeroPoint, barWidth, barHeight);
                        ctx.fillStyle = methods.getFillColor(i);
                        ctx.fill();
                        
                        if (!settings.removeBorders) {
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = methods.getStrokeColor(i);
                            ctx.stroke();
                        }
                        
                        ctx.closePath();
                        
                        // Increment the X point and draw a label if the graph
                        // isn't displaying multiple groups.
                        var distance = !settings.removeBorders ? barWidth + 9 : barWidth;
                        x += distance;
                        
                        if (settings.data.groups.length == 1) {
                            var labelX = !settings.removeBorders ? (x - 4) - (distance / 2) : (x - (barWidth / 2));
                            ctx.textAlign = "center";
                            ctx.fillStyle = "#000000";
                            ctx.fillText(entity.label, labelX, globals.bottom + 15);
                        }
                    });
                    
                    // If this is a grouped graph, we need to draw the group label.
                    if (settings.data.groups.length > 1) {
                        ctx.textAlign = 'center';
                        ctx.fillStyle = "black";
                        ctx.fillText(group.label, (x - ((group.values.length / 2) * (!settings.removeBorders ? barWidth + 9 : barWidth))) - (!settings.removeBorders ? 5 : 0), globals.bottom + 15,  globals.bottom + 15);
                    }
                });
                
                ctx.restore();
            },
            drawAxis : function(ctx) {
                var totalSteps = (globals.smallestValue * -1) + globals.largestValue;
                var stepHeight = (globals.bottom - globals.top) / totalSteps;
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
                ctx.lindWidth = 1;
                ctx.moveTo(globals.left + 0.5, globals.top);
                ctx.lineTo(globals.left + 0.5, globals.bottom + 0.5);
                ctx.lineTo(globals.right, globals.bottom + 0.5);
                ctx.stroke();
                ctx.closePath();
                
                if (globals.smallestValue < 0) {
                    var zeroPoint = globals.bottom - ((globals.smallestValue * -1) * stepHeight);
                    ctx.beginPath();
                    ctx.strokeStyle = "#343434";
                    ctx.lineWidth = 2;
                    ctx.moveTo(globals.left, zeroPoint + 0.5);
                    ctx.lineTo(globals.right, zeroPoint + 0.5);
                    ctx.stroke();
                    ctx.closePath();
                }
            },
            getDecimalPlaces : function(number) {
                var match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                return !match ? 0 : Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
            },
            roundToFixed : function(number, decimalPlaces) {
                var rounder = Math.pow(10, decimalPlaces);
                return (Math.round(number * rounder) / rounder).toFixed(decimalPlaces);
            },
            drawLines : function(ctx) {
                ctx.save();
                ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                globals.left += 5;

                var chartWidth = globals.right - globals.left - globals.paddingRight;
                var plotSpacing = chartWidth / settings.data.points.length;
                var totalSteps = (globals.smallestValue * -1) + globals.largestValue;
                var stepHeight = (globals.bottom - globals.top) / totalSteps;
                var zeroPoint = globals.bottom - ((globals.smallestValue * -1) * stepHeight);
                var x = globals.left;
                var drawnLabels = false;
                var rectanglePoints = new Array();
                
                $.each(settings.data.groups, function(i, group) {
                    var previousPointY = zeroPoint;
                    var previousPointX = globals.left + (plotSpacing / 2);
                    var groupFillColor = methods.getFillColor(i);
                    var groupStrokeColor = methods.getStrokeColor(i);
                    x = globals.left + (plotSpacing / 2);
                    
                    $.each(group.values, function(i, value) {
                        var lineHeight = globals.bottom - (value * stepHeight);;
                        ctx.beginPath();
                        
                        ctx.strokeStyle = groupFillColor;
                        ctx.lineWidth = 3;
                        if (i > 0) {
                            ctx.moveTo(previousPointX, previousPointY);
                            ctx.lineTo(x + 0.5, lineHeight);
                        }
                        
                        previousPointX = x + 0.5;
                        previousPointY = lineHeight;
                        ctx.stroke();
                        rectanglePoints[i] = new Array(previousPointX, previousPointY);
                        ctx.closePath();
                        
                        // Increment the X point and draw a label if required.
                        var distance = plotSpacing + 9;
                        x += distance;
                        if (!drawnLabels) {
                            // The plotSpacing / 2 is removed in the below variable as 
                            // we X is placed at the center point of each label in line graphs.
                            var labelX = (x - 4) - (distance / 2) - (plotSpacing / 2);
                            ctx.textAlign = "center";
                            ctx.fillStyle = "#000000";
                            ctx.fillText(settings.data.points[i], labelX, globals.bottom + 15);
                        }
                    });
                    
                    $.each(rectanglePoints, function(i, point) {
                        ctx.rect(point[0] - 5, point[1] - 5, 10, 10);
                        ctx.fillStyle = groupStrokeColor;
                        ctx.fill();
                    });
                    
                    drawnLabels = true;
                    x = globals.left + (plotSpacing / 2);
                });
                
                ctx.restore();
            }
        };
        
        return this.each(function() {
            var c = $(this)[0];
            var ctx = c.getContext("2d");
            methods.initialize(this, ctx);
            
            // If we are showing a legend, we need to add additional padding to the right
            // to ensure we have enough room. To Determine how much we need we'll need to
            // check the largest label width and add a few extra pixels to ensure spacing
            // between the graph and the legend itself.
            if (settings.showLegend && settings.data.groups.length > 1) {
                globals.paddingRight += globals.largestLabelWidth + 55;
                methods.drawLegend(ctx);
            }
            
            // Store the boundaries of the chart and other tidbits for quick access
            globals.top = globals.paddingTop;
            globals.bottom = globals.height - globals.paddingBottom;
            globals.left = globals.paddingLeft;
            globals.right = globals.width - globals.paddingRight;
            var chartHeight = globals.bottom - globals.top;
            
            // Draw the labels if the displayLabels flag is set to true.
            if (settings.showLabels) {
                // Reduce the bottom point of the graph by 35 pixels and draw the horizontal label.
                globals.bottom -= 35;   
                ctx.font = "bold 14px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                ctx.textAlign = 'center';
                ctx.fillText(settings.data.xLabel, (globals.right + globals.left) / 2, globals.bottom + 45);
                
                // Draw the vertical label and increment the left point by 14 pixels.
                methods.drawVerticalLabel(ctx, globals.paddingLeft, globals.top + (chartHeight / 2));
                globals.left += 14;                
            }
            
            // Draw the value labels, starting from zero if the lowest value is equal to or
            // more than zero, across ten points along the y-axis.
            globals.smallestValue = globals.smallestValue > 0 ? 0 : globals.smallestValue;
            methods.drawValueLabels(ctx);
            
            // Draw the bars or lines and the graph axis.
            if (settings.type == "bar") {
                methods.drawBars(ctx);   
            }
            else {
                methods.drawLines(ctx);   
            }
            
            methods.drawAxis(ctx);
        });
    };
    
    // Forgive me for polluting the global sea :(
    var __graphly_themes = 
        {
            themes: [
                {
                    name: 'default',
                    colors: [
                        {
                            fill: '#d32226',
                            stroke: '#a81b1e'
                        },
                        {
                            fill: '#de585b',
                            stroke: '#b14648'
                        },
                        {
                            fill: '#e57b7e',
                            stroke: '#b76264'
                        },
                        
                        {
                            fill: '#7fc223',
                            stroke: '#659b25'
                        },
                        {
                            fill: '#9ed162',
                            stroke: '#7ea74e'
                        },
                        {
                            fill: '#b3db83',
                            stroke: '#8faf68'
                        },
                        {
                            fill: '#875fbe',
                            stroke: '#6c4c98'
                        },
                        {
                            fill: '#a486ce',
                            stroke: '#836ba4'
                        },
                        {
                            fill: '#b7a0d8',
                            stroke: '#9280ac'
                        },
                        {
                            fill: '#e7cf00',
                            stroke: '#b8a500'
                        },
                        {
                            fill: '#eddb3e',
                            stroke: '#bdaf31'
                        },
                        {
                            fill: '#f1e267',
                            stroke: '#c0b452'
                        },
                        {
                            fill: '#5c7cda',
                            stroke: '#4963ae'
                        },
                        {
                            fill: '#849ce3',
                            stroke: '#697cb5'
                        },
                        {
                            fill: '#9eb1e9',
                            stroke: '#7e8dba'
                        }, 
                        {
                            fill: '#da5cb3',
                            stroke: '#ae4993'
                        },
                        {
                            fill: '#e384c9',
                            stroke: '#b569af'
                        },
                        {
                            fill: '#e99edb',
                            stroke: '#ba7eb5'
                        }, 
                        {
                            fill: '#da915c',
                            stroke: '#ae7849'
                        },
                        {
                            fill: '#e3b784',
                            stroke: '#b59b69'
                        },
                        {
                            fill: '#e9d29e',
                            stroke: '#baa37e'
                        }
                    ]
                },
                {
                    name: 'default-line-graph',
                    colors: [
                        {
                            fill: '#d32226',
                            stroke: '#a81b1e'
                        },
                        {
                            fill: '#7fc223',
                            stroke: '#659b25'
                        },
                        {
                            fill: '#875fbe',
                            stroke: '#6c4c98'
                        },
                        {
                            fill: '#e7cf00',
                            stroke: '#b8a500'
                        },
                        {
                            fill: '#5c7cda',
                            stroke: '#4963ae'
                        },
                        {
                            fill: '#da5cb3',
                            stroke: '#ae4993'
                        },
                        {
                            fill: '#da915c',
                            stroke: '#ae7849'
                        },                        
                        {
                            fill: '#de585b',
                            stroke: '#b14648'
                        },
                        {
                            fill: '#9ed162',
                            stroke: '#7ea74e'
                        },
                        {
                            fill: '#a486ce',
                            stroke: '#836ba4'
                        },
                        {
                            fill: '#eddb3e',
                            stroke: '#bdaf31'
                        },
                        {
                            fill: '#849ce3',
                            stroke: '#697cb5'
                        },
                        {
                            fill: '#e384c9',
                            stroke: '#b569af'
                        },
                        {
                            fill: '#e3b784',
                            stroke: '#b59b69'
                        },
                        {
                            fill: '#e57b7e',
                            stroke: '#b76264'
                        },
                        {
                            fill: '#b3db83',
                            stroke: '#8faf68'
                        },
                        {
                            fill: '#b7a0d8',
                            stroke: '#9280ac'
                        },
                        {
                            fill: '#f1e267',
                            stroke: '#c0b452'
                        },
                        {
                            fill: '#9eb1e9',
                            stroke: '#7e8dba'
                        }, 
                        {
                            fill: '#e99edb',
                            stroke: '#ba7eb5'
                        }, 
                        {
                            fill: '#e9d29e',
                            stroke: '#baa37e'
                        }
                    ]
                }
            ]
        };
})(jQuery);