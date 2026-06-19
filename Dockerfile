# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["CareerHub/CareerHub.Api.csproj", "CareerHub/"]
RUN dotnet restore "CareerHub/CareerHub.Api.csproj"

# Copy the rest of the source code
COPY . .

# Build and Publish
WORKDIR "/src/CareerHub"
RUN dotnet publish "CareerHub.Api.csproj" \
    --configuration Release \
    --no-restore \
    --output /app/publish

# Stage 2: Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port and define the entry point
EXPOSE 8080
ENTRYPOINT ["dotnet", "CareerHub.Api.dll"]