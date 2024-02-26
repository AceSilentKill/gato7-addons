const addonInfo = {
    name: "Class Randomizer",  // Addon Name
    id: "randomClass",     // Addon ID (Referenced by save data)
    version: "1.0.0",        // Version
    thumbnail: "https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/randomClass.png?raw=true",           // Thumbnail URL
    description: "Choose a random class (configurable) every time you spawn in",
    isSocial: false         // UNSUPPORTED - Maybe a future Krunker Hub addon support
};
var addonSetUtils;

const classToID = {
    'ak':'Triggerman', 
    'sniper':'Hunter',
    'smg':'Run N Gun', 
    'lmg':'Spray N Pray', 
    'shotgun':'Vince', 
    'rev':'Detective', 
    'semi':'Marksman', 
    'rocket':'Rocketeer', 
    'akimbo':'Agent', 
    'runner':'Runner', 
    'deagle':'Deagler', 
    'crossbow':'Bowman', 
    'famas':'Commando', 
    'blaster':'Trooper', 
    'builder':'Survivor', 
    'railgun':'Infiltrator'
}

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
        addonSetUtils.addConfig(addonInfo["id"], "randomizeClass", false);
        Object.keys(classToID).forEach(function (key) {
            if(key != "builder" && key != "deagle"){
                addonSetUtils.addConfig(addonInfo["id"], `classes.${key}`, true);
            } else {
                addonSetUtils.addConfig(addonInfo["id"], `classes.${key}`, false);
            }
        });
    }

    // Runs when page starts loading
    static initialize(dependencies) {
        addonSetUtils = new dependencies[0]();
        console.log("randomClass Running");
    }

    // Runs when page fully loaded
    static domLoaded() {
        let css = `
        #classRandom{
            width:300px;
            height:60px;
            padding:15px;
            vertical-align:bottom;
            font-size:27px!important;
            display:block;
            margin-left:3px;
        }
        .randButtonOn{border:4px solid #7bee79!important}
        .randButtonOff{border:4px solid #d04141!important}
        #classPreviewCanvas{
            position:relative;
            top:90px;
        }
        #menuClassSubtext{
            position:relative;
            top:90px;
        }
        #menuClassName{
            position:relative;
            top:90px;
        }
        `

        const injectSettingsCss = (css, classId = "opticzoom-css") => {
            let s = document.createElement("style");
            s.setAttribute("id", classId);
            s.innerHTML = css;
            document.head.appendChild(s);
        }

        injectSettingsCss(css)

        // Randomize Button
        var customButtonHolder = document.getElementById("customizeButton").parentElement;
        customButtonHolder.style = "position:relative;top:90px"
        var randClassButton = document.createElement("div");
        var isOn = (addonSetUtils.getConfig(addonInfo["id"], "randomizeClass") == true);
        randClassButton.id = "classRandom";
        randClassButton.classList.add("button");
        randClassButton.classList.add(isOn ? "randButtonOn" : "randButtonOff");
        randClassButton.innerHTML = `Random Class<span class="material-icons" style="font-size:42px;color:#fff;margin-left:6px;margin-top:-8px;margin-right:-10px;vertical-align:middle">cached</span><div id="randClassStatus" style="font-size:18px;color:#777;position:relative;top:-8px">Disabled</div>`;
        customButtonHolder.appendChild(randClassButton);
        var randClassStatus = document.getElementById("randClassStatus");
        randClassStatus.textContent = isOn ? "Enabled" : "Disabled";

        randClassButton.addEventListener("click",(event)=>{
            isOn = !isOn;
            addonSetUtils.addConfig(addonInfo["id"], "randomizeClass", isOn);

            randClassStatus.textContent = isOn ? "Enabled" : "Disabled";
            randClassButton.classList.remove(!isOn ? "randButtonOn" : "randButtonOff");
            randClassButton.classList.add(isOn ? "randButtonOn" : "randButtonOff");
        })

        function randomizeClass(){
            // Get Enabled Classes
            var enabledClasses = [];
            var idKeys = Object.keys(classToID);
            idKeys.forEach(function (key) {
                if(addonSetUtils.getConfig(addonInfo["id"], `classes.${key}`) == true){
                    enabledClasses[enabledClasses.length] = idKeys.indexOf(key);
                }
            });

            let rand = Math.floor(Math.random() * enabledClasses.length);
            window.selectClass(enabledClasses[rand]);
        }

        document.addEventListener("pointerlockchange", ()=>{
            if (document.pointerLockElement != null && isOn) {
                randomizeClass();
            }
        });
    }

    // Runs when Game fully loaded
    static gameLoaded() {

    }

    // Runs when settings update
    static updateSettings() {

    }

    // Loads Addons Settings to Configuration Window
    static loadAddonSettings(dependencies) {
        addonSetUtils = new dependencies[0]();
        addonSetUtils.createForm(addonInfo["id"]);

        addonSetUtils.createCategory("addonSettings", "Addon Settings");
        addonSetUtils.createCheckbox(addonInfo["id"], "enabled", "Enable Addon", "Determines if the Addon loads when refreshing page", "addonSettings", false, 2);

        addonSetUtils.createCategory("classSettings", "Classes");
        Object.keys(classToID).forEach(function (key) {
            addonSetUtils.createCheckbox(addonInfo["id"], `classes.${key}`, classToID[key], "Enable to allow Class to be selected by randomizer", "classSettings", false);
        });

        addonSetUtils.hookSaving(addonInfo["id"], __dirname);
    }
}
module.exports = gatoAddon
