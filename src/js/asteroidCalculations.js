export function getNasaAPI(temp, latitude, longitude){
const proxyServerUrl = 'http://localhost:3000/proxy?url='; // Replace with your proxy server URL
  
  // Make the API request using fetch with the CORS proxy
  try {
    return fetch(proxyServerUrl+ temp, {
      'Origin': 'http://localhost:1234/', // Replace with the actual origin of your web page
     
      'X-Requested-With': 'XMLHttpRequest',
    })
      .then(response => response.json())
      .then(data => {
  
        
  
        const asteroidCoordinates = heliocentricAsteroidCalculations(data.orbit.elements[1].value,data.orbit.elements[0].value,data.orbit.elements[3].value,data.orbit.elements[4].value,data.orbit.elements[5].value,data.orbit.elements[6].value, latitude, longitude)
        const equitorialCoordinates = horizontalToEquatorial(asteroidCoordinates.azimuth, asteroidCoordinates.altitude, latitude, longitude)
        return ([equitorialCoordinates.declination, equitorialCoordinates.rightAscension])
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  } catch (err){
    console.error('data unavalible');
  }
}


// Convert degrees to radians
function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}


const currentDate = new Date(); // Use any specific date and time for calculations

// Convert degrees to radians
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180/Math.PI

// Improved Kepler's equation solver
function solveKeplersEquation(M_rad, e) {
  const maxIter = 100;
  const tol = 1e-12;

  let E = M_rad;
  for (let i = 0; i < maxIter; i++) {
    const dM = E - e * Math.sin(E) - M_rad;
    const dE = dM / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < tol) break;
  }

  return E;
}

function heliocentricAsteroidCalculations(a, e, i, omega, w, M, observerLatitude, observerLongitude) {
  const msSinceJ2000 = currentDate.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0, 0);
  const T = msSinceJ2000 / (1000 * 60 * 60 * 24 * 36525); // Julian centuries since J2000.0

  // Calculate the mean anomaly
  const M_rad = (parseFloat(M) + 360 * T) * DEG2RAD;

  // Iteratively solve Kepler's equation to find the eccentric anomaly (E)
  let E = solveKeplersEquation(M_rad, e);

  // Calculate the distance from the asteroid to the Sun (r) in AU
  const r = a * (1 - e * Math.cos(E));

  // Calculate the heliocentric coordinates (x, y, z) in the orbital plane
  const x = r * (Math.cos(E) - e);
  const y = r * Math.sqrt(1 - e ** 2) * Math.sin(E);

  // Convert the heliocentric coordinates to the equatorial coordinate system (right ascension and declination)
  const cosOmega = Math.cos(deg2rad(omega));
  const sinOmega = Math.sin(deg2rad(omega));
  const cosW = Math.cos(deg2rad(w));
  const sinW = Math.sin(deg2rad(w));
  const cosI = Math.cos(deg2rad(i));
  const sinI = Math.sin(deg2rad(i));

  const xEquatorial = x * (cosOmega * cosW - sinOmega * sinW * cosI) - y * (cosOmega * sinW + sinOmega * cosW * cosI);
  const yEquatorial = x * (sinOmega * cosW + cosOmega * sinW * cosI) + y * (sinOmega * sinW - cosOmega * cosW * cosI);
  const zEquatorial = x * sinW * sinI + y * cosW * sinI;

  // Convert equatorial coordinates to horizontal coordinates (azimuth and altitude) for the observer's location
  const GMST = 280.46061837 + 360.98564736629 * T; // Greenwich Mean Sidereal Time in degrees
  const LST = GMST + observerLongitude; // Local Sidereal Time in degrees
  const LST_rad = LST * DEG2RAD;
  const observerLatitude_rad = observerLatitude * DEG2RAD;

  const xHorizontal = xEquatorial * Math.cos(observerLatitude_rad) * Math.cos(LST_rad) - yEquatorial * Math.sin(LST_rad);
  const yHorizontal = xEquatorial * Math.cos(observerLatitude_rad) * Math.sin(LST_rad) + yEquatorial * Math.cos(LST_rad);
  const zHorizontal = xEquatorial * Math.sin(observerLatitude_rad) + zEquatorial * Math.cos(observerLatitude_rad) * Math.sin(LST_rad);

  // Convert horizontal coordinates to azimuth and altitude
  const azimuth = Math.atan2(yHorizontal, xHorizontal);
  const altitude = Math.atan2(zHorizontal, Math.sqrt(xHorizontal ** 2 + yHorizontal ** 2));

  // Return azimuth and altitude in radians
  return {
    azimuth: azimuth* RAD2DEG,
    altitude: altitude* RAD2DEG,
  };
}


function horizontalToEquatorial(azimuth, altitude, observerLatitude, observerLongitude) {
  const azimuth_rad = azimuth * DEG2RAD;
  const altitude_rad = altitude * DEG2RAD;
  const observerLatitude_rad = observerLatitude * DEG2RAD;
  const observerLongitude_rad = observerLongitude * DEG2RAD;

  // Convert horizontal coordinates to equatorial coordinates
  const xHorizontal = Math.cos(altitude_rad) * Math.cos(azimuth_rad);
  const yHorizontal = Math.cos(altitude_rad) * Math.sin(azimuth_rad);
  const zHorizontal = Math.sin(altitude_rad);

  // Convert equatorial coordinates to observer's local horizontal coordinates
  const xEquatorial = xHorizontal * Math.cos(observerLatitude_rad) * Math.cos(observerLongitude_rad) - yHorizontal * Math.sin(observerLongitude_rad);
  const yEquatorial = xHorizontal * Math.cos(observerLatitude_rad) * Math.sin(observerLongitude_rad) + yHorizontal * Math.cos(observerLongitude_rad);
  const zEquatorial = xHorizontal * Math.sin(observerLatitude_rad) + zHorizontal * Math.cos(observerLatitude_rad);

  // Convert equatorial coordinates to right ascension and declination
  const rightAscension = Math.atan2(yEquatorial, xEquatorial);
  const declination = Math.asin(zEquatorial);

  // Convert right ascension and declination to degrees
  const rightAscension_deg = rightAscension * RAD2DEG;
  const declination_deg = declination * RAD2DEG;

  return {
    declination: declination_deg,
    rightAscension: rightAscension_deg,
  };
}






  
