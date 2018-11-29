# Author: Feiyang Liu
# Modified by: Cosmo Wang
import numpy as np

statname = ["Quench", "Noodle", "Plate", "Market", "Select", "Seared"]
def func(filename):
    hours = np.zeros((6, 72))
    data = open(filename)
    shifts = []
    
    for line in data:
        if (not line.startswith("#") and not line.startswith(" ") \
            and not line.startswith("\n")):
            
            line1 = line.replace(": ", " - ")
            line1 = line1.replace(":\t", " - ")
            line2 = line1.replace(":00", ".00")
            line2 = line2.replace(":15", ".25")
            line2 = line2.replace(":30", ".50")
            line2 = line2.replace(":45", ".75")
            
            spl_shift = line2.split(" - ")
            parsed_shift = [i.rstrip() for i in spl_shift]
            shifts.append(parsed_shift)
            
            #station = line2.split(", ")[0]
            #station_shifts = line2.split(", ")[1]
            #parsed_station_shifts = []
            #for shift in station_shifts:
            #    parsed_station_shifts.append((float(shift.split(" - ")[0].rstrip()), \
            #                                  float(shift.split(" - ")[1].rstrip())))
            #    shifts[station] = parsed_station_shifts

    data.close()
    
    for shift in shifts:
        for j in range(len(statname)):
            if shift[0] == statname[j]:
                index = j
                start = (float(shift[1]) - 7) / 0.25
                close = (float(shift[2]) - 7) / 0.25
                
                for i in range(len(hours[index])):
                    if i >= start and i < close:
                        hours[index][i] += 1
                
    return hours
        
print "Monday"
print func("Monday_output.txt")
print
print "Tuesday"
print func("Tuesday_output.txt")
print
print "Wednesday"
print func("Wednesday_output.txt")
print
print "Thursday"
print func("Thursday_output.txt")
print
print "Friday"
print func("Friday_output.txt")
print
print "Saturday"
print func("Saturday_output.txt")
print
print "Sunday"
print func("Sunday_output.txt")