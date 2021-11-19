const NotImplementedError = require("../NotImplementedError");
const PresetSelectionCapability = require("./PresetSelectionCapability");

/**
 * @template {import("../ValetudoRobot")} T
 * @extends PresetSelectionCapability<T>
 */
class CarpetAvoidanceModeControlCapability extends PresetSelectionCapability {
    /**
     * @abstract
     * @param {string} preset
     * @returns {Promise<void>}
     */
    async selectPreset(preset) {
        throw new NotImplementedError();
    }

    /**
     * @abstract
     * @returns {Promise<string>}
     */
    async getCurrentPreset() {
        throw new NotImplementedError();
    }

    /**
     * @returns {string}
     */
    getType() {
        return CarpetAvoidanceModeControlCapability.TYPE;
    }
}

CarpetAvoidanceModeControlCapability.TYPE = "CarpetAvoidanceModeControlCapability";

module.exports = CarpetAvoidanceModeControlCapability;
