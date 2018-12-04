/**
	This is the code for simulation of Center Table
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
		// set the day and speed of choosen on the page
		let day = $("#day-selector").val();
		let speed = $("#speed-slider").val();
		let ctSchedule = document.getElementById("ct-schedule").checked;
		let modelSchedule = document.getElementById("model-schedule").checked;
		let mcMode = document.getElementById("mc-mode").checked;
		let fixedMode = document.getElementById("fixed-mode").checked;
		$("#speed").text(speed / 1000);

		$(".header").click(function () {
		    $header = $(this);
		    //getting the next element
		    $content = $header.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    $content.slideToggle(300, function () {
		        //execute this after slideToggle is done
		        //change text of header based on visibility of content div
		        $header.text(function () {
		            //change text based on condition
		            return $content.is(":visible") ? "Description: (click to collapse)" : "Description: (click to expand)";
		        });
		    });
		});
		
		// populated the page with stations and waiting areas
		initializeStations(STATION_NAMES.length);
		initializeWaitingArea(STATION_NAMES.length);

		// set main timer handler to be null
		// set up count and probability data
		let timerHandler = null;
		let customerTimerHandler = null;
		let count = null;
		let prob = null;

		//set up statistical variables
		let totalCount = 0;
		let totalLost = 0;
		let totalWait = 0;

		// when simulation starts
		$("#start").click(function() {
			this.disabled = true;
			let inputs = document.getElementsByTagName("INPUT");
			for (let i = 0; i < inputs.length; i++) {
		        inputs[i].disabled = true;
			}
			document.getElementById("day-selector").disabled = true;
			// time index starts with 0 representing 7:00 on weekdays
			// time index starts with 4 representing 8:00 on weekends
			let timeIndex = 0;
			if (day === "Saturday" || day === "Sunday") {
				timeIndex = 4;
			}
			
			count = COUNT[day];
			if (!timerHandler) {
				
				prob = PROB[day];
				timerHandler = setInterval(function() {
					
					// reset and stop all when simulation finished
					if (day === "Friday" || day === "Saturday") {
						if (getTime() === 21) {
							clearInterval(timerHandler);
							clearInterval(customerTimerHandler);
							clearAll(day);
							alert("Simulation finished.")
							return;
						}
					} else {
						if (getTime() === 25) {
							clearInterval(timerHandler);
							clearInterval(customerTimerHandler);
							clearAll(day);
							alert("Simulation finished.")
							return;
						}
					}
					
					// update the clock on the page
					updateTime();

					// adjust number of servers at each station
					// adjust number of customers at each station
					// reflect if the station is open or closed
					for (let i = 0; i < STATION_NAMES.length; i++) {
						let stationName = STATION_NAMES[i];
						// adjust the number of servers according to the shift schedule
						if (ctSchedule) {
							adjustServer(stationName, CT_SHIFTS[day][i][timeIndex]);
						} else if (modelSchedule){
							adjustServer(stationName, MODEL_SHIFTS[day][i][timeIndex]);
						}

						// check the number of server
						let curServerCount = $("#" + stationName + "-server-area div").children().length;
						if (curServerCount > 0) {
							// if there are servers, get the number of customers goen in the past 15 minutes
							let customersGone = Math.ceil(TIME_INTERVAL * getServerSpeed(stationName, curServerCount));

							// remove the gone customer
							removeCustomer(stationName, customersGone);
						}

						// put closed signal at each station if the station is closed
						if (isOpen(day, stationName, getTime())) {
							document.getElementById(STATION_NAMES[i] + "-title").classList.remove("closed");
						} else {
							// clear all customer if the station is closed
							// these customers are the ones that are lost, record the number
							// totalLost += getCustomerCount(stationName)
							while ($("#" + stationName + "-wait-area").children().length > 1) {
								$("#" + stationName + "-wait-area").children().last().remove();
							}
							updateCount(stationName);
							document.getElementById(STATION_NAMES[i] + "-title").classList.add("closed");
						}
						
					}

					if (mcMode) {
						// assign customers to each station base on monte carlo method
						// customer index represents the nth customer to be assigned
						let customerIndex = 0;
						// customer count is the number of customers coming to all station at this time
						let customerCount = count[timeIndex];
						// record total count
						totalCount += customerCount;
						customerTimerHandler = setInterval(function() {
							// if all customers are assigned, this time is finished
							// increment time index and clear the sub timer handler
							if (customerIndex >= customerCount || getTime() === 25) {
								for (let i = 0; i < STATION_NAMES.length; i++) {
									totalWait += (1 / (getServerSpeed(STATION_NAMES[i], getServerCount(STATION_NAMES[i])))) 
													* getCustomerCount(STATION_NAMES[i]);
								}
								showResult(totalCount, totalLost, (Math.round(totalWait * 100) / 100));
								timeIndex++;
								clearInterval(customerTimerHandler);
								customerTimerHandler = null;
								return;
							}
							// record the station that the customer is assigned to
							let destStation = STATION_NAMES[monteCarlo(timeIndex, prob)];
							addCustomer(destStation);
							customerIndex++;
						}, 10);
					} else if (fixedMode) {
						// add customers to each station based on fixed probability
						let customerIndex = 0;
						let customerPerStation = [];
						for (let i = 0; i < STATION_NAMES.length; i++) {
							customerPerStation[i] = Math.ceil(count[timeIndex] * (prob[STATION_NAMES[i]][timeIndex] / 100));
						}
						let customerCount = customerPerStation.reduce(REDUCER);
						totalCount += customerCount;
						customerTimerHandler = setInterval(function() {
							if (customerIndex >= customerCount) {
								for (let i = 0; i < STATION_NAMES.length; i++) {
									totalWait += (1 / (getServerSpeed(STATION_NAMES[i], getServerCount(STATION_NAMES[i])))) 
													* getCustomerCount(STATION_NAMES[i]);
								}
								showResult(totalCount, totalLost, (Math.round(totalWait * 100) / 100));
								timeIndex++;
								clearInterval(customerTimerHandler);
								customerTimerHandler = null;
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
					}
				}, speed);
			}
		});
		// stop animation when stop is clicked
		$("#stop").click(function() {
			if (timerHandler) {
				clearInterval(timerHandler);
				timerHandler = null;
			}
		});
		// clear all when clear is clicked
		$("#clear").click(function () {
			location.reload();
		});
		// update the day and clear all when the selected day is changed
		$("#day-selector").change(function() {
			day = $(this).val();
			clearAll(day);
		});
		// update the speed displayed on the page when the slider is adjusted
		document.getElementById("speed-slider").oninput = function() {
			speed = $("#speed-slider").val()
			$("#speed").text(speed / 1000);
		}

		document.getElementById("ct-schedule").addEventListener('change', function() {
			ctSchedule = this.checked;
			modelSchedule = false;
		});
		document.getElementById("model-schedule").addEventListener('change', function() {
			modelSchedule = this.checked;
			ctSchedule = false;
		});
		document.getElementById("mc-mode").addEventListener('change', function() {
			mcMode = this.checked;
			fixedMode = false;
		});
		document.getElementById("fixed-mode").addEventListener('change', function() {
			fixedMode = this.checked;
			mcMode = false;
		});
		
	});

	function showResult(count, lost, wait) {
		$("#total-count").text(count);
		// $("#total-lost").text(lost);
		$("#waiting-time").text(wait);
	}

	/*
		Check if a station is open at a given time of a given day.
		@param {String} day: a day of a week, capitalized
		@param {String} stationName: name of the station needs to be checked
		@param {double} time: numerical representation of current time
	*/
	function isOpen(day, stationName, time) {
		let hours = HOURS[day][stationName];
		for (let i = 0; i < hours.length; i++) {
			if (time >= hours[i][0] && time < hours[i][1]) {
				return true;
			}
		}
		return false;
	}

	/*
		Randomly select a station to put a customer using Monte Carlo method.
		@param {int} time: current time of assignment represented by time index
						   0 represents 7:00, 1 represents 7:15 and so on
		@param {dictionary} prob: mapping from station name to a list of probabilities
								  that a customer will show up at that station at each
								  time of a day. The first element of the list represents
								  the probability of 7:00, second element represents 
								  the probability of 7:15 and so on
		@return {int} i: the index of the station that the cutsomer is assigned
	*/
	function monteCarlo(time, prob) {
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
				return i;
			}
		}
	}

	/*
		Get the current time and return the numerical representation of the time.
		@return {double} numerical representation of the time
	*/
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

	/*
		Clear time, count, customers and servers
	*/
	function clearAll(day) {
		// reset time
		if (day === "Saturday" || day === "Sunday") {
			$("#time").text("08:00");
		} else {
			$("#time").text("07:00");
		}
		// reset count
		for (let i = 0; i < STATION_NAMES.length; i++) {
			// reset count
			$("#" + STATION_NAMES[i] + "-count").text("0");
			// clear customers
			while ($("#" + STATION_NAMES[i] + "-wait-area").children().length > 1) {
				$("#" + STATION_NAMES[i] + "-wait-area").children().last().remove();
			}
			// clear servers
			$("#" + STATION_NAMES[i] + "-server-area").empty();
			// close all stations
			$("#" + STATION_NAMES[i] + "-title").addClass("closed");
		}
	}


	
	/*
		Add stations to the station area on the page.
		Station has a title section and a section for empolyees
		@param {int} n: number of stations to populate the area
	*/
	function initializeStations(n) {
		for (let i = 0; i < n; i++) {
			let titleArea = document.createElement("div");
			titleArea.classList.add("title-area");
			let title = document.createElement("p");
			title.innerText = (STATION_NAMES[i]);
			title.classList.add("station-title");
			title.classList.add("closed");
			title.id = STATION_NAMES[i] + "-title";
			let titleImg = document.createElement("img");
			titleImg.classList.add("title-img");
			titleImg.src = "img/" + STATION_NAMES[i] + ".png";
			titleImg.alt = STATION_NAMES[i] + " img";
			titleImg.style.width = "45px";
			titleImg.style.height = "45px";
			titleArea.appendChild(title);
			titleArea.appendChild(titleImg);
			let serverArea = document.createElement("div");
			serverArea.classList.add("server-area");
			serverArea.id = STATION_NAMES[i] + "-server-area";
			let station = document.createElement("div");
			station.classList.add("station");
			station.id = STATION_NAMES[i];
			station.appendChild(titleArea);
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

	/*
		Creat a DOM object with a picture representing a server.
		@return {DOM Object} server
	*/
	function createServer() {
		let server = document.createElement("div");
		server.classList.add("server");
		let img = document.createElement("img");
		img.src = "img/server.png";
		img.alt = "cat server";
		img.style.width = "40px";
		img.style.height = "24.7px";
		server.appendChild(img);
		return server;
	}

	function getServerCount(stationName) {
		return $("#" + stationName + "-server-area").children().length;
	}

	function getCustomerCount(stationName) {
		return $("#" + stationName + "-wait-area").children().length - 1;
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
		img.src = "img/customer.png";
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