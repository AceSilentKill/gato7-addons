const addonInfo = {
    name: "Optic Zoom",  // Addon Name
    id: "opticZoom",     // Addon ID (Referenced by save data)
    version: "1.0.2",        // Version
    thumbnail: "https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/opticzoom.png?raw=true",           // Thumbnail URL
    description: "Similar to Minecraft Optifine's zoom key, press a key to zoom in",
    isSocial: false         // UNSUPPORTED - Maybe a future Krunker Hub addon support
};
var addonSetUtils;
var notificationUtils;

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
        // Add your custom configuration options here
        addonSetUtils.addConfig(addonInfo["id"], "zoomkey", "87");

        addonSetUtils.addConfig(addonInfo["id"], "zoomamt", 2.5);
    }

    // Runs when page starts loading
    static initialize(dependencies) {
        addonSetUtils = new dependencies[0]();
        notificationUtils = dependencies[2];
        console.log("opticZoom Running");
    }

    // Runs when page fully loaded
    static domLoaded() {

    }

    // Runs when Game fully loaded
    static gameLoaded() {
        var canvases = [];

        const zoomMult = addonSetUtils.getConfig(addonInfo["id"], "zoomamt")
        const zoomKey = addonSetUtils.getConfig(addonInfo["id"], "zoomkey")

        let css = `
        .gatoZoom{width:calc(100% * ${zoomMult})!important;height:calc(100% * ${zoomMult})!important;}
        .zoomTrans{
            image-rendering: -moz-crisp-edges!important;
            image-rendering: -webkit-crisp-edges!important;
            image-rendering: pixelated!important;
            transition:all 0.25s ease-in-out!important;
            position:absolute;
            top:calc(50%)!important;
            left:calc(50%)!important;
            transform: translate(-50%, -50%);
        }
        `

        const injectSettingsCss = (css, classId = "opticzoom-css") => {
            let s = document.createElement("style");
            s.setAttribute("id", classId);
            s.innerHTML = css;
            document.head.appendChild(s);
        }

        injectSettingsCss(css)

        const keys = [
            { keyCode: zoomKey }
        ]

        const uiBase = document.getElementById("uiBase");
        const notifCheck = document.getElementById("gatoNotifBox");

        function handleKeyDown(event) {
            switch (event.target.tagName.toLowerCase()) {
                case "input":
                case "textarea":
                case "select":
                case "button":
                    break;
                default:
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "zoomkey")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) != "M" && String(event.keyCode) === String(kC)) {
                            //canvases.forEach(element => element.classList.add("gatoZoom"));
                            if(uiBase.classList.contains("onCompMenu")){
                                if(notifCheck.children.length < 1){
                                    notificationUtils.createNotif("search", "OpticZoom is Disabled", "You cannot use OpticZoom in competitive environments", "#eb4034", 3000);
                                }
                            } else {
                                canvases[4].classList.add("gatoZoom")
                                canvases[0].classList.add("gatoZoom")
                            }
                        }
                    }
            }
        }
        function handleKeyUp(event) {
            switch (event.target.tagName.toLowerCase()) {
                case "input":
                case "textarea":
                case "select":
                case "button":
                    break;
                default:
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "zoomkey")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) != "M" && String(event.keyCode) === String(kC)) {
                            //canvases.forEach(element => element.classList.remove("gatoZoom"));
                            canvases[4].classList.remove("gatoZoom")
                            canvases[0].classList.remove("gatoZoom")
                        }
                    }
            }
        }
        function handleMouseDown(event) {
            switch (event.target.tagName.toLowerCase()) {
                case "input":
                case "textarea":
                case "select":
                case "button":
                    break;
                default:
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "zoomkey")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) == "M" && "M" + event.button === String(kC)) {
                            //canvases.forEach(element => element.classList.add("gatoZoom"));
                            if(uiBase.classList.contains("onCompMenu")){
                                if(notifCheck.children.length < 1){
                                    notificationUtils.createNotif("search", "OpticZoom is Disabled", "You cannot use OpticZoom in competitive environments", "#eb4034", 3000);
                                }
                            } else {
                                canvases[4].classList.add("gatoZoom")
                                canvases[0].classList.add("gatoZoom")
                            }
                        }
                    }
            }
        }
        function handleMouseUp(event) {
            switch (event.target.tagName.toLowerCase()) {
                case "input":
                case "textarea":
                case "select":
                case "button":
                    break;
                default:
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "zoomkey")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) == "M" && "M" + event.button === String(kC)) {
                            //canvases.forEach(element => element.classList.remove("gatoZoom"));
                            canvases[4].classList.remove("gatoZoom")
                            canvases[0].classList.remove("gatoZoom")
                        }
                    }
            }
        }
        
        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        canvases = Array.from(document.getElementsByTagName('canvas'));
        canvases.forEach(element => element.addEventListener("mousedown", handleMouseDown));
        document.addEventListener("mouseup", handleMouseUp);

        canvases[4].classList.add("zoomTrans")
        canvases[0].classList.add("zoomTrans")
    }

    // Runs when settings update
    static updateSettings() {
        const zoomMult = addonSetUtils.getConfig(addonInfo["id"], "zoomamt")
        let css = `
        .gatoZoom{transform:scale(${zoomMult})}
        .zoomTrans{transition:transform 0.25s ease-in-out}
        `

        const injectSettingsCss = (css, classId = "opticzoom-css") => {
            let s = document.createElement("style");
            s.setAttribute("id", classId);
            s.innerHTML = css;
            document.head.appendChild(s);
        }

        document.getElementById("opticzoom-css").remove();
        injectSettingsCss(css)
    }

    // Loads Addons Settings to Configuration Window
    static loadAddonSettings(dependencies) {
        addonSetUtils = new dependencies[0]();
        addonSetUtils.createForm(addonInfo["id"]);

        addonSetUtils.createCategory("addonSettings", "Addon Settings");
        addonSetUtils.createCheckbox(addonInfo["id"], "enabled", "Enable Addon", "Determines if the Addon loads when refreshing page", "addonSettings", false, 2);
        addonSetUtils.createSlider(addonInfo["id"], "zoomamt", "Zoom Amount", "Changes the zoom amount", 1.1, 5.0, 2.5, 0.1, "addonSettings", false);
        addonSetUtils.createKeybindInput(addonInfo["id"], "zoomkey", "Zoom Keybind", "The key that will trigger zoom", "addonSettings", false);
        addonSetUtils.hookSaving(addonInfo["id"], __dirname);
    }
}
module.exports = gatoAddon
