# Philadelphia Public Art Proposals: 
## A Mini Data Visualization Project

In the year 2015, the Monument Lab and the Haverford Digital Scholarship program collected 400+ public art proposals from Philadelphians, and made this data public through [Open Data Philly](https://www.opendataphilly.org/). I created this mini data visualization project to show how I used this open data to better understand the people involved in this project and the proposals they made. 

In this tutorial I will go over how I parsed the data in order to integrate it with two data visualization libraries, Google Charts and jqCloud2. 

## Technologies Used
* JavaScript
* jQuery
* [Google Charts](https://developers.google.com/chart/)
* [jqCloud2](https://www.npmjs.com/package/jqcloud2) (I used jqCloud2 instead of [jqCloud](http://mistic100.github.io/jQCloud/) for its autoresize feature) 

## Table of Contents
* Loading a geojson file using jQuery
* Creating a pie chart using Google Charts
  * Loading the visualization API
  * Setting a callback to draw the chart when the library loads
  * Dividing ages by ranges and creating labels
  * Creating a list of tuples that contain the age range and the number of people who made a proposal within that age range 
  * Customizing the Google Pie Chart
* Creating a wordcloud using jqCloud2
  * Finding all proposal topics from the geojson file by mapping the feature's keys
  * Creating a list of tuples that contain the topic and the number of proposals that has that topic 
  * Mapping the list of tuples to a list of jqCloud word objects
  * Addding onHover functions on each word object
  * Creating and customizing the word cloud in jqCloud
