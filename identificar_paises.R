library(readxl)

countries_codes <- read_excel("C:/Users/diego/OneDrive - UVa/Escritorio/Visualizacion/iso_3digit_alpha_country_codes.xlsx")
population_and_demography <- read.csv("C:/Users/diego/OneDrive - UVa/Escritorio/Visualizacion/population-and-demography.csv", sep=";")

population<-population_and_demography[order(population_and_demography$Year),1:3]
population<-population[population$Country.name %in% countries_codes$Country,]

#Hay 235 paises y 72 daños en los datos
num_paises<-235
num_annos<-72

population_year2021<-population_and_demography[which(population_and_demography$Year=="2021"), 1:3]
population_year2021<-population_year2021[population_year2021$Country.name %in% countries_codes$Country,]

countries_codes_paises<-as.data.frame(countries_codes[countries_codes$Country%in%population_year2021$Country.name,])


population<-cbind(population,rep("",dim(population)[1]),rep("",dim(population)[1]))
names(population)<-c("name","year","pop","id","continente")
for(i in 1:dim(countries_codes_paises)[1]){
  pais<-population$name[i]
  id_y_continente<-c(as.character(countries_codes_paises[countries_codes_paises$Country %in% pais,][1]),
                     as.character(countries_codes_paises[countries_codes_paises$Country %in% pais,][3]))
  for(j in 0:(num_annos-1)){
    population$id[i+(j*num_paises)]<-id_y_continente[1]
    population$continente[i+(j*num_paises)]<-id_y_continente[2]
  }
}

# Define the file name and path where you want to save the Excel file
file_path <- "C:/Users/diego/OneDrive - UVa/Escritorio/Visualizacion/"    
file_name <- "population_all_years.csv" 

write.csv(population, file = paste0(file_path, file_name),row.names = FALSE)

world_and_continents<-c("Africa (UN)", "Asia (UN)","Europe (UN)","Latin America and the Caribbean (UN)",
                        "Northern America (UN)", "Oceania (UN)","World")

pop_world<-population_and_demography[order(population_and_demography$Year),1:3]
pop_world<-pop_world_and_continents[pop_world_and_continents$Country.name %in% "World",]
names(pop_world)<-c("name","year","pop")
num_agnos<-2021-1950
num_areas<-length(1)

for(i in 0:num_agnos){
  

  if(pop_world_and_continents[j+i*num_areas,1]!= "World"){
    name<-pop_world_and_continents[j+i*num_areas,1]
    pop_world_and_continents[j+i*num_areas,1]<-substr(name, 1, nchar(name) - 5)
  }
}

pop_world_and_continents<-pop_world_and_continents[pop_world_and_continents[,1]!="Latin America and the Caribbean",]

file_name <- "pop_world_and_continents.csv" 
write.csv(pop_world_and_continents, file = paste0(file_path, file_name),row.names = FALSE)
