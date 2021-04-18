import document from "document";
import { Accelerometer } from "accelerometer";
import { Barometer } from "barometer";
import { Gyroscope } from "gyroscope";
import { OrientationSensor } from "orientation";

import * as messaging from "messaging";

const FREQUENCY_INTERVALS_IN_MS = 100;

// Initial status of the application will be paused
let PAUSED = true;

let current_label = "";

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
      if (!PAUSED && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
          timestamp: new Date().getTime(),
          accel_x: accel_data.x,
          accel_y: accel_data.y,
          accel_z: accel_data.z,
          baro_pressure: baro_data.pressure,
          gyro_x: gyro_data.x,
          gyro_y: gyro_data.y,
          gyro_z: gyro_data.z,
          orientation: orient_data.quaternion,
          label: current_label
        });
      }
    }, FREQUENCY_INTERVALS_IN_MS);
}
////////////////////
// UI interaction //
////////////////////

// Pause/Start button
const pauseStartButton = document.getElementById("pauseStartButton");

pauseStartButton.addEventListener("click", (evt) => {
  if(PAUSED) {
    pauseStartButton.text = "PAUSE";
  } else {
    pauseStartButton.text = "START";
  }
  PAUSED = !PAUSED
})

// Labels list setup

let list = document.getElementById("labelList");
let items = list.getElementsByClassName("list-item");

function uncheck_all_except_selected(index_new) {
  items.forEach((element, index) => {
    if (index === index_new) {
      current_label = element.id
      element.class += ' selected'
    } else {
      element.class = element.class.split(' ')[0]
    }
  });
}
uncheck_all_except_selected(0)


items.forEach((element, index) => {
  let touch = element.getElementById("touch");
  touch.onclick = (evt) => {
    uncheck_all_except_selected(index)
  };
});
