# Navigate-the-Stars

## Description 

This is a program that aims to provide accurate and real-time estimations about the location of a shooting star/asteroid based on the user's current location and a selected date range the user has selected. This is done through using the NASA Api to find many of the different asteroids and using Astrophysics calculations to find the location based on specific attributes about the celestial object.


## Instalation

To use this application, follow the steps provided: 

1. Clone this repository to your local machine:
```bash
git clone [https://github.com/SharvinSoosaipillai/Navigate-the-Stars.git]
```

2. Change to the project directory:
```bash
cd navigate-the-stars
```

3. Install all of the required dependencies
```bash
npm install
```

4. Obtain a [Nasa API Key](https://api.nasa.gov/) and replace it in the .env folder

5. Obtain a [Open Cage](https://opencagedata.com/) and replace it in the .env folder 

6. Navigate to the js files by running
```bash
cd src
```
then 
```bash
cd js
```
and run the server file by running 
```bash
node server.mjs
```
7. Finally, in a seperate terminal, in the main directory, run the following comman
```bash
parcel ./src/index.html
```
