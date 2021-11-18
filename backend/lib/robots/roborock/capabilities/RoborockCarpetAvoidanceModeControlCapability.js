const CarpetAvoidanceModeControlCapability = require("../../../core/capabilities/CarpetAvoidanceModeControlCapability");

/**
 * @extends CarpetAvoidanceModeControlCapability<import("../RoborockValetudoRobot")>
 */
class RoborockCarpetAvoidanceModeControlCapability extends CarpetAvoidanceModeControlCapability {
    /**
     * @param {string} preset
     * @returns {Promise<void>}
     */
    async selectPreset(preset) {
        const matchedPreset = this.presets.find(p => {
            return p.name === preset;
        });

        if (matchedPreset) {
            await this.robot.sendCommand("set_carpet_clean_mode", {carpet_clean_mode: matchedPreset.value}, {});
        } else {
            throw new Error("Invalid Preset");
        }
    }
    /**
     * Returns the current carpet avoidance mode
     */
    async getCurrentPreset() {
        const res = await this.robot.sendCommand("get_carpet_clean_mode", [], {});

        return this.findByValue(res[0].carpet_clean_mode).name;
    }
}

module.exports = RoborockCarpetAvoidanceModeControlCapability;
