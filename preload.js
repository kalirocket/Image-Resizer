const {contextBridge} = require('electron')
const path = require('path');
const os = require('os');
const Toastify = require('toastify-js');
contextBridge.exposeInMainWorld('os', {
    homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args)
});

contextBridge.exposeInMainWorld('Toastify', {
    toast: (options) => Toastify(options).showToast()
});