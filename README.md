# Fitbit Sensor Data Collector

Collects sensor data from a Fitbit smartwatch and stores it in your phone. App developed for Fitbit Sense. Will
work on other devices, but for example gyroscope data might not be available (as is the case for Versa devices).

## Installation

### Using CLI

Read more on how to install CLI [here](https://dev.fitbit.com/build/guides/command-line-interface/)

1. In the phone app, go to Account, select your device -> Developer Menu -> Toggle Developer Bridge
2. In the watch: Settings -> Developer Bridge -> Toggle enable

**Build the app** with `fitbit-build`

**Install the app**: Enter fitbil CLI interface with `fitbit` command, then just type `install`