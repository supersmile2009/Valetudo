const entities = require("../../../entities");
const ValetudoSelectionPreset = require("../../../entities/core/ValetudoSelectionPreset");
const {CarpetAvoidanceModeControlCapability} = require("../../../core/capabilities");

/**
 * @extends CarpetAvoidanceModeControlCapability<import("../MockRobot")>
 */
class MockCarpetAvoidanceModeControlCapability extends CarpetAvoidanceModeControlCapability {
    /**
     * @param {object} options
     * @param {import("../MockRobot")} options.robot
     */
    constructor(options) {
        let presets = [
            new ValetudoSelectionPreset({name: entities.state.attributes.CarpetAvoidanceModeStateAttribute.MODE.AVOID, value: 0}),
            new ValetudoSelectionPreset({name: entities.state.attributes.CarpetAvoidanceModeStateAttribute.MODE.RAISE, value: 1}),
            new ValetudoSelectionPreset({name: entities.state.attributes.CarpetAvoidanceModeStateAttribute.MODE.IGNORE, value: 2}),
        ];
        super({
            robot: options.robot,
            presets: presets
        });

        this.currentPreset = presets[0];
    }

    /**
     * @param {string} preset
     * @returns {Promise<void>}
     */
    async selectPreset(preset) {
        const matchedPreset = this.presets.find(p => {
            return p.name === preset;
        });

        if (matchedPreset) {
            this.currentPreset = matchedPreset;
        } else {
            throw new Error("Invalid Preset");
        }
    }

    async getCurrentPreset() {
        return this.currentPreset.name;
    }
}

module.exports = MockCarpetAvoidanceModeControlCapability;
