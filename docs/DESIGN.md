# Design Documentation

This document explains where this extension sits in the MakeCode architecture and how its files work together.

## Position In MakeCode Architecture

Microsoft MakeCode, also called PXT, is organized around targets, packages, and editor metadata.

For this repository:

- The target is `microbit`.
- The package is `maqueen`.
- The runtime dependency is the MakeCode `core` package.
- Hardware behavior is exposed through TypeScript APIs and MakeCode block metadata.

At a high level:

```text
MakeCode Blocks / TypeScript editor
        |
        v
Maqueen extension package
        |
        v
maqueen.ts shared declarations
        |
        v
maqueen-v4.ts / maqueen-v5.ts APIs and block metadata
        |
        v
MakeCode micro:bit core APIs
        |
        v
micro:bit pins, I2C, timing, serial, screen
        |
        v
Maqueen robot controller and sensors
```

The extension does not define a complete MakeCode target. It is a target package that plugs into the existing micro:bit target and adds Maqueen-specific blocks.

## Package Manifest

`pxt.json` is the package boundary. It declares:

- Package name, version, description, and license.
- Dependencies required by MakeCode.
- Files that are part of the package.
- Test files used by `pxt test`.
- Supported MakeCode target metadata.

Only files listed in `pxt.json` are part of the MakeCode package. Source files that are not listed there are ordinary repository files and are not shipped or compiled by the PXT package flow.

## Runtime Source

Runtime source is split by responsibility:

- `maqueen.ts`: shared package-level declarations, including the Maqueen I2C address and shared helper types.
- `maqueen-v4.ts`: the `maqueen` namespace for v4 APIs.
- `maqueen-v5.ts`: the `Maqueen_V5` namespace for v5 APIs.

The `maqueen` and `Maqueen_V5` namespaces are the public TypeScript surface that MakeCode users call from JavaScript/TypeScript projects. The same exported functions become MakeCode Blocks when they include `//%` metadata.

Keeping v4 and v5 in separate files makes hardware-specific behavior easier to review without changing the public namespace names that existing MakeCode projects depend on.

## Block Metadata

MakeCode uses special `//%` comments to generate the block editor experience.

Common metadata in this extension includes:

- `block`: user-visible block text.
- `blockId`: stable identifier for a block.
- `weight`: ordering within the toolbox.
- `group`: grouping inside a toolbox category.
- `fieldEditor` and `fieldOptions`: UI hints for enum inputs.
- `min` and `max`: numeric input constraints.

Because block IDs can be used by saved MakeCode projects, changing them is a compatibility risk. New behavior should prefer adding new blocks or preserving existing IDs unless there is a deliberate migration plan.

## Hardware Access Model

The extension talks to Maqueen hardware through standard MakeCode micro:bit APIs:

- `pins.i2cWriteBuffer`, `pins.i2cWriteNumber`, `pins.i2cReadBuffer`, and `pins.i2cReadNumber` for Maqueen controller registers.
- `pins.digitalReadPin` and `pins.digitalWritePin` for direct line sensor and LED access on v4.
- `pins.pulseIn` for ultrasonic echo measurement.
- `basic.pause`, `basic.forever`, and `control` runtime services for timing and events.

The Maqueen controller is addressed at I2C address `0x10`. V4 and V5 use different register layouts, so the code keeps separate namespaces rather than hiding both models behind one API.

## Version Split

The v4 API in `maqueen-v4.ts` accesses several features directly through micro:bit pins:

- Line sensors use `P13` and `P14`.
- LEDs use `P8` and `P12`.
- Ultrasonic measurement uses `P1` and `P2`.

The v5 API in `maqueen-v5.ts` delegates more behavior to the Maqueen controller over I2C:

- Motor control.
- RGB light modes.
- Line sensor state and ADC data.
- Battery and light sensor data.
- Built-in line patrol behavior.

This split keeps the public blocks close to the hardware model that students and teachers see.

## Localization

Locale files in `_locales/` provide translated block strings and JSDoc strings. MakeCode uses these files to display localized toolbox labels and help text.

When adding or renaming a block:

- Update the English block metadata in `maqueen-v4.ts` or `maqueen-v5.ts`.
- Add or update matching keys in locale JSON files.
- Keep old block IDs when compatibility matters.

## Testing Model

`test.ts` is a compile-time smoke test for the v4 APIs. In a MakeCode development environment, `pxt test` should compile the package and catch missing symbols, invalid metadata, or type errors.

Hardware behavior still requires manual testing on a micro:bit and Maqueen robot because many APIs depend on physical sensors, I2C responses, and motor hardware.

## Extension Boundaries

This package should stay focused on Maqueen robot capabilities. It should not duplicate MakeCode core APIs or become a general micro:bit helper package.

Good additions are:

- New Maqueen hardware features.
- Safer wrappers around Maqueen controller registers.
- Documentation and examples for Maqueen-specific workflows.
- Compatibility-preserving block improvements.

Risky additions are:

- Changing existing block IDs.
- Reusing v4 names for behavior that only works on v5.
- Adding long blocking loops without timeout behavior.
- Adding files to the repository without also deciding whether they belong in `pxt.json`.
