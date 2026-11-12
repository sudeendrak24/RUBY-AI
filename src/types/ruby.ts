export type RubyLanguage = 'en' | 'ta' | 'hi';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  aliases: string[];
  relationship?: string;
  isEmergency: boolean;
  ridingBypass: boolean;
}

export type RidingPolicy = 'NORMAL' | 'AI_ASSISTANT' | 'EMERGENCY_ONLY';

export interface UserPreferences {
  callAssistantEnabled: boolean;
  ridingModePolicy: RidingPolicy;
  autoSmsTemplate: string;
  aiDisclosureEnabled: boolean;
  voiceSpeed: number;
  wakeWord: string;
}

export interface CallSession {
  id: string;
  callerNumber: string;
  callerName: string;
  carrier: string;
  status: 'RINGING' | 'AI_SCREENING' | 'CONNECTED' | 'ENDED';
  startTime: string;
  durationSeconds: number;
  aiTranscript?: string[];
  callerMessage?: string;
}

export interface SystemTelemetry {
  cpuUsagePct: number;
  ramUsedMb: number;
  ramTotalMb: number;
  activeThreads: number;
  uptimeSeconds: number;
  model: string;
  os: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  category: 'SECURITY' | 'TELEPHONY' | 'VOICE' | 'SYSTEM';
  description: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
}

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'pairing'
  | 'home'
  | 'voice'
  | 'history'
  | 'incoming_call'
  | 'active_call'
  | 'outgoing_call'
  | 'contacts'
  | 'call_settings'
  | 'riding_mode'
  | 'memory'
  | 'language'
  | 'windows_sync'
  | 'permissions'
  | 'security'
  | 'about';
