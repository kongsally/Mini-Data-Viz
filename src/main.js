
var geoJson_data;
var topics = [];
var chart_width = $(window).width() * 0.8;

function loadGeoJson(drawAgeChart, drawTopicCloud {
	$.getJSON("../assets/monument_lab_master.geojson", function( data ) { 
      	geoJson_data = data.features;
      	console.log(geoJson_data);

      	// Make a dictionary with the topics
      	topics = Object.keys(geoJson_data[0].properties).filter(function(k) {
		    	return k.indexOf('topic') == 0;
		});

      	drawAgeChart();
      	drawTopicCloud();
  });
}

function isNaturalNumber (str) {
    var pattern = /^(0|([1-9]\d*))$/;
    return pattern.test(str);
}

function mergeAsTuples(labels, ageCounts) {
	var length = labels.length;
	var mergedArray = [];
	for (var i = 0; i < length; i++) {
		mergedArray.push([labels[i], ageCounts[i]]);
	}
	return mergedArray;
}

function processAgeRange(n) {
	
	var ageRange_counts = Array(n).fill(0);
	
	reported_age_count = 0;

	// Creating an object of ages and its counts
	for (var i = 0; i < geoJson_data.length; i++) {
		var currentAge = geoJson_data[i].properties["age"];
		if (!isNaturalNumber(currentAge)) {
			continue;
		} else {
			reported_age_count += 1;
			ageRange_counts[parseInt(currentAge/10)] += 1;
		}	
	}

	console.log(reported_age_count + " people reported age");
	return ageRange_counts;
}

function processTopics() {

	var topics_n = topics.length;
	var topics_count = Array(topics_n).fill(0);
	var topics_proposals = Object.keys(geoJson_data[0].properties).filter(function(k) {
		    return k.indexOf('topic') == 0;
		}).reduce(function(newData, k) {
		    newData[k] = [];
		    return newData;
		}, {});

	
	// Creating an object of ages and its counts
	for (var i = 0; i < geoJson_data.length; i++) {
		for (var j = 0; j < topics_n; j++) {
			var currentTopic = topics[j];
			var hasTag = geoJson_data[i].properties[currentTopic];
			if (!hasTag) {
				continue;
			} else {
				topics_count[j] += 1;
				var name = geoJson_data[i].properties["name"];
				var transcription = geoJson_data[i].properties["transcript"];

				var entry = name + ": " + transcription;
				if(entry.length > 1
				 && !topics_proposals[currentTopic].includes(entry)) {
					topics_proposals[currentTopic].push(entry);
				}	
			}	
		}
	}

	return [topics_count, topics_proposals];
}


// Load the Visualization API and the bar package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(setupChart);

function setupChart() {
	loadGeoJson(drawAgeChart, drawTopicCloud);
}

function createAgeRangeLabels(n) {
	var labels = []
	for (var i = 0; i <= n; i++) {
		labels.push((i*10) + "-" + (i*10+9));
	}
	return labels;
}

function drawAgeChart() {
	
	// Create the data table.
	var age_range_data = new google.visualization.DataTable();
	age_range_data.addColumn('string', 'Age Range');
	age_range_data.addColumn('number', 'Number of Participants');
	
	var n = 16;
	ageRange_Labels = createAgeRangeLabels(n);
	ageRange_Counts = processAgeRange(n);
	topics_Counts = processTopics();

	age_chart_data = mergeAsTuples(ageRange_Labels, ageRange_Counts);
	tag_chart_data = mergeAsTuples(topics, topics_Counts);

	console.log(age_chart_data);

	age_range_data.addRows(age_chart_data);

	// Set chart options
	var options = {'width': chart_width,
	               'height': 600,
	               pieHole: 0.4,
	               legend: { position: 'top', maxLines: 3},
	           		isStacked: true};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(
		document.getElementById('ageChart'));

	chart.draw(age_range_data, options);
}

function drawTopicCloud() {
	
	[topics_Counts, topicsProposals] = processTopics();

	var tokenized_topics = topics.map(function(obj) { 
	   var tokenized_topic = obj.slice(6, obj.length);
	   return tokenized_topic;
	});

	topic_chart_data = mergeAsTuples(tokenized_topics, topics_Counts);
	
	// for word cloud
	topic_wordcloud_data = [];
	for (var i = 0; i < topic_chart_data.length; i++) {
		var tag = topic_chart_data[i][0];
		tag.replace(/_/g, ' ');
		var counts = topic_chart_data[i][1];
		topic_wordcloud_data.push({
			"text": tag,
			"weight": counts
		});
	}

	$('#topicCloud').jQCloud(topic_wordcloud_data, {
	  width: chart_width,
	  height: 500,
	  shape: "rectangular"
	});

}

$( window ).resize(function() {
  chart_width = $(window).width() * 0.8;
  drawAgeChart();
});
