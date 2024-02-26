const addonInfo = {
    name: "Alternate Account Manager", // Addon Name
    id: "altManager", // Addon ID (Referenced by save data)
    version: "1.0.1", // Version
    thumbnail: "https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/altmng.png?raw=true", // Thumbnail URL
    description: "Alternate Account Manager allows you to switch accounts. Based on LaF",
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
    }

    // Runs when page starts loading
    static initialize(dependencies) {
        addonSetUtils = new dependencies[0]();
        console.log("altManager Running");
    }

    // Runs when page fully loaded
    static domLoaded() {
        let css = `.altManage{ vertical-align:middle; display:inline-block; cursor:pointer; margin-top:-21px; } .altManage > span{ color:#5dd8e8; position:relative!important; top:-10px!important; } .altManage > span:first-child { color:#5dd8e8; font-size:37px!important; top:-3px!important; }`;
        const injectSettingsCss = (css, classId = "altmanager-css") => {
            let s = document.createElement("style");
            s.setAttribute("id", classId);
            s.innerHTML = css;
            document.head.appendChild(s);
        }

        injectSettingsCss(css)

        window.altMng = this;
    }

    // Alt Manager Functions
    static altManagerOpen() {
        // Open Separate Popup
        showWindow(22);
        // Create Window
        const mngHolder = document.getElementById('menuWindow');
        mngHolder.textContent = '';
        mngHolder.classList.add("stickyHeader");
        mngHolder.innerHTML += `<div id="playerSearchH" class="setHed">Alternate Accounts Manager</div>`;
        // Add Account button
        let addButton = document.createElement("span");
        addButton.setAttribute("onmouseenter", "playTick()");
        addButton.classList.add("punishButton");
        addButton.style = "background-color:#42f54e;position:absolute;right:0px;top:21px";
        addButton.textContent = "Add New Account";
        addButton.setAttribute("onclick","window.altMng.altShowAdd()")
        document.getElementById("playerSearchH").appendChild(addButton);
        // Create Account List
        mngHolder.innerHTML += `<div id="playerListH"><table class="pListTable" style="margin-top: 8px;overflow-y: scroll;height: calc(100% - 75px);"><tbody></tbody></table></div>`;
        const tableBody = document.getElementById("playerListH").children[0].children[0];
        const accList = JSON.parse(localStorage.getItem('altAccounts'));
        if (!accList) {
            console.log("No Alt Data")
        } else {
            Object.keys(accList).forEach((k) => {
                let row = document.createElement("tr");
                row.innerHTML += `<td class="pListName">${k}</td>`;
                let actions = document.createElement("td");
                actions.classList.add("pListActions");

                // Buttons
                let logInButton = document.createElement("span");
                logInButton.setAttribute("onmouseenter", "playTick()");
                logInButton.classList.add("punishButton");
                logInButton.style = "background-color:#42f54e";
                logInButton.textContent = "Log In";
                
                let editButton = document.createElement("span");
                editButton.setAttribute("onmouseenter", "playTick()");
                editButton.classList.add("punishButton");
                editButton.classList.add("kick");
                editButton.textContent = "Edit";

                let deleteButton = document.createElement("span");
                deleteButton.setAttribute("onmouseenter", "playTick()");
                deleteButton.classList.add("punishButton");
                deleteButton.textContent = "Delete";

                actions.appendChild(logInButton);
                actions.appendChild(editButton);
                actions.appendChild(deleteButton);

                logInButton.addEventListener("click", (event) => {
                    this.altLogin(k)
                });
                editButton.addEventListener("click", (event) => {
                    this.altEdit(k)
                });
                deleteButton.addEventListener("click", (event) => {
                    this.altDelete(k)
                });

                row.appendChild(actions);
                tableBody.appendChild(row);
            });
        }
        if (tableBody.children.length < 1) {
            let row = document.createElement("tr");
            row.innerHTML += `<td class="pListName">No Alternate Accounts.</td>`;
            tableBody.appendChild(row);
        }
    }

    static altLogin(accName) {
        let accNameElem = document.getElementById('accName');
        let accPass = document.getElementById('accPass');
        const altAccounts = JSON.parse(localStorage.getItem('altAccounts'));
        window.logoutAcc();
        accNameElem = document.getElementById('accName');
        accPass = document.getElementById('accPass');
        accNameElem.value = accName;
        accPass.value = Buffer.from(altAccounts[accName], 'base64').toString();
        accNameElem.style.display = 'none';
        accPass.style.display = 'none';
        let accountButtons = document.getElementsByClassName('accBtn');
        Array.from(accountButtons).forEach((k) => {
            k.style.display = 'none';
        });
        setTimeout(() => {
            window.loginAcc();
        }, 100);
    }
    static altAdd(f = false) {
        const accName = document.getElementById('accName');
        const accPass = document.getElementById('accPass');
        const accPassB64 = Buffer.from(accPass.value).toString('base64');
        let altAccounts = JSON.parse(localStorage.getItem('altAccounts'));
        if (!altAccounts) {
            altAccounts = {
                [accName.value]: accPassB64,
            };
            localStorage.setItem('altAccounts', JSON.stringify(altAccounts));
            accName.value = '';
            accPass.value = '';
            document.getElementById('accResp').innerText = "Added Alt Successfully!";
        } else {
            let existing = false;
            Object.keys(altAccounts).forEach((k) => {
                if (k === accName.value && !f) {
                    document.getElementById('accResp').innerText = "Error! Could not append Alt!";
                    existing = true;
                }
            });
            if (!existing) {
                altAccounts[accName.value] = accPassB64;
                localStorage.setItem('altAccounts', JSON.stringify(altAccounts));
                document.getElementById('accName').value = '';
                document.getElementById('accPass').value = '';
                document.getElementById('accResp').innerText = f ? "Saved Account!" : "Added Account Successfully!";
            }
        }
    }
    static altShowAdd() {
        const menuWindow = document.getElementById('menuWindow');
        menuWindow.outerHTML = `
        <div id='menuWindow' class='dark' style='overflow-y: auto; width: 960px;'>
            <div style='position:relative;z-index:9'>
                <div id='referralHeader'>Add Account</div>
                <div style='height:20px;'></div><input id='accName' type='text' placeholder='Enter Username' class='accountInput' style='margin-top:0'><input id='accPass' type='password' placeholder='Enter Password' class='accountInput'>
                <div class='setBodH' style='margin-left:0px;width:calc(100% - 40px)'>
                    <div id='accResp' style='margin-top:20px;margin-bottom:20px;font-size:18px;color:rgba(255,255,255,0.5);text-align:center'>For lost Passwords/Accounts contact <span style='color:rgba(255,255,255,0.8)'>recovery@yendis.ch</span></div>
                </div>
                <div style='width:100%;text-align:center;margin-top:10px;background-color:rgba(0,0,0,0.3);padding-top:10px;padding-bottom:20px;'>
                    <div id="addAccountButton" class='accBtn button buttonPI' style='width:95%' onclick='SOUND.play(\`select_0\`,0.1);window.altMng.altAdd()'>Add Account</div>
                </div>
            </div>
        </div>`;
    }
    static altSave() {
        document.getElementById("editAccountButton").classList.add("blockClick");
        try {
            this.altAdd(true);
        } catch (e) {
            window.log(e);
        }
        setTimeout(() => {
            document.getElementById('windowHolder').style.display = 'none';
        }, 3000);
    }
    static altEdit(accName) {
        const menuWindow = document.getElementById('menuWindow');
        menuWindow.outerHTML = `
        <div id='menuWindow' class='dark' style='overflow-y: auto; width: 960px;'>
            <div style='position:relative;z-index:9'>
                <div id='referralHeader'>Edit Account</div>
                <div style='height:20px;'></div><input id='accName' type='text' placeholder='Enter Username' class='accountInput' style='margin-top:0' value='${accName}' readonly='readonly'><input id='accPass' type='password' placeholder='Enter Password' class='accountInput'>
                <div class='setBodH' style='margin-left:0px;width:calc(100% - 40px)'>
                    <div id='accResp' style='margin-top:20px;margin-bottom:20px;font-size:18px;color:rgba(255,255,255,0.5);text-align:center'>Editing account...</div>
                </div>
                <div style='width:100%;text-align:center;margin-top:10px;background-color:rgba(0,0,0,0.3);padding-top:10px;padding-bottom:20px;'>
                    <div id="editAccountButton" class='accBtn button buttonG' style='width:95%' onclick='SOUND.play(\`select_0\`,0.1);window.altMng.altSave()'>Save Account</div>
                </div>
            </div>
        </div>`;
    }
    static altDelete(accName) {
        const altAccounts = JSON.parse(localStorage.getItem('altAccounts'));
        delete altAccounts[accName];
        localStorage.setItem('altAccounts', JSON.stringify(altAccounts));
        window.closWind();
        this.altManagerOpen();
    }

    // Runs when Game fully loaded
    static gameLoaded() {
        let usernameContainer = document.getElementById("menuUsernameContainer");
        var altManageLabel = document.createElement("div");
        altManageLabel.classList.add("altManage");
        altManageLabel.innerHTML = `<span class="material-icons">switch_account</span><span> Alts</span>`;
        let vertSep = document.createElement("div");
        vertSep.classList.add("verticalSeparator");
        vertSep.style = "height:35px";
        usernameContainer.after(altManageLabel);
        usernameContainer.after(vertSep);

        altManageLabel.addEventListener("click", () => {
            this.altManagerOpen();
        })

        var altManageLabel2 = document.createElement("div");
        altManageLabel2.classList.add("altManage");
        altManageLabel2.innerHTML = `<span class="material-icons">switch_account</span><span> Alts</span>`;
        let vertSep2 = document.createElement("div");
        vertSep2.classList.add("verticalSeparator");
        vertSep2.style = "height:35px";
        let signedOutHB = document.getElementById("signedOutHeaderBar")
        signedOutHB.appendChild(vertSep2);
        signedOutHB.appendChild(altManageLabel2);
        altManageLabel2.style = "margin-top:10px"

        altManageLabel2.addEventListener("click", () => {
            this.altManagerOpen();
        })
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
        addonSetUtils.hookSaving(addonInfo["id"], __dirname);
    }
}
module.exports = gatoAddon
