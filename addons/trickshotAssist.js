const addonInfo = {
    name: "Trickshot Assist", // Addon Name
    id: "trickshotAssist", // Addon ID (Referenced by save data)
    version: "1.0.0", // Version
    thumbnail: "https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/trickshotAssist.png?raw=true", // Thumbnail URL
    description: "Use buttons to turn left/right. Original by Ectryliz. NOT AIMBOT",
    isSocial: false // UNSUPPORTED - Maybe a future Krunker Hub addon support
};
var addonSetUtils;

class gatoAddon {
    // Fetch Function - DO NOT REMOVE
    static getInfo(infoName) {
        return addonInfo[infoName];
    }
    // Create your inital configurations here
    static firstTimeSetup(dependencies) {
        addonSetUtils = new dependencies[0]();
        // REQUIRED
        addonSetUtils.addConfig(addonInfo["id"], "enabled", true);

        addonSetUtils.addConfig(addonInfo["id"], "turnAmount", "60");
        addonSetUtils.addConfig(addonInfo["id"], "turnTime", "5");
    }

    // Runs when page starts loading
    static initialize(dependencies) {
        addonSetUtils = new dependencies[0]();
    }

    // Runs when page fully loaded
    static domLoaded() {
        // Turn amount in pixels
        const turnAmount = 60;
        // Turn time in ms
        const turnTime = 5;

        let spinLeft = false;
        let spinRight = false;

        let interval = null;
        let gameCanvas = null;

        canvasWaiter();
        function canvasWaiter() {
            if (gameCanvas) {
                [...document.querySelectorAll('canvas')].forEach((canva) => {
                    canva.addEventListener('mousedown', (event) => {
                        if (event.button == 4) {
                            startSpin();
                            return (spinLeft = true);
                        }
                        if (event.button == 3) {
                            startSpin();
                            return (spinRight = true);
                        }
                    });

                    canva.addEventListener('mouseup', (event) => {
                        if (event.button == 4) {
                            endSpin();
                            return (spinLeft = false);
                        }
                        if (event.button == 3) {
                            endSpin();
                            return (spinRight = false);
                        }
                    });
                });
            } else {
                setTimeout(() => {
                    gameCanvas = document.querySelector(
                        'body > canvas:not(#game-overlay)'
                    );
                    canvasWaiter();
                }, 100);
            }
        }

        function startSpin() {
            if (interval) return;
            interval = setInterval(() => {
                if (gameCanvas) {
                    gameCanvas.dispatchEvent(
                        new MouseEvent('mousemove', {
                            movementX: spinLeft ? -Number(addonSetUtils.getConfig(addonInfo["id"], "turnAmount")) : spinRight ? Number(addonSetUtils.getConfig(addonInfo["id"], "turnAmount")) : 0
                        })
                    );
                }
            }, Number(addonSetUtils.getConfig(addonInfo["id"], "turnTime")));
        }

        function endSpin() {
            clearInterval(interval);
            interval = null;
        }

        console.log("trickshotAssist Running");
    }

    // Runs when Game fully loaded
    static gameLoaded() {

    }

    // Runs when settings update
    static updateSettings() {

    }

    // Loads Addons Settings to Configuration Window
    static loadAddonSettings(dependencies) {
        var dropdownOptions
        addonSetUtils = new dependencies[0]();
        addonSetUtils.createForm(addonInfo["id"]);

        addonSetUtils.createCategory("addonSettings", "Addon Settings");
        addonSetUtils.createCheckbox(addonInfo["id"], "enabled", "Enable Addon", "Determines if the Addon loads when refreshing page", "addonSettings", false, 2);

        function openOriginal() {
            window.open("https://pastebin.com/HfUw6RJe");
        }
        addonSetUtils.createButton(addonInfo["id"], "openOriginal", "Original Script", "This script was made by Ectryliz", "Open in Browser", openOriginal, "addonSettings", false);

        addonSetUtils.createSlider(addonInfo["id"], "turnAmount", "Turn Amount", "How much you will turn", 0, 360, 60, 5, "addonSettings", false);
        addonSetUtils.createSlider(addonInfo["id"], "turnTime", "Turn Time ms", "Changes the font size of the Billboard", 5, 1000, 5, 5, "addonSettings", false);

        addonSetUtils.hookSaving(addonInfo["id"], __dirname);
    }
}
module.exports = gatoAddon
