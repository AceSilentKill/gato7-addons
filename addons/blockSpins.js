const addonInfo = {
  name: 'Block Spins', // Addon Name
  id: 'blockSpins', // Addon ID (Referenced by save data)
  version: '1.0.1', // Version
  thumbnail:'https://github.com/creepycats/gatoclient-addons/blob/main/thumbnails/blockSpins.png?raw=true', // Thumbnail URL
  description: 'A great way to fight your spinning addiction!',
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
    var _gen = windows[13].gen;
    windows[13].gen = function () {
      return _gen
        .apply(this, arguments)
        .replace(/prizeWheel\(.*?\)/g, 'alert("Spins are disabled through an add-on!")');
    };
  }

  // Runs when settings update
  static updateSettings() {}

  // Loads Addons Settings to Configuration Window
  static loadAddonSettings(dependencies) {
    addonSetUtils = new dependencies[0]();
    addonSetUtils.createForm(addonInfo['id']);

    addonSetUtils.createCategory('addonSettings', 'Addon Settings');
    addonSetUtils.createCheckbox(addonInfo['id'],'enabled','Enable Addon','Determines if the Addon loads when refreshing page','addonSettings',false,2);
    addonSetUtils.hookSaving(addonInfo['id'], __dirname);
  }
}
module.exports = gatoAddon;
