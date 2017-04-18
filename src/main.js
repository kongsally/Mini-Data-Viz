var geoJSONData;
var topics = [];
var chartWidth = $(window).width() * 0.6;

// Load the Visualization API and the corechart package which has the pie chart.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
  // pass in the draw chart functions as callback once the geojson is loaded
  loadGeoJson(drawAgeChart, drawTopicCloud);
}

function loadGeoJson(drawAgeChart, drawTopicCloud) {
	$.getJSON('assets/monument_lab_master.geojson', function( data ) { 
  	geoJSONData = data.features;
  	
    // filter all topics from the first entry's list of properties
  	topics = Object.keys(geoJSONData[0].properties).filter(function(property) {
    	return property.indexOf('topic') == 0;
    });

    // draw the chart and word cloud only after the geojson file was loaded
  	drawAgeChart();
  	drawTopicCloud();
  });
}

function drawAgeChart() {

  // Get list of age range labels and counts
  var n = 8; 
  ageRangeLabels = createAgeRangeLabels(n);
  ageRangeCounts = countAges(n);

  // Merge the label and count lists as a list of tuples so that 
  // we can add it as rows to the DataTable
  ageChartData = mergeAsTuples(ageRangeLabels, ageRangeCounts);
  
  // Create the data table.
  var ageDataTable = new google.visualization.DataTable();
  ageDataTable.addColumn('string', 'Age Range');
  ageDataTable.addColumn('number', 'Number of Participants');
  ageDataTable.addRows(ageChartData);

  // Set chart options
  // Generated color gradient from http://www.perbang.dk/rgbgradient/ 
  var options = {'width': chartWidth * 0.7,
                 'height': 400,
                 'legend': 'right',
                 'pieHole': 0.4,
                 'pieSliceText': 'value',
                 'chartArea': {'width': '100%'},
                 'colors': ['#DC3912','#C5512C','#AF6A46','#998361','#839B7B','#6DB496','#57CDB0','#41E6CB']
                 };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(
    document.getElementById('age-chart'));
  chart.draw(ageDataTable, options);
}

function drawTopicCloud() {

  // tokenize the topic by removing the word 'topic_' from each topic name
  // ex. topic_neighborhood => neighborhood
  var tokenizedTopics = topics.map(function(obj) { 
     var tokenizedTopic = obj.slice(6, obj.length);
     return tokenizedTopic;
  });

  topicsCounts = countTopics();
  topicChartData = mergeAsTuples(tokenizedTopics, topicsCounts);

  // need to create a list of word object that has the properties text and weight
  var words = topicChartData.map(function (topicCountTuple) {
    var topic = topicCountTuple[0];
    var count = topicCountTuple[1];

    var word = {
      "text": topic,
      "weight": count,
      afterWordRender: function() {
        // updates the number of topic proposals 
        this.hover(function(){
          var topic = "topic_" + $(this).text();
            $('#topic-proposal-number').text(
              count+ "/462");
        }, function(){
          $('#topic-proposal-number').text("462");
        })
      }
    }
    return word;
  });

  var wordCloud = $('#topic-cloud').jQCloud(words, {
    autoResize: true,
    width: chartWidth,
    shape: "rectangular"
  });

}

function isNaturalNumber (str) {
    var pattern = /^(0|([1-9]\d*))$/;
    return pattern.test(str);
}

function mergeAsTuples(labels, counts) {
	var tupleArray = labels.map(function (label, index, array) {
    return [label, counts[index]]
  });
	return tupleArray;
}

function createAgeRangeLabels(n) {
  var labels = []
  for (var i = 0; i <= n; i++) {
    labels.push((i*10) + "-" + (i*10+9));
  }
  console.log(labels);
  return labels;
}

function countAges(n) {
	
	var ageRangeCounts = Array(n).fill(0);
	
	// Creating an object of ages and its counts
	for (var i = 0; i < geoJSONData.length; i++) {
		var currentAge = geoJSONData[i].properties["age"];
		if (!isNaturalNumber(currentAge)) {
			continue;
		} else {
			ageRangeCounts[parseInt(currentAge/10)] += 1;
		}	
	}

	return ageRangeCounts;
}

function countTopics() {

	var topics_n = topics.length;
	var topicsCount = Array(topics_n).fill(0);
	
	// Iterate through each entry, find which topics it is related to,
  // then keep count of topics that emerges from each proposal 
	for (var i = 0; i < geoJSONData.length; i++) {
		for (var j = 0; j < topics_n; j++) {
			var currentTopic = topics[j];
			var hasTag = geoJSONData[i].properties[currentTopic];
			if (!hasTag) {
				continue;
			} else {
				topicsCount[j] += 1;
			}	
		}
	}
	return topicsCount;
}


$(window).resize(function() {
  chartWidth = $(window).width() * 0.6;
  drawAgeChart();
});
