const addonInfo = {
    name: "TrueFPS",  // Addon Name
    id: "trueFPS",     // Addon ID (Referenced by save data)
    version: "1.0.0",        // Version
    thumbnail: "https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/keyboardoverlay.png?raw=true",           // Thumbnail URL
    description: "Displays a more accurate FPS counter, and adds a Frames per Second graph",
    isSocial: false         // UNSUPPORTED - Maybe a future Krunker Hub addon support
};
const addonSettingsUtils = require(require('path').resolve('./') + '/resources/app.asar/app/utils/addonUtils');
const addonSetUtils = new addonSettingsUtils();

class gatoAddon {
    // Fetch Function - DO NOT REMOVE
    static getInfo(infoName) {
        return addonInfo[infoName];
    }
    // Create your inital configurations here
    static firstTimeSetup() {
        // REQUIRED
        addonSetUtils.addConfig(addonInfo["id"], "enabled", true);
        // Add your custom configuration options here

    }

    // Runs when page starts loading
    static initialize() {
        
    }

    // Runs when page fully loaded
    static domLoaded() {
        let css = `
        #truefpsDisplay{font-size:18px;vertical-align:top;color:rgba(255,255,255,.5)}
        `
        const injectSettingsCss = (css, classId = "truefps-css") => {
            let s = document.createElement("style");
            s.setAttribute("id", classId);
            s.innerHTML = css;
            document.head.appendChild(s);
        }
        injectSettingsCss(css);

        var times = [];
        var fps;
        var trueFPSDisplay = document.createElement("div");
        trueFPSDisplay.id = "truefpsDisplay";
        trueFPSDisplay.style = "display:block;";
        var fpsText = document.createElement("span");
        fpsText.id = "trueingameFPS";
        fpsText.style = "color:#9eeb56";
        let debugInfo = document.getElementsByClassName("debugInfo")[0];
        debugInfo.insertBefore(trueFPSDisplay,debugInfo.children[0]);
        trueFPSDisplay.appendChild(fpsText);
        trueFPSDisplay.innerHTML += " True FPS";
        fpsText = document.getElementById("trueingameFPS");
    
        function refreshLoop() {
            window.requestAnimationFrame(function() {
                const now = performance.now();
                while (times.length > 0 && times[0] <= now - 1000) {
                    times.shift();
                }
                times.push(now);
                fps = times.length;
                fpsText.innerHTML = fps;
                refreshLoop();
            });
        }
    
        refreshLoop();
    }

    // Runs when settings update
    static updateSettings() {

    }

    // Loads Addons Settings to Configuration Window
    static loadAddonSettings() {
        addonSetUtils.createForm(addonInfo["id"]);

        addonSetUtils.createCategory("addonSettings", "Addon Settings");
        addonSetUtils.createCheckbox(addonInfo["id"], "enabled", "Enable Addon", "Determines if the Addon loads when refreshing page", "addonSettings", false, 2);

        addonSetUtils.hookSaving(addonInfo["id"], __dirname);
    }
}
module.exports = gatoAddon
