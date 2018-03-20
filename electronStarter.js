const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
//Module to careate a list in Menu
const Menu = electron.Menu;
//ipc Main
const ipc = electron.ipcMain;

const path = require('path')
const url = require('url')


const config = require('./src/config/config').config;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow , widget;
let widgetShow = true;

function createWindow () {
  const atomScreen = electron.screen;
  const size = atomScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 400, height: 400})
  widget = new BrowserWindow({
    width:130,
    height:38,
    x:size.width - 100,
    y:size.height - 100,
    resizable:false,
    transparent: false,
    frame: false,
    minimizable: false,
    maximizable :false,
    closable:false,
    alwaysOnTop:true,
    show:true,
    frame:false,
    backgroundColor:'#34495e'
  });
  widget.setAlwaysOnTop(true);
  widget.setSkipTaskbar(true);
  const widgetUrl = url.format({
    pathname: path.join(__dirname, '/renderer/widget.html'),
    protocol: 'file:',
    slashes: true
  });
  // widget.loadURL(`file://${__dirname}/renderer/widget.html`);
  
  const label = electron.app.getName();
  
  // and load the index.html of the app.
  const startUrl = config.dev.entryPoint || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.on('did-finish-load' , _=>{
    widget.loadURL(widgetUrl);
  })
  
  //Template for the Menu
  const template = [
    {
      label,
      submenu:[{
        label: `Show/Hide Widget`,
        click: () => {
          widgetShow = !widgetShow;
          if(widgetShow){
            show(widget);
          }else{
            hide(widget);
          }
          
        },
        role: 'widget'
      },
      {
        type:'separator'
      },
      {
        label:'Quit',
        click: _=> {
          app.quit();
          widget.destroy();
        },
        accelerator: 'Cmd+Q'
      }]
    }
  ];

  let widgetWebContent;

  widget.webContents.on('did-finish-load' , ()=>{
    widgetWebContent = widget.webContents;
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);


  // Open the DevTools.
   mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    console.log('closed')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    widget.destroy();
  })
  widget.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    widget = null;
  })

  ipc.on('start' , (event , args)=>{
    console.log('received')
  })
  ipc.on('timer' , (event , args) => {
    widgetWebContent.send("timer-start" , args.start)
  });
  ipc.on('hide' , (event)=>{
    widgetShow = !widgetShow;
    hide(widget);
  });
  ipc.on('timer-state-change', (event, args) =>{
    mainWindow.webContents.send("timer-state-change" , args);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function hide(win){
  return win.hide();
}
function show(win){
  return win.show();
}