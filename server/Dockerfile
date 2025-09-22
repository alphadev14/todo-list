# Stage 1: build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution và csproj
COPY todo-list.sln ./
COPY server/*.csproj server/

# Restore dependencies (force restore trong Linux)
RUN dotnet restore todo-list.sln --disable-parallel --force

# Copy toàn bộ source code
COPY . .

# Publish project
WORKDIR /src/server
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "server.dll"]
