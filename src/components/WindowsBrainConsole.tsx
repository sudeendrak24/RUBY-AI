import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  HardDrive,
  Activity,
  Shield,
  Layers,
  Send,
  CheckCircle2,
  AlertTriangle,
  Play,
  Home,
  MessageSquare,
  Mic,
  Lock,
  Smartphone,
  Phone,
  Bike,
  Workflow,
  Server,
  Settings
} from 'lucide-react';
import { SystemTelemetry, AuditLogItem } from '../types/ruby';
import { RubyAIOrb, OrbState } from './RubyAIOrb';
import { RubyCard, RubyPrimaryButton, RubySecondaryButton } from './ui/RubyComponents';

interface WindowsBrainConsoleProps {
  telemetry: SystemTelemetry;
  onExecuteCommand: (cmd: string) => void;
  auditLogs: AuditLogItem[];
  lastCommandResult: any;
}

export const WindowsBrainConsole: React.FC<WindowsBrainConsoleProps> = ({
  telemetry,
  onExecuteCommand,
  auditLogs,
  lastCommandResult,
}) => {
  const [cliInput, setCliInput] = useState('');
  const [activeWindowsView, setActiveWindowsView] = useState<
    'home' | 'chat' | 'voice' | 'memory' | 'devices' | 'calls' | 'riding' | 'automation' | 'system' | 'security' | 'settings'
  >('home');

  const sampleCommands = [
    'Ruby, call Amma',
    'Ruby, activate riding mode',
    'open vscode',
    'system status',
    'ரூபி, அம்மாக்கு கால் பண்ணு',
    'रूबी, राइडिंग मोड चालू करो',
    'open unknown_malware.exe',
  ];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    onExecuteCommand(cliInput.trim());
    setCliInput('');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'memory', label: 'Memory', icon: Lock },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'riding', label: 'Riding', icon: Bike },
    { id: 'automation', label: 'Automation', icon: Workflow },
    { id: 'system', label: 'System', icon: Server },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const orbState: OrbState = lastCommandResult?.intent === 'call_contact'
    ? 'calling'
    : lastCommandResult?.status === 'security_blocked'
    ? 'error'
    : 'idle';

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Telemetry Strip (Intel Core i5, 16GB RAM, Integrated Graphics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#111111] border border-[#222222] rounded-[18px]">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span className="font-semibold text-white">CPU Usage</span>
            <Cpu className="w-4 h-4 text-[#FF7900]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-num text-white">{telemetry.cpuUsagePct}%</span>
            <span className="text-[11px] text-[#A1A1AA] font-mono-num">Intel i5-1135G7</span>
          </div>
          <div className="w-full bg-[#1B1B1B] rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-[#FF7900] h-full rounded-full transition-all" style={{ width: `${telemetry.cpuUsagePct}%` }} />
          </div>
        </div>

        <div className="p-3 bg-[#111111] border border-[#222222] rounded-[18px]">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span className="font-semibold text-white">Memory (RAM)</span>
            <HardDrive className="w-4 h-4 text-[#FFC15A]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-num text-white">4.8 GB</span>
            <span className="text-[11px] text-[#A1A1AA] font-mono-num">/ 16.0 GB</span>
          </div>
          <div className="w-full bg-[#1B1B1B] rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-[#FFC15A] h-full rounded-full" style={{ width: '30%' }} />
          </div>
        </div>

        <div className="p-3 bg-[#111111] border border-[#222222] rounded-[18px]">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span className="font-semibold text-white">Native C VAD</span>
            <Activity className="w-4 h-4 text-[#35C98A]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-num text-white">0.4 ms</span>
            <span className="text-[11px] text-[#35C98A] font-mono-num">16kHz PCM</span>
          </div>
          <div className="text-[11px] text-[#A1A1AA] font-mono-num mt-1">C99 Audio Subsystem</div>
        </div>

        <div className="p-3 bg-[#111111] border border-[#222222] rounded-[18px]">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span className="font-semibold text-white">Ruby Brain Daemon</span>
            <Shield className="w-4 h-4 text-[#54A6FF]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-num text-white">:8443</span>
            <span className="text-[11px] text-[#54A6FF] font-mono-num">REST + WS</span>
          </div>
          <div className="text-[11px] text-[#A1A1AA] font-mono-num mt-1">HMAC-SHA256 Token</div>
        </div>
      </div>

      {/* Desktop Main Workspace with Left Sidebar Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Navigation Rail (11 Sections) */}
        <div className="md:col-span-3 p-3 bg-[#111111] border border-[#222222] rounded-[24px] space-y-1">
          <div className="px-3 py-2 text-[11px] font-mono-num text-[#A1A1AA] uppercase tracking-wider font-semibold border-b border-[#222222] mb-1">
            Windows Desktop Rail
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeWindowsView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveWindowsView(item.id)}
                className={`w-full px-3 py-2 rounded-[12px] text-xs font-medium flex items-center gap-2.5 transition ${
                  isActive
                    ? 'bg-[#FF7900] text-[#080808] font-bold shadow-[0_0_15px_rgba(255,121,0,0.3)]'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#1B1B1B]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center/Right Desktop Workspace */}
        <div className="md:col-span-9 space-y-4">
          {/* Main Desktop Console & 3D Orb Header */}
          <div className="p-4 bg-[#111111] border border-[#222222] rounded-[24px] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#FF7900]" />
                <span className="font-bold text-white text-xs font-mono-num">RUBY AI Windows 11 Controller</span>
                <span className="text-[#A1A1AA]">·</span>
                <span className="text-[#35C98A] text-xs font-mono-num">ONLINE</span>
              </div>
              <div className="text-[11px] text-[#A1A1AA] font-mono-num">
                Intel Core i5 • 16GB RAM • Win32 API
              </div>
            </div>

            {/* Centered 3D Procedural AI Orb in Desktop View */}
            <div className="py-2 flex items-center justify-center">
              <RubyAIOrb state={orbState} size="sm" statusLabel="RUBY AI Central Brain (Ruby 3.2 + C)" />
            </div>

            {/* Quick Query Suggestions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-semibold text-[#A1A1AA] shrink-0">Try Query:</span>
              {sampleCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => onExecuteCommand(cmd)}
                  className="px-2.5 py-1 bg-[#1B1B1B] hover:bg-[#252525] text-[#A1A1AA] hover:text-white rounded-[10px] border border-[#2A2A2A] text-xs whitespace-nowrap transition"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Command Execution Log */}
            <div className="p-3.5 bg-[#080808] border border-[#222222] rounded-[16px] font-mono-num text-xs space-y-2 min-h-[110px]">
              <div className="text-[#A1A1AA] flex items-center justify-between">
                <span>// Last Evaluated Intent:</span>
                <span className="text-[11px] text-[#FF9D32] font-semibold uppercase">{lastCommandResult?.intent || 'IDLE'}</span>
              </div>

              {lastCommandResult ? (
                <div className="space-y-1.5 pt-1 text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="text-[#FF7900] font-bold">&gt;</span>
                    <div>
                      <span className="text-[#A1A1AA]">Speech Output:</span>
                      <p className="text-white font-medium">{lastCommandResult.speech}</p>
                    </div>
                  </div>

                  {lastCommandResult.action && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-[#A1A1AA]">Action Dispatched:</span>
                      <span className={`px-2 py-0.5 rounded font-mono-num ${
                        lastCommandResult.status === 'security_blocked'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {lastCommandResult.action}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[#A1A1AA] py-4 text-center italic">
                  Awaiting voice or CLI instruction...
                </div>
              )}
            </div>

            {/* Command Input Form */}
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF7900] font-mono-num font-bold">&gt;</span>
                <input
                  type="text"
                  placeholder="Enter command in English, தமிழ், or हिंदी..."
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  className="w-full bg-[#080808] border border-[#222222] rounded-[14px] pl-8 pr-4 py-2.5 text-xs text-white placeholder-[#A1A1AA] outline-none focus:border-[#FF7900] font-mono-num"
                />
              </div>
              <RubyPrimaryButton type="submit" icon={Send}>
                Execute
              </RubyPrimaryButton>
            </form>
          </div>

          {/* DAG Task Planner & Allowlist Execution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DAG Task Planner */}
            <div className="p-4 bg-[#111111] border border-[#222222] rounded-[24px] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Layers className="w-4 h-4 text-[#FF7900]" />
                  <span>DAG Task Planner Engine</span>
                </div>
                <span className="text-[10px] font-mono-num text-[#A1A1AA]">planner.rb</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#1B1B1B] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#35C98A] shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Step 1: Resolve Intent & Aliases</div>
                      <div className="text-[10px] text-[#A1A1AA]">Query AES-256 encrypted contacts cache</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-num text-[#35C98A]">VERIFIED</span>
                </div>

                <div className="p-2.5 bg-[#1B1B1B] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#35C98A] shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Step 2: Pre-Execution Safety Check</div>
                      <div className="text-[10px] text-[#A1A1AA]">Verify allowlist & confirmation flags</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-num text-[#35C98A]">PASSED</span>
                </div>

                <div className="p-2.5 bg-[#1B1B1B] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#35C98A] shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Step 3: Dispatch IPC to Android / SIM</div>
                      <div className="text-[10px] text-[#A1A1AA]">Mutual TLS WebSocket connection (:8443)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-num text-[#FF9D32]">READY</span>
                </div>
              </div>
            </div>

            {/* Windows Allowlisted Application Launcher */}
            <div className="p-4 bg-[#111111] border border-[#222222] rounded-[24px] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Shield className="w-4 h-4 text-[#54A6FF]" />
                  <span>Windows Execution Allowlist</span>
                </div>
                <span className="text-[10px] font-mono-num text-[#A1A1AA]">security.rb</span>
              </div>

              <p className="text-[11px] text-[#A1A1AA]">
                Arbitrary terminal injection is blocked. Only verified applications can be launched:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'VS Code', key: 'code', path: 'Code.exe' },
                  { name: 'Windows Notepad', key: 'notepad', path: 'notepad.exe' },
                  { name: 'Command Terminal', key: 'terminal', path: 'cmd.exe' },
                  { name: 'File Explorer', key: 'explorer', path: 'explorer.exe' },
                ].map((app, i) => (
                  <button
                    key={i}
                    onClick={() => onExecuteCommand(`open ${app.key}`)}
                    className="p-2.5 bg-[#1B1B1B] hover:bg-[#252525] border border-[#2A2A2A] rounded-[14px] text-left flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-semibold text-white">{app.name}</div>
                      <div className="text-[10px] font-mono-num text-[#A1A1AA]">{app.path}</div>
                    </div>
                    <Play className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Activity Audit Log Stream */}
      <div className="p-4 bg-[#111111] border border-[#222222] rounded-[24px] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Shield className="w-4 h-4 text-[#35C98A]" />
            <span>Audit Trail & Cryptographic Security Log</span>
          </div>
          <span className="text-[10px] font-mono-num text-[#A1A1AA]">HMAC-SHA256 Signed</span>
        </div>

        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 bg-[#080808] border border-[#222222] rounded-[12px] flex items-center justify-between text-xs font-mono-num"
            >
              <div className="flex items-center gap-2">
                {log.severity === 'ALERT' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#FF4545] shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#35C98A] shrink-0" />
                )}
                <span className="text-white">{log.description}</span>
              </div>
              <span className="text-[10px] text-[#A1A1AA] shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
