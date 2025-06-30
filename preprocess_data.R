library(readxl)

countries_codes <- read_excel("C:/Users/diego/Desktop/proyectos/crecimiento_poblacion/iso_3digit_alpha_country_codes.xlsx")
population_and_demography <- read.csv("C:/Users/diego/Desktop/proyectos/crecimiento_poblacion/population_1950_2023.csv", sep=",")

population<-population_and_demography[order(population_and_demography$Year),1:3]
# Only select the countries not continent or group of countries
population<-population[population$Entity %in% countries_codes$Country,]

# There is 235 countries and 73 years data
num_countries<-235
num_years<-73

population<-cbind(population,rep("",dim(population)[1]),rep("",dim(population)[1]))
names(population)<-c("name","year","pop","id","continent")

# Pick a year and get only the country codes that are in this year data
population_year2021<-population_and_demography[which(population_and_demography$Year=="2021"), 1:3]
population_year2021<-population_year2021[population_year2021$Entity %in% countries_codes$Country,]
countries_codes_paises<-as.data.frame(countries_codes[countries_codes$Country%in%population_year2021$Entity,])

# Add continent to the data
for(i in 1:dim(countries_codes_paises)[1]){
  country<-population$name[i]
  id_y_continent<-c(as.character(countries_codes_paises[countries_codes_paises$Country %in% country,][1]),
                     as.character(countries_codes_paises[countries_codes_paises$Country %in% country,][3]))
  for(j in 0:(num_years-1)){
    population$id[i+(j*num_countries)]<-id_y_continent[1]
    population$continent[i+(j*num_countries)]<-id_y_continent[2]
  }
}


# Define the file name and path to save the world and continents population
file_path <- "C:/Users/diego/Desktop/proyectos/crecimiento_poblacion//"    
file_name <- "population_all_years.csv" 

write.csv(population, file = paste0(file_path, file_name),row.names = FALSE)

world_and_continents<-c("Africa (UN)", "Asia (UN)","Europe (UN)","Latin America and the Caribbean (UN)",
                        "Northern America (UN)", "Oceania (UN)","World")

pop_world<-population_and_demography[population_and_demography$Entity %in% "World",]
pop_world_and_continents<-population_and_demography[population_and_demography$Entity %in% world_and_continents,]
names(pop_world)<-c("name","year","pop")

file_name <- "pop_world_and_continents.csv" 
write.csv(pop_world_and_continents, file = paste0(file_path, file_name),row.names = FALSE)

file_name <- "pop_world.csv" 
write.csv(pop_world, file = paste0(file_path, file_name),row.names = FALSE)
