def get_total_hours(filename):
	data = open(filename)
	total = 0
	for line in data:
		if not line.startswith("Total") and not line.startswith("#"):
			hour = line.split(": ")[1]
			start = hour.split(" - ")[0]
			start = float(start.split(":")[0]) + (float(start.split(":")[1]) / 60)
			end = hour.split(" - ")[1]
			end = float(end.split(":")[0]) + (float(end.split(":")[1]) / 60)
			total += (end - start)
	return total

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

for day in DAYS:
	print(day)
	print("Center Table: " + str(get_total_hours(day + ".txt")))
	print("Model Schedule: " + str(get_total_hours(day + "_output.txt")))

