getwd()
setwd("/Users/liufeiyang/Downloads/CT Simulator")
Monday = read.delim('resultMon.txt', header = FALSE, sep = ",", dec = ".")
hist(Monday$V2, col=rgb(1,0,0,0.5), breaks = 30, xlim = c(20000, 44000), 
     main = "Comparison on Monday", xlab = "Customer Waiting Time")
hist(Monday$V4, col=rgb(0,0,1,0.5), breaks = 30, add = T)
legend("topright", c("CT", "GM"), col=c(rgb(1,0,0,0.5), rgb(0,0,1,0.5)), 
       lwd=10)

mean(Monday$V1)
sd(Monday$V1)
mean(Monday$V3)
sd(Monday$V3)
mean(Monday$V2)
sd(Monday$V2)
mean(Monday$V4)
sd(Monday$V4)

Tuesday = read.delim('resultTues.txt', header = FALSE, sep = ",", dec = ".")
hist(Tuesday$V2, col=rgb(1,0,0,0.5), breaks = 30, xlim = c(20000, 35000), 
     main = "Comparison on Tuesday", xlab = "Customer Waiting Time")
hist(Tuesday$V4, col=rgb(0,0,1,0.5), breaks = 30, add = T)
legend("topright", c("CT", "GM"), col=c(rgb(1,0,0,0.5), rgb(0,0,1,0.5)), 
       lwd=10)

mean(Tuesday$V1)
sd(Tuesday$V1)
mean(Tuesday$V3)
sd(Tuesday$V3)
mean(Tuesday$V2)
sd(Tuesday$V2)
mean(Tuesday$V4)
sd(Tuesday$V4)

Wednesday = read.delim('resultWedn.txt', header = FALSE, sep = ",", dec = ".")
hist(Wednesday$V2, col=rgb(1,0,0,0.5), breaks = 30, xlim = c(20000, 44000), 
     main = "Comparison on Wednesday", xlab = "Customer Waiting Time")
hist(Wednesday$V4, col=rgb(0,0,1,0.5), breaks = 30, add = T)
legend("topright", c("CT", "GM"), col=c(rgb(1,0,0,0.5), rgb(0,0,1,0.5)), 
       lwd=10)

mean(Wednesday$V1)
sd(Wednesday$V1)
mean(Wednesday$V3)
sd(Wednesday$V3)
mean(Wednesday$V2)
sd(Wednesday$V2)
mean(Wednesday$V4)
sd(Wednesday$V4)

Thursday = read.delim('resultThur.txt', header = FALSE, sep = ",", dec = ".")
hist(Thursday$V2, col=rgb(1,0,0,0.5), breaks = 30, xlim = c(20000, 35000), 
     ylim = c(0, 180), main = "Comparison on Thursday", 
     xlab = "Customer Waiting Time")
hist(Thursday$V4, col=rgb(0,0,1,0.5), breaks = 30, add = T)
legend("topright", c("CT", "GM"), col=c(rgb(1,0,0,0.5), rgb(0,0,1,0.5)), 
       lwd=10)

mean(Thursday$V1)
sd(Thursday$V1)
mean(Thursday$V3)
sd(Thursday$V3)
mean(Thursday$V2)
sd(Thursday$V2)
mean(Thursday$V4)
sd(Thursday$V4)

Friday = read.delim('resultFri.txt', header = FALSE, sep = ",", dec = ".")
hist(Friday$V2, col=rgb(1,0,0,0.5), breaks = 30, xlim = c(18000, 30000), 
     main = "Comparison on Friday", xlab = "Customer Waiting Time")
hist(Friday$V4, col=rgb(0,0,1,0.5), breaks = 30, add = T)
legend("topright", c("CT", "GM"), col=c(rgb(1,0,0,0.5), rgb(0,0,1,0.5)), 
       lwd=10)

mean(Friday$V1)
sd(Friday$V1)
mean(Friday$V3)
sd(Friday$V3)
mean(Friday$V2)
sd(Friday$V2)
mean(Friday$V4)
sd(Friday$V4)

Saturday = read.delim('resultSat.txt', header = FALSE, sep = ",", dec = ".")
hist(Saturday$V2, col=rgb(1,0,0,0.5), breaks = 30, xlim = c(10000, 13000), 
     main = "Comparison on Saturday", xlab = "Customer Waiting Time")
hist(Saturday$V4, col=rgb(0,0,1,0.5), breaks = 30, add = T)
legend("topright", c("CT", "GM"), col=c(rgb(1,0,0,0.5), rgb(0,0,1,0.5)), 
       lwd=10)

mean(Saturday$V1)
sd(Saturday$V1)
mean(Saturday$V3)
sd(Saturday$V3)
mean(Saturday$V2)
sd(Saturday$V2)
mean(Saturday$V4)
sd(Saturday$V4)

Sunday = read.delim('resultSun.txt', header = FALSE, sep = ",", dec = ".")
hist(Sunday$V2, col=rgb(1,0,0,0.5), breaks = 30, xlim = c(12000, 18000), 
     main = "Comparison on Sunday", xlab = "Customer Waiting Time")
hist(Sunday$V4, col=rgb(0,0,1,0.5), breaks = 30, add = T)
legend("topright", c("CT", "GM"), col=c(rgb(1,0,0,0.5), rgb(0,0,1,0.5)), 
       lwd=10)

mean(Sunday$V1)
sd(Sunday$V1)
mean(Sunday$V3)
sd(Sunday$V3)
mean(Sunday$V2)
sd(Sunday$V2)
mean(Sunday$V4)
sd(Sunday$V4)