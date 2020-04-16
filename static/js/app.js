// read the data with promise function and set variables for further parsing and selection
d3.json("data/samples.json").then((data) => {

    var names = data.names;

    var metadata = data.metadata;

    var samples = data.samples;
    
    // Get dropdown element from DOM
    var dropdown = document.getElementById("selDataset");
    /* check to see if there are select options present, if so then remove
        this prevents adding redundant (duplicate) options to the dropdown menu */
    if (dropdown.length > 0) {
        for (var i = 0; i < dropdown.length; i++) {
            dropdown.remove(0);
        };
    };
    // create option elements
    var option = document.createElement("option");
    // Loop through the names array to populate dropdown options
    for (var i = 0; i < names.length; ++i) {
        // Append the option to the end of the dropdown element
        dropdown.add( new Option(names[i]));
    };

    // use the first sample in the data for the init plot variables
    var initSample = samples[0];
    var initOTUs = initSample.otu_ids;
    var initValues = initSample.sample_values;
    var initLabels = initSample.otu_labels;
    // get the top 10 init OTUs (note: already in descending sort)
    var initPlotOTUs = initOTUs.slice(0, 10);
    var initPlotValues = initValues.slice(0, 10);
    var initPlotLabels = initLabels.slice(0, 10);
    // reverse sort the top 10 init OTUs for the way Plotly displays horizontal bar charts
    var reverse_initPlotOTUs = initPlotOTUs.reverse();
    var reverse_initPlotValues = initPlotValues.reverse();
    var reverse_initPlotLabels = initPlotLabels.reverse();
    
    // concatenate 'OTU' and otu_id to use as y-axis bar plot labels
    var reverse_initconcatOTUs = [];
    for (i = 0; i < reverse_initPlotOTUs.length; ++i) {
        reverse_initconcatOTUs.push(`OTU ${reverse_initPlotOTUs[i]}`);
    };

    // initialize the Bar plot
    function initBar () {
        var dataBar = [{
            x: reverse_initPlotValues,
            y: reverse_initconcatOTUs,
            text: reverse_initPlotLabels,
            type: 'bar',
            orientation: 'h',
            marker: { 
                color: 'rebeccapurple',
                width: 1
            }
        }];

        var layoutBar = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Value" },
            yaxis: { title: "OTU_ID" }
        };
        Plotly.newPlot("bar", dataBar, layoutBar);
    };

    // initialize the Bubble plot
    function initBubble () {
        var dataBubble = [{
            x: initOTUs,
            y: initValues,
            text: initLabels,
            mode: 'markers',
            marker: {
                color: initOTUs,
                size: initValues,
            }
        }];

        var layoutBubble = {
            title: "All OTUs Found on Subject and Corresponding Sample Values",
            xaxis: { title: "OTU_ID" },
            yaxis: { title: "Sample Value" }
        };

        Plotly.newPlot("bubble", dataBubble, layoutBubble);
    };

    // initialize demographics
    var initMeta = [metadata[0]];

    var ul = d3.select('#sample-metadata').append('ul');
    initMeta.forEach(demo => {
        // var ul = panel.append('ul');
        Object.entries(demo).forEach(([key, value]) => {
            ul.append('li').text(`${key}: ${value}`);
        });
    });
  
    // calculate mean scrub frequency for delta comparison in gauge plot
    var allScrubFreq = [];
    var sumScrubFreq = 0;
    var countScrubFreq = 0;
    for (i = 0; i < metadata.length; ++i) {
        if (metadata[i].wfreq != '') {
            allScrubFreq.push(metadata[i].wfreq);
            sumScrubFreq += metadata[i].wfreq;
            countScrubFreq += 1;
        }
    };
    
    var meanScrubFreq = sumScrubFreq / countScrubFreq;
    
    // get the initial scrub frequency
    var initScrubFreq = initMeta[0].wfreq;

    // initialize gauge plot
    function initGauge () {
        var dataGauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: initScrubFreq,
                title: { text: "Belly Button Washing Frequency<br><span style='font-size:0.8em'>Scrubs Per Week vs. Mean</span>" },
                type: "indicator",
                mode: "gauge+number+delta",
                delta: { reference: meanScrubFreq },
                gauge: {
                    axis: { range: [null, 9],                         
                        tickvals: [0,1,2,3,4,5,6,7,8,9] 
                        },
                    bar: { color: "rebeccapurple" },
                    steps: [
                        { range: [0, 1], color: "orangered" },
                        { range: [1, 2], color: "orangered" },
                        { range: [2, 3], color: "lightsalmon" },
                        { range: [3, 4], color: "lightsalmon" },
                        { range: [4, 5], color: "lightgreen" },
                        { range: [5, 6], color: "limegreen" },
                        { range: [6, 7], color: "limegreen" },
                        { range: [7, 8], color: "mediumseagreen" },
                        { range: [8, 9], color: "mediumseagreen" },
                        ]                        
                }
            }
        ];
        
        var layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', dataGauge, layout);
    
    };
    
    // event listener to invoke handler function on change of dropdown menu
    d3.selectAll("#selDataset").on("change", optionChanged);

    // event handler function
    function optionChanged(value) {

        // Assign the value of the dropdown menu option to a variable
        var dataset = this.value;

        // iterate through the samples data to get the sample data corresponding to the selected subject ID
        for (var i = 0; i < samples.length; ++i) {
            if (samples[i].id === dataset) {
                var idSample = samples[i];
                break;
            };
        };

        // assign the subject ID's OTUs, sample_values, and otu_labels to variables to use with bubble plot
        var idOTUs = idSample.otu_ids;
        var idValues = idSample.sample_values;
        var idLabels = idSample.otu_labels;
        // get the top 10 OTUs (note: already in descending sort)
        var idPlotOTUs = idOTUs.slice(0, 10);
        var idPlotValues = idValues.slice(0, 10);
        var idPlotLabels = idLabels.slice(0, 10);
        // sort the top 10 OTUs for the way Plotly displays horizontal bar charts
        var reverse_idPlotOTUs = idPlotOTUs.reverse();
        var reverse_idPlotValues = idPlotValues.reverse();
        var reverse_idPlotLabels = idPlotLabels.reverse();
        
        // concatenate 'OTU' and otu_id
        var reverse_idconcatOTUs = [];
        for (i = 0; i < reverse_idPlotOTUs.length; ++i) {
            reverse_idconcatOTUs.push(`OTU ${reverse_idPlotOTUs[i]}`);
        };

        // get the metadata for id selected in dropdown
        var idMeta = [];
        
        for (var i = 0; i < metadata.length; ++i) {
            if (metadata[i].id === parseInt(dataset)) {
                idMeta.push(metadata[i]);
                break;
            };
        };
        
        // clear the demographic list before populating a new list of demos corresponding to selected subject ID
        document.getElementById('sample-metadata').innerHTML = "";

        // populate a list of demographics for selected subject ID
        var ul = d3.select('#sample-metadata').append('ul');
        idMeta.forEach(demo => {
            // var ul = panel.append('ul');
            Object.entries(demo).forEach(([key, value]) => {
                ul.append('li').text(`${key}: ${value}`);
            });
        });

        // get scrub frequency for selected subject ID
        var idScrubFreq = idMeta[0].wfreq;

        // update bar plot with selected subject ID's data
        var barx = reverse_idPlotValues;
        var bary = reverse_idconcatOTUs;
        var bartext = reverse_idPlotLabels;

        Plotly.restyle("bar", "x", [barx]);
        Plotly.restyle("bar", "y", [bary]);
        Plotly.restyle("bar", "text", [bartext]);

        // update bubble plot with selected subject ID's data
        var bubblex = idOTUs;
        var bubbley = idValues;
        var bubbletext = idLabels;
        var bubblecolor = idOTUs;
        var bubblesize = idValues;

        Plotly.restyle("bubble", "x", [bubblex]);
        Plotly.restyle("bubble", "y", [bubbley]);
        Plotly.restyle("bubble", "text", [bubbletext]);
        Plotly.restyle("bubble", "color", [bubblecolor]);
        Plotly.restyle("bubble", "size", [bubblesize]);
        
        // update gauge plot with selected subject ID's data
        var gaugevalue = idScrubFreq;
        
        Plotly.restyle("gauge", "value", [gaugevalue]);
        
    };

// initialize plots on page load or refresh
initBar();
initBubble();
initGauge();

});

// end of script

