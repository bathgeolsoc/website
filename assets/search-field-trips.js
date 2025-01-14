---
---

{% include_relative lunr.js %}

const searchform = document.getElementById("search-form");
const searchfield = document.getElementById("searchfield");
const filteredEvents = document.getElementById("filtered-events");
const searchcount = document.querySelector('.searchcount')

var index = lunr(function() {
  this.ref('id');
  this.field('title', {boost: 10});
  this.field('leader');
  this.field('excerpt');
  this.field('year');
  for (let key in window.store) {
  this.add({
    'id': key,
    'title': window.store[key].title,
    'leader': window.store[key].leader,
    'excerpt': window.store[key].excerpt,
	'year': window.store[key].year
  });
}
});

const getTerm = function() {
  searchfield.addEventListener('keyup', function(event) {
    event.preventDefault();
    const query = this.value ;   
    doSearch(query);
  })
}

var doSearch = function () {
		const trimmedValue = searchfield.value.trim();
		console.log("Searching for " + trimmedValue);
		searchcount.style.display = "block";
		selectElement('year-select', '*');
		var result = index.search(trimmedValue);
		filteredEvents.innerHTML = '';
		searchcount.innerHTML = `Found ${result.length} field trips`;
		showResults(result);
};

var showResults = (result) => {

    for (let item of result) {
		console.log(item.ref);
      var ref = item.ref;
      var searchitem = document.createElement('div');
      searchitem.className = 'searchitem';
      searchitem.innerHTML = `<div class="circle-date">${window.store[ref].dayofweek}<br><div class='centre-date'>${window.store[ref].date}</div>${window.store[ref].year}</div>
	  <div class="event-content"><h2><a href="${window.store[ref].url}">${window.store[ref].title}</a></h2>
	  <h3>Leader: ${window.store[ref].leader}</h3>
	  <p>${window.store[ref].excerpt}</p></div>
	  <hr>`;

      filteredEvents.appendChild(searchitem);
}
};

getTerm();

function compareObjects(o1, o2) {
  var k = '';
  for(k in o1) if(o1[k] != o2[k]) return false;
  for(k in o2) if(o1[k] != o2[k]) return false;
  return true;
}

function itemExists(haystack, needle) {
  for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
  return false;
}

function timeFilterEvents() {
	searchcount.style.display = "none";
	filteredEvents.innerHTML = '';
	searchfield.value='';
	
	var selectedYear = document.getElementById("year-select").value;
	
	if(selectedYear=='upcoming'){
		const now = Math.floor(Date.now() / 1000)
		var results = [];
		  for(var i=0; i<window.store.length; i++) {
			for(var datetime in window.store[i]) {
			  if(window.store[i]['datetime']>now) {
				if(!itemExists(results, window.store[i])){
					results.push(window.store[i]);
					results[results.length-1].ref = i;
				}
			  }
			}
		  }
		showResults(results);
	}
	else{
		var result = index.search('year: ' + selectedYear);
		showResults(result);
	}
}
timeFilterEvents();

function selectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}