import { Accelerometer } from "accelerometer";
import { Barometer } from "barometer";

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

  let accel_data = {x: 0, y:0, z:0}

  // Collects accelerometer data
  if (Accelerometer) {
    const accel = new Accelerometer({ frequency: FREQUENCY_INTERVALS_IN_MS });
    accel.addEventListener("reading", () => {
      accel_data = {
        x: accel.x,
        y: accel.y,
        z: accel.z
      };
    });
    accel.start();
  }

  setInterval(() => {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        // Send the data to peer as a message
      messaging.peerSocket.send(
        {
          timestamp: new Date().getTime(),
          accel_x: accel_data.x,
          accel_y: accel_data.y,
          accel_z: accel_data.z,
        });
      }
    }, FREQUENCY_INTERVALS_IN_MS);
}
