import { app, BrowserWindow, ipcMain, shell, Menu } from 'electron';
import path from 'path';
import { startHonoServer } from './server';

let mainWindow: BrowserWindow | null = null;
let honoServer: any = null;
let pendingAnchorId: string | null = null;

// Strictly enforce: No macOS Preferences menu item or default application menu
Menu.setApplicationMenu(null);

// Register both mokko and grokbot protocol schemes
for (const scheme of ['mokko', 'grokbot']) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(scheme, process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient(scheme);
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      // Deep link URL in commandLine
      const url = commandLine.find((arg) => arg.startsWith('mokko://') || arg.startsWith('grokbot://'));
      if (url) {
        handleDeepLink(url);
      }
    }
  });
}

function handleDeepLink(urlStr: string) {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'mokko:' && parsed.protocol !== 'grokbot:') {
      console.warn('Rejected unrecognized protocol link:', urlStr);
      return;
    }
    const anchorId = parsed.searchParams.get('id');
    if (anchorId) {
      // Sanitize anchor ID (alphanumeric, dashes, and underscores only)
      const sanitized = anchorId.replace(/[^a-zA-Z0-9_-]/g, '');
      if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents.isLoading() === false) {
        mainWindow.webContents.send('navigate-anchor', sanitized);
      } else {
        // Queue pending link until window finished loading
        pendingAnchorId = sanitized;
      }
    }
  } catch (err) {
    console.error('Failed to parse deep link:', urlStr, err);
  }
}

// macOS open-url handler
app.on('open-url', (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0c0d0e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      spellcheck: true,
    },
    icon: path.join(__dirname, '../public/logo.png'),
  });

  // Security Hardening: Prevent opening arbitrary new windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Security Hardening: Prevent in-app navigation away from our bundle
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsed = new URL(navigationUrl);
    if (parsed.origin !== 'http://localhost:5173' && parsed.protocol !== 'file:') {
      event.preventDefault();
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        shell.openExternal(navigationUrl);
      }
    }
  });

  // Dispatch any queued deep links once ready
  mainWindow.webContents.on('did-finish-load', () => {
    if (pendingAnchorId) {
      mainWindow?.webContents.send('navigate-anchor', pendingAnchorId);
      pendingAnchorId = null;
    }
  });

  // Start Hono backend server
  honoServer = startHonoServer(31415);

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window controls
  ipcMain.on('window-minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow?.close();
  });

  // Validated external URL opener
  ipcMain.on('open-external', (_event, url: string) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        shell.openExternal(url);
      } else {
        console.warn('Blocked attempt to open untrusted scheme:', url);
      }
    } catch {
      console.warn('Invalid URL passed to open-external:', url);
    }
  });

  ipcMain.on('open-settings', (_event, anchorId?: string) => {
    mainWindow?.webContents.send('navigate-anchor', anchorId || 'account');
  });

  ipcMain.on('toggle-agent-info', () => {
    mainWindow?.webContents.send('toggle-agent-info');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Cold start command line check for Windows/Linux
  const launchUrl = process.argv.find((arg) => arg.startsWith('mokko://') || arg.startsWith('grokbot://'));
  if (launchUrl) {
    handleDeepLink(launchUrl);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
