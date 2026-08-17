# Feature Documentation

This repository is a Microsoft MakeCode extension for the micro:bit Maqueen robot. It adds Maqueen-specific blocks and TypeScript APIs on top of the standard MakeCode micro:bit runtime.

The extension currently exposes two robot API groups:

- `maqueen`: APIs for the Maqueen v4 hardware model.
- `Maqueen_V5`: APIs for the Maqueen v5 hardware model.

## Package Scope

The package is configured by `pxt.json` as a public MakeCode package named `maqueen`. It supports the `microbit` target and depends on:

- `core`: the standard MakeCode micro:bit APIs.
- `ir`: DFRobot's external IR package dependency.

Runtime code is separated by hardware generation:

- `maqueen.ts`: shared constants and types used by both hardware generations.
- `maqueen-v4.ts`: the Maqueen v4 block/API namespace.
- `maqueen-v5.ts`: the Maqueen v5 block/API namespace.

Locale files under `_locales/` provide translated block labels and JSDoc text for MakeCode's block editor.

## Maqueen V4 Features

The `maqueen` namespace provides the v4 feature set. Its implementation lives in `maqueen-v4.ts`.

### Motor Control

`motorRun(index, direction, speed)` controls the left, right, or both motors through I2C address `0x10`.

`motorStop(motors)` stops the selected motor or both motors.

Supported motor selectors:

- `Motors.M1`: left motor.
- `Motors.M2`: right motor.
- `Motors.All`: both motors.

Supported directions:

- `Dir.CW`: forward.
- `Dir.CCW`: backward.

### Servo Control

`servoRun(index, angle)` controls servo channel `S1` or `S2` with an angle from `0` to `180`.

### Ultrasonic Distance

`Ultrasonic()` measures distance in centimeters using micro:bit pins `P1` and `P2`.

The function retries short failed reads and returns `500` when no usable echo is detected.

### Line Tracking

`readPatrol(patrol)` reads the left or right line tracking sensor:

- left sensor: `P13`.
- right sensor: `P14`.

`ltEvent(value, vi, action)` registers a callback for line sensor state changes.

### LEDs

`writeLED(led, ledswitch)` controls the left and right LEDs:

- left LED: `P8`.
- right LED: `P12`.

### Product Information

`IR_read_version()` reads product/version information from the Maqueen controller over I2C.

## Maqueen V5 Features

The `Maqueen_V5` namespace provides the v5 feature set. Its implementation lives in `maqueen-v5.ts`. V5 uses more I2C registers than v4 because more behavior is handled by the Maqueen controller board.

### Initialization

`I2CInit()` initializes the V5 controller over I2C and waits until version data is available.

### Motor Control

`motorRun(index, direction, speed)` and `motorStop(motors)` provide the same high-level motor operations as v4, using V5-specific I2C registers.

### Line Patrol

`patrolling(patrol)` enables or disables automatic line patrol mode.

`patrolSpeed(speed)` sets the line patrol speed grade.

`readPatrol(patrol)` reads the digital state of the left, middle, or right line sensor.

`readPatrolData(patrol)` reads raw ADC data for the selected line sensor.

### Servo Control

`servoRun(index, angle)` controls servo channel `S1` or `S2`.

### RGB Lights

V5 exposes richer RGB car light controls:

- `setRgblLed(type, rgb)`: set a light color.
- `setRgbBlink(type, num, grade, rgb)`: blink a light a set number of times.
- `setRgbchange(type, grade)`: enable gradual color change.
- `setRgbOff(type)`: turn RGB lights off.

### Sensors

`Ultrasonic()` reads ultrasonic distance in centimeters.

`readLightIntensity(type)` reads left or right light sensor intensity.

`getBatteryData(type)` reads battery level as a percentage for alkaline or lithium battery configuration.

### Product Information

`readVersion()` reads V5 product/version information from the controller over I2C.

## MakeCode Blocks

The `//%` metadata comments in `maqueen-v4.ts` and `maqueen-v5.ts` define how functions and enums appear in the MakeCode Blocks editor. They specify block labels, categories, weights, groups, editor controls, and numeric ranges.

For example, motor speed is exposed with a `0` to `255` range, servo angles with a `0` to `180` range, and enum parameters use grid picker controls.
