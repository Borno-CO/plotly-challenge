d3.json("data/samples.json").then((data) => {

    var names = data.names;
    console.log(names);

    var metadata = data.metadata;
    console.log(metadata);

    var samples = data.samples;
    console.log(samples);
    
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

    // get the first sample for the init plot variables
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
    // check the init variables
    console.log(initSample);
    console.log(`initOTUs ${initOTUs}`);
    console.log(`initPlotOTUs ${initPlotOTUs}`);
    console.log(`reverse_initPlotOTUs ${reverse_initPlotOTUs}`);
    console.log(`reverse_initconcatOTUs ${reverse_initconcatOTUs}`);
    console.log(`initValues ${initValues}`);
    console.log(`initPlotValues ${initPlotValues}`);
    console.log(`reverse_initPlotValues ${reverse_initPlotValues}`);
    console.log(`initPlotLabels ${initPlotLabels}`);
    console.log(`reverse_initPlotLabels ${reverse_initPlotLabels}`);

    // initialize the Bar plot
    function initBar () {
        var dataBar = [{
            x: reverse_initPlotValues,
            y: reverse_initconcatOTUs,
            text: reverse_initPlotLabels,
            type: 'bar',
            orientation: 'h'
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

        // var CHART = d3.selectAll("#bar").node();

        Plotly.newPlot("bubble", dataBubble, layoutBubble);
    };

    // initialize demographics
    var initMeta = [metadata[0]];
    console.log(initMeta);

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
    console.log(`allScrubFreq: ${allScrubFreq}`);
    console.log(countScrubFreq);
    var meanScrubFreq = sumScrubFreq / countScrubFreq;
    console.log(`meanScrubFreq: ${meanScrubFreq}`);
    
    // get the initial scrub frequency
    var initScrubFreq = initMeta[0].wfreq;
    console.log(`initScrubFreq: ${initScrubFreq}`);

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
    // document.getElementByID("selDataset").reset();
    // d3.select("#selDataset").node().value = "";
    d3.selectAll("#selDataset").on("change", optionChanged);

    function optionChanged(value) {
        // Use D3 to select the dropdown menu
        console.log(this.value);
        // console.log(`The selected value is ${value}`)
        // Assign the value of the dropdown menu option to a variable
        var dataset = this.value;
        console.log(`dataset: ${dataset}`);
        // iterate through the samples data to get the sample data corresponding to the selected subject ID
        for (var i = 0; i < samples.length; ++i) {
            if (samples[i].id === dataset) {
                console.log(samples[i].id);
                var idSample = samples[i];
                console.log(idSample);
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

        // check the selected ID variables
        // console.log(idSample);
        console.log(`idOTUs ${idOTUs}`);
        console.log(`idPlotOTUs ${idPlotOTUs}`);
        console.log(`reverse_idPlotOTUs ${reverse_idPlotOTUs}`);
        console.log(`reverse_idconcatOTUs ${reverse_idconcatOTUs}`);
        console.log(`idValues ${idValues}`);
        console.log(`idPlotValues ${idPlotValues}`);
        console.log(`reverse_idPlotValues ${reverse_idPlotValues}`);
        console.log(`idPlotLabels ${idPlotLabels}`);
        console.log(`reverse_idPlotLabels ${reverse_idPlotLabels}`);

        // get the metadata for id selected in dropdown
        var idMeta = [];
        
        for (var i = 0; i < metadata.length; ++i) {
            if (metadata[i].id === parseInt(dataset)) {
                console.log(metadata[i].id);
                idMeta.push(metadata[i]);
                console.log(idMeta);
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
        console.log(`idScrubFreq: ${idScrubFreq}`);
    
        // update the Bar plot data
        // function updateBar () {
        // var idDataBar = [{
        //     x: reverse_idPlotValues,
        //     y: reverse_idconcatOTUs,
        //     text: reverse_idPlotLabels,
        //     type: 'bar',
        //     orientation: 'h'
        // }];

        // update bar plot with selected subject ID's data
        var barx = reverse_idPlotValues;
        var bary = reverse_idconcatOTUs;
        var bartext = reverse_idPlotLabels;

        Plotly.restyle("bar", "x", [barx]);
        Plotly.restyle("bar", "y", [bary]);
        Plotly.restyle("bar", "text", [bartext]);
        // var layoutBar = {
        //     title: "Top 10 OTUs",
        //     xaxis: { title: "Sample Value" },
        //     yaxis: { title: "OTU_ID" }
        // };
        // Plotly.restyle("bar", "values", [idDataBar], 0);
        // updateBar(idDataBar);
        // };


        // update the Bubble plot
        // function initBubble () {
        // var idDataBubble = {
        //     x: idOTUs,
        //     y: idValues,
        //     text: idLabels,
        //     mode: 'markers',
        //     marker: {
        //         color: idOTUs,
        //         size: idValues,
        //     }
        // };

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
        // var layoutBubble = {
        //     title: "Sample Values by OTU_ID",
        //     xaxis: { title: "OTU_ID" },
        //     yaxis: { title: "Sample Value" }
        // };
        // Plotly.restyle("bubble", idDataBubble);
        // updateBubble(idDataBubble);
        
        // };

        // update gauge plot with selected subject ID's data
        var gaugevalue = idScrubFreq;
        
        Plotly.restyle("gauge", "value", [gaugevalue]);
        
    };

// function updateBar(newbardata) {
//     Plotly.restyle("bar", "values", [newbardata]), [0];
// };

// function updateBubble(newbubbledata) {
//     Plotly.restyle("bubble", "values", [newbubbledata], [0]);
// };

// initialize plots on page load or refresh
initBar();
initBubble();
initGauge();
});



