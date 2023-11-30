country_codes <- read.csv("C:/Users/diego/OneDrive - UVa/Escritorio/Cuarto/PrimerCuatri/DESI/Trabajo/Visualizacion/country_codes.csv")
population_and_demography <- read.csv("C:/Users/diego/OneDrive - UVa/Escritorio/Cuarto/PrimerCuatri/DESI/Trabajo/Visualizacion/population-and-demography.csv", sep=";")

no_paises<-c("Africa (UN)","Asia (UN)","Europe (UN)","High-income countries", "Land-locked developing countries (LLDC)", "Latin America and the Caribbean (UN)",
             "Least developed countries","Less developed regions", "excluding China","Less developed regions", "excluding least developed countries","Low-income countries",
              "Lower-middle-income countries", "More developed regions","Northern America (UN)", "Oceania (UN)","Small island developing states (SIDS)","Upper-middle-income countries",
             "World")

population_year2021<-population_and_demography[which(population_and_demography$Year=="2021"), 1:3]
population_year2021<-population_year2021[population_year2021$Country.name %in% country_codes$name,]
country_codes_paises<-country_codes[country_codes$name%in%population_year2021$Country.name,]

population_year2021<-cbind(population_year2021,country_codes_paises$country.code)

population_year2021<-population_year2021[!population_year2021$Country.name %in%no_paises,]


# Codigo para crear el excel
library(openxlsx)
# Define the file name and path where you want to save the Excel file
file_name <- "population_year2021.csv"  # Change this to your desired file name
file_path <- "C:/Users/diego/OneDrive - UVa/Escritorio/Cuarto/PrimerCuatri/DESI/Trabajo/Visualizacion/"    # Change this to your desired file path

# Create the Excel file
write.xlsx(population_year2021, file = paste0(file_path, file_name))