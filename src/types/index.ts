export type CarrierType = 'inwi' | 'orange' | 'iam' | 'global';

export type ProtocolType = 'v2ray' | 'ssh' | 'vmess' | 'vless' | 'trojan' | 'openvpn';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export type Language = 'darija' | 'ar' | 'fr' | 'en';

export interface Server {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  flag: string;
  carrier: CarrierType;
  protocol: ProtocolType;
  pingMs: number;
  loadPercent: number;
  ip: string;
  isVip?: boolean;
  isRecommended?: boolean;
  features: string[];
}

export interface CarrierTweak {
  id: string;
  name: string;
  carrier: CarrierType;
  carrierLabel: string;
  sniHost: string;
  bugHost: string;
  payload: string;
  port: number;
  protocol: ProtocolType;
  description: string;
  speedRating: string;
}

export interface SpeedPoint {
  time: string;
  speedMB: number;
}

export interface ConnectionStats {
  durationSeconds: number;
  downloadSpeedBytes: number;
  uploadSpeedBytes: number;
  totalDownloadBytes: number;
  totalUploadBytes: number;
  currentPing: number;
  virtualIp: string;
  speedHistory?: SpeedPoint[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'debug';
  message: string;
}

export interface ProxyConfig {
  isEnabled: boolean;
  socksPort: number;
  httpPort: number;
  localIp: string;
  activeClientsCount: number;
}

export interface AppSettings {
  appName: string;
  appSubtitle: string;
  accentColor: 'emerald' | 'cyan' | 'amber' | 'purple';
  killSwitch: boolean;
  bypassLan: boolean;
  dnsOverHttps: boolean;
  autoReconnect: boolean;
  selectedDns: string;
  language: Language;
}
