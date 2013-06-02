graphly
=======

Graphly is an easy to use and lightweight jQuery plugin which allows you to transform your data into clean and customisable graphs. See below an example of a graph created using Graphly.

![Graphly Sample](http://rastating.com/gpu-green-graph.png)

Supported browsers include:
* Chrome
* Firefox
* Internet Explorer 9+
* Opera
* Safari

### Examples
To see some examples of Graphly in use, visit the demo page at http://www.getgraphly.com/demo/

### How Do I Use Graphly?
The first step is to include the jQuery and Graphly libraries inside the head tags of your HTML document and ensure the HTML 5 doctype is being used, as in this template:

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="jquery.min.js"></script>
        <script src="graphly.min.js"></script>
    </head>
    <body>
    </body>
</html>
```

After you have included the jQuery and Graphly libraries, you must place a **canvas** element where you wish the graph to appear, and set the width and height accordingly. For example, an 800x300 graph would require the following markup:

```html
<canvas id="canvas" width="800" height="300"></canvas>
```

The final step to creating a graph is to construct your data and pass it through to the Graphly plugin. In its simplest form, the data consists of a single group of data and labels, such as this:

```javascript
var data = {
    xLabel: 'Characters',
    yLabel: 'Awesomeness',
    groups: [
        {
            label:  'People',
            values: [
                {
                    label: 'Jack Bauer',
                    value: 100
                },
                {
                    label: 'Jack Shephard',
                    value: 13
                },
                {
                    label: 'Nancy Botwin',
                    value: 50
                },
                {
                    label: 'Walter White',
                    value: 77
                }
            ]
        }
    ]
};
```
_For more information on constructing your data see the **Constructing Data** section._

Once the data is constructed, simply call the Graphly plugin:

```javascript
$('#canvas').graphly({ 'data' : data });
```

See below for a complete example of how to use Graphly:

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="jquery.min.js"></script>
        <script src="graphly.min.js"></script>
    </head>
    <body>
        <canvas id="canvas" width="800" height="300"></canvas>
        
        <script>
            $(function() {
                var data = {
                    xLabel: 'Characters',
                    yLabel: 'Awesomeness',
                    groups: [
                        {
                            label:  'People',
                            values: [
                                {
                                    label: 'Jack Bauer',
                                    value: 100
                                },
                                {
                                    label: 'Jack Shephard',
                                    value: 13
                                },
                                {
                                    label: 'Nancy Botwin',
                                    value: 50
                                },
                                {
                                    label: 'Walter White',
                                    value: 77
                                }
                            ]
                        }
                    ]
                };
                
                $('#canvas').graphly({ 'data' : data });
            });
        </script>
    </body>
</html>
```

In addition to the **data** setting that is passed in the above example, the following optional settings can be specified:

* customTheme - a custom theme definition to use instead of a built-in theme
* height - the initial height of the canvas to draw on
* paddingTop - the padding applied to the top of the canvas in pixels
* paddingLeft - the padding applied to the left of the canvas in pixels
* paddingBottom - the padding applied to the bottom of the canvas in pixels
* paddingRight - the padding applied to the right of the canvas in pixels
* removeBorders - a boolean value indicating whether or not to remove borders from bars
* showLabels - a boolean value indicating whether or not to show the axis labels
* showLegend - a boolean value indicating whether or not to show the legend
* theme - the name of the built-in theme to use
* width - the initial width of the canvas to draw on

### Constructing Data
Currently Graphly is capable of generating graphs which consist of one or more groups of data. An example of a data set that contains one group of data can be found below. Within the root object are three objects, **xLabel**, **yLabel** and **groups**. The label objects contain the axis labels that will be displayed on the graph, and the groups object contains an array of objects which represent groups of entities and data values.

```javascript
{
    xLabel: 'Characters',
    yLabel: 'Awesomeness',
    groups: [
        {
            label:  'People',
            values: [
                {
                    label: 'Jack Bauer',
                    value: 100
                },
                {
                    label: 'Jack Shephard',
                    value: 13
                },
                {
                    label: 'Nancy Botwin',
                    value: 50
                },
                {
                    label: 'Walter White',
                    value: 77
                }
            ]
        }
    ]
}
```

The label property in the group object is the label / name associated with the entire group (see below example for a better example of this), and the labels in the values array are those that are associated with each individual bar in the graph.

In the above example, we have no repeating entities and will have four unique bars in the graph. However, if we have a graph that needs to show figures for a repeating group of entities under different circumstances, such as in the example below, which shows how a group of Graphics Processing Units perform under different circumstances, we can simply specify multiple groups in the groups array:

```javascript
{
    xLabel: 'GPU / Settings',
    yLabel: 'FPS',
    groups: [
        {
            label: 'Tessellation Disabled',
            values: [
                {
                    label: 'nVidia GeForce GTX 680 2 GB SLi',
                    value: 296
                },
                {
                    label: 'nVidia GeForce GTX 690 4 GB',
                    value: 285
                },
                {
                    label: 'AMD Radeon HD 7970 3 GB CrossFire',
                    value: 267
                },
                {
                    label: 'Nvidia GeForce GTX 590 3 GB',
                    value: 248
                },
                {
                    label: 'AMD Radeon HD 6990 4 GB',
                    value: 231
                },
                {
                    label: 'nVidia GeForce GTX 680 2 GB',
                    value: 207
                },
                {
                    label: 'nVidia GeForce GTX 580 1.5 GB',
                    value: 193
                },
                {
                    label: 'AMD Radeon HD 7970 3 GB',
                    value: 148
                },
                {
                    label: 'AMD Radeon HD 7950 3 GB',
                    value: 104
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
}
```

In addition to the above examples, we can customise how the data will be represented further by specifying colours that will be associated with each entity, as can be seen in this example:

```javascript
{
    xLabel: 'Characters',
    yLabel: 'Awesomeness',
    groups: [
        {
            label:  'People',
            values: [
                {
                    label: 'Jack Bauer',
                    value: 100,
                    color: '#636F57'
                },
                {
                    label: 'Jack Shephard',
                    value: 13,
                    color: '#78AB46'
                },
                {
                    label: 'Nancy Botwin',
                    value: 50,
                    color: '#66CD00'
                },
                {
                    label: 'Walter White',
                    value: 77,
                    color: '#7FFF00'
                }
            ]
        }
    ]
}
```

If no colour is specified the default colour selection will be used for that particular entity.

### Current Limitations
As Graphly is still in the early stages of development, it is still limited in a number of senses; primarily that it can only produce bar charts.

Multiple graph types are currently planned as new features to be added in the near future, so keep checking back if this is an issue for you.

Alternatively, [Open an Issue](https://github.com/rastating/graphly/issues/new) to bring suggestions and bugs to light.

### Authors and Contributors
Graphly is developed by [rastating](http://rastating.com/), and can be found on the following networks:

* GitHub: https://github.com/rastating
* Last.fm: http://www.last.fm/user/rastating
* Twitter: https://twitter.com/iamrastating
* Xbox LIVE: https://live.xbox.com/en-GB/Profile?gamertag=rastatingg
