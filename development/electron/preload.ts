import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  openExternal: (url: string) => void;
  onNavigateAnchor: (callback: (anchorId: string) => void) => () => void;
  openSettings: (anchorId?: string) => void;
  toggleAgentInfo: () => void;
}

const api: ElectronAPI = {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
  onNavigateAnchor: (callback: (anchorId: string) => void) => {
    const handler = (_event: any, anchorId: string) => callback(anchorId);
    ipcRenderer.on('navigate-anchor', handler);
    return () => ipcRenderer.removeListener('navigate-anchor', handler);
  },
  openSettings: (anchorId?: string) => ipcRenderer.send('open-settings', anchorId),
  toggleAgentInfo: () => ipcRenderer.send('toggle-agent-info'),
};

contextBridge.exposeInMainWorld('electronAPI', api);
