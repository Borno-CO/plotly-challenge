
      <div class="col-md-2">
      <div id="bellybuttons" style="width:100%;height:0;padding-bottom:100%;position:relative;">
      </div>
    </div>
    <div class="col-md-1"></div>


    d3.select('#bellybuttons').html('<br><h4>What\'s in your belly button?</h4><iframe src="https://giphy.com/embed/11x3F1cvBdTIcM" width="360" height="180" position="absolute" frameBorder="0" class="giphy-embed"></iframe><p><a href="https://giphy.com/gifs/11x3F1cvBdTIcM">via GIPHY</a></p>');
    // var bellybuttons_img = d3.select('#bellybuttons').append('iframe');
    // bellybuttons_img.attr('src', 'https://gph.is/299ZQ6O');
    // bellybuttons_img.attr('width', '100%');
    // bellybuttons_img.attr('height', '100%');
    // bellybuttons_img_img.attr('style', 'position:absolute');
    // bellybuttons_img.attr('frameBorder', '0');
    // bellybuttons_img.attr('class', 'giphy-embed');
















d3.selectAll("#selDataset").on("change", updatePlotly);

    // This function is called when a dropdown menu item is selected
    function updatePlotly() {
        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.property("value");

        for (var i = 0; i < samples.length; ++i) {
            if (samples[i].id === dataset) {
                var idSamples = samples[i];
                console.log(`idSamples: ${idSamples}`);
            }
        }

        d3.selectAll("#selDataset").on("change", optionChanged);

    function optionChanged() {
        // Use D3 to select the dropdown menu
        
        // Assign the value of the dropdown menu option to a variable
        var dataset = document.getElementByID("selDataset").value;

        for (var i = 0; i < samples.length; ++i) {
            if (samples[i].id === dataset) {
                var idSamples = samples[i];
                console.log(`idSamples: ${idSamples}`);
            }
        }

        
        d3.select("#stockInput").node().value = "";



        // function to get the first sample for the init plots
        function initSample(sample) {
            return sample[0];
            return sample.id === '940';
        }

        var defaultSample = samples.filter(initSample);
        // var sortedOTU = otuArray.sort(function sortFunction(a, b) {
        //     return b - a;
        //   });

        // var top10OTU = sortedOTU.slice(0, 10);

        // // Initialize x and y arrays
        // var x = [];
        // var y = [];
    }

    steps: [
        { range: [0, 1], color: "white" },
        { range: [1, 2], color: "lightyellow" },
        { range: [2, 3], color: "lightgoldenrodyellow" },
        { range: [3, 4], color: "yellowgreen" },
        { range: [4, 5], color: "greenyellow" },
        { range: [5, 6], color: "mediumseagreen" },
        { range: [6, 7], color: "lightgreen" },
        { range: [7, 8], color: "limegreen" },
        { range: [8, 9], color: "green" },
    ],