export interface DSComponent {
  name: string;
  category: 'base' | 'layout' | 'feedback' | 'form';
  path: string;
}

export interface ComponentUsage {
  component: string;
  file: string;
  line: number;
  source: 'design-system' | 'local';
}

export interface LocalComponent {
  name: string;
  path: string;
  hasDSEquivalent: boolean;
  dsEquivalent?: string;
}

export interface MonitorReport {
  timestamp: string;
  summary: {
    totalDSComponents: number;
    usedDSComponents: number;
    coveragePercent: number;
    localComponentsCount: number;
    duplicatesCount: number;
  };
  dsComponents: {
    name: string;
    category: string;
    usageCount: number;
    usedIn: string[];
  }[];
  localComponents: LocalComponent[];
  duplicates: {
    localPath: string;
    dsComponent: string;
    recommendation: string;
  }[];
  unusedDSComponents: string[];
}

export interface MonitorConfig {
  frontendPath: string;
  dsPackageName: string;
  localComponentsPath: string;
  outputPath?: string;
}
