const addonInfo = {
    name: "TwitchUtility",  // Addon Name
    id: "twitchUtility",     // Addon ID (Referenced by save data)
    version: "1.0.5",        // Version
    thumbnail: "https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/twitchutility.png?raw=true",           // Thumbnail URL
    description: "Allows you to integrate your Twitch chat ingame (!link, Chat View)",
    isSocial: false         // UNSUPPORTED - Maybe a future Krunker Hub addon support
};
//const path = require('path');
const { shell } = require('electron');
const fetch = window.fetch;//(...args) => import(path.resolve('./') + '/resources/app.asar/node_modules/node-fetch').then(({ default: fetch }) => fetch(...args));
const { createServer } = require('http');
const { ifError } = require('assert');
var notificationUtils;
var addonSetUtils;
const client_id = "omnaylafso0f3fdtzwrwk5qdb24km9";
var tmi;
var emoteParser;

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
        addonSetUtils.addConfig(addonInfo["id"], "filteredNames", "");
        addonSetUtils.addConfig(addonInfo["id"], "chatboxEnabled", true);
        addonSetUtils.addConfig(addonInfo["id"], "chatboxOpacity", "1");
        addonSetUtils.addConfig(addonInfo["id"], "chatboxBgOpacity", "0.2");
        addonSetUtils.addConfig(addonInfo["id"], "chatboxHeight", "2.5");

        addonSetUtils.addConfig(addonInfo["id"], "emotes", true);
        addonSetUtils.addConfig(addonInfo["id"], "badges", true);

        addonSetUtils.addConfig(addonInfo["id"], "bttv", false);
        addonSetUtils.addConfig(addonInfo["id"], "ffz", false);
        addonSetUtils.addConfig(addonInfo["id"], "7tv", false);
    }

    // Runs when page starts loading
    static initialize(dependencies) {
        addonSetUtils = new dependencies[0]();
        notificationUtils = dependencies[2];
        tmi = dependencies[3];
        emoteParser = dependencies[4];
    }

    // Runs when page fully loaded
    static domLoaded() {
        let css = `
        #twitchChatList{
            overflow-y:hidden;
            overflow-y:auto;
            overflow-x:hidden;
            z-index:999999;
            border-radius:5px;
            background-color:rgba(0,0,0,.4);
            pointer-events:all;
            position:relative;
            margin-bottom:50px;
            direction:rtl;
            text-align:left;
        }
        #twitchChatList::-webkit-scrollbar-track{
            -webkit-box-shadow:unset;
            box-shadow:unset;
            border-radius:unset;
            background-color:rgba(0,0,0,.25)
        }
        #twitchChatList::-webkit-scrollbar{
            width:6px
        }
        #twitchChatList::-webkit-scrollbar-thumb{
            border-radius:2px;
            -webkit-box-shadow:unset;
            box-shadow:unset;
            border-color:#36393f
        }
        .message-emote{
            width:1.5rem;
            height:1.5rem;
        }
        `
        const injectSettingsCss = (css, classId = "twitchutility-css") => {
            let s = document.createElement("style");
            s.setAttribute("id", classId);
            s.innerHTML = css;
            document.head.appendChild(s);
        }
        injectSettingsCss(css);

        let chatboxEnabled = addonSetUtils.getConfig(addonInfo["id"], "chatboxEnabled");
        if (chatboxEnabled == true) {
            let chatHolder = document.getElementById("chatHolder");
            let chatList = document.getElementById("chatList");
            var twitchChat = chatList.cloneNode(false);
            twitchChat.id = "twitchChatList";
            twitchChat.style = `display:block; opacity:${addonSetUtils.getConfig(addonInfo["id"], "chatboxOpacity")}; max-height: ${Number(addonSetUtils.getConfig(addonInfo["id"], "chatboxHeight")) * 100}px`;
            chatHolder.insertBefore(twitchChat, chatHolder.children[0]);
        }

        async function initTwitchIntegration(tokenPromise) {
            var token = await tokenPromise;
            var user = addonSetUtils.getConfig(addonInfo["id"], "channelName");
            const client = new tmi.Client({
                options: { debug: true },
                connection: {
                    reconnect: true,
                    secure: true
                },
                clientId: client_id,
                identity: {
                    username: `${user}`,
                    password: `oauth:${token}`
                },
                channels: [`${user}`]
            });
            client.connect().catch(console.error);
            if (addonSetUtils.getConfig(addonInfo["id"], "emotes") == true || addonSetUtils.getConfig(addonInfo["id"], "badges") == true) {
                emoteParser.setDebug(true);
                emoteParser.events.on("error", e => {
                    console.log("Error:", e);
                })
                emoteParser.setTwitchCredentials(client_id, token);
                emoteParser.loadAssets("twitch");
                emoteParser.loadAssets(user, { "bttv": addonSetUtils.getConfig(addonInfo["id"], "bttv"), "ffz": addonSetUtils.getConfig(addonInfo["id"], "ffz"), "7tv": addonSetUtils.getConfig(addonInfo["id"], "7tv") });
            }

            console.log("TwitchUtility Connected!");

            var _messageNumber = 0;
            var names = addonSetUtils.getConfig(addonInfo["id"], "filteredNames");
            var filteredUsers = names.split(' ');

            client.on('message', (channel, tags, message, self) => {
                if (message.toLowerCase() === '!link' && addonSetUtils.getConfig(addonInfo["id"], "linkCommand") == true) {
                    client.say(channel, `@${tags.username} ` + window.location.href);
                    return;
                }

                if (chatboxEnabled == true) {
                    if (!filteredUsers.includes(tags.username)) {
                        var badgePrepend = "";
                        if (addonSetUtils.getConfig(addonInfo["id"], "badges") == true) {
                            var ttvBadges = emoteParser.getBadges(tags, channel);
                            for (const badge in ttvBadges) {
                                badgePrepend += `<img class="message-emote"src="${ttvBadges[badge]["img"]}"/>`;
                            }
                        }
                        badgePrepend += " ";
                        var messageHTML = message;
                        if (addonSetUtils.getConfig(addonInfo["id"], "emotes") == true) {
                            messageHTML = emoteParser.replaceEmotes(message, tags, channel, self)
                        }

                        var _msgElement = document.createElement("div");
                        _msgElement.setAttribute("data-tab", "-1");
                        _msgElement.id = "chatMsg_" + _messageNumber;

                        var _msgItem = document.createElement("div");
                        _msgItem.classList.add("chatItem"); 
                        _msgItem.classList.add("twitchMsg");
                        _msgItem.style = `background-color: rgba(0, 0, 0, ${addonSetUtils.getConfig(addonInfo["id"], "chatboxBgOpacity")})`;
                        _msgItem.innerHTML = `‎<span style="color:${tags.color}">${badgePrepend}${tags['display-name']}: </span><span class="chatMsg">` + messageHTML + "</span>‎";
                        _msgElement.appendChild(_msgItem);

                                                let twitchChatList = document.getElementById("twitchChatList");
                                                twitchChatList.appendChild(_msgElement);
                                                twitchChatList.scrollTop = twitchChatList.scrollHeight;
                                                _messageNumber++;

                                                            if (twitchChatList.childNodes.length > 35) {
                                                                twitchChatList.childNodes[0].remove();
                                                            }
                    
                    }
                }
            });

            document.getElementById("subLogoButtons").innerHTML += `<div class="button small buttonPI material-icons" id="menuBtnLinkChat" onmouseenter="playTick()" onclick="playSelect()" style="font-size:32px!important">chat link</div>`;
            let linkToChatButton = document.getElementById("menuBtnLinkChat");
            linkToChatButton.addEventListener("click", () => {
                client.say(`${user}`, `Link: ` + window.location.href);
                notificationUtils.createNotif("link", "Posted link to Twitch Chat", "Viewers, feel free to join through the link in the messsage!", "#42d12c", 3000);
            })
        }
        console.log("TwitchUtility Module Requesting Token...");
        initTwitchIntegration(this.getToken());

        function handleKeybinds(event) {
            switch (event.target.tagName.toLowerCase()) {
                case "input":
                case "textarea":
                case "select":
                case "button":
                    break;
                default:
                    if (event.keyCode === addonSetUtils.getConfig(addonInfo["id"], "linkKey").substring(0, 1).charCodeAt(0)) {
                        addonSetUtils.addConfig(addonInfo["id"], "linkCommand", !addonSetUtils.getConfig(addonInfo["id"], "linkCommand"));
                        if (addonSetUtils.getConfig(addonInfo["id"], "linkCommand")) {
                            notificationUtils.createNotif("link", "!Link is Enabled", "Viewers, feel free to join, do !link in chat!", "#42d12c", 3000);
                        } else {
                            notificationUtils.createNotif("link", "!Link is Disabled", "Viewers can no longer join in on the action.", "#d1312c", 3000);
                        }
                    }
                    break;
            }
        }
        document.addEventListener("keydown", handleKeybinds);
    }

    // Runs when settings update
    static updateSettings() {
        let twitchChatList = document.getElementById("twitchChatList");
        twitchChatList.style = `display:block; opacity:${addonSetUtils.getConfig(addonInfo["id"], "chatboxOpacity")}; max-height: ${Number(addonSetUtils.getConfig(addonInfo["id"], "chatboxHeight")) * 100}px`;
        let messages = document.querySelectorAll(".twitchMsg");
        for (const msg in messages) {
            messages[msg].style = `background-color: rgba(0, 0, 0, ${addonSetUtils.getConfig(addonInfo["id"], "chatboxBgOpacity")})`;
        }
    }

    static handleTokenUrl(url) {
        const { token } = String(url).match(/token=(?<token>.*)/u)?.groups ?? {};
        if (!token) return new Error('No token');

        addonSetUtils.addConfig(addonInfo["id"], "token", token);

        this.getUsername(token);

        return token;
    }
    static getToken() {
        return new Promise((resolve, reject) => {
            const cachedToken = addonSetUtils.getConfig(addonInfo["id"], "token");
            if (cachedToken != undefined && cachedToken.length > 0) {
                return resolve(cachedToken);
            }
            const state = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

            const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=http://localhost:6942&state=${state}&response_type=token&scope=chat:read+chat:edit`;

            const server = createServer((req, res) => {
                if (req.method !== 'GET') return res.end();
                if (req.url === '/') {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    return res.end(`<!DOCTYPE html>
                    <html lang="en">
                        <head><title>Gatoclient Twitch oAuth</title><head>
                        <body>
                            <noscript><h2>Please enable Javascript on your browser</h2></noscript>
                            <h2>Close this window if it does not automatically close for you</h2>
                            <script>
                                if (location.hash) {
                                    const token = location.hash.match(/access_token=(.*)&scope/)[1];
                                    const state = location.hash.match(/state=(.*)&/)[1];
                                    if (state !== '${state}') throw new Error('State mismatch');
                                    fetch('http://localhost:6942/token?token=' + token, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).then(window.close);
                                } else {
                                    document.write('<h2>oh No</h2>');
                                }
                            </script>
                        <body>
                    </html>`);
                }
                if (String(req.url).startsWith('/token')) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end();
                    server.close();

                    const result = this.handleTokenUrl(req.url);

                    if (result instanceof Error) return reject(result);
                    return resolve(result);
                }
                return res.end();
            }).listen(6942, () => {
                shell.openExternal(oauthUrl);
            });
            setTimeout(() => {
                server.close();
                return reject(new Error('Timeout'));
            }, 5 * 60 * 1000);
        });
    }

    // Loads Addons Settings to Configuration Window
    static loadAddonSettings(dependencies) {
        addonSetUtils = new dependencies[0]();
        addonSetUtils.createForm(addonInfo["id"]);

        addonSetUtils.createCategory("addonSettings", "Addon Settings");
        addonSetUtils.createCheckbox(addonInfo["id"], "enabled", "Enable Addon", "Determines if the Addon loads when refreshing page", "addonSettings", false, 2);

        function resetToken() {
            addonSetUtils.addConfig(addonInfo["id"], "token", "");
        }
        addonSetUtils.createTextInput(addonInfo["id"], "channelName", "Twitch Username", "Due to high instability, I ask that you please input your Twitch username here", "Enter your Twitch Username", "addonSettings", false, 2);
        addonSetUtils.createButton(addonInfo["id"], "resetToken", "Remove oAuth Token", "Removes your oAuth token", "Reset", resetToken, "addonSettings", false, 2);

        addonSetUtils.createCategory("featureSettings", "Features");
        addonSetUtils.createCheckbox(addonInfo["id"], "linkCommand", "!Link command", "Allows users in chat to comment !Link to get the game link", "featureSettings", false);
        addonSetUtils.createTextInput(addonInfo["id"], "linkKey", "Link Toggle Keybind", "Add a quick keybind that toggles the !Link command", "L", "featureSettings", false);

        addonSetUtils.createCategory("chatboxSettings", "Twitch Chatbox Settings");
        addonSetUtils.createCheckbox(addonInfo["id"], "chatboxEnabled", "Enable Chatbox", "Determines if the Addon loads when refreshing page", "chatboxSettings", false, 2);
        addonSetUtils.createCheckbox(addonInfo["id"], "filterCommands", "Filter commands [WIP]", "Don't show when users execute commands. (WORK IN PROGRESS)", "chatboxSettings", false, 2);
        addonSetUtils.createTextInput(addonInfo["id"], "filteredNames", "Filter users", "Filter users by putting their name here, separated by spaces.", "Names here", "chatboxSettings", false, 2);
        addonSetUtils.createSlider(addonInfo["id"], "chatboxOpacity", "Chat Opacity", "Changes twitch chat opacity", 0, 1.0, 1.0, 0.1, "chatboxSettings", false);
        addonSetUtils.createSlider(addonInfo["id"], "chatboxBgOpacity", "Chat BG Opac", "Changes message background opacity", 0, 1.0, 0.2, 0.1, "chatboxSettings", false);
        addonSetUtils.createSlider(addonInfo["id"], "chatboxHeight", "Chat Height", "Changes maximum height of chatbox", 0, 5.0, 2.5, 0.1, "chatboxSettings", false);

        addonSetUtils.createCategory("emoteSettings", "Twitch Chatbox: Emotes + Badges");
        addonSetUtils.createCheckbox(addonInfo["id"], "emotes", "Enable Emotes", "Show Emotes in the Twitch Chatbox", "emoteSettings", false, 2);
        addonSetUtils.createCheckbox(addonInfo["id"], "badges", "Enable Badges", "Show Badges in the Twitch Chatbox", "emoteSettings", false, 2);
        addonSetUtils.createCheckbox(addonInfo["id"], "bttv", "BTTV Support", "Show Emotes in the Twitch Chatbox", "emoteSettings", false, 2);
        addonSetUtils.createCheckbox(addonInfo["id"], "ffz", "FFZ Support", "Show Emotes in the Twitch Chatbox", "emoteSettings", false, 2);
        addonSetUtils.createCheckbox(addonInfo["id"], "7tv", "7TV Support", "Show Emotes in the Twitch Chatbox", "emoteSettings", false, 2);

        addonSetUtils.hookSaving(addonInfo["id"], __dirname);
    }
}
module.exports = gatoAddon