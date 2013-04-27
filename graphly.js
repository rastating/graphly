// Copyright (C) 2013 rastating
//
// Version 0.01
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
            'json'          : null,
            'paddingTop'    : 1,
            'paddingLeft'   : 1,
            'paddingBottom' : 1,
            'paddingRight'  : 1,
            'showLabels'    : true,
            'showLegend'    : true
        }, options);
        
        var colours = new Array();
        var methods = {
            getBarCount : function() {
                var retval = 0;
                $.each(settings.json.groups, function(i, item) {
                    retval += item.values.length;
                });
                
                return retval;
            },
            getLargestValue : function() {
                var retval = null;
                $.each(settings.json.groups, function(i, item) {
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
                $.each(settings.json.groups, function(i, item) {
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
                
                $.each(settings.json.groups, function(i, item) {
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
                ctx.fillText(settings.json.yLabel, x, y);
                
                ctx.restore();   
            },
            drawLegend : function(ctx) {
                var x = settings.width - settings.paddingRight + 15;
                var y = settings.paddingTop + 5;
                var labels = new Array();
                
                $.each(settings.json.groups, function(i, item) {
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
                    ctx.fillStyle = colours[i];
                    ctx.fill();
                    ctx.closePath();
                    ctx.textBaseline = "top";
                    ctx.fillText(item, x + 13, labelY - 1); 
                });
                
                ctx.restore();
            },
            setupColours : function() {
                // Aero
                colours[0] = '#7CB9E8';
                // Carmine red
                colours[1] = '#FF0038';
                // Amber
                colours[2] = '#FFBF00';
                // Android green
                colours[3] = '#A4C639';
                // Air Force blue (USAF)
                colours[4] = '#00308F';
                // Electric purple
                colours[5] = '#BF00FF';
                // Alabama Crimson
                colours[6] = '#A32638';
                // Mustard
                colours[7] = '#FFDB58';
                // Alizarin crimson
                colours[8] = '#E32636';
                // Alloy orange
                colours[9] = '#C46210';
                // Almond
                colours[10] = '#EFDECD';
                // Amaranth
                colours[11] = '#E52B50';
                // Amazon
                colours[12] = '#3B7A57';
                // Aero blue
                colours[13] = '#C9FFE5';
                // SAE/ECE Amber (color)
                colours[14] = '#FF7E00';
                // American rose
                colours[15] = '#FF033E';
                // Amethyst
                colours[16] = '#9966CC';
                // African violet
                colours[17] = '#B284BE';
                // Myrtle green
                colours[18] = '#317873';
                // Antique brass
                colours[19] = '#CD9575';
                // Antique bronze
                colours[20] = '#665D1E';
                // Antique fuchsia
                colours[21] = '#915C83';
                // Antique ruby
                colours[22] = '#841B2D';
                // Mulberry
                colours[23] = '#C54B8C';
                // Ao (English)
                colours[24] = '#008000';
                // Apple green
                colours[25] = '#8DB600';
                // Apricot
                colours[26] = '#FBCEB1';
                // Aqua
                colours[27] = '#00FFFF';
                // Aquamarine
                colours[28] = '#7FFFD4';
                // Army green
                colours[29] = '#4B5320';
                // Arsenic
                colours[30] = '#3B444B';
                // Arylide yellow
                colours[31] = '#E9D66B';
                // Ash grey
                colours[32] = '#B2BEB5';
                // Asparagus
                colours[33] = '#87A96B';
                // Atomic tangerine
                colours[34] = '#FF9966';
                // Auburn
                colours[35] = '#A52A2A';
                // Aureolin
                colours[36] = '#FDEE00';
                // AuroMetalSaurus
                colours[37] = '#6E7F80';
                // Avocado
                colours[38] = '#568203';
                // Azure
                colours[39] = '#007FFF';
                // Azure mist/web
                colours[40] = '#F0FFFF';
                // Baby blue
                colours[41] = '#89CFF0';
                // Baby blue eyes
                colours[42] = '#A1CAF1';
                // Baby pink
                colours[43] = '#F4C2C2';
                // Baby powder
                colours[44] = '#FEFEFA';
                // Baker-Miller pink
                colours[45] = '#FF91AF';
                // Ball blue
                colours[46] = '#21ABCD';
                // Banana Mania
                colours[47] = '#FAE7B5';
                // Banana yellow
                colours[48] = '#FFE135';
                // Barbie pink
                colours[49] = '#E0218A';
                // Barn red
                colours[50] = '#7C0A02';
                // Battleship grey
                colours[51] = '#848482';
                // Bazaar
                colours[52] = '#98777B';
                // Beau blue
                colours[53] = '#BCD4E6';
                // Beaver
                colours[54] = '#9F8170';
                // Beige
                colours[55] = '#F5F5DC';
                // B'dazzled blue
                colours[56] = '#2E5894';
                // Big dip o'ruby
                colours[57] = '#9C2542';
                // Bisque
                colours[58] = '#FFE4C4';
                // Bistre
                colours[59] = '#3D2B1F';
                // Bistre brown
                colours[60] = '#967117';
                // Bitter lemon
                colours[61] = '#CAE00D';
                // Bitter lime
                colours[62] = '#BFFF00';
                // Bittersweet
                colours[63] = '#FE6F5E';
                // Bittersweet shimmer
                colours[64] = '#BF4F51';
                // Black
                colours[65] = '#000000';
                // Black bean
                colours[66] = '#3D0C02';
                // Black leather jacket
                colours[67] = '#253529';
                // Black olive
                colours[68] = '#3B3C36';
                // Blanched almond
                colours[69] = '#FFEBCD';
                // Blast-off bronze
                colours[70] = '#A57164';
                // Bleu de France
                colours[71] = '#318CE7';
                // Blizzard Blue
                colours[72] = '#ACE5EE';
                // Blond
                colours[73] = '#FAF0BE';
                // Blue
                colours[74] = '#0000FF';
                // Blue (Crayola)
                colours[75] = '#1F75FE';
                // Blue (Munsell)
                colours[76] = '#0093AF';
                // Blue (NCS)
                colours[77] = '#0087BD';
                // Blue (pigment)
                colours[78] = '#333399';
                // Blue (RYB)
                colours[79] = '#0247FE';
                // Blue Bell
                colours[80] = '#A2A2D0';
                // Blue-gray
                colours[81] = '#6699CC';
                // Blue-green
                colours[82] = '#0D98BA';
                // Blue sapphire
                colours[83] = '#126180';
                // Blue-violet
                colours[84] = '#8A2BE2';
                // Blue yonder
                colours[85] = '#5072A7';
                // Blueberry
                colours[86] = '#4F86F7';
                // Bluebonnet
                colours[87] = '#1C1CF0';
                // Blush
                colours[88] = '#DE5D83';
                // Bole
                colours[89] = '#79443B';
                // Bondi blue
                colours[90] = '#0095B6';
                // Bone
                colours[91] = '#E3DAC9';
                // Boston University Red
                colours[92] = '#CC0000';
                // Bottle green
                colours[93] = '#006A4E';
                // Boysenberry
                colours[94] = '#873260';
                // Brandeis blue
                colours[95] = '#0070FF';
                // Brass
                colours[96] = '#B5A642';
                // Brick red
                colours[97] = '#CB4154';
                // Bright cerulean
                colours[98] = '#1DACD6';
                // Bright green
                colours[99] = '#66FF00';
                // Bright lavender
                colours[100] = '#BF94E4';
                // Bright maroon
                colours[101] = '#C32148';
                // Bright navy blue
                colours[102] = '#1974D2';
                // Bright pink
                colours[103] = '#FF007F';
                // Bright turquoise
                colours[104] = '#08E8DE';
                // Bright ube
                colours[105] = '#D19FE8';
                // Brilliant lavender
                colours[106] = '#F4BBFF';
                // Brilliant rose
                colours[107] = '#FF55A3';
                // Brink pink
                colours[108] = '#FB607F';
                // British racing green
                colours[109] = '#004225';
                // Bronze
                colours[110] = '#CD7F32';
                // Bronze Yellow
                colours[111] = '#737000';
                // Brown (traditional)
                colours[112] = '#964B00';
                // Brown (web)
                colours[113] = '#A52A2A';
                // Brown-nose
                colours[114] = '#6B4423';
                // Brunswick green
                colours[115] = '#1B4D3E';
                // Bubble gum
                colours[116] = '#FFC1CC';
                // Bubbles
                colours[117] = '#E7FEFF';
                // Buff
                colours[118] = '#F0DC82';
                // Bud green
                colours[119] = '#7BB661';
                // Bulgarian rose
                colours[120] = '#480607';
                // Burgundy
                colours[121] = '#800020';
                // Burlywood
                colours[122] = '#DEB887';
                // Burnt orange
                colours[123] = '#CC5500';
                // Burnt sienna
                colours[124] = '#E97451';
                // Burnt umber
                colours[125] = '#8A3324';
                // Byzantine
                colours[126] = '#BD33A4';
                // Byzantium
                colours[127] = '#702963';
                // Cadet
                colours[128] = '#536872';
                // Cadet blue
                colours[129] = '#5F9EA0';
                // Cadet grey
                colours[130] = '#91A3B0';
                // Cadmium green
                colours[131] = '#006B3C';
                // Cadmium orange
                colours[132] = '#ED872D';
                // Cadmium red
                colours[133] = '#E30022';
                // Cadmium yellow
                colours[134] = '#FFF600';
                // Cafe au lait
                colours[135] = '#A67B5B';
                // Cafe noir
                colours[136] = '#4B3621';
                // Cal Poly green
                colours[137] = '#1E4D2B';
                // Cambridge Blue
                colours[138] = '#A3C1AD';
                // Camel
                colours[139] = '#C19A6B';
                // Cameo pink
                colours[140] = '#EFBBCC';
                // Camouflage green
                colours[141] = '#78866B';
                // Canary yellow
                colours[142] = '#FFEF00';
                // Candy apple red
                colours[143] = '#FF0800';
                // Candy pink
                colours[144] = '#E4717A';
                // Capri
                colours[145] = '#00BFFF';
                // Caput mortuum
                colours[146] = '#592720';
                // Cardinal
                colours[147] = '#C41E3A';
                // Caribbean green
                colours[148] = '#00CC99';
                // Carmine
                colours[149] = '#960018';
                // Carmine (M&P)
                colours[150] = '#D70040';
                // Carmine pink
                colours[151] = '#EB4C42';
                // Air Force blue (RAF)
                colours[152] = '#5D8AA8';
                // Carnation pink
                colours[153] = '#FFA6C9';
                // Carnelian
                colours[154] = '#B31B1B';
                // Carolina blue
                colours[155] = '#99BADD';
                // Carrot orange
                colours[156] = '#ED9121';
                // Castleton green
                colours[157] = '#00563F';
                // Catalina blue
                colours[158] = '#062A78';
                // Catawba
                colours[159] = '#703642';
                // Cedar Chest
                colours[160] = '#C95A49';
                // Ceil
                colours[161] = '#92A1CF';
                // Celadon
                colours[162] = '#ACE1AF';
                // Celadon blue
                colours[163] = '#007BA7';
                // Celadon green
                colours[164] = '#2F847C';
                // Celeste (colour)
                colours[165] = '#B2FFFF';
                // Celestial blue
                colours[166] = '#4997D0';
                // Cerise
                colours[167] = '#DE3163';
                // Cerise pink
                colours[168] = '#EC3B83';
                // Cerulean
                colours[169] = '#007BA7';
                // Cerulean blue
                colours[170] = '#2A52BE';
                // Cerulean frost
                colours[171] = '#6D9BC3';
                // CG Blue
                colours[172] = '#007AA5';
                // CG Red
                colours[173] = '#E03C31';
                // Chamoisee
                colours[174] = '#A0785A';
                // Champagne
                colours[175] = '#F7E7CE';
                // Charcoal
                colours[176] = '#36454F';
                // Charleston green
                colours[177] = '#232B2B';
                // Charm pink
                colours[178] = '#E68FAC';
                // Chartreuse (traditional)
                colours[179] = '#DFFF00';
                // Chartreuse (web)
                colours[180] = '#7FFF00';
                // Cherry
                colours[181] = '#DE3163';
                // Cherry blossom pink
                colours[182] = '#FFB7C5';
                // Chestnut
                colours[183] = '#954535';
                // China pink
                colours[184] = '#DE6FA1';
                // China rose
                colours[185] = '#A8516E';
                // Chinese red
                colours[186] = '#AA381E';
                // Chinese violet
                colours[187] = '#856088';
                // Chocolate (traditional)
                colours[188] = '#7B3F00';
                // Chocolate (web)
                colours[189] = '#D2691E';
                // Chrome yellow
                colours[190] = '#FFA700';
                // Cinereous
                colours[191] = '#98817B';
                // Cinnabar
                colours[192] = '#E34234';
                // Cinnamon
                colours[193] = '#D2691E';
                // Citrine
                colours[194] = '#E4D00A';
                // Citron
                colours[195] = '#9FA91F';
                // Claret
                colours[196] = '#7F1734';
                // Classic rose
                colours[197] = '#FBCCE7';
                // Cobalt
                colours[198] = '#0047AB';
                // Cocoa brown
                colours[199] = '#D2691E';
                // Coconut
                colours[200] = '#965A3E';
                // Coffee
                colours[201] = '#6F4E37';
                // Columbia blue
                colours[202] = '#9BDDFF';
                // Congo pink
                colours[203] = '#F88379';
                // Cool black
                colours[204] = '#002E63';
                // Cool grey
                colours[205] = '#8C92AC';
                // Copper
                colours[206] = '#B87333';
                // Copper (Crayola)
                colours[207] = '#DA8A67';
                // Copper penny
                colours[208] = '#AD6F69';
                // Copper red
                colours[209] = '#CB6D51';
                // Copper rose
                colours[210] = '#996666';
                // Coquelicot
                colours[211] = '#FF3800';
                // Coral
                colours[212] = '#FF7F50';
                // Coral pink
                colours[213] = '#F88379';
                // Coral red
                colours[214] = '#FF4040';
                // Cordovan
                colours[215] = '#893F45';
                // Corn
                colours[216] = '#FBEC5D';
                // Cornell Red
                colours[217] = '#B31B1B';
                // Cornflower blue
                colours[218] = '#6495ED';
                // Cornsilk
                colours[219] = '#FFF8DC';
                // Cosmic latte
                colours[220] = '#FFF8E7';
                // Cotton candy
                colours[221] = '#FFBCD9';
                // Cream
                colours[222] = '#FFFDD0';
                // Crimson
                colours[223] = '#DC143C';
                // Crimson glory
                colours[224] = '#BE0032';
                // Cyan
                colours[225] = '#00FFFF';
                // Cyan (process)
                colours[226] = '#00B7EB';
                // Cyber grape
                colours[227] = '#58427C';
                // Cyber yellow
                colours[228] = '#FFD300';
                // Daffodil
                colours[229] = '#FFFF31';
                // Dandelion
                colours[230] = '#F0E130';
                // Dark blue
                colours[231] = '#00008B';
                // Dark blue-gray
                colours[232] = '#666699';
                // Dark brown
                colours[233] = '#654321';
                // Dark byzantium
                colours[234] = '#5D3954';
                // Dark candy apple red
                colours[235] = '#A40000';
                // Dark cerulean
                colours[236] = '#08457E';
                // Dark chestnut
                colours[237] = '#986960';
                // Dark coral
                colours[238] = '#CD5B45';
                // Dark cyan
                colours[239] = '#008B8B';
                // Dark electric blue
                colours[240] = '#536878';
                // Dark goldenrod
                colours[241] = '#B8860B';
                // Dark gray
                colours[242] = '#A9A9A9';
                // Dark green
                colours[243] = '#013220';
                // Dark imperial blue
                colours[244] = '#00416A';
                // Dark jungle green
                colours[245] = '#1A2421';
                // Dark khaki
                colours[246] = '#BDB76B';
                // Dark lava
                colours[247] = '#483C32';
                // Dark lavender
                colours[248] = '#734F96';
                // Dark liver
                colours[249] = '#534B4F';
                // Dark liver (horses)
                colours[250] = '#543D37';
                // Dark magenta
                colours[251] = '#8B008B';
                // Dark midnight blue
                colours[252] = '#003366';
                // Dark moss green
                colours[253] = '#4A5D23';
                // Dark olive green
                colours[254] = '#556B2F';
                // Dark orange
                colours[255] = '#FF8C00';
                // Dark orchid
                colours[256] = '#9932CC';
                // Dark pastel blue
                colours[257] = '#779ECB';
                // Dark pastel green
                colours[258] = '#03C03C';
                // Dark pastel purple
                colours[259] = '#966FD6';
                // Dark pastel red
                colours[260] = '#C23B22';
                // Dark pink
                colours[261] = '#E75480';
                // Dark powder blue
                colours[262] = '#003399';
                // Dark raspberry
                colours[263] = '#872657';
                // Dark red
                colours[264] = '#8B0000';
                // Dark salmon
                colours[265] = '#E9967A';
                // Dark scarlet
                colours[266] = '#560319';
                // Dark sea green
                colours[267] = '#8FBC8F';
                // Dark sienna
                colours[268] = '#3C1414';
                // Dark sky blue
                colours[269] = '#8CBED6';
                // Dark slate blue
                colours[270] = '#483D8B';
                // Dark slate gray
                colours[271] = '#2F4F4F';
                // Dark spring green
                colours[272] = '#177245';
                // Dark tan
                colours[273] = '#918151';
                // Dark tangerine
                colours[274] = '#FFA812';
                // Dark taupe
                colours[275] = '#483C32';
                // Dark terra cotta
                colours[276] = '#CC4E5C';
                // Dark turquoise
                colours[277] = '#00CED1';
                // Dark vanilla
                colours[278] = '#D1BEA8';
                // Dark violet
                colours[279] = '#9400D3';
                // Dark yellow
                colours[280] = '#9B870C';
                // Dartmouth green
                colours[281] = '#00703C';
                // Davy's grey
                colours[282] = '#555555';
                // Debian red
                colours[283] = '#D70A53';
                // Deep carmine
                colours[284] = '#A9203E';
                // Deep carmine pink
                colours[285] = '#EF3038';
                // Deep carrot orange
                colours[286] = '#E9692C';
                // Deep cerise
                colours[287] = '#DA3287';
                // Deep champagne
                colours[288] = '#FAD6A5';
                // Deep chestnut
                colours[289] = '#B94E48';
                // Deep coffee
                colours[290] = '#704241';
                // Deep fuchsia
                colours[291] = '#C154C1';
                // Deep jungle green
                colours[292] = '#004B49';
                // Deep lemon
                colours[293] = '#F5C71A';
                // Deep lilac
                colours[294] = '#9955BB';
                // Deep magenta
                colours[295] = '#CC00CC';
                // Deep mauve
                colours[296] = '#D473D4';
                // Deep moss green
                colours[297] = '#355E3B';
                // Deep peach
                colours[298] = '#FFCBA4';
                // Deep pink
                colours[299] = '#FF1493';
                // Deep ruby
                colours[300] = '#843F5B';
                // Deep saffron
                colours[301] = '#FF9933';
                // Deep sky blue
                colours[302] = '#00BFFF';
                // Deep Space Sparkle
                colours[303] = '#4A646C';
                // Deep Taupe
                colours[304] = '#7E5E60';
                // Deep Tuscan red
                colours[305] = '#66424D';
                // Deer
                colours[306] = '#BA8759';
                // Denim
                colours[307] = '#1560BD';
                // Desert
                colours[308] = '#C19A6B';
                // Desert sand
                colours[309] = '#EDC9AF';
                // Diamond
                colours[310] = '#B9F2FF';
                // Dim gray
                colours[311] = '#696969';
                // Dirt
                colours[312] = '#9B7653';
                // Dodger blue
                colours[313] = '#1E90FF';
                // Dogwood rose
                colours[314] = '#D71868';
                // Dollar bill
                colours[315] = '#85BB65';
                // Donkey Brown
                colours[316] = '#664C28';
                // Drab
                colours[317] = '#967117';
                // Duke blue
                colours[318] = '#00009C';
                // Dust storm
                colours[319] = '#E5CCC9';
                // Earth yellow
                colours[320] = '#E1A95F';
                // Ebony
                colours[321] = '#555D50';
                // Ecru
                colours[322] = '#C2B280';
                // Eggplant
                colours[323] = '#614051';
                // Eggshell
                colours[324] = '#F0EAD6';
                // Egyptian blue
                colours[325] = '#1034A6';
                // Electric blue
                colours[326] = '#7DF9FF';
                // Electric crimson
                colours[327] = '#FF003F';
                // Electric cyan
                colours[328] = '#00FFFF';
                // Electric green
                colours[329] = '#00FF00';
                // Electric indigo
                colours[330] = '#6F00FF';
                // Electric lavender
                colours[331] = '#F4BBFF';
                // Electric lime
                colours[332] = '#CCFF00';
                // Air superiority blue
                colours[333] = '#72A0C1';
                // Electric ultramarine
                colours[334] = '#3F00FF';
                // Electric violet
                colours[335] = '#8F00FF';
                // Electric yellow
                colours[336] = '#FFFF33';
                // Emerald
                colours[337] = '#50C878';
                // English green
                colours[338] = '#1B4D3E';
                // English lavender
                colours[339] = '#B48395';
                // English red
                colours[340] = '#AB4B52';
                // English violet
                colours[341] = '#563C5C';
                // Eton blue
                colours[342] = '#96C8A2';
                // Eucalyptus
                colours[343] = '#44D7A8';
                // Fallow
                colours[344] = '#C19A6B';
                // Falu red
                colours[345] = '#801818';
                // Fandango
                colours[346] = '#B53389';
                // Fandango pink
                colours[347] = '#DE5285';
                // Fashion fuchsia
                colours[348] = '#F400A1';
                // Fawn
                colours[349] = '#E5AA70';
                // Feldgrau
                colours[350] = '#4D5D53';
                // Feldspar
                colours[351] = '#FDD5B1';
                // Fern green
                colours[352] = '#4F7942';
                // Ferrari Red
                colours[353] = '#FF2800';
                // Field drab
                colours[354] = '#6C541E';
                // Firebrick
                colours[355] = '#B22222';
                // Fire engine red
                colours[356] = '#CE2029';
                // Flame
                colours[357] = '#E25822';
                // Flamingo pink
                colours[358] = '#FC8EAC';
                // Flattery
                colours[359] = '#6B4423';
                // Flavescent
                colours[360] = '#F7E98E';
                // Flax
                colours[361] = '#EEDC82';
                // Flirt
                colours[362] = '#A2006D';
                // Mughal green
                colours[363] = '#306030';
                // Fluorescent orange
                colours[364] = '#FFBF00';
                // Fluorescent pink
                colours[365] = '#FF1493';
                // Fluorescent yellow
                colours[366] = '#CCFF00';
                // Folly
                colours[367] = '#FF004F';
                // Forest green (traditional)
                colours[368] = '#014421';
                // Forest green (web)
                colours[369] = '#228B22';
                // French beige
                colours[370] = '#A67B5B';
                // French bistre
                colours[371] = '#856D4D';
                // French blue
                colours[372] = '#0072BB';
                // French lilac
                colours[373] = '#86608E';
                // French lime
                colours[374] = '#9EFD38';
                // French mauve
                colours[375] = '#D473D4';
                // French raspberry
                colours[376] = '#C72C48';
                // French rose
                colours[377] = '#F64A8A';
                // French sky blue
                colours[378] = '#77B5FE';
                // French wine
                colours[379] = '#AC1E44';
                // Fresh Air
                colours[380] = '#A6E7FF';
                // Fuchsia
                colours[381] = '#FF00FF';
                // Fuchsia (Crayola)
                colours[382] = '#C154C1';
                // Fuchsia pink
                colours[383] = '#FF77FF';
                // Fuchsia rose
                colours[384] = '#C74375';
                // Fulvous
                colours[385] = '#E48400';
                // Fuzzy Wuzzy
                colours[386] = '#CC6666';
                // Gainsboro
                colours[387] = '#DCDCDC';
                // Gamboge
                colours[388] = '#E49B0F';
                // Generic viridian
                colours[389] = '#007F66';
                // MSU Green
                colours[390] = '#18453B';
                // Giants orange
                colours[391] = '#FE5A1D';
                // Ginger
                colours[392] = '#B06500';
                // Glaucous
                colours[393] = '#6082B6';
                // Glitter
                colours[394] = '#E6E8FA';
                // GO green
                colours[395] = '#00AB66';
                // Gold (metallic)
                colours[396] = '#D4AF37';
                // Gold (web) (Golden)
                colours[397] = '#FFD700';
                // Gold Fusion
                colours[398] = '#85754E';
                // Golden brown
                colours[399] = '#996515';
                // Golden poppy
                colours[400] = '#FCC200';
                // Golden yellow
                colours[401] = '#FFDF00';
                // Goldenrod
                colours[402] = '#DAA520';
                // Granny Smith Apple
                colours[403] = '#A8E4A0';
                // Grape
                colours[404] = '#6F2DA8';
                // Gray
                colours[405] = '#808080';
                // Gray (HTML/CSS gray)
                colours[406] = '#808080';
                // Gray (X11 gray)
                colours[407] = '#BEBEBE';
                // Gray-asparagus
                colours[408] = '#465945';
                // Gray-blue
                colours[409] = '#8C92AC';
                // Green (color wheel) (X11 green)
                colours[410] = '#00FF00';
                // Green (Crayola)
                colours[411] = '#1CAC78';
                // Green (HTML/CSS color)
                colours[412] = '#008000';
                // Green (Munsell)
                colours[413] = '#00A877';
                // Green (NCS)
                colours[414] = '#009F6B';
                // Green (pigment)
                colours[415] = '#00A550';
                // Green (RYB)
                colours[416] = '#66B032';
                // Green-yellow
                colours[417] = '#ADFF2F';
                // Grullo
                colours[418] = '#A99A86';
                // Guppie green
                colours[419] = '#00FF7F';
                // Halaya ube
                colours[420] = '#663854';
                // Han blue
                colours[421] = '#446CCF';
                // Han purple
                colours[422] = '#5218FA';
                // Hansa yellow
                colours[423] = '#E9D66B';
                // Harlequin
                colours[424] = '#3FFF00';
                // Harvard crimson
                colours[425] = '#C90016';
                // Harvest gold
                colours[426] = '#DA9100';
                // Heart Gold
                colours[427] = '#808000';
                // Heliotrope
                colours[428] = '#DF73FF';
                // Hollywood cerise
                colours[429] = '#F400A1';
                // Honeydew
                colours[430] = '#F0FFF0';
                // Honolulu blue
                colours[431] = '#006DB0';
                // Hooker's green
                colours[432] = '#49796B';
                // Hot magenta
                colours[433] = '#FF1DCE';
                // Hot pink
                colours[434] = '#FF69B4';
                // Hunter green
                colours[435] = '#355E3B';
                // Iceberg
                colours[436] = '#71A6D2';
                // Icterine
                colours[437] = '#FCF75E';
                // Illuminating Emerald
                colours[438] = '#319177';
                // Imperial
                colours[439] = '#602F6B';
                // Imperial blue
                colours[440] = '#002395';
                // Imperial purple
                colours[441] = '#66023C';
                // Imperial red
                colours[442] = '#ED2939';
                // Inchworm
                colours[443] = '#B2EC5D';
                // Independence
                colours[444] = '#4C516D';
                // India green
                colours[445] = '#138808';
                // Indian red
                colours[446] = '#CD5C5C';
                // Indian yellow
                colours[447] = '#E3A857';
                // Indigo
                colours[448] = '#6F00FF';
                // Indigo dye
                colours[449] = '#091F92';
                // Indigo (web)
                colours[450] = '#4B0082';
                // International Klein Blue
                colours[451] = '#002FA7';
                // International orange (aerospace)
                colours[452] = '#FF4F00';
                // International orange (engineering)
                colours[453] = '#BA160C';
                // International orange (Golden Gate Bridge)
                colours[454] = '#C0362C';
                // Iris
                colours[455] = '#5A4FCF';
                // Irresistible
                colours[456] = '#B3446C';
                // Isabelline
                colours[457] = '#F4F0EC';
                // Islamic green
                colours[458] = '#009000';
                // Italian sky blue
                colours[459] = '#B2FFFF';
                // Ivory
                colours[460] = '#FFFFF0';
                // Jade
                colours[461] = '#00A86B';
                // Japanese indigo
                colours[462] = '#264348';
                // Japanese violet
                colours[463] = '#5B3256';
                // Jasmine
                colours[464] = '#F8DE7E';
                // Jasper
                colours[465] = '#D73B3E';
                // Jazzberry jam
                colours[466] = '#A50B5E';
                // Jelly Bean
                colours[467] = '#DA614E';
                // Jet
                colours[468] = '#343434';
                // Jonquil
                colours[469] = '#F4CA16';
                // June bud
                colours[470] = '#BDDA57';
                // Jungle green
                colours[471] = '#29AB87';
                // Kelly green
                colours[472] = '#4CBB17';
                // Kenyan copper
                colours[473] = '#7C1C05';
                // Keppel
                colours[474] = '#3AB09E';
                // Khaki (HTML/CSS) (Khaki)
                colours[475] = '#C3B091';
                // Khaki (X11) (Light khaki)
                colours[476] = '#F0E68C';
                // Kobe
                colours[477] = '#882D17';
                // Kobi
                colours[478] = '#E79FC4';
                // Kombu green
                colours[479] = '#354230';
                // KU Crimson
                colours[480] = '#E8000D';
                // La Salle Green
                colours[481] = '#087830';
                // Languid lavender
                colours[482] = '#D6CADD';
                // Lapis lazuli
                colours[483] = '#26619C';
                // Laser Lemon
                colours[484] = '#FFFF66';
                // Laurel green
                colours[485] = '#A9BA9D';
                // Lava
                colours[486] = '#CF1020';
                // Lavender (floral)
                colours[487] = '#B57EDC';
                // Lavender (web)
                colours[488] = '#E6E6FA';
                // Lavender blue
                colours[489] = '#CCCCFF';
                // Lavender blush
                colours[490] = '#FFF0F5';
                // Lavender gray
                colours[491] = '#C4C3D0';
                // Lavender indigo
                colours[492] = '#9457EB';
                // Lavender magenta
                colours[493] = '#EE82EE';
                // Lavender mist
                colours[494] = '#E6E6FA';
                // Lavender pink
                colours[495] = '#FBAED2';
                // Lavender purple
                colours[496] = '#967BB6';
                // Lavender rose
                colours[497] = '#FBA0E3';
                // Lawn green
                colours[498] = '#7CFC00';
                // Lemon
                colours[499] = '#FFF700';
                // Lemon chiffon
                colours[500] = '#FFFACD';
                // Lemon curry
                colours[501] = '#CCA01D';
                // Lemon glacier
                colours[502] = '#FDFF00';
                // Lemon lime
                colours[503] = '#E3FF00';
                // Lemon meringue
                colours[504] = '#F6EABE';
                // Lemon yellow
                colours[505] = '#FFF44F';
                // Licorice
                colours[506] = '#1A1110';
                // Liberty
                colours[507] = '#545AA7';
                // Light apricot
                colours[508] = '#FDD5B1';
                // Light blue
                colours[509] = '#ADD8E6';
                // Light brown
                colours[510] = '#B5651D';
                // Light carmine pink
                colours[511] = '#E66771';
                // Light coral
                colours[512] = '#F08080';
                // Light cornflower blue
                colours[513] = '#93CCEA';
                // Light crimson
                colours[514] = '#F56991';
                // Light cyan
                colours[515] = '#E0FFFF';
                // Light fuchsia pink
                colours[516] = '#F984EF';
                // Light goldenrod yellow
                colours[517] = '#FAFAD2';
                // Light gray
                colours[518] = '#D3D3D3';
                // Light green
                colours[519] = '#90EE90';
                // Light khaki
                colours[520] = '#F0E68C';
                // Light medium orchid
                colours[521] = '#D39BCB';
                // Light moss green
                colours[522] = '#ADDFAD';
                // Light orchid
                colours[523] = '#E6A8D7';
                // Light pastel purple
                colours[524] = '#B19CD9';
                // Light pink
                colours[525] = '#FFB6C1';
                // Light red ochre
                colours[526] = '#E97451';
                // Light salmon
                colours[527] = '#FFA07A';
                // Light salmon pink
                colours[528] = '#FF9999';
                // Light sea green
                colours[529] = '#20B2AA';
                // Light sky blue
                colours[530] = '#87CEFA';
                // Light slate gray
                colours[531] = '#778899';
                // Light steel blue
                colours[532] = '#B0C4DE';
                // Light taupe
                colours[533] = '#B38B6D';
                // Light Thulian pink
                colours[534] = '#E68FAC';
                // Light yellow
                colours[535] = '#FFFFE0';
                // Lilac
                colours[536] = '#C8A2C8';
                // Lime (color wheel)
                colours[537] = '#BFFF00';
                // Lime (web) (X11 green)
                colours[538] = '#00FF00';
                // Lime green
                colours[539] = '#32CD32';
                // Limerick
                colours[540] = '#9DC209';
                // Lincoln green
                colours[541] = '#195905';
                // Linen
                colours[542] = '#FAF0E6';
                // Lion
                colours[543] = '#C19A6B';
                // Little boy blue
                colours[544] = '#6CA0DC';
                // Liver
                colours[545] = '#674C47';
                // Liver (dogs)
                colours[546] = '#B86D29';
                // Liver (organ)
                colours[547] = '#6C2E1F';
                // Liver chestnut
                colours[548] = '#987456';
                // Lumber
                colours[549] = '#FFE4CD';
                // Lust
                colours[550] = '#E62020';
                // Magenta
                colours[551] = '#FF00FF';
                // Magenta (Crayola)
                colours[552] = '#FF55A3';
                // Magenta (dye)
                colours[553] = '#CA1F7B';
                // Magenta (Pantone)
                colours[554] = '#D0417E';
                // Magenta (process)
                colours[555] = '#FF0090';
                // Magenta haze
                colours[556] = '#9F4576';
                // Magic mint
                colours[557] = '#AAF0D1';
                // Magnolia
                colours[558] = '#F8F4FF';
                // Mahogany
                colours[559] = '#C04000';
                // Maize
                colours[560] = '#FBEC5D';
                // Majorelle Blue
                colours[561] = '#6050DC';
                // Malachite
                colours[562] = '#0BDA51';
                // Manatee
                colours[563] = '#979AAA';
                // Mango Tango
                colours[564] = '#FF8243';
                // Mantis
                colours[565] = '#74C365';
                // Mardi Gras
                colours[566] = '#880085';
                // Maroon (Crayola)
                colours[567] = '#C32148';
                // Maroon (HTML/CSS)
                colours[568] = '#800000';
                // Maroon (X11)
                colours[569] = '#B03060';
                // Mauve
                colours[570] = '#E0B0FF';
                // Mauve taupe
                colours[571] = '#915F6D';
                // Mauvelous
                colours[572] = '#EF98AA';
                // Maya blue
                colours[573] = '#73C2FB';
                // Meat brown
                colours[574] = '#E5B73B';
                // Medium aquamarine
                colours[575] = '#66DDAA';
                // Medium blue
                colours[576] = '#0000CD';
                // Medium candy apple red
                colours[577] = '#E2062C';
                // Medium carmine
                colours[578] = '#AF4035';
                // Medium champagne
                colours[579] = '#F3E5AB';
                // Medium electric blue
                colours[580] = '#035096';
                // Medium jungle green
                colours[581] = '#1C352D';
                // Medium lavender magenta
                colours[582] = '#DDA0DD';
                // Medium orchid
                colours[583] = '#BA55D3';
                // Medium Persian blue
                colours[584] = '#0067A5';
                // Medium purple
                colours[585] = '#9370DB';
                // Medium red-violet
                colours[586] = '#BB3385';
                // Medium ruby
                colours[587] = '#AA4069';
                // Medium sea green
                colours[588] = '#3CB371';
                // Medium sky blue
                colours[589] = '#80DAEB';
                // Medium slate blue
                colours[590] = '#7B68EE';
                // Medium spring bud
                colours[591] = '#C9DC87';
                // Medium spring green
                colours[592] = '#00FA9A';
                // Medium taupe
                colours[593] = '#674C47';
                // Medium turquoise
                colours[594] = '#48D1CC';
                // Medium Tuscan red
                colours[595] = '#79443B';
                // Medium vermilion
                colours[596] = '#D9603B';
                // Medium violet-red
                colours[597] = '#C71585';
                // Mellow apricot
                colours[598] = '#F8B878';
                // Mellow yellow
                colours[599] = '#F8DE7E';
                // Melon
                colours[600] = '#FDBCB4';
                // Metallic Seaweed
                colours[601] = '#0A7E8C';
                // Metallic Sunburst
                colours[602] = '#9C7C38';
                // Mexican pink
                colours[603] = '#E4007C';
                // Midnight blue
                colours[604] = '#191970';
                // Midnight green (eagle green)
                colours[605] = '#004953';
                // Midori
                colours[606] = '#E3F988';
                // Mikado yellow
                colours[607] = '#FFC40C';
                // Mint
                colours[608] = '#3EB489';
                // Mint cream
                colours[609] = '#F5FFFA';
                // Mint green
                colours[610] = '#98FF98';
                // Misty rose
                colours[611] = '#FFE4E1';
                // Moccasin
                colours[612] = '#FAEBD7';
                // Mode beige
                colours[613] = '#967117';
                // Moonstone blue
                colours[614] = '#73A9C2';
                // Mordant red 19
                colours[615] = '#AE0C00';
                // Moss green
                colours[616] = '#8A9A5B';
                // Mountain Meadow
                colours[617] = '#30BA8F';
                // Mountbatten pink
                colours[618] = '#997A8D';
                
                // Pickup any custom colours
                var labels = new Array();
                $.each(settings.json.groups, function(i, item) {
                    $.each(item.values, function(i, item) {
                        if ($.inArray(item.label, labels) == -1) {
                            labels[labels.length] = item.label;
                            if (item.colour != undefined) {
                                colours[i] = item.colour;   
                            }
                        }
                    });
                });
            }
        };
        
        methods.setupColours();
        
        return this.each(function() {
            var c = $(this)[0];
            var ctx = c.getContext("2d");
            
            // Store the width and height of the canvas.
            settings.width = $(this).width();
            settings.height = $(this).height();
            
            // Setup a default padding of 15 pixels to ensure room for the value and axis labels.
            settings.paddingLeft = settings.paddingLeft < 15 ? 15 : settings.paddingLeft;
            settings.paddingTop = settings.paddingTop < 15 ? 15 : settings.paddingTop;
            settings.paddingRight = settings.paddingRight < 15 ? 15 : settings.paddingRight;
            settings.paddingBottom = settings.paddingBottom < 15 ? 15 : settings.paddingBottom;
            
            // If we are showing a legend, we need to add additional padding to the right
            // to ensure we have enough room. To determine how much we need we'll need to
            // check the largest label width and add a few pixels on for padding of that.
            if (settings.showLegend && settings.json.groups.length > 0) {
                settings.paddingRight += methods.getLargestLabel(ctx) + 40;
                methods.drawLegend(ctx);
            }
            
            // Store the boundaries of the chart for quick access.
            var top = settings.paddingTop;
            var bottom = settings.height - settings.paddingBottom - 35;
            var left = settings.paddingLeft;
            var right = settings.width - settings.paddingRight;
            var chartHeight = bottom - top;

            // Draw the labels if the flag is set.
            if (settings.showLabels) {
                ctx.font = "bold 14px \"lucida grande\",tahoma,verdana,arial,sans-serif";
                ctx.textAlign = 'center';
                ctx.fillText(settings.json.xLabel, (right + left) / 2, bottom + 45);
                methods.drawVerticalLabel(ctx, settings.paddingLeft, top + (chartHeight / 2));
                
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
            var barWidth = (chartWidth - (groupSpacing * (settings.json.groups.length + 1))) / barCount;
            var currentXPos = left;
            
            // Draw the bars
            ctx.font = "11px \"lucida grande\",tahoma,verdana,arial,sans-serif";
            $.each(settings.json.groups, function(i, item) {
                currentXPos += groupSpacing;
                $.each(item.values, function(i, item) {
                    var barHeight = chartHeight * (item.value / highestValue);
                    ctx.beginPath();
                    ctx.rect(currentXPos, bottom - (barHeight + 0), barWidth, barHeight);
                    ctx.fillStyle = colours[i];
                    ctx.fill();
                    ctx.closePath();
                    currentXPos += barWidth;
                    
                    if (settings.json.groups.length == 1) {
                        ctx.textAlign = 'center';
                        ctx.fillStyle = "black";
                        ctx.fillText(item.label, currentXPos - (barWidth / 2), bottom + 15);
                    }
                });
                
                if (settings.json.groups.length > 1) {
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