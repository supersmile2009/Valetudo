const StateAttribute = require("./StateAttribute");

class CarpetAvoidanceModeStateAttribute extends StateAttribute {
    /**
     * @param {object} options
     * @param {CarpetAvoidanceModeAttributeValue} options.value
     * @param {object} [options.metaData]
     */
    constructor(options) {
        super(options);

        this.value = options.value;
    }

    /**
     *
     * @param {CarpetAvoidanceModeStateAttribute} otherAttribute
     * @return {boolean}
     */
    equals(otherAttribute) {
        return this.__class === otherAttribute.__class &&
            this.type === otherAttribute.type &&
            this.subType === otherAttribute.subType &&
            this.value === otherAttribute.value;
    }
}

/**
 *  @typedef {string} CarpetAvoidanceModeAttributeValue
 *  @enum {string}
 *
 */
CarpetAvoidanceModeStateAttribute.MODE = Object.freeze({
    AVOID: "avoid",
    RAISE: "raise",
    IGNORE: "ignore",
});


module.exports = CarpetAvoidanceModeStateAttribute;
