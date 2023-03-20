//define url needed to access data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//view data
d3.json(url).then(function(data) {
    console.log(data)
})

//__________________________________________________________________________
//Creat initializing function to pull sample names for dropdown menu. Selection from menu will alter the page.
function init() {
    //select html id to be used for dropdown
    let dropdownMenu = d3.select("#selDataset");
    //call data 
    d3.json(url).then(function(data) {
        //isolate sample names from data
        let names = data.names;
        //loop through list of sample names and append to html as options within select list
        names.forEach(element => {
            dropdownMenu.append("option").property("value", element).text(element)
        });
        //isolate first data point (sample 940) to create initial charts so page is populated initially prior to selection
        let firstName = names[0]; //isolate first data point
        demoChart(firstName); //call demoChart function to display metadata for first data point
        myCharts(firstName); //call myCharts function to display bar, gauge, and bubble charts for first data point
  }
 )
}

init(); //run function so data displays

//__________________________________________________________________________
//create function to update sample subject id based on drop down selection
//refer to "optionChanged" for id="selDataset" in HTML code
function optionChanged(newName){ 
    demoChart(newName); //update metadata display
    myCharts(newName); //update bar, gauge, and bubble charts
}


//__________________________________________________________________________
//create function to display metadata
function demoChart(sample){
    d3.json(url).then((data) => { //retrieve data source
        let metadata = data.metadata; //isolate metadata
        let metaArray = metadata.filter(sampleobj => sampleobj.id == sample); 
        let metaResults = metaArray[0]; //first result
        let panel = d3.select("#sample-metadata"); //id = sample-metadata
        panel.html(""); //clears out previous demographic info
        Object.entries(metaResults).forEach(([key, value]) => {
            panel.append("h5").text(`${key.toUpperCase()}: ${value}`);

        })
    })}

//__________________________________________________________________________
//create function to display bar graph, gauge, and bubble chart
function myCharts(sample){
    d3.json(url).then((data) => { //retrieve data
        let metadata = data.metadata; //isolate metadata
        let metaArray = metadata.filter(sampleobj => sampleobj.id == sample);
        let metaResults = metaArray[0];  
        let wfreq = metaResults.wfreq; //wash frequency


        let sampleData = data.samples; //isolate samples
        let sampleArray = sampleData.filter(sampleobj => sampleobj.id == sample);
        let sampleResults = sampleArray[0];
        
        let otu_ids = sampleResults.otu_ids; //isolate otu_ids from samples
        let sample_values = sampleResults.sample_values; //isolate sample_values from samples
        let otu_labels = sampleResults.otu_labels; //isolate otu_labels from samples

        //________________________________________________________________
        //Build Bar Chart using Plotly
        let yTicks = otu_ids.slice(0,10).reverse().map(otus => `OTU ${otus}`) //define y a-axis

        var barData = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: yTicks,
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
          }];
          
          var barLayout = {
            title: 'Top 10 OTUs Found in Sample',
            margin: {t:30, l:130, r: 30, b: 30}
          };

          Plotly.newPlot('bar', barData, barLayout);

          //________________________________________________________________
          //Build Bubblechart using Plotly
          var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_ids,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "mint"
            }
          }];
          
          var bubbleLayout = {
            title: 'Display of Sample',
            height: 600,
            width: 1200, 
          };

          Plotly.newPlot('bubble', bubbleData, bubbleLayout);
          
          //________________________________________________________________
          //Build Gauge Chart using Plotly
          var gaugedata = [
            {
              type: "indicator",
              mode: "gauge+number+delta",
              value: wfreq,
              title: { text: "<b>Belly Button Wash Frequency<b> <br> Scrubs per Week", font: { size: 20 } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 2, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bordercolor: "royalblue",
                steps: [
                  { range: [0, 1], color: "lightblue" },
                  { range: [1, 2], color: "lightblue" },
                  { range: [2, 3], color: "lightblue" },
                  { range: [3, 4], color: "lightblue" },
                  { range: [4, 5], color: "lightblue" },
                  { range: [5, 6], color: "lightblue" },
                  { range: [6, 7], color: "lightblue" },
                  { range: [7, 8], color: "lightblue" },
                  { range: [8, 9], color: "lightblue" }
                ],
                threshold: {
                  line: { color: "darkblue", width: 4 },
                  thickness: 0.75,
                  value: wfreq
                }
              }
            }
          ];
          
          var gaugeLayout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white",
            font: { color: "darkblue", family: "sans-serif" }
          };
          
          Plotly.newPlot('gauge', gaugedata, gaugeLayout);

    }
    )
}




