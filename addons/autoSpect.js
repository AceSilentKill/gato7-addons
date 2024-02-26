const addonInfo = {
  name: 'AutoSpect', // Addon Name
  id: 'autoSpect', // Addon ID (Referenced by save data)
  version: '1.0.0', // Version
  thumbnail:'https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/autoSpect.png?raw=true', // Thumbnail URL
  description: 'Auto Spectator Mode',
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
    addonSetUtils.addConfig(addonInfo['id'], 'enabled', true);
  }

  // Runs when page starts loading
  static initialize(dependencies) {
    addonSetUtils = new dependencies[0]();
  }

  // Runs when page fully loaded
  static domLoaded() {}

  // Runs when Game fully loaded
  static gameLoaded() {
    setSpect(addonSetUtils.getConfig(addonInfo["id"], `enabled`));
  }

  // Runs when settings update
  static updateSettings() {}

  // Loads Addons Settings to Configuration Window
  static loadAddonSettings(dependencies) {
    addonSetUtils = new dependencies[0]();
    addonSetUtils.createForm(addonInfo['id']);

    addonSetUtils.createCategory('addonSettings', 'Addon Settings');
    addonSetUtils.createCheckbox(addonInfo['id'],'enabled','Enable AutoSpect','Determines if spectator mode is automatically enabled','addonSettings',false,2);
    addonSetUtils.hookSaving(addonInfo['id'], __dirname);
  }
}
module.exports = gatoAddon;