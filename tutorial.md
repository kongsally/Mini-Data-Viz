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
#### 1. Understanding the monument lab geojson file
* The geojson file contains a list of feature objects where each feature has two attributes:
    * Geometry: an object that describes the point coordinate (lat, long) of where the proposed art should be.
    * Properties: an object that includes the name, title, and topics of the proposal as attributes
* **Think of each feature as a proposal** 
* For each proposal, its properties object has different **topics as attributes** where the value is 1 if that topic is relevant to the proposal and “null” if not. Example:
    * ```
    {..."topic_war":null,"topic_violence":1,"topic_unity":null...}```
 * For each proposal, its properties object also has an **age attribute** that represents the age of the person who made the proposal.

#### 2. Setting up callback functions for drawing the charts
* For drawing the charts, we want to make sure we first load the needed library, load the geojson file, then draw the charts. We will use callback functions to ensure this order. 
* Setting a callback to run when the Google Visualization API is loaded:

```javascript
google.charts.setOnLoadCallback(drawCharts);
```
* The function drawCharts calls loadGeoJson and passes in drawAgeChart and drawTopicCloud functions as callback function arguments:

```javascript
function drawCharts() {
  loadGeoJson(drawAgeChart, drawTopicCloud);
}
```
#### 3. Creating a pie chart using Google Charts
* Dividing ages by ranges and creating labels
* Creating a list of tuples that contain the age range and the number of people who made a proposal within that age range 
* Customizing the Google Pie Chart

#### 4. Creating a wordcloud using jqCloud2
 A word cloud is a weighted list of words where the size of the words represent its importance.
For this project, I chose a word cloud over a pie chart or a bar graph because we have a lot of topics (55) to fit in either an axis or as a slice of a pie. 

* Finding all proposal topics from the geojson file by mapping the feature's keys
* Creating a list of tuples that contain the topic and the number of proposals that has that topic 
* Mapping the list of tuples to a list of jqCloud word objects
* Adding onHover functions on each word object
* Creating the word cloud in jqCloud and customizing options
