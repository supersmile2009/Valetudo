const CapabilityRouter = require("./CapabilityRouter");
const PresetSelectionCapabilityRouter = require("./PresetSelectionCapabilityRouter");

class CarpetAvoidanceModeControlCapabilityRouter extends CapabilityRouter {

    initRoutes() {
        this.router = new PresetSelectionCapabilityRouter({capability: this.capability, validator: this.validator}).getRouter();

        this.router.get("/preset", async (req, res) => {
            res.json({
                value: await this.capability.getCurrentPreset(),
            });
        });
    }
}

module.exports = CarpetAvoidanceModeControlCapabilityRouter;
