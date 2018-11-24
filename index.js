/**
	This is the jQuery code for simulation of Center Table
	schedule and feasibility testing.

	Author: Cosmo Wang
**/
(function() {

	// Name of all food stations
	let STATION_NAMES = ["Quench", "Noodle", "Plate", "Market", "Select", "Seared"];
	let COLOR = ["#2a4d69", "#4b86b4", "#adcbe3", "#e7eff6", "#63ace5", "#60B8D2"];
	let TIME_INTERVAL = 15;

	// Run all code inside this section when the page is loaded
	$(document).ready(function() {
		let day = $("#day-selector").val().toLowerCase();
		let speed = $("#speed-slider").val();
		$("#speed").text(speed / 1000);

		initializeStations(STATION_NAMES.length);
		initializeWaitingArea(STATION_NAMES.length);
		let timerHandler = null
		$("#start").click(function() {
			isOpen();
			if (!timerHandler) {
				timerHandler = setInterval(function() {
					console.log(getTime());
					updateTime();
					let timesRun = 0;
					let stationTimerHandler = setInterval(function() {
						if (timesRun > 5) {
							clearInterval(stationTimerHandler);
							return;
						}
						let stationName = STATION_NAMES[timesRun];

						// get the number of customers gone in the past 15 minutes
						let curServerCount = $("#" + stationName + "-server-area div").children().length;
						if (curServerCount > 0) {
							let customersGone = Math.ceil(TIME_INTERVAL * getServerSpeed(stationName, curServerCount));
							removeCustomer(stationName, customersGone);
						}
						timesRun++;
						let num = parseInt(Math.random() * 4) + 1;
						for (j = 0; j < num; j++) {
							addCustomer(stationName);
						}
						let serverNum = parseInt(Math.random() * 4) + 1;
						adjustServer(stationName, 1);
						console.log(num + " added to " + stationName + "!");
					}, 50);
				}, speed);
			}
		});
		$("#stop").click(function() {
			if (timerHandler) {
				clearInterval(timerHandler);
				timerHandler = null;
			}
		});
		$("#clear").click(function () {
			if (!timerHandler) {
				resetTime(day);
				resetCount();
				clearCustomers();
				clearServers();
			}
		});
		$("#day-selector").change(function() {
			day = $(this).val().toLowerCase();
			resetTime(day);
		});
		document.getElementById("speed-slider").oninput = function() {
			speed = $("#speed-slider").val()
			$("#speed").text(speed / 1000);
		}
		
	});

	function isOpen(day) {
		let url = "index.php?mode=open&day=" + day;
		fetch(url, {credentials: 'include'})
			.then(checkStatus)
         	// Displays description on the page
         	.then(function(responseTEXT) {
            	alert(responseTEXT);
         	})
	}

	function getTime() {
		let time = $("#time").text();
		let hour = parseInt(time.substring(0, 2));
		let min = parseInt(time.substring(3, 5));
		return hour + min / 60;
	}


	/*
		Get the number of customers served at a station during one minute.
		@param {String} stationName: name of a station
		@param {int} n: number of servers at the station currently
	*/
	function getServerSpeed(stationName, n) {
		if (stationName === "Quench") {
			return 1 / (-0.2 * n + 1.6);
		}
		if (stationName === "Noodle") {
			return 1 / (-0.2 * n + 1.2);
		}
		if (stationName === "Plate") {
			return 1 / (-0.2 * n + 1.2);
		}
		if (stationName === "Market") {
			return 1 / (-0.1 * n + 1.5);
		}
		if (stationName === "Select") {
			return 1 / (-0.2 * n + 1);
		}
		if (stationName === "Seared") {
			return 1 / (-0.2 * n + 1.6);
		}

	}

	/*
		Update time displayed on the page by one minute, represented be one real second.
	*/
	function updateTime() {
		let time = $("#time").text();
		let hour = parseInt(time.substring(0, 2));
		let min = parseInt(time.substring(3, 5));
		let ampm = time.substring(6);
		min += TIME_INTERVAL;
		if (min >= 60) {
			hour += parseInt(min / 60);
			min %= 60;
		}
		if (hour >= 12) {
			ampm = "P.M.";
		}
		if (hour > 12) {
			hour %= 12;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (hour < 10) {
			hour = "0" + hour;
		}
		time = "" + hour + ":" + min + " " + ampm;
		$("#time").text(time);
	}

	function resetTime(day) {
		if (day === "saturday" || day === "sunday") {
			$("#time").text("08:00 A.M.");
		} else {
			$("#time").text("07:00 A.M.");
		}
		
	}

	function resetCount() {
		for (let i = 0; i < STATION_NAMES.length; i++) {
			$("#" + STATION_NAMES[i] + "-count").text("0");
		}
	}

	function clearCustomers() {
		for (let i = 0; i < STATION_NAMES.length; i++) {
			while ($("#" + STATION_NAMES[i] + "-wait-area").children().length > 1) {
				$("#" + STATION_NAMES[i] + "-wait-area").children().last().remove();
			}
		}
	}

	function clearServers() {
		for (let i = 0; i < STATION_NAMES.length; i++) {
			$("#" + STATION_NAMES[i] + "-server-area").empty();
		}
	}
	
	/*
		Add stations to the station area on the page.
		Station has a title section and a section for empolyees
		@param {int} n: number of stations to populate the area
	*/
	function initializeStations(n) {
		for (let i = 0; i < n; i++) {
			let title = document.createElement("p");
			title.innerText = (STATION_NAMES[i]);
			title.classList.add("station-title");
			let serverArea = document.createElement("div");
			serverArea.classList.add("server-area");
			serverArea.id = STATION_NAMES[i] + "-server-area";
			let station = document.createElement("div");
			station.classList.add("station");
			station.id = STATION_NAMES[i];
			station.appendChild(title);
			station.appendChild(serverArea);
			station.style.backgroundColor = COLOR[i];
			$("#station-area").append(station);
		}
	}

	/*
		Add waiting area for each station on the page.
		Waiting area start with a child representing a count of how many
		customers are waiting in the area.
		@param {int} n: number of waiting area to populate the area
	*/
	function initializeWaitingArea(n) {
		for (let i = 0; i < n ; i++) {
			let name = STATION_NAMES[i];
			let count = document.createElement("p");
			count.id = name + "-count";
			count.classList.add("customer-count");
			count.innerText = 0;
			let waitArea = document.createElement("div");
			waitArea.classList.add("wait-section");
			waitArea.id = name + "-wait-area";
			waitArea.appendChild(count);
			waitArea.style.backgroundColor = COLOR[i];
			$("#wait-area").append(waitArea);
		}
	}

	/*
		Adjust the number of servers at given station to n.
		@param {String} stationName: name of the station to adjust
		@param {int} number of servers at the time at the station
	*/
	function adjustServer(stationName, n) {
		let childrenNum = $("#" + stationName + "-server-area div").length;
		while (childrenNum != n) {
			if (childrenNum < n) {
				$("#" + stationName + "-server-area").append(createServer);
				childrenNum++;
			} else {
				$("#" + stationName + "-server-area").children().last().remove();
				childrenNum--;
			}
		}
	}

	function createServer() {
		let server = document.createElement("div");
		server.classList.add("server");
		let img = document.createElement("img");
		img.src = "server.png";
		img.alt = "cat server";
		img.style.width = "40px";
		img.style.height = "24.7px";
		server.appendChild(img);
		return server;
	}

	/*
		Remove n customers from a given station.
		@param {String} stationName: name of the stationg
		@param {int} n: number of curtomers to remove
	*/
	function removeCustomer(stationName, n) {
		while ($("#" + stationName + "-wait-area").children().length - 1 > 0 && n > 0) {
			$("#" + stationName + "-wait-area").children().last().remove();
			n--;
		}
	}

	/*
		Add n customers to a specific station.
		@param {int} n: number of customers to be added
		@param {String} stationName: name of station to add more customers
		@param {int} speed: number of miliseconds between each customer move animation
	*/
	function addCustomer(stationName) {
		$("#" + stationName + "-wait-area").append(createCustomer());
		updateCount(stationName);
	}

	function createCustomer() {
		// create a div for the customer to be added
		let customer = document.createElement("div");
		customer.classList.add("customer");
		let img = document.createElement("img");
		img.src = "cat.png";
		img.alt = "cat customer";
		img.style.width = "40px";
		img.style.height = "24.7px";

		// append a image into the div for the customer, initially empty
		customer.appendChild(img);
		return customer;
	}

	/*
		Update customer count in the wait area specified by name
		@param {String} name: name of the station
	*/
	function updateCount(name) {
		document.getElementById(name + "-count").innerText = document.getElementById(name + "-wait-area").childElementCount - 1;
	}

	/**
    *  Function to check the status of an Ajax call, boiler plate code to include,
    *  based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    *  @param the response text from the url call
    *  @return did we succeed or not, so we know whether or 
    *  not to continue with the handling of this promise
    */
   function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
         return response.text();
      } else {
         return Promise.reject(new Error(response.status +
                                        ": " + response.statusText));
      }
   }
})();