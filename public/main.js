const { app, BrowserWindow} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
require('@electron/remote/main').initialize();

function createWindow() {
    const win = new BrowserWindow({
        width: 1180,
        height: 1000,
        webPreferences: {
            enableRemoteModule: true,
            nodeItegration: true
        }
    })

    win.loadURL(
        isDev 
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    )
}

app.on('ready', createWindow)

// MacOS listeners
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})