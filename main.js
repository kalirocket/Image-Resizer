const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');
const path = require('path');
const os = require('os');
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const fs = require('fs');
const resizeImg = require('resize-img');


let mainWindow;
let aboutWindow;

// Create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, '/preload.js')
        }
    });


    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Create about window
function createAboutWindow() {
    aboutWindow = new BrowserWindow({
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


});

// Resize image
async function resizeImage({imgPath, height, width, destination}) {
    try {
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height
        });

        // Create filename
        const filename = path.basename(imgPath);
        // Create destination folder if it's not present
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }

        // Write the file to the destination folder
        fs.writeFileSync(path.join(destination, filename), newPath);

        // Send success back to the render probably
        mainWindow.webContents.send('image:done');

        // Open destination folder
        shell.openPath(destination);

    } catch (e) {
        console.log(e);
    }
}

// Respond to ipcRenderer resize
ipcMain.on('image:resizer', (e, options) => {
    options.destination = path.join(os.homedir(), 'imageresizer');
    resizeImage(options);
});


app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});