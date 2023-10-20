const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// Create the main window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600
    });


    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Create about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300
    });

    aboutWindow.loadFile(path.join(__dirname, '/renderer/about.html'))
}

// App is ready
app.whenReady().then(() => {
    // Menu template
    // const menu = [
    //     {
    //         label: 'Quit',
    //         click: () => app.quit(),
    //         accelerator: 'CmdOrCtrl+W'
    //     }
    // ];
    const menu = [
        ...(isMac ? [{
            label: app.name,
            submenu: [
                {
                    label: 'About'
                }
            ]
        }
        ] : []),
        {
            role: 'fileMenu',
        },
        ...(!isMac ? [{
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }] : [])


    ];
    createMainWindow();


    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });


})

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});