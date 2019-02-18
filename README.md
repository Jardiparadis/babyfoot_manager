# BabyFoot Manager
## Presentation
BabyFoot Manager is a web application for creating and managing babyfoot games.

## Database model
The database used is a Postgresql database.  
![Database schema](doc/resources/babyfoot_database.png)

## Eslint
The code was written with the ESLint linter, in its standard configuration, as it's considered as a generic and basic norm, used by lots of developers.

## Docker
The entire application, as well as the database run in docker containers.
This choice was made to facilitate the installation of the database, and to ensure that the application behavior will not depends of your operating system.   
Docker-compose is also used, to ease the application deployment.  
To install Docker, go on https://docs.docker.com/install/. 

## Running the application
To run the application, first, you have to install dependencies with the following command:
```sh
npm install
```
Then, to launch the database and the application, just type this command:
```sh
docker-compose up
```
While the application is running, you can start using the babyfoot manager by browsing to
`http://localhost:8089`

## Testing
First, you have to install dependencies with the following command:
```sh
npm install
```
In order to run the tests, use the following command to launch the application in development mode:
```sh
docker-compose -f dev.docker-compose.yml up -d --build
``` 
Then, you have to execute a bash in the server's container with the command:
```sh
docker exec -it <CONTAINER ID> bash
```
The \<CONTAINER ID\> has to by replaced be the id of the docker container named **babyfoot_manager_server_1**.
It can be obtained with the command:
```sh
docker ps
```   
Finally, all you have to do is typing this command:
```sh
npm test
``` 
