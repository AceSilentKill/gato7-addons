const addonInfo = {
    name: "Keystrokes Overlay",  // Addon Name
    id: "keystrokeOverlay",     // Addon ID (Referenced by save data)
    version: "1.0.5",        // Version
    thumbnail: "https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/keyboardoverlay.png?raw=true",           // Thumbnail URL
    description: "Keyboard Overlay based off of the Crankshaft Keystrokes by KraXen72",
    isSocial: false         // UNSUPPORTED - Maybe a future Krunker Hub addon support
};
var gatoclientUtils;
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
        // Add your custom configuration options here
        addonSetUtils.addConfig(addonInfo["id"], "forward", "87");
        addonSetUtils.addConfig(addonInfo["id"], "backward", "83");
        addonSetUtils.addConfig(addonInfo["id"], "left", "65");
        addonSetUtils.addConfig(addonInfo["id"], "right", "68");
        addonSetUtils.addConfig(addonInfo["id"], "auxKey1", "82");
        addonSetUtils.addConfig(addonInfo["id"], "auxKey2", "71");

        addonSetUtils.addConfig(addonInfo["id"], "leftPercent", 50);
        addonSetUtils.addConfig(addonInfo["id"], "topPercent", 90);
        addonSetUtils.addConfig(addonInfo["id"], "scale", 0.5);
    }

    // Runs when page starts loading
    static initialize(dependencies) {
        addonSetUtils = new dependencies[0]();
        gatoclientUtils = dependencies[1];

        console.log("Keybinds Running");
    }

    // Runs when page fully loaded
    static domLoaded() {

    }

    // Runs when Game fully loaded
    static gameLoaded() {
        const { keyFromCode } = gatoclientUtils;
                // here you can mess with the values
                const size = 2.5 //how many rem will one of the keys be in height
                const forward = addonSetUtils.getConfig(addonInfo["id"], "forward")
                const backward = addonSetUtils.getConfig(addonInfo["id"], "backward")
                const left = addonSetUtils.getConfig(addonInfo["id"], "left")
                const right = addonSetUtils.getConfig(addonInfo["id"], "right")
                const auxKey1 = addonSetUtils.getConfig(addonInfo["id"], "auxKey1")
                const auxKey2 = addonSetUtils.getConfig(addonInfo["id"], "auxKey2")
        
                //ok don't touch it past this point unless you know what you're doing
                const keysHTML = `
            <span class="key key-w">${keyFromCode(forward)}</span>
            <span class="key key-a">${keyFromCode(left)}</span>
            <span class="key key-s">${keyFromCode(backward)}</span>
            <span class="key key-d">${keyFromCode(right)}</span>
            <span class="key key-sft">sft</span>
            <span class="key key-space">__</span>
            <span class="key key-aux1">${keyFromCode(auxKey1)}</span>
            <span class="key key-aux2">${keyFromCode(auxKey2)}</span>
        `
                function precisionRound(number, precision = 2) {
                    let factor = Math.pow(10, precision);
                    return Math.round(number * factor) / factor;
                }
                let css = `
            .keystrokes-hold {
                display: grid;
                grid-template: repeat(3, ${size}rem) / repeat(8, ${precisionRound(size / 2)}rem);
                grid-template-areas: 
                "empty1 empty2 keyw keyw empty3 empty4 empty5 empty6" 
                "keya keya keys keys keyd keyd aux1 aux1"
                "shift shift shift space space space aux2 aux2";
                position: absolute;
                column-gap: ${precisionRound(size / 10)}rem;
                row-gap: ${precisionRound(size / 5)}rem;
            }
            .key {
                background: #262626;
                color: white;
                font-size: ${precisionRound((size / 2) * 0.66)}rem;
                font-weight: bold;
                border: 2px solid black;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: ${size}rem;
                min-height: ${size}rem;
            }
            .key-sft, .key-space {
                font-size: ${precisionRound((size / 2) * 0.66)}rem;
            }
            .key-w { grid-area: keyw; }
            .key-a { grid-area: keya; }
            .key-s { grid-area: keys; }
            .key-d { grid-area: keyd; }
            .key-sft { grid-area: shift; }
            .key-space { grid-area: space; }
            .key-aux1 { grid-area: aux1; }
            .key-aux2 { grid-area: aux2; }
            .active {
                background: #868686;
                color: #232323;
            }
        `
        
                const injectSettingsCss = (css, classId = "keystrokes-css") => {
                    let s = document.createElement("style");
                    s.setAttribute("id", classId);
                    s.innerHTML = css;
                    document.head.appendChild(s);
                }
        
                injectSettingsCss(css)
                const hold = document.createElement("div")
                hold.classList.add("keystrokes-hold")
                var scale = Number(addonSetUtils.getConfig(addonInfo["id"], "scale")) + 0.5;
                var leftPos = addonSetUtils.getConfig(addonInfo["id"], "leftPercent")
                var topPos = addonSetUtils.getConfig(addonInfo["id"], "topPercent")
                hold.style = `top:${topPos}%;left:${leftPos}%; transform: translate(-50%,-50%) scale(${scale});`;
                hold.innerHTML = keysHTML
                document.getElementById("inGameUI").appendChild(hold)
        
                const keys = [
                    { keyCode: forward, elem: document.querySelector(".keystrokes-hold .key.key-w") },
                    { keyCode: left, elem: document.querySelector(".keystrokes-hold .key.key-a") },
                    { keyCode: backward, elem: document.querySelector(".keystrokes-hold .key.key-s") },
                    { keyCode: right, elem: document.querySelector(".keystrokes-hold .key.key-d") },
                    { keyCode: 16, elem: document.querySelector(".keystrokes-hold .key.key-sft") },
                    { keyCode: 32, elem: document.querySelector(".keystrokes-hold .key.key-space") },
                    { keyCode: auxKey1, elem: document.querySelector(".keystrokes-hold .key.key-aux1") },
                    { keyCode: auxKey2, elem: document.querySelector(".keystrokes-hold .key.key-aux2") }
                ]
        
                function handleKeyDown(event) {
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "forward")
                    keys[1]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "left")
                    keys[2]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "backward")
                    keys[3]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "right")
                    keys[6]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey1")
                    keys[7]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey2")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) != "M" && String(event.keyCode) === String(kC)) {
                            key.elem.classList.add("active")
                        }
                    }
                }
                function handleKeyUp(event) {
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "forward")
                    keys[1]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "left")
                    keys[2]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "backward")
                    keys[3]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "right")
                    keys[6]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey1")
                    keys[7]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey2")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) != "M" && String(event.keyCode) === String(kC)) {
                            key.elem.classList.remove("active")
                        }
                    }
                }
                function handleMouseDown(event) {
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "forward")
                    keys[1]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "left")
                    keys[2]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "backward")
                    keys[3]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "right")
                    keys[6]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey1")
                    keys[7]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey2")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) == "M" && "M" + event.button === String(kC)) {
                            window.log("Mouse Down " + kC);
                            key.elem.classList.add("active")
                        }
                    }
                }
                function handleMouseUp(event) {
                    keys[0]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "forward")
                    keys[1]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "left")
                    keys[2]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "backward")
                    keys[3]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "right")
                    keys[6]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey1")
                    keys[7]["keyCode"] = addonSetUtils.getConfig(addonInfo["id"], "auxKey2")
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        var kC = key.keyCode;
                        if (typeof kC === "number") {
                            kC = parseInt(kC);
                        }
                        if (String(kC).substring(0, 1) == "M" && "M" + event.button === String(kC)) {
                            window.log("Mouse Up " + kC);
                            key.elem.classList.remove("active")
                        }
                    }
                }
        
                document.addEventListener("keydown", handleKeyDown)
                document.addEventListener("keyup", handleKeyUp)
        
                var canvases = Array.from(document.getElementsByTagName('canvas'));
                canvases.forEach(element => element.addEventListener("mousedown", handleMouseDown)); // This is a workaround since you can't use document mousedown when canvas-locked
        
                document.addEventListener("mouseup", handleMouseUp);
    }

    // Runs when settings update
    static updateSettings() {
        const { keyFromCode } = gatoclientUtils;
        const forward = addonSetUtils.getConfig(addonInfo["id"], "forward");
        const backward = addonSetUtils.getConfig(addonInfo["id"], "backward");
        const left = addonSetUtils.getConfig(addonInfo["id"], "left");
        const right = addonSetUtils.getConfig(addonInfo["id"], "right");
        const auxKey1 = addonSetUtils.getConfig(addonInfo["id"], "auxKey1");
        const auxKey2 = addonSetUtils.getConfig(addonInfo["id"], "auxKey2");
        const keys = [
            { keyCode: forward, elem: document.querySelector(".keystrokes-hold .key.key-w") },
            { keyCode: left, elem: document.querySelector(".keystrokes-hold .key.key-a") },
            { keyCode: backward, elem: document.querySelector(".keystrokes-hold .key.key-s") },
            { keyCode: right, elem: document.querySelector(".keystrokes-hold .key.key-d") },
            { keyCode: 16, elem: document.querySelector(".keystrokes-hold .key.key-sft") },
            { keyCode: 32, elem: document.querySelector(".keystrokes-hold .key.key-space") },
            { keyCode: auxKey1, elem: document.querySelector(".keystrokes-hold .key.key-aux1") },
            { keyCode: auxKey2, elem: document.querySelector(".keystrokes-hold .key.key-aux2") }
        ]
        document.querySelector(".keystrokes-hold .key.key-w").textContent = keyFromCode(forward);
        document.querySelector(".keystrokes-hold .key.key-a").textContent = keyFromCode(left);
        document.querySelector(".keystrokes-hold .key.key-s").textContent = keyFromCode(backward);
        document.querySelector(".keystrokes-hold .key.key-d").textContent = keyFromCode(right);
        document.querySelector(".keystrokes-hold .key.key-aux1").textContent = keyFromCode(auxKey1);
        document.querySelector(".keystrokes-hold .key.key-aux2").textContent = keyFromCode(auxKey2);

        var scale = Number(addonSetUtils.getConfig(addonInfo["id"], "scale")) + 0.5;
        var leftPos = addonSetUtils.getConfig(addonInfo["id"], "leftPercent")
        var topPos = addonSetUtils.getConfig(addonInfo["id"], "topPercent")

        document.querySelector(".keystrokes-hold").style = `top:${topPos}%;left:${leftPos}%; transform: translate(-50%,-50%) scale(${scale});`;
    }

    // Loads Addons Settings to Configuration Window
    static loadAddonSettings(dependencies) {
        addonSetUtils = new dependencies[0]();
        addonSetUtils.createForm(addonInfo["id"]);

        addonSetUtils.createCategory("addonSettings", "Addon Settings");
        addonSetUtils.createCheckbox(addonInfo["id"], "enabled", "Enable Addon", "Determines if the Addon loads when refreshing page", "addonSettings", false, 2);

        addonSetUtils.createCategory("visualSettings", "Visual Settings");
        addonSetUtils.createSlider(addonInfo["id"], "leftPercent", "X Position (%)", "Changes the X position of the overlay. Based by percentage from left to right", 0, 100, 50, 1, "visualSettings", false);
        addonSetUtils.createSlider(addonInfo["id"], "topPercent", "Y Position (%)", "Changes the Y position of the overlay. Based by percentage from top to bottom", 0, 100, 90, 1, "visualSettings", false);
        addonSetUtils.createSlider(addonInfo["id"], "scale", "Scale", "Changes the scale of the overlay", 0.1, 2.0, 0.5, 0.1, "visualSettings", false);

        addonSetUtils.createCategory("extraKeysSettings", "Change Keybinds");
        addonSetUtils.createKeybindInput(addonInfo["id"], "forward", "Forward Key", "The Forward key that will show up on the overlay", "extraKeysSettings", false);
        addonSetUtils.createKeybindInput(addonInfo["id"], "backward", "Backward Key", "The Backward key that will show up on the overlay", "extraKeysSettings", false);
        addonSetUtils.createKeybindInput(addonInfo["id"], "left", "Left Key", "The Left key that will show up on the overlay", "extraKeysSettings", false);
        addonSetUtils.createKeybindInput(addonInfo["id"], "right", "Right Key", "The Right key that will show up on the overlay", "extraKeysSettings", false);
        addonSetUtils.createKeybindInput(addonInfo["id"], "auxKey1", "Extra Key 1", "The extra key that will show up on the overlay", "extraKeysSettings", false);
        addonSetUtils.createKeybindInput(addonInfo["id"], "auxKey2", "Extra Key 2", "The extra key that will show up on the overlay", "extraKeysSettings", false);

        function openOriginal() {
            window.open("https://gist.github.com/KraXen72/2ea1332440b0c66b83ca9b73afc38269");
        }
        addonSetUtils.createButton(addonInfo["id"], "openOriginal", "Original Script", "This is a modified version of KraXen's script, here is the original", "Open in Browser", openOriginal, "addonSettings", false);

        addonSetUtils.hookSaving(addonInfo["id"], __dirname);
    }
}
module.exports = gatoAddon
