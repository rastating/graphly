// Copyright (C) 2013 rastating
//
// Version 0.1.3
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
            'paddingTop'    : 1,
            'paddingLeft'   : 1,
            'paddingBottom' : 1,
            'paddingRight'  : 1,
            'showLabels'    : true,
            'showLegend'    : true
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
            'colors'            : __graphly_bar_colors.slice(0),
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
                
                // Cache the dimensions of the current canvas.
                globals.width = $(canvas).width();
                globals.height = $(canvas).height();
                
                // Setup a default padding of 15 pixels.
                globals.paddingLeft = settings.paddingLeft < 15 ? 15 : settings.paddingLeft;
                globals.paddingTop = settings.paddingTop < 15 ? 15 : settings.paddingTop;
                globals.paddingRight = settings.paddingRight < 15 ? 15 : settings.paddingRight;
                globals.paddingBottom = settings.paddingBottom < 15 ? 15 : settings.paddingBottom;
                    
                $.each(settings.data.groups, function(i, group) {
                    $.each(group.values, function(i, entity) {
                        // Update the largest value, if needed.
                        if (largestValue == null || largestValue < entity.value) {
                            largestValue = entity.value;   
                        }
                        
                        // Update the smallest value, if needed.
                        if (smallestValue == null || smallestValue > entity.value) {
                            smallestValue = entity.value;   
                        }
                        
                        // Update the decimal count value, if needed.
                        var currentDecimalPlaces = methods.getDecimalPlaces(entity.value);
                        if (decimalCount == null || decimalCount < currentDecimalPlaces) {
                            decimalCount = currentDecimalPlaces;
                        }
                        
                        // Calculate the dimensions of the current label and update
                        // the largest label width, if needed.
                        var currentLabelWidth = ctx.measureText(entity.label).width;
                        if (largestLabel == null || largestLabel < currentLabelWidth) {
                            largestLabel = currentLabelWidth;   
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
                    $.each(group.values, function(i, entity) {
                        if ($.inArray(entity.label, labels) == -1) {
                            labels[labels.length] = entity.label;   
                        }
                    });
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
                    ctx.fillStyle = globals.colors[i];
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
                
                $.each(settings.data.groups, function(i, group) {
                    x += groupSpacing;
                    $.each(group.values, function(i, entity) {
                        // Draw the bar
                        var barHeight = (entity.value * stepHeight) * -1;           
                        ctx.beginPath();
                        ctx.rect(x, zeroPoint, barWidth, barHeight);
                        ctx.fillStyle = globals.colors[i];
                        ctx.fill();
                        ctx.closePath();
                        
                        // Increment the X point and draw a label if the graph
                        // isn't displaying multiple groups.
                        x += barWidth;
                        if (settings.data.groups.length == 1) {
                            ctx.textAlign = "center";
                            ctx.fillStyle = "#000000";
                            ctx.fillText(entity.label, x - (barWidth / 2), globals.bottom + 15);
                        }
                    });
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
            if (settings.showLegend && settings.data.groups.length > 0) {
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
            
            // Draw the bars and the graph axis.
            methods.drawBars(ctx);
            methods.drawAxis(ctx);
        });
    };
    
    // Forgive me for polluting the global sea :(
    var __graphly_bar_colors = new Array();      
    
    // See colors.ref.txt for the un-minified values and colour names.
    __graphly_bar_colors[0]="#7CB9E8";__graphly_bar_colors[1]="#FF0038";__graphly_bar_colors[2]="#FFBF00";__graphly_bar_colors[3]="#A4C639";__graphly_bar_colors[4]="#00308F";__graphly_bar_colors[5]="#BF00FF";__graphly_bar_colors[6]="#A32638";__graphly_bar_colors[7]="#FFDB58";__graphly_bar_colors[8]="#E32636";__graphly_bar_colors[9]="#C46210";__graphly_bar_colors[10]="#EFDECD";__graphly_bar_colors[11]="#E52B50";__graphly_bar_colors[12]="#3B7A57";__graphly_bar_colors[13]="#C9FFE5";__graphly_bar_colors[14]="#FF7E00";__graphly_bar_colors[15]="#FF033E";__graphly_bar_colors[16]="#9966CC";__graphly_bar_colors[17]="#B284BE";__graphly_bar_colors[18]="#317873";__graphly_bar_colors[19]="#CD9575";__graphly_bar_colors[20]="#665D1E";__graphly_bar_colors[21]="#915C83";__graphly_bar_colors[22]="#841B2D";__graphly_bar_colors[23]="#C54B8C";__graphly_bar_colors[24]="#008000";__graphly_bar_colors[25]="#8DB600";__graphly_bar_colors[26]="#FBCEB1";__graphly_bar_colors[27]="#00FFFF";__graphly_bar_colors[28]="#7FFFD4";__graphly_bar_colors[29]="#4B5320";__graphly_bar_colors[30]="#3B444B";__graphly_bar_colors[31]="#E9D66B";__graphly_bar_colors[32]="#B2BEB5";__graphly_bar_colors[33]="#87A96B";__graphly_bar_colors[34]="#FF9966";__graphly_bar_colors[35]="#A52A2A";__graphly_bar_colors[36]="#FDEE00";__graphly_bar_colors[37]="#6E7F80";__graphly_bar_colors[38]="#568203";__graphly_bar_colors[39]="#007FFF";__graphly_bar_colors[40]="#F0FFFF";__graphly_bar_colors[41]="#89CFF0";__graphly_bar_colors[42]="#A1CAF1";__graphly_bar_colors[43]="#F4C2C2";__graphly_bar_colors[44]="#FEFEFA";__graphly_bar_colors[45]="#FF91AF";__graphly_bar_colors[46]="#21ABCD";__graphly_bar_colors[47]="#FAE7B5";__graphly_bar_colors[48]="#FFE135";__graphly_bar_colors[49]="#E0218A";__graphly_bar_colors[50]="#7C0A02";__graphly_bar_colors[51]="#848482";__graphly_bar_colors[52]="#98777B";__graphly_bar_colors[53]="#BCD4E6";__graphly_bar_colors[54]="#9F8170";__graphly_bar_colors[55]="#F5F5DC";__graphly_bar_colors[56]="#2E5894";__graphly_bar_colors[57]="#9C2542";__graphly_bar_colors[58]="#FFE4C4";__graphly_bar_colors[59]="#3D2B1F";__graphly_bar_colors[60]="#967117";__graphly_bar_colors[61]="#CAE00D";__graphly_bar_colors[62]="#BFFF00";__graphly_bar_colors[63]="#FE6F5E";__graphly_bar_colors[64]="#BF4F51";__graphly_bar_colors[65]="#000000";__graphly_bar_colors[66]="#3D0C02";__graphly_bar_colors[67]="#253529";__graphly_bar_colors[68]="#3B3C36";__graphly_bar_colors[69]="#FFEBCD";__graphly_bar_colors[70]="#A57164";__graphly_bar_colors[71]="#318CE7";__graphly_bar_colors[72]="#ACE5EE";__graphly_bar_colors[73]="#FAF0BE";__graphly_bar_colors[74]="#0000FF";__graphly_bar_colors[75]="#1F75FE";__graphly_bar_colors[76]="#0093AF";__graphly_bar_colors[77]="#0087BD";__graphly_bar_colors[78]="#333399";__graphly_bar_colors[79]="#0247FE";__graphly_bar_colors[80]="#A2A2D0";__graphly_bar_colors[81]="#6699CC";__graphly_bar_colors[82]="#0D98BA";__graphly_bar_colors[83]="#126180";__graphly_bar_colors[84]="#8A2BE2";__graphly_bar_colors[85]="#5072A7";__graphly_bar_colors[86]="#4F86F7";__graphly_bar_colors[87]="#1C1CF0";__graphly_bar_colors[88]="#DE5D83";__graphly_bar_colors[89]="#79443B";__graphly_bar_colors[90]="#0095B6";__graphly_bar_colors[91]="#E3DAC9";__graphly_bar_colors[92]="#CC0000";__graphly_bar_colors[93]="#006A4E";__graphly_bar_colors[94]="#873260";__graphly_bar_colors[95]="#0070FF";__graphly_bar_colors[96]="#B5A642";__graphly_bar_colors[97]="#CB4154";__graphly_bar_colors[98]="#1DACD6";__graphly_bar_colors[99]="#66FF00";__graphly_bar_colors[100]="#BF94E4";__graphly_bar_colors[101]="#C32148";__graphly_bar_colors[102]="#1974D2";__graphly_bar_colors[103]="#FF007F";__graphly_bar_colors[104]="#08E8DE";__graphly_bar_colors[105]="#D19FE8";__graphly_bar_colors[106]="#F4BBFF";__graphly_bar_colors[107]="#FF55A3";__graphly_bar_colors[108]="#FB607F";__graphly_bar_colors[109]="#004225";__graphly_bar_colors[110]="#CD7F32";__graphly_bar_colors[111]="#737000";__graphly_bar_colors[112]="#964B00";__graphly_bar_colors[113]="#A52A2A";__graphly_bar_colors[114]="#6B4423";__graphly_bar_colors[115]="#1B4D3E";__graphly_bar_colors[116]="#FFC1CC";__graphly_bar_colors[117]="#E7FEFF";__graphly_bar_colors[118]="#F0DC82";__graphly_bar_colors[119]="#7BB661";__graphly_bar_colors[120]="#480607";__graphly_bar_colors[121]="#800020";__graphly_bar_colors[122]="#DEB887";__graphly_bar_colors[123]="#CC5500";__graphly_bar_colors[124]="#E97451";__graphly_bar_colors[125]="#8A3324";__graphly_bar_colors[126]="#BD33A4";__graphly_bar_colors[127]="#702963";__graphly_bar_colors[128]="#536872";__graphly_bar_colors[129]="#5F9EA0";__graphly_bar_colors[130]="#91A3B0";__graphly_bar_colors[131]="#006B3C";__graphly_bar_colors[132]="#ED872D";__graphly_bar_colors[133]="#E30022";__graphly_bar_colors[134]="#FFF600";__graphly_bar_colors[135]="#A67B5B";__graphly_bar_colors[136]="#4B3621";__graphly_bar_colors[137]="#1E4D2B";__graphly_bar_colors[138]="#A3C1AD";__graphly_bar_colors[139]="#C19A6B";__graphly_bar_colors[140]="#EFBBCC";__graphly_bar_colors[141]="#78866B";__graphly_bar_colors[142]="#FFEF00";__graphly_bar_colors[143]="#FF0800";__graphly_bar_colors[144]="#E4717A";__graphly_bar_colors[145]="#00BFFF";__graphly_bar_colors[146]="#592720";__graphly_bar_colors[147]="#C41E3A";__graphly_bar_colors[148]="#00CC99";__graphly_bar_colors[149]="#960018";__graphly_bar_colors[150]="#D70040";__graphly_bar_colors[151]="#EB4C42";__graphly_bar_colors[152]="#5D8AA8";__graphly_bar_colors[153]="#FFA6C9";__graphly_bar_colors[154]="#B31B1B";__graphly_bar_colors[155]="#99BADD";__graphly_bar_colors[156]="#ED9121";__graphly_bar_colors[157]="#00563F";__graphly_bar_colors[158]="#062A78";__graphly_bar_colors[159]="#703642";__graphly_bar_colors[160]="#C95A49";__graphly_bar_colors[161]="#92A1CF";__graphly_bar_colors[162]="#ACE1AF";__graphly_bar_colors[163]="#007BA7";__graphly_bar_colors[164]="#2F847C";__graphly_bar_colors[165]="#B2FFFF";__graphly_bar_colors[166]="#4997D0";__graphly_bar_colors[167]="#DE3163";__graphly_bar_colors[168]="#EC3B83";__graphly_bar_colors[169]="#007BA7";__graphly_bar_colors[170]="#2A52BE";__graphly_bar_colors[171]="#6D9BC3";__graphly_bar_colors[172]="#007AA5";__graphly_bar_colors[173]="#E03C31";__graphly_bar_colors[174]="#A0785A";__graphly_bar_colors[175]="#F7E7CE";__graphly_bar_colors[176]="#36454F";__graphly_bar_colors[177]="#232B2B";__graphly_bar_colors[178]="#E68FAC";__graphly_bar_colors[179]="#DFFF00";__graphly_bar_colors[180]="#7FFF00";__graphly_bar_colors[181]="#DE3163";__graphly_bar_colors[182]="#FFB7C5";__graphly_bar_colors[183]="#954535";__graphly_bar_colors[184]="#DE6FA1";__graphly_bar_colors[185]="#A8516E";__graphly_bar_colors[186]="#AA381E";__graphly_bar_colors[187]="#856088";__graphly_bar_colors[188]="#7B3F00";__graphly_bar_colors[189]="#D2691E";__graphly_bar_colors[190]="#FFA700";__graphly_bar_colors[191]="#98817B";__graphly_bar_colors[192]="#E34234";__graphly_bar_colors[193]="#D2691E";__graphly_bar_colors[194]="#E4D00A";__graphly_bar_colors[195]="#9FA91F";__graphly_bar_colors[196]="#7F1734";__graphly_bar_colors[197]="#FBCCE7";__graphly_bar_colors[198]="#0047AB";__graphly_bar_colors[199]="#D2691E";__graphly_bar_colors[200]="#965A3E";__graphly_bar_colors[201]="#6F4E37";__graphly_bar_colors[202]="#9BDDFF";__graphly_bar_colors[203]="#F88379";__graphly_bar_colors[204]="#002E63";__graphly_bar_colors[205]="#8C92AC";__graphly_bar_colors[206]="#B87333";__graphly_bar_colors[207]="#DA8A67";__graphly_bar_colors[208]="#AD6F69";__graphly_bar_colors[209]="#CB6D51";__graphly_bar_colors[210]="#996666";__graphly_bar_colors[211]="#FF3800";__graphly_bar_colors[212]="#FF7F50";__graphly_bar_colors[213]="#F88379";__graphly_bar_colors[214]="#FF4040";__graphly_bar_colors[215]="#893F45";__graphly_bar_colors[216]="#FBEC5D";__graphly_bar_colors[217]="#B31B1B";__graphly_bar_colors[218]="#6495ED";__graphly_bar_colors[219]="#FFF8DC";__graphly_bar_colors[220]="#FFF8E7";__graphly_bar_colors[221]="#FFBCD9";__graphly_bar_colors[222]="#FFFDD0";__graphly_bar_colors[223]="#DC143C";__graphly_bar_colors[224]="#BE0032";__graphly_bar_colors[225]="#00FFFF";__graphly_bar_colors[226]="#00B7EB";__graphly_bar_colors[227]="#58427C";__graphly_bar_colors[228]="#FFD300";__graphly_bar_colors[229]="#FFFF31";__graphly_bar_colors[230]="#F0E130";__graphly_bar_colors[231]="#00008B";__graphly_bar_colors[232]="#666699";__graphly_bar_colors[233]="#654321";__graphly_bar_colors[234]="#5D3954";__graphly_bar_colors[235]="#A40000";__graphly_bar_colors[236]="#08457E";__graphly_bar_colors[237]="#986960";__graphly_bar_colors[238]="#CD5B45";__graphly_bar_colors[239]="#008B8B";__graphly_bar_colors[240]="#536878";__graphly_bar_colors[241]="#B8860B";__graphly_bar_colors[242]="#A9A9A9";__graphly_bar_colors[243]="#013220";__graphly_bar_colors[244]="#00416A";__graphly_bar_colors[245]="#1A2421";__graphly_bar_colors[246]="#BDB76B";__graphly_bar_colors[247]="#483C32";__graphly_bar_colors[248]="#734F96";__graphly_bar_colors[249]="#534B4F";__graphly_bar_colors[250]="#543D37";__graphly_bar_colors[251]="#8B008B";__graphly_bar_colors[252]="#003366";__graphly_bar_colors[253]="#4A5D23";__graphly_bar_colors[254]="#556B2F";__graphly_bar_colors[255]="#FF8C00";__graphly_bar_colors[256]="#9932CC";__graphly_bar_colors[257]="#779ECB";__graphly_bar_colors[258]="#03C03C";__graphly_bar_colors[259]="#966FD6";__graphly_bar_colors[260]="#C23B22";__graphly_bar_colors[261]="#E75480";__graphly_bar_colors[262]="#003399";__graphly_bar_colors[263]="#872657";__graphly_bar_colors[264]="#8B0000";__graphly_bar_colors[265]="#E9967A";__graphly_bar_colors[266]="#560319";__graphly_bar_colors[267]="#8FBC8F";__graphly_bar_colors[268]="#3C1414";__graphly_bar_colors[269]="#8CBED6";__graphly_bar_colors[270]="#483D8B";__graphly_bar_colors[271]="#2F4F4F";__graphly_bar_colors[272]="#177245";__graphly_bar_colors[273]="#918151";__graphly_bar_colors[274]="#FFA812";__graphly_bar_colors[275]="#483C32";__graphly_bar_colors[276]="#CC4E5C";__graphly_bar_colors[277]="#00CED1";__graphly_bar_colors[278]="#D1BEA8";__graphly_bar_colors[279]="#9400D3";__graphly_bar_colors[280]="#9B870C";__graphly_bar_colors[281]="#00703C";__graphly_bar_colors[282]="#555555";__graphly_bar_colors[283]="#D70A53";__graphly_bar_colors[284]="#A9203E";__graphly_bar_colors[285]="#EF3038";__graphly_bar_colors[286]="#E9692C";__graphly_bar_colors[287]="#DA3287";__graphly_bar_colors[288]="#FAD6A5";__graphly_bar_colors[289]="#B94E48";__graphly_bar_colors[290]="#704241";__graphly_bar_colors[291]="#C154C1";__graphly_bar_colors[292]="#004B49";__graphly_bar_colors[293]="#F5C71A";__graphly_bar_colors[294]="#9955BB";__graphly_bar_colors[295]="#CC00CC";__graphly_bar_colors[296]="#D473D4";__graphly_bar_colors[297]="#355E3B";__graphly_bar_colors[298]="#FFCBA4";__graphly_bar_colors[299]="#FF1493";__graphly_bar_colors[300]="#843F5B";__graphly_bar_colors[301]="#FF9933";__graphly_bar_colors[302]="#00BFFF";__graphly_bar_colors[303]="#4A646C";__graphly_bar_colors[304]="#7E5E60";__graphly_bar_colors[305]="#66424D";__graphly_bar_colors[306]="#BA8759";__graphly_bar_colors[307]="#1560BD";__graphly_bar_colors[308]="#C19A6B";__graphly_bar_colors[309]="#EDC9AF";__graphly_bar_colors[310]="#B9F2FF";__graphly_bar_colors[311]="#696969";__graphly_bar_colors[312]="#9B7653";__graphly_bar_colors[313]="#1E90FF";__graphly_bar_colors[314]="#D71868";__graphly_bar_colors[315]="#85BB65";__graphly_bar_colors[316]="#664C28";__graphly_bar_colors[317]="#967117";__graphly_bar_colors[318]="#00009C";__graphly_bar_colors[319]="#E5CCC9";__graphly_bar_colors[320]="#E1A95F";__graphly_bar_colors[321]="#555D50";__graphly_bar_colors[322]="#C2B280";__graphly_bar_colors[323]="#614051";__graphly_bar_colors[324]="#F0EAD6";__graphly_bar_colors[325]="#1034A6";__graphly_bar_colors[326]="#7DF9FF";__graphly_bar_colors[327]="#FF003F";__graphly_bar_colors[328]="#00FFFF";__graphly_bar_colors[329]="#00FF00";__graphly_bar_colors[330]="#6F00FF";__graphly_bar_colors[331]="#F4BBFF";__graphly_bar_colors[332]="#CCFF00";__graphly_bar_colors[333]="#72A0C1";__graphly_bar_colors[334]="#3F00FF";__graphly_bar_colors[335]="#8F00FF";__graphly_bar_colors[336]="#FFFF33";__graphly_bar_colors[337]="#50C878";__graphly_bar_colors[338]="#1B4D3E";__graphly_bar_colors[339]="#B48395";__graphly_bar_colors[340]="#AB4B52";__graphly_bar_colors[341]="#563C5C";__graphly_bar_colors[342]="#96C8A2";__graphly_bar_colors[343]="#44D7A8";__graphly_bar_colors[344]="#C19A6B";__graphly_bar_colors[345]="#801818";__graphly_bar_colors[346]="#B53389";__graphly_bar_colors[347]="#DE5285";__graphly_bar_colors[348]="#F400A1";__graphly_bar_colors[349]="#E5AA70";__graphly_bar_colors[350]="#4D5D53";__graphly_bar_colors[351]="#FDD5B1";__graphly_bar_colors[352]="#4F7942";__graphly_bar_colors[353]="#FF2800";__graphly_bar_colors[354]="#6C541E";__graphly_bar_colors[355]="#B22222";__graphly_bar_colors[356]="#CE2029";__graphly_bar_colors[357]="#E25822";__graphly_bar_colors[358]="#FC8EAC";__graphly_bar_colors[359]="#6B4423";__graphly_bar_colors[360]="#F7E98E";__graphly_bar_colors[361]="#EEDC82";__graphly_bar_colors[362]="#A2006D";__graphly_bar_colors[363]="#306030";__graphly_bar_colors[364]="#FFBF00";__graphly_bar_colors[365]="#FF1493";__graphly_bar_colors[366]="#CCFF00";__graphly_bar_colors[367]="#FF004F";__graphly_bar_colors[368]="#014421";__graphly_bar_colors[369]="#228B22";__graphly_bar_colors[370]="#A67B5B";__graphly_bar_colors[371]="#856D4D";__graphly_bar_colors[372]="#0072BB";__graphly_bar_colors[373]="#86608E";__graphly_bar_colors[374]="#9EFD38";__graphly_bar_colors[375]="#D473D4";__graphly_bar_colors[376]="#C72C48";__graphly_bar_colors[377]="#F64A8A";__graphly_bar_colors[378]="#77B5FE";__graphly_bar_colors[379]="#AC1E44";__graphly_bar_colors[380]="#A6E7FF";__graphly_bar_colors[381]="#FF00FF";__graphly_bar_colors[382]="#C154C1";__graphly_bar_colors[383]="#FF77FF";__graphly_bar_colors[384]="#C74375";__graphly_bar_colors[385]="#E48400";__graphly_bar_colors[386]="#CC6666";__graphly_bar_colors[387]="#DCDCDC";__graphly_bar_colors[388]="#E49B0F";__graphly_bar_colors[389]="#007F66";__graphly_bar_colors[390]="#18453B";__graphly_bar_colors[391]="#FE5A1D";__graphly_bar_colors[392]="#B06500";__graphly_bar_colors[393]="#6082B6";__graphly_bar_colors[394]="#E6E8FA";__graphly_bar_colors[395]="#00AB66";__graphly_bar_colors[396]="#D4AF37";__graphly_bar_colors[397]="#FFD700";__graphly_bar_colors[398]="#85754E";__graphly_bar_colors[399]="#996515";__graphly_bar_colors[400]="#FCC200";__graphly_bar_colors[401]="#FFDF00";__graphly_bar_colors[402]="#DAA520";__graphly_bar_colors[403]="#A8E4A0";__graphly_bar_colors[404]="#6F2DA8";__graphly_bar_colors[405]="#808080";__graphly_bar_colors[406]="#808080";__graphly_bar_colors[407]="#BEBEBE";__graphly_bar_colors[408]="#465945";__graphly_bar_colors[409]="#8C92AC";__graphly_bar_colors[410]="#00FF00";__graphly_bar_colors[411]="#1CAC78";__graphly_bar_colors[412]="#008000";__graphly_bar_colors[413]="#00A877";__graphly_bar_colors[414]="#009F6B";__graphly_bar_colors[415]="#00A550";__graphly_bar_colors[416]="#66B032";__graphly_bar_colors[417]="#ADFF2F";__graphly_bar_colors[418]="#A99A86";__graphly_bar_colors[419]="#00FF7F";__graphly_bar_colors[420]="#663854";__graphly_bar_colors[421]="#446CCF";__graphly_bar_colors[422]="#5218FA";__graphly_bar_colors[423]="#E9D66B";__graphly_bar_colors[424]="#3FFF00";__graphly_bar_colors[425]="#C90016";__graphly_bar_colors[426]="#DA9100";__graphly_bar_colors[427]="#808000";__graphly_bar_colors[428]="#DF73FF";__graphly_bar_colors[429]="#F400A1";__graphly_bar_colors[430]="#F0FFF0";__graphly_bar_colors[431]="#006DB0";__graphly_bar_colors[432]="#49796B";__graphly_bar_colors[433]="#FF1DCE";__graphly_bar_colors[434]="#FF69B4";__graphly_bar_colors[435]="#355E3B";__graphly_bar_colors[436]="#71A6D2";__graphly_bar_colors[437]="#FCF75E";__graphly_bar_colors[438]="#319177";__graphly_bar_colors[439]="#602F6B";__graphly_bar_colors[440]="#002395";__graphly_bar_colors[441]="#66023C";__graphly_bar_colors[442]="#ED2939";__graphly_bar_colors[443]="#B2EC5D";__graphly_bar_colors[444]="#4C516D";__graphly_bar_colors[445]="#138808";__graphly_bar_colors[446]="#CD5C5C";__graphly_bar_colors[447]="#E3A857";__graphly_bar_colors[448]="#6F00FF";__graphly_bar_colors[449]="#091F92";__graphly_bar_colors[450]="#4B0082";__graphly_bar_colors[451]="#002FA7";__graphly_bar_colors[452]="#FF4F00";__graphly_bar_colors[453]="#BA160C";__graphly_bar_colors[454]="#C0362C";__graphly_bar_colors[455]="#5A4FCF";__graphly_bar_colors[456]="#B3446C";__graphly_bar_colors[457]="#F4F0EC";__graphly_bar_colors[458]="#009000";__graphly_bar_colors[459]="#B2FFFF";__graphly_bar_colors[460]="#FFFFF0";__graphly_bar_colors[461]="#00A86B";__graphly_bar_colors[462]="#264348";__graphly_bar_colors[463]="#5B3256";__graphly_bar_colors[464]="#F8DE7E";__graphly_bar_colors[465]="#D73B3E";__graphly_bar_colors[466]="#A50B5E";__graphly_bar_colors[467]="#DA614E";__graphly_bar_colors[468]="#343434";__graphly_bar_colors[469]="#F4CA16";__graphly_bar_colors[470]="#BDDA57";__graphly_bar_colors[471]="#29AB87";__graphly_bar_colors[472]="#4CBB17";__graphly_bar_colors[473]="#7C1C05";__graphly_bar_colors[474]="#3AB09E";__graphly_bar_colors[475]="#C3B091";__graphly_bar_colors[476]="#F0E68C";__graphly_bar_colors[477]="#882D17";__graphly_bar_colors[478]="#E79FC4";__graphly_bar_colors[479]="#354230";__graphly_bar_colors[480]="#E8000D";__graphly_bar_colors[481]="#087830";__graphly_bar_colors[482]="#D6CADD";__graphly_bar_colors[483]="#26619C";__graphly_bar_colors[484]="#FFFF66";__graphly_bar_colors[485]="#A9BA9D";__graphly_bar_colors[486]="#CF1020";__graphly_bar_colors[487]="#B57EDC";__graphly_bar_colors[488]="#E6E6FA";__graphly_bar_colors[489]="#CCCCFF";__graphly_bar_colors[490]="#FFF0F5";__graphly_bar_colors[491]="#C4C3D0";__graphly_bar_colors[492]="#9457EB";__graphly_bar_colors[493]="#EE82EE";__graphly_bar_colors[494]="#E6E6FA";__graphly_bar_colors[495]="#FBAED2";__graphly_bar_colors[496]="#967BB6";__graphly_bar_colors[497]="#FBA0E3";__graphly_bar_colors[498]="#7CFC00";__graphly_bar_colors[499]="#FFF700";__graphly_bar_colors[500]="#FFFACD";__graphly_bar_colors[501]="#CCA01D";__graphly_bar_colors[502]="#FDFF00";__graphly_bar_colors[503]="#E3FF00";__graphly_bar_colors[504]="#F6EABE";__graphly_bar_colors[505]="#FFF44F";__graphly_bar_colors[506]="#1A1110";__graphly_bar_colors[507]="#545AA7";__graphly_bar_colors[508]="#FDD5B1";__graphly_bar_colors[509]="#ADD8E6";__graphly_bar_colors[510]="#B5651D";__graphly_bar_colors[511]="#E66771";__graphly_bar_colors[512]="#F08080";__graphly_bar_colors[513]="#93CCEA";__graphly_bar_colors[514]="#F56991";__graphly_bar_colors[515]="#E0FFFF";__graphly_bar_colors[516]="#F984EF";__graphly_bar_colors[517]="#FAFAD2";__graphly_bar_colors[518]="#D3D3D3";__graphly_bar_colors[519]="#90EE90";__graphly_bar_colors[520]="#F0E68C";__graphly_bar_colors[521]="#D39BCB";__graphly_bar_colors[522]="#ADDFAD";__graphly_bar_colors[523]="#E6A8D7";__graphly_bar_colors[524]="#B19CD9";__graphly_bar_colors[525]="#FFB6C1";__graphly_bar_colors[526]="#E97451";__graphly_bar_colors[527]="#FFA07A";__graphly_bar_colors[528]="#FF9999";__graphly_bar_colors[529]="#20B2AA";__graphly_bar_colors[530]="#87CEFA";__graphly_bar_colors[531]="#778899";__graphly_bar_colors[532]="#B0C4DE";__graphly_bar_colors[533]="#B38B6D";__graphly_bar_colors[534]="#E68FAC";__graphly_bar_colors[535]="#FFFFE0";__graphly_bar_colors[536]="#C8A2C8";__graphly_bar_colors[537]="#BFFF00";__graphly_bar_colors[538]="#00FF00";__graphly_bar_colors[539]="#32CD32";__graphly_bar_colors[540]="#9DC209";__graphly_bar_colors[541]="#195905";__graphly_bar_colors[542]="#FAF0E6";__graphly_bar_colors[543]="#C19A6B";__graphly_bar_colors[544]="#6CA0DC";__graphly_bar_colors[545]="#674C47";__graphly_bar_colors[546]="#B86D29";__graphly_bar_colors[547]="#6C2E1F";__graphly_bar_colors[548]="#987456";__graphly_bar_colors[549]="#FFE4CD";__graphly_bar_colors[550]="#E62020";__graphly_bar_colors[551]="#FF00FF";__graphly_bar_colors[552]="#FF55A3";__graphly_bar_colors[553]="#CA1F7B";__graphly_bar_colors[554]="#D0417E";__graphly_bar_colors[555]="#FF0090";__graphly_bar_colors[556]="#9F4576";__graphly_bar_colors[557]="#AAF0D1";__graphly_bar_colors[558]="#F8F4FF";__graphly_bar_colors[559]="#C04000";__graphly_bar_colors[560]="#FBEC5D";__graphly_bar_colors[561]="#6050DC";__graphly_bar_colors[562]="#0BDA51";__graphly_bar_colors[563]="#979AAA";__graphly_bar_colors[564]="#FF8243";__graphly_bar_colors[565]="#74C365";__graphly_bar_colors[566]="#880085";__graphly_bar_colors[567]="#C32148";__graphly_bar_colors[568]="#800000";__graphly_bar_colors[569]="#B03060";__graphly_bar_colors[570]="#E0B0FF";__graphly_bar_colors[571]="#915F6D";__graphly_bar_colors[572]="#EF98AA";__graphly_bar_colors[573]="#73C2FB";__graphly_bar_colors[574]="#E5B73B";__graphly_bar_colors[575]="#66DDAA";__graphly_bar_colors[576]="#0000CD";__graphly_bar_colors[577]="#E2062C";__graphly_bar_colors[578]="#AF4035";__graphly_bar_colors[579]="#F3E5AB";__graphly_bar_colors[580]="#035096";__graphly_bar_colors[581]="#1C352D";__graphly_bar_colors[582]="#DDA0DD";__graphly_bar_colors[583]="#BA55D3";__graphly_bar_colors[584]="#0067A5";__graphly_bar_colors[585]="#9370DB";__graphly_bar_colors[586]="#BB3385";__graphly_bar_colors[587]="#AA4069";__graphly_bar_colors[588]="#3CB371";__graphly_bar_colors[589]="#80DAEB";__graphly_bar_colors[590]="#7B68EE";__graphly_bar_colors[591]="#C9DC87";__graphly_bar_colors[592]="#00FA9A";__graphly_bar_colors[593]="#674C47";__graphly_bar_colors[594]="#48D1CC";__graphly_bar_colors[595]="#79443B";__graphly_bar_colors[596]="#D9603B";__graphly_bar_colors[597]="#C71585";__graphly_bar_colors[598]="#F8B878";__graphly_bar_colors[599]="#F8DE7E";__graphly_bar_colors[600]="#FDBCB4";__graphly_bar_colors[601]="#0A7E8C";__graphly_bar_colors[602]="#9C7C38";__graphly_bar_colors[603]="#E4007C";__graphly_bar_colors[604]="#191970";__graphly_bar_colors[605]="#004953";__graphly_bar_colors[606]="#E3F988";__graphly_bar_colors[607]="#FFC40C";__graphly_bar_colors[608]="#3EB489";__graphly_bar_colors[609]="#F5FFFA";__graphly_bar_colors[610]="#98FF98";__graphly_bar_colors[611]="#FFE4E1";__graphly_bar_colors[612]="#FAEBD7";__graphly_bar_colors[613]="#967117";__graphly_bar_colors[614]="#73A9C2";__graphly_bar_colors[615]="#AE0C00";__graphly_bar_colors[616]="#8A9A5B";__graphly_bar_colors[617]="#30BA8F";__graphly_bar_colors[618]="#997A8D";
})(jQuery);