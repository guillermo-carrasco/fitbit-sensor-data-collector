import document from "document";
import { Accelerometer } from "accelerometer";
import { Barometer } from "barometer";
import { Gyroscope } from "gyroscope";
import { OrientationSensor } from "orientation";

import * as messaging from "messaging";

const FREQUENCY_INTERVALS_IN_MS = 100;

messaging.peerSocket.addEventListener("open", (evt) => {
  console.log('Connection opened with companion app!')
  sensorDataCollection();
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});


// Start data collection in intervals of 100 milliseconds
function sensorDataCollection() {

  // Initialise sensor data holders
  let accel_data = {x: null, y: null, z: null}
  let baro_data = {pressure: null}
  let gyro_data = {x: null, y: null, z: null}
  let orient_data = {quaternion: null}

  // Start sensors at the same sampling frequency than the interval we send messages to the companion app
  if (Accelerometer) {
    const accel = new Accelerometer({ frequency: FREQUENCY_INTERVALS_IN_MS });
    accel.addEventListener("reading", () => {
      accel_data = {
          x: accel.x ? accel.x.toFixed(3) : 0,
          y: accel.y ? accel.y.toFixed(3) : 0,
          z: accel.z ? accel.z.toFixed(3) : 0
      };
    });
    accel.start();
  }
  if (Barometer) {
      const barometer = new Barometer({ frequency: FREQUENCY_INTERVALS_IN_MS });
      barometer.addEventListener("reading", () => {
        baro_data = {
          pressure: barometer.pressure ? parseInt(barometer.pressure) : 0
        };
      });
      barometer.start();
  }
  if (Gyroscope) {
    const gyro = new Gyroscope({ frequency: FREQUENCY_INTERVALS_IN_MS });
    gyro.addEventListener("reading", () => {
      gyro_data = {
        x: gyro.x ? gyro.x.toFixed(3) : 0,
        y: gyro.y ? gyro.y.toFixed(3) : 0,
        z: gyro.z ? gyro.z.toFixed(3) : 0,
      };
      console.log(
        `ts: ${gyro.timestamp}, \
         x: ${gyro.x}, \
         y: ${gyro.y}, \
         z: ${gyro.z}`
      );
    });
    gyro.start();
  }
  if (OrientationSensor) {
    const orientation = new OrientationSensor({ frequency: FREQUENCY_INTERVALS_IN_MS });
    orientation.addEventListener("reading", () => {
      orient_data = {
        quaternion: orientation.quaternion ? orientation.quaternion.map(n => n.toFixed(3)) : null
      };
    });
    orientation.start();
  }


  // Send a new data sample to the companion app every interval. The variables are updated asyncronously
  setInterval(() => {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
          timestamp: new Date().getTime(),
          accel_x: accel_data.x,
          accel_y: accel_data.y,
          accel_z: accel_data.z,
          baro_pressure: baro_data.pressure,
          gyro_x: gyro_data.x,
          gyro_y: gyro_data.y,
          gyro_z: gyro_data.z,
          orientation: orient_data.quaternion
        });
      }
    }, FREQUENCY_INTERVALS_IN_MS);
}

// UI interaction
const pauseStartButton = document.getElementById("pauseStartButton");

pauseStartButton.addEventListener("click", (evt) => {
  console.log("CLICKED");
})