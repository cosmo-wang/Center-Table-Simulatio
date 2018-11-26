/**
	This is the jQuery code for simulation of Center Table
	schedule and feasibility testing.

	Author: Cosmo Wang
**/
(function() {

	// Name of all food stations
	const STATION_NAMES = ["Quench", "Noodle", "Plate", "Market", "Select", "Seared"];
	const COLOR = ["#2a4d69", "#4b86b4", "#adcbe3", "#e7eff6", "#63ace5", "#60B8D2"];
	const TIME_INTERVAL = 15;
	const REDUCER = (accumulator, currentValue) => accumulator + currentValue;


	// Run all code inside this section when the page is loaded
	$(document).ready(function() {
		let day = $("#day-selector").val();
		let speed = $("#speed-slider").val();
		$("#speed").text(speed / 1000);

		initializeStations(STATION_NAMES.length);
		initializeWaitingArea(STATION_NAMES.length);
		let timerHandler = null;
		let count = null;
		let prob = null;
		$("#start").click(function() {
			let timeIndex = 0;
			count = COUNT[day];
			if (!timerHandler) {
				prob = PROB[day];
				timerHandler = setInterval(function() {
					
					// reset and stop all when simulation finished
					if (getTime() === 25) {
						clearInterval(timerHandler);
						clearAll(day);
						alert("Simulation finished.")
						return;
					}


					updateTime();
					// adjust number of servers at each station
					for (let i = 0; i < STATION_NAMES.length; i++) {
						let stationName = STATION_NAMES[i];
						if (isOpen(day, STATION_NAMES[i], getTime())) {
							document.getElementById(STATION_NAMES[i] + "-title").classList.remove("closed");
						} else {

							document.getElementById(STATION_NAMES[i] + "-title").classList.add("closed");
						}

						adjustServer(stationName, SHIFTS[day][i][timeIndex]);

						// get the number of customers gone in the past 15 minutes
						let curServerCount = $("#" + stationName + "-server-area div").children().length;
						if (curServerCount > 0) {
							let customersGone = Math.ceil(TIME_INTERVAL * getServerSpeed(stationName, curServerCount));
							if (stationName === "Market") {
								console.log("Time is " + getTime());
								console.log("Now Market has " + ($("#" + stationName + "-wait-area").children().length - 1) + " customers.");
								console.log(customersGone + " gone at " + stationName);
							}
							removeCustomer(stationName, customersGone);
							if (stationName === "Market") {
								console.log("After Market has " + ($("#" + stationName + "-wait-area").children().length - 1) + " customers.");
							}
						}
						
					}

					let customerIndex = 0;
					let customerPerStation = [];
					for (let i = 0; i < STATION_NAMES.length; i++) {
						customerPerStation[i] = Math.ceil(count[timeIndex] * (prob[STATION_NAMES[i]][timeIndex] / 100));
					}
					let customerCount = customerPerStation.reduce(REDUCER);
					console.log(customerPerStation);
					console.log(customerCount + " came.");
					let customerTimerHandler = setInterval(function() {
						if (customerIndex >= customerCount) {
							timeIndex++;
							clearInterval(customerTimerHandler);
							return;
						}
						for (let i = 0; i < customerPerStation.length; i++) {
							if (customerPerStation[i] > 0) {
								addCustomer(STATION_NAMES[i]);
								customerPerStation[i]--;
							}
						}
						customerIndex++;
					}, 5);



					// -------------------------------- //
					// assign customers to each station base on monte carlo method
					// let customerIndex = 0;
					// let customerCount = count[timeIndex];
					// console.log(customerCount + " came.");
					// let customerTimerHandler = setInterval(function() {
					// 	if (customerIndex >= customerCount) {
					// 		timeIndex++;
					// 		clearInterval(customerTimerHandler);
					// 		return;
					// 	}
					// 	let destStation = STATION_NAMES[monteCarlo(timeIndex, count, prob)];
					// 	addCustomer(destStation);
					// 	customerIndex++;
					// }, 10);
					// -------------------------------- //


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
				clearAll();
			}
		});
		$("#day-selector").change(function() {
			day = $(this).val();
			clearAll(day);
		});
		document.getElementById("speed-slider").oninput = function() {
			speed = $("#speed-slider").val()
			$("#speed").text(speed / 1000);
		}
		
	});

	function isOpen(day, stationName, time) {
		let hours = HOURS[day][stationName];
		for (let i = 0; i < hours.length; i++) {
			if (time >= hours[i][0] && time < hours[i][1]) {
				return true;
			}
		}
		return false;
	}

	function monteCarlo(time, count, prob) {
		let p = [prob["Quench"][time] / 100, 
				 prob["Noodle"][time] / 100, 
				 prob["Plate"][time] / 100, 
				 prob["Market"][time] / 100,
				 prob["Select"][time] / 100, 
				 prob["Seared"][time] / 100];
		let x = Math.random();
		let s = 0;
		for (let i = 0; i < p.length; i++) {
			s += p[i]
			if (x <= s) {
				if (i === 3) {
					console.log("1 added to Market.")
				}
				return i;
			}
		}
	}

	function getTime() {
		let time = $("#time").text();
		let hour = parseInt(time.substring(0, 2));
		let min = parseInt(time.substring(3, 5));
		if (hour < 7) {
			return hour + (min / 60) + 24;
		}
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
			return 1 / (-0.2 * n + 1);
		}
		if (stationName === "Market") {
			return 1 / (-0.2 * n + 1.1);
		}
		if (stationName === "Select") {
			return 1 / (-0.2 * n + 1);
		}
		if (stationName === "Seared") {
			return 1 / (-0.2 * n + 1);
		}

	}

	/*
		Update time displayed on the page by one minute, represented be one real second.
	*/
	function updateTime() {
		let time = $("#time").text();
		let hour = parseInt(time.substring(0, 2));
		let min = parseInt(time.substring(3, 5));
		min += TIME_INTERVAL;
		if (min >= 60) {
			hour += 1;
			min -= 60;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (hour < 10) {
			hour = "0" + hour;
		}
		if (hour >= 24) {
			hour -= 24;
		}
		time = "" + hour + ":" + min;
		$("#time").text(time);
	}

	function clearAll(day) {
		// reset time
		if (day === "Saturday" || day === "Sunday") {
			$("#time").text("08:00");
		} else {
			$("#time").text("07:00");
		}
		// reset count
		for (let i = 0; i < STATION_NAMES.length; i++) {
			$("#" + STATION_NAMES[i] + "-count").text("0");
		}
		// clear customers
		for (let i = 0; i < STATION_NAMES.length; i++) {
			while ($("#" + STATION_NAMES[i] + "-wait-area").children().length > 1) {
				$("#" + STATION_NAMES[i] + "-wait-area").children().last().remove();
			}
		}
		// clear servers
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
			title.id = STATION_NAMES[i] + "-title";
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
		if ($("#" + stationName + "-wait-area").children().length == 1) {
			$("#" + stationName + "-count").text("0");
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