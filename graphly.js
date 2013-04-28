// Copyright (C) 2013 rastating
//
// Version 0.02
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
        
        var colors = new Array();
        var vars = {
            'width'         : 0,
            'height'        : 0,
            'paddingTop'    : settings.paddingTop,
            'paddingLeft'   : settings.paddingLeft,
            'paddingBottom' : settings.paddingBottom,
            'paddingRight'  : settings.paddingRight,
        };
        
        var methods = {
            getBarCount : function() {
                var retval = 0;
                $.each(settings.data.groups, function(i, item) {
                    retval += item.values.length;
                });
                
                return retval;
            },
            getLargestValue : function() {
                var retval = null;
                $.each(settings.data.groups, function(i, item) {
                    $.each(item.values, function(i, item) {
                        if (retval == null || retval < item.value) {
                            retval = item.value;   
                        }
                    });
                });
                
                return retval;
            },
            getSmallestValue : function() {
                var retval = null;
                $.each(settings.data.groups, function(i, item) {
                    $.each(item.values, function(i, item) {
                        if (retval == null || retval > item.value) {
                            retval = item.value;   
                        }
                    });
                });
                
                return retval;
            },
            getLargestLabel : function(ctx) {
                var retval = null;
                
                $.each(settings.data.groups, function(i, item) {
                    $.each(item.values, function(i, item) {
                        var labelWidth = ctx.measureText(item.label).width;
                        if (retval == null || retval < labelWidth) {
                            retval = labelWidth;
                        }
                    });
                });
                
                return retval;
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
                var x = vars.width - vars.paddingRight + 15;
                var y = vars.paddingTop + 5;
                var labels = new Array();
                
                $.each(settings.data.groups, function(i, item) {
                    $.each(item.values, function(i, item) {
                        if ($.inArray(item.label, labels) == -1) {
                            labels[labels.length] = item.label;   
                        }
                    });
                });
                
                ctx.save();
                
                var labelY = y;
                ctx.font = "bold 14px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                ctx.fillText('Legend', x, labelY);
                ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";

                $.each(labels, function(i, item) {
                    labelY += 16;
                    ctx.beginPath();
                    ctx.rect(x, labelY, 11, 11);
                    ctx.fillStyle = colors[i];
                    ctx.fill();
                    ctx.closePath();
                    ctx.textBaseline = "top";
                    ctx.fillText(item, x + 13, labelY - 1); 
                });
                
                ctx.restore();
            },
            setupcolors : function() {
                // Aero
                colors[0] = '#7CB9E8';
                // Carmine red
                colors[1] = '#FF0038';
                // Amber
                colors[2] = '#FFBF00';
                // Android green
                colors[3] = '#A4C639';
                // Air Force blue (USAF)
                colors[4] = '#00308F';
                // Electric purple
                colors[5] = '#BF00FF';
                // Alabama Crimson
                colors[6] = '#A32638';
                // Mustard
                colors[7] = '#FFDB58';
                // Alizarin crimson
                colors[8] = '#E32636';
                // Alloy orange
                colors[9] = '#C46210';
                // Almond
                colors[10] = '#EFDECD';
                // Amaranth
                colors[11] = '#E52B50';
                // Amazon
                colors[12] = '#3B7A57';
                // Aero blue
                colors[13] = '#C9FFE5';
                // SAE/ECE Amber (color)
                colors[14] = '#FF7E00';
                // American rose
                colors[15] = '#FF033E';
                // Amethyst
                colors[16] = '#9966CC';
                // African violet
                colors[17] = '#B284BE';
                // Myrtle green
                colors[18] = '#317873';
                // Antique brass
                colors[19] = '#CD9575';
                // Antique bronze
                colors[20] = '#665D1E';
                // Antique fuchsia
                colors[21] = '#915C83';
                // Antique ruby
                colors[22] = '#841B2D';
                // Mulberry
                colors[23] = '#C54B8C';
                // Ao (English)
                colors[24] = '#008000';
                // Apple green
                colors[25] = '#8DB600';
                // Apricot
                colors[26] = '#FBCEB1';
                // Aqua
                colors[27] = '#00FFFF';
                // Aquamarine
                colors[28] = '#7FFFD4';
                // Army green
                colors[29] = '#4B5320';
                // Arsenic
                colors[30] = '#3B444B';
                // Arylide yellow
                colors[31] = '#E9D66B';
                // Ash grey
                colors[32] = '#B2BEB5';
                // Asparagus
                colors[33] = '#87A96B';
                // Atomic tangerine
                colors[34] = '#FF9966';
                // Auburn
                colors[35] = '#A52A2A';
                // Aureolin
                colors[36] = '#FDEE00';
                // AuroMetalSaurus
                colors[37] = '#6E7F80';
                // Avocado
                colors[38] = '#568203';
                // Azure
                colors[39] = '#007FFF';
                // Azure mist/web
                colors[40] = '#F0FFFF';
                // Baby blue
                colors[41] = '#89CFF0';
                // Baby blue eyes
                colors[42] = '#A1CAF1';
                // Baby pink
                colors[43] = '#F4C2C2';
                // Baby powder
                colors[44] = '#FEFEFA';
                // Baker-Miller pink
                colors[45] = '#FF91AF';
                // Ball blue
                colors[46] = '#21ABCD';
                // Banana Mania
                colors[47] = '#FAE7B5';
                // Banana yellow
                colors[48] = '#FFE135';
                // Barbie pink
                colors[49] = '#E0218A';
                // Barn red
                colors[50] = '#7C0A02';
                // Battleship grey
                colors[51] = '#848482';
                // Bazaar
                colors[52] = '#98777B';
                // Beau blue
                colors[53] = '#BCD4E6';
                // Beaver
                colors[54] = '#9F8170';
                // Beige
                colors[55] = '#F5F5DC';
                // B'dazzled blue
                colors[56] = '#2E5894';
                // Big dip o'ruby
                colors[57] = '#9C2542';
                // Bisque
                colors[58] = '#FFE4C4';
                // Bistre
                colors[59] = '#3D2B1F';
                // Bistre brown
                colors[60] = '#967117';
                // Bitter lemon
                colors[61] = '#CAE00D';
                // Bitter lime
                colors[62] = '#BFFF00';
                // Bittersweet
                colors[63] = '#FE6F5E';
                // Bittersweet shimmer
                colors[64] = '#BF4F51';
                // Black
                colors[65] = '#000000';
                // Black bean
                colors[66] = '#3D0C02';
                // Black leather jacket
                colors[67] = '#253529';
                // Black olive
                colors[68] = '#3B3C36';
                // Blanched almond
                colors[69] = '#FFEBCD';
                // Blast-off bronze
                colors[70] = '#A57164';
                // Bleu de France
                colors[71] = '#318CE7';
                // Blizzard Blue
                colors[72] = '#ACE5EE';
                // Blond
                colors[73] = '#FAF0BE';
                // Blue
                colors[74] = '#0000FF';
                // Blue (Crayola)
                colors[75] = '#1F75FE';
                // Blue (Munsell)
                colors[76] = '#0093AF';
                // Blue (NCS)
                colors[77] = '#0087BD';
                // Blue (pigment)
                colors[78] = '#333399';
                // Blue (RYB)
                colors[79] = '#0247FE';
                // Blue Bell
                colors[80] = '#A2A2D0';
                // Blue-gray
                colors[81] = '#6699CC';
                // Blue-green
                colors[82] = '#0D98BA';
                // Blue sapphire
                colors[83] = '#126180';
                // Blue-violet
                colors[84] = '#8A2BE2';
                // Blue yonder
                colors[85] = '#5072A7';
                // Blueberry
                colors[86] = '#4F86F7';
                // Bluebonnet
                colors[87] = '#1C1CF0';
                // Blush
                colors[88] = '#DE5D83';
                // Bole
                colors[89] = '#79443B';
                // Bondi blue
                colors[90] = '#0095B6';
                // Bone
                colors[91] = '#E3DAC9';
                // Boston University Red
                colors[92] = '#CC0000';
                // Bottle green
                colors[93] = '#006A4E';
                // Boysenberry
                colors[94] = '#873260';
                // Brandeis blue
                colors[95] = '#0070FF';
                // Brass
                colors[96] = '#B5A642';
                // Brick red
                colors[97] = '#CB4154';
                // Bright cerulean
                colors[98] = '#1DACD6';
                // Bright green
                colors[99] = '#66FF00';
                // Bright lavender
                colors[100] = '#BF94E4';
                // Bright maroon
                colors[101] = '#C32148';
                // Bright navy blue
                colors[102] = '#1974D2';
                // Bright pink
                colors[103] = '#FF007F';
                // Bright turquoise
                colors[104] = '#08E8DE';
                // Bright ube
                colors[105] = '#D19FE8';
                // Brilliant lavender
                colors[106] = '#F4BBFF';
                // Brilliant rose
                colors[107] = '#FF55A3';
                // Brink pink
                colors[108] = '#FB607F';
                // British racing green
                colors[109] = '#004225';
                // Bronze
                colors[110] = '#CD7F32';
                // Bronze Yellow
                colors[111] = '#737000';
                // Brown (traditional)
                colors[112] = '#964B00';
                // Brown (web)
                colors[113] = '#A52A2A';
                // Brown-nose
                colors[114] = '#6B4423';
                // Brunswick green
                colors[115] = '#1B4D3E';
                // Bubble gum
                colors[116] = '#FFC1CC';
                // Bubbles
                colors[117] = '#E7FEFF';
                // Buff
                colors[118] = '#F0DC82';
                // Bud green
                colors[119] = '#7BB661';
                // Bulgarian rose
                colors[120] = '#480607';
                // Burgundy
                colors[121] = '#800020';
                // Burlywood
                colors[122] = '#DEB887';
                // Burnt orange
                colors[123] = '#CC5500';
                // Burnt sienna
                colors[124] = '#E97451';
                // Burnt umber
                colors[125] = '#8A3324';
                // Byzantine
                colors[126] = '#BD33A4';
                // Byzantium
                colors[127] = '#702963';
                // Cadet
                colors[128] = '#536872';
                // Cadet blue
                colors[129] = '#5F9EA0';
                // Cadet grey
                colors[130] = '#91A3B0';
                // Cadmium green
                colors[131] = '#006B3C';
                // Cadmium orange
                colors[132] = '#ED872D';
                // Cadmium red
                colors[133] = '#E30022';
                // Cadmium yellow
                colors[134] = '#FFF600';
                // Cafe au lait
                colors[135] = '#A67B5B';
                // Cafe noir
                colors[136] = '#4B3621';
                // Cal Poly green
                colors[137] = '#1E4D2B';
                // Cambridge Blue
                colors[138] = '#A3C1AD';
                // Camel
                colors[139] = '#C19A6B';
                // Cameo pink
                colors[140] = '#EFBBCC';
                // Camouflage green
                colors[141] = '#78866B';
                // Canary yellow
                colors[142] = '#FFEF00';
                // Candy apple red
                colors[143] = '#FF0800';
                // Candy pink
                colors[144] = '#E4717A';
                // Capri
                colors[145] = '#00BFFF';
                // Caput mortuum
                colors[146] = '#592720';
                // Cardinal
                colors[147] = '#C41E3A';
                // Caribbean green
                colors[148] = '#00CC99';
                // Carmine
                colors[149] = '#960018';
                // Carmine (M&P)
                colors[150] = '#D70040';
                // Carmine pink
                colors[151] = '#EB4C42';
                // Air Force blue (RAF)
                colors[152] = '#5D8AA8';
                // Carnation pink
                colors[153] = '#FFA6C9';
                // Carnelian
                colors[154] = '#B31B1B';
                // Carolina blue
                colors[155] = '#99BADD';
                // Carrot orange
                colors[156] = '#ED9121';
                // Castleton green
                colors[157] = '#00563F';
                // Catalina blue
                colors[158] = '#062A78';
                // Catawba
                colors[159] = '#703642';
                // Cedar Chest
                colors[160] = '#C95A49';
                // Ceil
                colors[161] = '#92A1CF';
                // Celadon
                colors[162] = '#ACE1AF';
                // Celadon blue
                colors[163] = '#007BA7';
                // Celadon green
                colors[164] = '#2F847C';
                // Celeste (color)
                colors[165] = '#B2FFFF';
                // Celestial blue
                colors[166] = '#4997D0';
                // Cerise
                colors[167] = '#DE3163';
                // Cerise pink
                colors[168] = '#EC3B83';
                // Cerulean
                colors[169] = '#007BA7';
                // Cerulean blue
                colors[170] = '#2A52BE';
                // Cerulean frost
                colors[171] = '#6D9BC3';
                // CG Blue
                colors[172] = '#007AA5';
                // CG Red
                colors[173] = '#E03C31';
                // Chamoisee
                colors[174] = '#A0785A';
                // Champagne
                colors[175] = '#F7E7CE';
                // Charcoal
                colors[176] = '#36454F';
                // Charleston green
                colors[177] = '#232B2B';
                // Charm pink
                colors[178] = '#E68FAC';
                // Chartreuse (traditional)
                colors[179] = '#DFFF00';
                // Chartreuse (web)
                colors[180] = '#7FFF00';
                // Cherry
                colors[181] = '#DE3163';
                // Cherry blossom pink
                colors[182] = '#FFB7C5';
                // Chestnut
                colors[183] = '#954535';
                // China pink
                colors[184] = '#DE6FA1';
                // China rose
                colors[185] = '#A8516E';
                // Chinese red
                colors[186] = '#AA381E';
                // Chinese violet
                colors[187] = '#856088';
                // Chocolate (traditional)
                colors[188] = '#7B3F00';
                // Chocolate (web)
                colors[189] = '#D2691E';
                // Chrome yellow
                colors[190] = '#FFA700';
                // Cinereous
                colors[191] = '#98817B';
                // Cinnabar
                colors[192] = '#E34234';
                // Cinnamon
                colors[193] = '#D2691E';
                // Citrine
                colors[194] = '#E4D00A';
                // Citron
                colors[195] = '#9FA91F';
                // Claret
                colors[196] = '#7F1734';
                // Classic rose
                colors[197] = '#FBCCE7';
                // Cobalt
                colors[198] = '#0047AB';
                // Cocoa brown
                colors[199] = '#D2691E';
                // Coconut
                colors[200] = '#965A3E';
                // Coffee
                colors[201] = '#6F4E37';
                // Columbia blue
                colors[202] = '#9BDDFF';
                // Congo pink
                colors[203] = '#F88379';
                // Cool black
                colors[204] = '#002E63';
                // Cool grey
                colors[205] = '#8C92AC';
                // Copper
                colors[206] = '#B87333';
                // Copper (Crayola)
                colors[207] = '#DA8A67';
                // Copper penny
                colors[208] = '#AD6F69';
                // Copper red
                colors[209] = '#CB6D51';
                // Copper rose
                colors[210] = '#996666';
                // Coquelicot
                colors[211] = '#FF3800';
                // Coral
                colors[212] = '#FF7F50';
                // Coral pink
                colors[213] = '#F88379';
                // Coral red
                colors[214] = '#FF4040';
                // Cordovan
                colors[215] = '#893F45';
                // Corn
                colors[216] = '#FBEC5D';
                // Cornell Red
                colors[217] = '#B31B1B';
                // Cornflower blue
                colors[218] = '#6495ED';
                // Cornsilk
                colors[219] = '#FFF8DC';
                // Cosmic latte
                colors[220] = '#FFF8E7';
                // Cotton candy
                colors[221] = '#FFBCD9';
                // Cream
                colors[222] = '#FFFDD0';
                // Crimson
                colors[223] = '#DC143C';
                // Crimson glory
                colors[224] = '#BE0032';
                // Cyan
                colors[225] = '#00FFFF';
                // Cyan (process)
                colors[226] = '#00B7EB';
                // Cyber grape
                colors[227] = '#58427C';
                // Cyber yellow
                colors[228] = '#FFD300';
                // Daffodil
                colors[229] = '#FFFF31';
                // Dandelion
                colors[230] = '#F0E130';
                // Dark blue
                colors[231] = '#00008B';
                // Dark blue-gray
                colors[232] = '#666699';
                // Dark brown
                colors[233] = '#654321';
                // Dark byzantium
                colors[234] = '#5D3954';
                // Dark candy apple red
                colors[235] = '#A40000';
                // Dark cerulean
                colors[236] = '#08457E';
                // Dark chestnut
                colors[237] = '#986960';
                // Dark coral
                colors[238] = '#CD5B45';
                // Dark cyan
                colors[239] = '#008B8B';
                // Dark electric blue
                colors[240] = '#536878';
                // Dark goldenrod
                colors[241] = '#B8860B';
                // Dark gray
                colors[242] = '#A9A9A9';
                // Dark green
                colors[243] = '#013220';
                // Dark imperial blue
                colors[244] = '#00416A';
                // Dark jungle green
                colors[245] = '#1A2421';
                // Dark khaki
                colors[246] = '#BDB76B';
                // Dark lava
                colors[247] = '#483C32';
                // Dark lavender
                colors[248] = '#734F96';
                // Dark liver
                colors[249] = '#534B4F';
                // Dark liver (horses)
                colors[250] = '#543D37';
                // Dark magenta
                colors[251] = '#8B008B';
                // Dark midnight blue
                colors[252] = '#003366';
                // Dark moss green
                colors[253] = '#4A5D23';
                // Dark olive green
                colors[254] = '#556B2F';
                // Dark orange
                colors[255] = '#FF8C00';
                // Dark orchid
                colors[256] = '#9932CC';
                // Dark pastel blue
                colors[257] = '#779ECB';
                // Dark pastel green
                colors[258] = '#03C03C';
                // Dark pastel purple
                colors[259] = '#966FD6';
                // Dark pastel red
                colors[260] = '#C23B22';
                // Dark pink
                colors[261] = '#E75480';
                // Dark powder blue
                colors[262] = '#003399';
                // Dark raspberry
                colors[263] = '#872657';
                // Dark red
                colors[264] = '#8B0000';
                // Dark salmon
                colors[265] = '#E9967A';
                // Dark scarlet
                colors[266] = '#560319';
                // Dark sea green
                colors[267] = '#8FBC8F';
                // Dark sienna
                colors[268] = '#3C1414';
                // Dark sky blue
                colors[269] = '#8CBED6';
                // Dark slate blue
                colors[270] = '#483D8B';
                // Dark slate gray
                colors[271] = '#2F4F4F';
                // Dark spring green
                colors[272] = '#177245';
                // Dark tan
                colors[273] = '#918151';
                // Dark tangerine
                colors[274] = '#FFA812';
                // Dark taupe
                colors[275] = '#483C32';
                // Dark terra cotta
                colors[276] = '#CC4E5C';
                // Dark turquoise
                colors[277] = '#00CED1';
                // Dark vanilla
                colors[278] = '#D1BEA8';
                // Dark violet
                colors[279] = '#9400D3';
                // Dark yellow
                colors[280] = '#9B870C';
                // Dartmouth green
                colors[281] = '#00703C';
                // Davy's grey
                colors[282] = '#555555';
                // Debian red
                colors[283] = '#D70A53';
                // Deep carmine
                colors[284] = '#A9203E';
                // Deep carmine pink
                colors[285] = '#EF3038';
                // Deep carrot orange
                colors[286] = '#E9692C';
                // Deep cerise
                colors[287] = '#DA3287';
                // Deep champagne
                colors[288] = '#FAD6A5';
                // Deep chestnut
                colors[289] = '#B94E48';
                // Deep coffee
                colors[290] = '#704241';
                // Deep fuchsia
                colors[291] = '#C154C1';
                // Deep jungle green
                colors[292] = '#004B49';
                // Deep lemon
                colors[293] = '#F5C71A';
                // Deep lilac
                colors[294] = '#9955BB';
                // Deep magenta
                colors[295] = '#CC00CC';
                // Deep mauve
                colors[296] = '#D473D4';
                // Deep moss green
                colors[297] = '#355E3B';
                // Deep peach
                colors[298] = '#FFCBA4';
                // Deep pink
                colors[299] = '#FF1493';
                // Deep ruby
                colors[300] = '#843F5B';
                // Deep saffron
                colors[301] = '#FF9933';
                // Deep sky blue
                colors[302] = '#00BFFF';
                // Deep Space Sparkle
                colors[303] = '#4A646C';
                // Deep Taupe
                colors[304] = '#7E5E60';
                // Deep Tuscan red
                colors[305] = '#66424D';
                // Deer
                colors[306] = '#BA8759';
                // Denim
                colors[307] = '#1560BD';
                // Desert
                colors[308] = '#C19A6B';
                // Desert sand
                colors[309] = '#EDC9AF';
                // Diamond
                colors[310] = '#B9F2FF';
                // Dim gray
                colors[311] = '#696969';
                // Dirt
                colors[312] = '#9B7653';
                // Dodger blue
                colors[313] = '#1E90FF';
                // Dogwood rose
                colors[314] = '#D71868';
                // Dollar bill
                colors[315] = '#85BB65';
                // Donkey Brown
                colors[316] = '#664C28';
                // Drab
                colors[317] = '#967117';
                // Duke blue
                colors[318] = '#00009C';
                // Dust storm
                colors[319] = '#E5CCC9';
                // Earth yellow
                colors[320] = '#E1A95F';
                // Ebony
                colors[321] = '#555D50';
                // Ecru
                colors[322] = '#C2B280';
                // Eggplant
                colors[323] = '#614051';
                // Eggshell
                colors[324] = '#F0EAD6';
                // Egyptian blue
                colors[325] = '#1034A6';
                // Electric blue
                colors[326] = '#7DF9FF';
                // Electric crimson
                colors[327] = '#FF003F';
                // Electric cyan
                colors[328] = '#00FFFF';
                // Electric green
                colors[329] = '#00FF00';
                // Electric indigo
                colors[330] = '#6F00FF';
                // Electric lavender
                colors[331] = '#F4BBFF';
                // Electric lime
                colors[332] = '#CCFF00';
                // Air superiority blue
                colors[333] = '#72A0C1';
                // Electric ultramarine
                colors[334] = '#3F00FF';
                // Electric violet
                colors[335] = '#8F00FF';
                // Electric yellow
                colors[336] = '#FFFF33';
                // Emerald
                colors[337] = '#50C878';
                // English green
                colors[338] = '#1B4D3E';
                // English lavender
                colors[339] = '#B48395';
                // English red
                colors[340] = '#AB4B52';
                // English violet
                colors[341] = '#563C5C';
                // Eton blue
                colors[342] = '#96C8A2';
                // Eucalyptus
                colors[343] = '#44D7A8';
                // Fallow
                colors[344] = '#C19A6B';
                // Falu red
                colors[345] = '#801818';
                // Fandango
                colors[346] = '#B53389';
                // Fandango pink
                colors[347] = '#DE5285';
                // Fashion fuchsia
                colors[348] = '#F400A1';
                // Fawn
                colors[349] = '#E5AA70';
                // Feldgrau
                colors[350] = '#4D5D53';
                // Feldspar
                colors[351] = '#FDD5B1';
                // Fern green
                colors[352] = '#4F7942';
                // Ferrari Red
                colors[353] = '#FF2800';
                // Field drab
                colors[354] = '#6C541E';
                // Firebrick
                colors[355] = '#B22222';
                // Fire engine red
                colors[356] = '#CE2029';
                // Flame
                colors[357] = '#E25822';
                // Flamingo pink
                colors[358] = '#FC8EAC';
                // Flattery
                colors[359] = '#6B4423';
                // Flavescent
                colors[360] = '#F7E98E';
                // Flax
                colors[361] = '#EEDC82';
                // Flirt
                colors[362] = '#A2006D';
                // Mughal green
                colors[363] = '#306030';
                // Fluorescent orange
                colors[364] = '#FFBF00';
                // Fluorescent pink
                colors[365] = '#FF1493';
                // Fluorescent yellow
                colors[366] = '#CCFF00';
                // Folly
                colors[367] = '#FF004F';
                // Forest green (traditional)
                colors[368] = '#014421';
                // Forest green (web)
                colors[369] = '#228B22';
                // French beige
                colors[370] = '#A67B5B';
                // French bistre
                colors[371] = '#856D4D';
                // French blue
                colors[372] = '#0072BB';
                // French lilac
                colors[373] = '#86608E';
                // French lime
                colors[374] = '#9EFD38';
                // French mauve
                colors[375] = '#D473D4';
                // French raspberry
                colors[376] = '#C72C48';
                // French rose
                colors[377] = '#F64A8A';
                // French sky blue
                colors[378] = '#77B5FE';
                // French wine
                colors[379] = '#AC1E44';
                // Fresh Air
                colors[380] = '#A6E7FF';
                // Fuchsia
                colors[381] = '#FF00FF';
                // Fuchsia (Crayola)
                colors[382] = '#C154C1';
                // Fuchsia pink
                colors[383] = '#FF77FF';
                // Fuchsia rose
                colors[384] = '#C74375';
                // Fulvous
                colors[385] = '#E48400';
                // Fuzzy Wuzzy
                colors[386] = '#CC6666';
                // Gainsboro
                colors[387] = '#DCDCDC';
                // Gamboge
                colors[388] = '#E49B0F';
                // Generic viridian
                colors[389] = '#007F66';
                // MSU Green
                colors[390] = '#18453B';
                // Giants orange
                colors[391] = '#FE5A1D';
                // Ginger
                colors[392] = '#B06500';
                // Glaucous
                colors[393] = '#6082B6';
                // Glitter
                colors[394] = '#E6E8FA';
                // GO green
                colors[395] = '#00AB66';
                // Gold (metallic)
                colors[396] = '#D4AF37';
                // Gold (web) (Golden)
                colors[397] = '#FFD700';
                // Gold Fusion
                colors[398] = '#85754E';
                // Golden brown
                colors[399] = '#996515';
                // Golden poppy
                colors[400] = '#FCC200';
                // Golden yellow
                colors[401] = '#FFDF00';
                // Goldenrod
                colors[402] = '#DAA520';
                // Granny Smith Apple
                colors[403] = '#A8E4A0';
                // Grape
                colors[404] = '#6F2DA8';
                // Gray
                colors[405] = '#808080';
                // Gray (HTML/CSS gray)
                colors[406] = '#808080';
                // Gray (X11 gray)
                colors[407] = '#BEBEBE';
                // Gray-asparagus
                colors[408] = '#465945';
                // Gray-blue
                colors[409] = '#8C92AC';
                // Green (color wheel) (X11 green)
                colors[410] = '#00FF00';
                // Green (Crayola)
                colors[411] = '#1CAC78';
                // Green (HTML/CSS color)
                colors[412] = '#008000';
                // Green (Munsell)
                colors[413] = '#00A877';
                // Green (NCS)
                colors[414] = '#009F6B';
                // Green (pigment)
                colors[415] = '#00A550';
                // Green (RYB)
                colors[416] = '#66B032';
                // Green-yellow
                colors[417] = '#ADFF2F';
                // Grullo
                colors[418] = '#A99A86';
                // Guppie green
                colors[419] = '#00FF7F';
                // Halaya ube
                colors[420] = '#663854';
                // Han blue
                colors[421] = '#446CCF';
                // Han purple
                colors[422] = '#5218FA';
                // Hansa yellow
                colors[423] = '#E9D66B';
                // Harlequin
                colors[424] = '#3FFF00';
                // Harvard crimson
                colors[425] = '#C90016';
                // Harvest gold
                colors[426] = '#DA9100';
                // Heart Gold
                colors[427] = '#808000';
                // Heliotrope
                colors[428] = '#DF73FF';
                // Hollywood cerise
                colors[429] = '#F400A1';
                // Honeydew
                colors[430] = '#F0FFF0';
                // Honolulu blue
                colors[431] = '#006DB0';
                // Hooker's green
                colors[432] = '#49796B';
                // Hot magenta
                colors[433] = '#FF1DCE';
                // Hot pink
                colors[434] = '#FF69B4';
                // Hunter green
                colors[435] = '#355E3B';
                // Iceberg
                colors[436] = '#71A6D2';
                // Icterine
                colors[437] = '#FCF75E';
                // Illuminating Emerald
                colors[438] = '#319177';
                // Imperial
                colors[439] = '#602F6B';
                // Imperial blue
                colors[440] = '#002395';
                // Imperial purple
                colors[441] = '#66023C';
                // Imperial red
                colors[442] = '#ED2939';
                // Inchworm
                colors[443] = '#B2EC5D';
                // Independence
                colors[444] = '#4C516D';
                // India green
                colors[445] = '#138808';
                // Indian red
                colors[446] = '#CD5C5C';
                // Indian yellow
                colors[447] = '#E3A857';
                // Indigo
                colors[448] = '#6F00FF';
                // Indigo dye
                colors[449] = '#091F92';
                // Indigo (web)
                colors[450] = '#4B0082';
                // International Klein Blue
                colors[451] = '#002FA7';
                // International orange (aerospace)
                colors[452] = '#FF4F00';
                // International orange (engineering)
                colors[453] = '#BA160C';
                // International orange (Golden Gate Bridge)
                colors[454] = '#C0362C';
                // Iris
                colors[455] = '#5A4FCF';
                // Irresistible
                colors[456] = '#B3446C';
                // Isabelline
                colors[457] = '#F4F0EC';
                // Islamic green
                colors[458] = '#009000';
                // Italian sky blue
                colors[459] = '#B2FFFF';
                // Ivory
                colors[460] = '#FFFFF0';
                // Jade
                colors[461] = '#00A86B';
                // Japanese indigo
                colors[462] = '#264348';
                // Japanese violet
                colors[463] = '#5B3256';
                // Jasmine
                colors[464] = '#F8DE7E';
                // Jasper
                colors[465] = '#D73B3E';
                // Jazzberry jam
                colors[466] = '#A50B5E';
                // Jelly Bean
                colors[467] = '#DA614E';
                // Jet
                colors[468] = '#343434';
                // Jonquil
                colors[469] = '#F4CA16';
                // June bud
                colors[470] = '#BDDA57';
                // Jungle green
                colors[471] = '#29AB87';
                // Kelly green
                colors[472] = '#4CBB17';
                // Kenyan copper
                colors[473] = '#7C1C05';
                // Keppel
                colors[474] = '#3AB09E';
                // Khaki (HTML/CSS) (Khaki)
                colors[475] = '#C3B091';
                // Khaki (X11) (Light khaki)
                colors[476] = '#F0E68C';
                // Kobe
                colors[477] = '#882D17';
                // Kobi
                colors[478] = '#E79FC4';
                // Kombu green
                colors[479] = '#354230';
                // KU Crimson
                colors[480] = '#E8000D';
                // La Salle Green
                colors[481] = '#087830';
                // Languid lavender
                colors[482] = '#D6CADD';
                // Lapis lazuli
                colors[483] = '#26619C';
                // Laser Lemon
                colors[484] = '#FFFF66';
                // Laurel green
                colors[485] = '#A9BA9D';
                // Lava
                colors[486] = '#CF1020';
                // Lavender (floral)
                colors[487] = '#B57EDC';
                // Lavender (web)
                colors[488] = '#E6E6FA';
                // Lavender blue
                colors[489] = '#CCCCFF';
                // Lavender blush
                colors[490] = '#FFF0F5';
                // Lavender gray
                colors[491] = '#C4C3D0';
                // Lavender indigo
                colors[492] = '#9457EB';
                // Lavender magenta
                colors[493] = '#EE82EE';
                // Lavender mist
                colors[494] = '#E6E6FA';
                // Lavender pink
                colors[495] = '#FBAED2';
                // Lavender purple
                colors[496] = '#967BB6';
                // Lavender rose
                colors[497] = '#FBA0E3';
                // Lawn green
                colors[498] = '#7CFC00';
                // Lemon
                colors[499] = '#FFF700';
                // Lemon chiffon
                colors[500] = '#FFFACD';
                // Lemon curry
                colors[501] = '#CCA01D';
                // Lemon glacier
                colors[502] = '#FDFF00';
                // Lemon lime
                colors[503] = '#E3FF00';
                // Lemon meringue
                colors[504] = '#F6EABE';
                // Lemon yellow
                colors[505] = '#FFF44F';
                // Licorice
                colors[506] = '#1A1110';
                // Liberty
                colors[507] = '#545AA7';
                // Light apricot
                colors[508] = '#FDD5B1';
                // Light blue
                colors[509] = '#ADD8E6';
                // Light brown
                colors[510] = '#B5651D';
                // Light carmine pink
                colors[511] = '#E66771';
                // Light coral
                colors[512] = '#F08080';
                // Light cornflower blue
                colors[513] = '#93CCEA';
                // Light crimson
                colors[514] = '#F56991';
                // Light cyan
                colors[515] = '#E0FFFF';
                // Light fuchsia pink
                colors[516] = '#F984EF';
                // Light goldenrod yellow
                colors[517] = '#FAFAD2';
                // Light gray
                colors[518] = '#D3D3D3';
                // Light green
                colors[519] = '#90EE90';
                // Light khaki
                colors[520] = '#F0E68C';
                // Light medium orchid
                colors[521] = '#D39BCB';
                // Light moss green
                colors[522] = '#ADDFAD';
                // Light orchid
                colors[523] = '#E6A8D7';
                // Light pastel purple
                colors[524] = '#B19CD9';
                // Light pink
                colors[525] = '#FFB6C1';
                // Light red ochre
                colors[526] = '#E97451';
                // Light salmon
                colors[527] = '#FFA07A';
                // Light salmon pink
                colors[528] = '#FF9999';
                // Light sea green
                colors[529] = '#20B2AA';
                // Light sky blue
                colors[530] = '#87CEFA';
                // Light slate gray
                colors[531] = '#778899';
                // Light steel blue
                colors[532] = '#B0C4DE';
                // Light taupe
                colors[533] = '#B38B6D';
                // Light Thulian pink
                colors[534] = '#E68FAC';
                // Light yellow
                colors[535] = '#FFFFE0';
                // Lilac
                colors[536] = '#C8A2C8';
                // Lime (color wheel)
                colors[537] = '#BFFF00';
                // Lime (web) (X11 green)
                colors[538] = '#00FF00';
                // Lime green
                colors[539] = '#32CD32';
                // Limerick
                colors[540] = '#9DC209';
                // Lincoln green
                colors[541] = '#195905';
                // Linen
                colors[542] = '#FAF0E6';
                // Lion
                colors[543] = '#C19A6B';
                // Little boy blue
                colors[544] = '#6CA0DC';
                // Liver
                colors[545] = '#674C47';
                // Liver (dogs)
                colors[546] = '#B86D29';
                // Liver (organ)
                colors[547] = '#6C2E1F';
                // Liver chestnut
                colors[548] = '#987456';
                // Lumber
                colors[549] = '#FFE4CD';
                // Lust
                colors[550] = '#E62020';
                // Magenta
                colors[551] = '#FF00FF';
                // Magenta (Crayola)
                colors[552] = '#FF55A3';
                // Magenta (dye)
                colors[553] = '#CA1F7B';
                // Magenta (Pantone)
                colors[554] = '#D0417E';
                // Magenta (process)
                colors[555] = '#FF0090';
                // Magenta haze
                colors[556] = '#9F4576';
                // Magic mint
                colors[557] = '#AAF0D1';
                // Magnolia
                colors[558] = '#F8F4FF';
                // Mahogany
                colors[559] = '#C04000';
                // Maize
                colors[560] = '#FBEC5D';
                // Majorelle Blue
                colors[561] = '#6050DC';
                // Malachite
                colors[562] = '#0BDA51';
                // Manatee
                colors[563] = '#979AAA';
                // Mango Tango
                colors[564] = '#FF8243';
                // Mantis
                colors[565] = '#74C365';
                // Mardi Gras
                colors[566] = '#880085';
                // Maroon (Crayola)
                colors[567] = '#C32148';
                // Maroon (HTML/CSS)
                colors[568] = '#800000';
                // Maroon (X11)
                colors[569] = '#B03060';
                // Mauve
                colors[570] = '#E0B0FF';
                // Mauve taupe
                colors[571] = '#915F6D';
                // Mauvelous
                colors[572] = '#EF98AA';
                // Maya blue
                colors[573] = '#73C2FB';
                // Meat brown
                colors[574] = '#E5B73B';
                // Medium aquamarine
                colors[575] = '#66DDAA';
                // Medium blue
                colors[576] = '#0000CD';
                // Medium candy apple red
                colors[577] = '#E2062C';
                // Medium carmine
                colors[578] = '#AF4035';
                // Medium champagne
                colors[579] = '#F3E5AB';
                // Medium electric blue
                colors[580] = '#035096';
                // Medium jungle green
                colors[581] = '#1C352D';
                // Medium lavender magenta
                colors[582] = '#DDA0DD';
                // Medium orchid
                colors[583] = '#BA55D3';
                // Medium Persian blue
                colors[584] = '#0067A5';
                // Medium purple
                colors[585] = '#9370DB';
                // Medium red-violet
                colors[586] = '#BB3385';
                // Medium ruby
                colors[587] = '#AA4069';
                // Medium sea green
                colors[588] = '#3CB371';
                // Medium sky blue
                colors[589] = '#80DAEB';
                // Medium slate blue
                colors[590] = '#7B68EE';
                // Medium spring bud
                colors[591] = '#C9DC87';
                // Medium spring green
                colors[592] = '#00FA9A';
                // Medium taupe
                colors[593] = '#674C47';
                // Medium turquoise
                colors[594] = '#48D1CC';
                // Medium Tuscan red
                colors[595] = '#79443B';
                // Medium vermilion
                colors[596] = '#D9603B';
                // Medium violet-red
                colors[597] = '#C71585';
                // Mellow apricot
                colors[598] = '#F8B878';
                // Mellow yellow
                colors[599] = '#F8DE7E';
                // Melon
                colors[600] = '#FDBCB4';
                // Metallic Seaweed
                colors[601] = '#0A7E8C';
                // Metallic Sunburst
                colors[602] = '#9C7C38';
                // Mexican pink
                colors[603] = '#E4007C';
                // Midnight blue
                colors[604] = '#191970';
                // Midnight green (eagle green)
                colors[605] = '#004953';
                // Midori
                colors[606] = '#E3F988';
                // Mikado yellow
                colors[607] = '#FFC40C';
                // Mint
                colors[608] = '#3EB489';
                // Mint cream
                colors[609] = '#F5FFFA';
                // Mint green
                colors[610] = '#98FF98';
                // Misty rose
                colors[611] = '#FFE4E1';
                // Moccasin
                colors[612] = '#FAEBD7';
                // Mode beige
                colors[613] = '#967117';
                // Moonstone blue
                colors[614] = '#73A9C2';
                // Mordant red 19
                colors[615] = '#AE0C00';
                // Moss green
                colors[616] = '#8A9A5B';
                // Mountain Meadow
                colors[617] = '#30BA8F';
                // Mountbatten pink
                colors[618] = '#997A8D';
                
                // Pickup any custom colours
                var labels = new Array();
                $.each(settings.data.groups, function(i, item) {
                    $.each(item.values, function(i, item) {
                        if ($.inArray(item.label, labels) == -1) {
                            labels[labels.length] = item.label;
                            if (item.color != undefined) {
                                colors[i] = item.color;   
                            }
                        }
                    });
                });
            }
        };
        
        methods.setupcolors();
        
        return this.each(function() {
            var c = $(this)[0];
            var ctx = c.getContext("2d");
            
            // Store the width and height of the canvas.
            vars.width = $(this).width();
            vars.height = $(this).height();
            
            // Setup a default padding of 15 pixels to ensure room for the value and axis labels.
            vars.paddingLeft = settings.paddingLeft < 15 ? 15 : settings.paddingLeft;
            vars.paddingTop = settings.paddingTop < 15 ? 15 : settings.paddingTop;
            vars.paddingRight = settings.paddingRight < 15 ? 15 : settings.paddingRight;
            vars.paddingBottom = settings.paddingBottom < 15 ? 15 : settings.paddingBottom;
            
            // If we are showing a legend, we need to add additional padding to the right
            // to ensure we have enough room. To determine how much we need we'll need to
            // check the largest label width and add a few pixels on for padding of that.
            if (settings.showLegend && settings.data.groups.length > 0) {
                vars.paddingRight += methods.getLargestLabel(ctx) + 40;
                methods.drawLegend(ctx);
            }
            
            // Store the boundaries of the chart for quick access.
            var top = vars.paddingTop;
            var bottom = vars.height - vars.paddingBottom - 35;
            var left = vars.paddingLeft;
            var right = vars.width - vars.paddingRight;
            var chartHeight = bottom - top;

            // Draw the labels if the flag is set.
            if (settings.showLabels) {
                ctx.font = "bold 14px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                ctx.textAlign = 'center';
                ctx.fillText(settings.data.xLabel, (right + left) / 2, bottom + 45);
                methods.drawVerticalLabel(ctx, vars.paddingLeft, top + (chartHeight / 2));
                
                // Move the left boundary by the height of the previously drawn label
                // in order to prevent value labels clashing with the axis label.
                left += 14;
            }

            // Get the lowest and highest values to plot the range along the y-axis.
            ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            var lowestValue = methods.getSmallestValue();
            var highestValue = methods.getLargestValue();
            var labelGap = chartHeight / 10;
            var largestLabel = 0;            
            
            // If the lowest value is equal to or more than zero, calculate
            // labels up to the maximum value from zero.
            if (lowestValue >= 0) {
                var labels = new Array();
                for (var i = 0; i <= 10; i++) {
                    var labelValue;
                    
                    if (i < 10) {
                        labelValue = (highestValue - (highestValue * ((i * 10) / 100)));
                    }
                    else {
                        labelValue = 0; 
                    }
                    
                    var labelDimensions = ctx.measureText(Math.round(labelValue));
                    if (labelDimensions.width > largestLabel) {
                        largestLabel = labelDimensions.width;
                    }
                    
                    labels[i] = Math.round(labelValue);
                }
                
                left = left + largestLabel;
                
                // Draw the labels and the horizontal markers in the background.
                $.each(labels, function(i, item) {
                    ctx.fillText(item, left, top + (i * labelGap));
                    ctx.beginPath();
                    ctx.strokeStyle = "#CCCCCC";
                    ctx.lineWidth = 1;
                    ctx.moveTo(left + 5, Math.round(top + (i * labelGap)) + 0.5);
                    ctx.lineTo(right, Math.round(top + (i * labelGap)) + 0.5);
                    ctx.stroke();
                    ctx.closePath();
                });
            }
            
            // Update the bounds of the chart and setup the width of each bar.
            left = left + 5;
            var chartWidth = right - left;
            var barCount = methods.getBarCount();
            var groupSpacing = 15;
            var barWidth = (chartWidth - (groupSpacing * (settings.data.groups.length + 1))) / barCount;
            var currentXPos = left;
            
            // Draw the bars
            ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";
            $.each(settings.data.groups, function(i, item) {
                currentXPos += groupSpacing;
                $.each(item.values, function(i, item) {
                    var barHeight = chartHeight * (item.value / highestValue);
                    ctx.beginPath();
                    ctx.rect(currentXPos, bottom - (barHeight + 0), barWidth, barHeight);
                    ctx.fillStyle = colors[i];
                    ctx.fill();
                    ctx.closePath();
                    currentXPos += barWidth;
                    
                    if (settings.data.groups.length == 1) {
                        ctx.textAlign = 'center';
                        ctx.fillStyle = "black";
                        ctx.fillText(item.label, currentXPos - (barWidth / 2), bottom + 15);
                    }
                });
                
                if (settings.data.groups.length > 1) {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "black";
                    ctx.fillText(item.label, currentXPos - ((item.values.length / 2) * barWidth), bottom + 15);
                }
            });
        
            // Draw the axis
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.moveTo(left + 0.5, top);
            ctx.lineTo(left + 0.5, bottom + 0.5);
            ctx.lineTo(right, bottom + 0.5);
            ctx.stroke();
            ctx.closePath();
        });  
    };
})(jQuery);