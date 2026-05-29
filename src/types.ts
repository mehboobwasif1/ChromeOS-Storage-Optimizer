export interface DeviceProfile {
  model: string;
  codename: string;
  chromeOsVersion: string;
  storageSizeGb: number;
  hasLinux: boolean;
  hasAndroid: boolean;
  isDeveloperMode: boolean;
}

export interface CleanupModule {
  id: string;
  name: string;
  description: string;
  component: 'Crostini Linux' | 'Android (ARC++)' | 'Chrome Browser' | 'General OS';
  sizeSavedEstimate: string;
  command: string;
  risk: 'Low' | 'Medium' | 'High';
  checked: boolean;
}

export interface AdvisorCategory {
  id: string;
  title: string;
  description: string;
  steps: string[];
  visualTip: string;
  estimatedSaving: string;
}

export interface AnalysisResult {
  overview: string;
  rawPastedText: string;
  itemsDetected: Array<{
    name: string;
    size?: string;
    path?: string;
    isSafeToDelete: boolean;
    explanation: string;
    cleanupCommand?: string;
  }>;
  preventativeMeasures: string;
}
