let COUNT = {
	"Monday": [8, 9, 41, 63, 56, 36, 50, 67, 71, 50, 79, 60, 34, 28, 44, 
			   28, 60, 65, 116, 93, 78, 78, 171, 122, 92, 67, 127, 72, 
			   35, 28, 34, 24, 23, 26, 29, 18, 32, 26, 44, 36, 85, 117, 
			   143, 123, 120, 131, 135, 122, 140, 131, 123, 121, 78, 58, 
			   16, 5, 25, 17, 13, 12, 11, 11, 13, 10, 3, 1, 1, 2, 3, 2, 2, 0]
};

// let COUNT = {
// 	"Monday": [19, 12, 56, 84, 75, 53, 63, 83, 81, 70, 97, 79, 48, 36, 49,
// 			   37, 81, 89, 160, 118, 91, 104, 185, 128, 97, 73, 147, 90, 
// 			   44, 32, 42, 29, 30, 32, 37, 30, 37, 31, 54, 43, 113, 140, 
// 			   155, 130, 144, 149, 166, 149, 161, 155, 137, 127, 93, 76, 
// 			   24, 11, 41, 35, 37, 27, 21, 22, 25, 20, 7, 7, 5, 3, 6, 4, 3, 2]
// }

let HOURS = {
	"Monday": {
		"Quench":[[7, 25]],
		"Market":[[7, 21]],
		"Noodle":[[11, 14], [17, 20.5]],
		"Plate": [[7.5, 10], [11, 14], [17, 20], [21, 23]],
		"Select": [[11, 14], [17, 20.5]],
		"Seared": [[11, 14], [16, 21]]
	}
}

let PROB = {
	"Monday": {
		"Quench": [85.71, 83.33, 25.00, 20.97, 33.33, 28.26, 25.64, 32.35, 34.57, 36.92,
				   24.74, 28.57, 55.26, 42.86, 41.03, 47.37, 22.41, 13.48, 6.80, 11.83, 
				   7.14, 9.20, 5.66, 9.17, 11.59, 17.14, 4.60, 7.84, 31.82, 28.57, 34.21, 
				   16.67, 22.22, 26.32, 35.14, 18.75, 16.13, 18.18, 22.92, 16.67, 7.89, 
				   5.13, 5.50, 7.84, 7.27, 5.47, 5.97, 6.20, 1.59, 7.52, 8.91, 5.83, 12.99, 
				   6.67, 100.00, 100.00, 17.86, 31.25, 34.78, 0.00, 33.33, 9.09, 15.38, 
				   41.18, 100.00, 100.00, 100.00, 100.00, 0.00, 100.00, 0.00, 100.00],

		"Noodle": [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 0.00, 10.34, 15.73, 22.45, 11.83, 19.05, 
				   19.54, 23.90, 19.17, 8.70, 15.71, 24.14, 15.69, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 17.11, 19.23, 
				   21.10, 18.63, 20.00, 24.22, 19.40, 21.71, 21.43, 15.04, 25.74, 23.30, 
				   28.57, 20.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],

		"Plate": [0.00, 0.00, 64.29, 66.13, 58.67, 60.87, 56.41, 55.88, 59.26, 53.85, 
				  54.64, 59.74, 34.21, 0.00, 0.00, 0.00, 18.97, 25.84, 20.41, 24.73, 
				  22.62, 26.44, 18.87, 25.00, 28.99, 31.43, 24.14, 25.49, 0.00, 0.00, 
				  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 18.42, 
				  16.67, 12.84, 13.73, 17.27, 17.19, 17.16, 14.73, 27.78, 22.56, 15.84, 
				  9.71, 0.00, 0.00, 0.00, 0.00, 82.14, 68.75, 65.22, 100.00, 66.67, 
				  90.91, 84.62, 58.82, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],

		"Market": [14.29, 16.67, 10.71, 12.90, 8.00, 10.87, 17.95, 11.76, 6.17, 9.23, 
				   20.62, 11.69, 10.53, 57.14, 58.97, 52.63, 24.14, 21.35, 21.09, 25.81, 
				   25.00, 24.14, 23.90, 20.83, 28.99, 18.57, 18.39, 23.53, 68.18, 71.43, 
				   65.79, 83.33, 77.78, 73.68, 64.86, 81.25, 41.94, 50.00, 37.50, 33.33, 
				   15.79, 23.08, 26.61, 27.45, 20.00, 21.09, 14.93, 19.38, 19.84, 18.80, 
				   23.76, 21.36, 24.68, 23.33, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],

		"Select": [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 6.90, 6.74, 9.52, 7.53, 9.52, 5.75, 8.81, 15.00, 
				   8.70, 5.71, 8.05, 5.88, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 9.21, 11.54, 11.93, 3.92, 13.64, 10.94, 11.94, 
				   10.08, 9.52, 12.78, 11.88, 6.80, 5.19, 6.67, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00],

		"Seared": [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 17.24, 16.85, 19.73, 18.28, 16.67, 14.94, 18.87, 
				   10.83, 13.04, 11.43, 20.69, 21.57, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 41.94, 31.82, 39.58, 50.00, 31.58, 24.36, 22.02, 28.43, 21.82, 
				   21.09, 30.60, 27.91, 19.84, 23.31, 13.86, 33.01, 28.57, 43.33, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
				   0.00, 0.00, 0.00, 0.00]
	}
};