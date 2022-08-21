function newSelection(selectedID){
   d3.json("data/samples.json").then((data) => {
   d3.select("#selDataset").html("");   
   
   data.metadata.forEach(item =>
      {
         d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
      });

   d3.select("#selDataset").node().value = selectedID;

   const idMetadata = data.metadata.filter(item=> (item.id == selectedID));
   console.log(idMetadata);
   
   const panelDisplay = d3.select("#sample-metadata");
   panelDisplay.html("");
   Object.entries(idMetadata[0]).forEach(item=> 
      {

         panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
      });

   // BAR CHART
   const idSample = data.samples.filter(item => parseInt(item.id) == selectedID);
      
   var sampleValue = idSample[0].sample_values.slice(0,10);
   sampleValue= sampleValue.reverse();
   var otuID = idSample[0].otu_ids.slice(0,10);
   otuID = otuID.reverse();
   var otuLabels = idSample[0].otu_labels
   otuLabels = otuLabels.reverse();

   const yAxis = otuID.map(item => 'OTU' + " " + item);
   
   const trace = {
   y: yAxis,
   x: sampleValue,
   type: 'bar',
   orientation: "h",
   text:  otuLabels,
   marker: {
      color: 'rgb(183, 38, 7)',
      line: {
         width: 1
      }
      }
   },
   layout = {
   title: 'Top 10 Operational Taxonomic Units (OTU)/Individual',
   xaxis: {title: 'Number of Samples Collected'},
   yaxis: {title: 'OTU ID'}
   };
   
   Plotly.newPlot('bar', [trace], layout,  {responsive: true});    
      
// BUBBLE CHART

var sampleValue1 =idSample[0].sample_values;
var otuID1= idSample[0].otu_ids;

const trace1 = {
   x: otuID1,
   y: sampleValue1,
   mode: 'markers',
   marker: {
     color: otuID1,     
     size: sampleValue1
   }
 },

 layout1 = {
   title: '<b>Bubble Chart For Each Sample</b>',
   xaxis: {title: 'OTU ID'},
   yaxis: {title: 'Number of Samples Collected'},
   showlegend: false,
   height: 700,
   width: 1250
   };
   
Plotly.newPlot('bubble', [trace1], layout1);

// GAUGE CHART

const gaugeDisplay = d3.select("#gauge");
gaugeDisplay.html(""); 
const washFreq = idMetadata[0].wfreq;

const gaugeData = [
   {
     domain: { x: [0, 1], y: [0, 1] },
     value: washFreq,
     title: { text: "Belly Button Washing Frequency <br>(Scrubs Per Week)" },
     type: "indicator",
     mode: "gauge+number",     
      gauge: {
      axis: { range: [0,9] },
      bar: { color: "#f63e17" },
      steps: [
         { range: [0, 1], color: "#f75d3d" },
         { range: [1, 2], color: "#f86d50" },
         { range: [2, 3], color: "#f97d63" },
         { range: [3, 4], color: "#fa8c76" },
         { range: [4, 5], color: "#fa9c89" },
         { range: [5, 6], color: "#fbac9b" },
         { range: [6, 7], color: "#fcbcae" },
         { range: [7, 8], color: "#fdcbc1" },
         { range: [8, 9], color: "#feebe7" }
               
       ],
      threshold: {
         value: washFreq
       }
     }
   }
 ]; 
 const gaugeLayout = {  width: 500, 
                  height: 400, 
                  margin: { t: 0, b: 0 }, 
                   };

 Plotly.newPlot('gauge', gaugeData, gaugeLayout); 

});
}

newSelection(940);

d3.select("#selDataset").on('change',() => {
newSelection(d3.event.target.value);

});