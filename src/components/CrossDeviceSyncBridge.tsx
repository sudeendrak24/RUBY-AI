import React from 'react';
import { Wifi, PhoneCall, Bike, Shield, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

interface CrossDeviceSyncBridgeProps {
  onSimulateIncomingCall: (name: string, phone: string) => void;
  isRidingModeActive: boolean;
  setIsRidingModeActive: (active: boolean) => void;
  connectedDevice: string;
}

export const CrossDeviceSyncBridge: React.FC<CrossDeviceSyncBridgeProps> = ({
  onSimulateIncomingCall,
  isRidingModeActive,
  setIsRidingModeActive,
  connectedDevice,
}) => {
  return (
    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono-num">
            Device Connectivity & Telephony Testbed
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono-num">
          <Wifi className="w-3.5 h-3.5" />
          <span>Local Wi-Fi TLS Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* SIM Carrier Simulator Card */}
        <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Airtel India SIM Slot 1</span>
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Simulate native carrier SIM incoming calls to verify Telecom InCallService & AI Screening:
          </p>
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => onSimulateIncomingCall('Amma', '+91 98450 11223')}
              className="py-1.5 px-2 bg-neutral-800 hover:bg-orange-500 hover:text-black rounded text-[11px] text-left transition font-medium"
            >
              📞 Call from Amma (Emergency Bypass)
            </button>
            <button
              onClick={() => onSimulateIncomingCall('Rohan (Teammate)', '+91 98765 43210')}
              className="py-1.5 px-2 bg-neutral-800 hover:bg-orange-500 hover:text-black rounded text-[11px] text-left transition font-medium"
            >
              📞 Call from Rohan (AI Screening & Msg)
            </button>
            <button
              onClick={() => onSimulateIncomingCall('Unknown Telemarketer', '+91 14092 38811')}
              className="py-1.5 px-2 bg-neutral-800 hover:bg-orange-500 hover:text-black rounded text-[11px] text-left transition font-medium text-rose-300"
            >
              📞 Unknown Number (Spam Block)
            </button>
          </div>
        </div>

        {/* Motorcycle Riding Mode Trigger */}
        <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Riding Mode Trigger</span>
            <Bike className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Simulate motorcycle ignition or Bluetooth helmet audio pairing:
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsRidingModeActive(!isRidingModeActive)}
              className={`w-full py-2 px-3 rounded-lg font-semibold text-[11px] transition flex items-center justify-center gap-1.5 ${
                isRidingModeActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-black'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>{isRidingModeActive ? 'Deactivate Riding Mode' : 'Activate Riding Mode'}</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-500 font-mono-num pt-1">
            Auto-SMS: "I am riding my motorcycle right now..."
          </div>
        </div>

        {/* Mutual Cryptographic Pairing */}
        <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Paired Companion Device</span>
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="space-y-1 text-[11px] font-mono-num text-slate-400">
            <div>Device: <strong className="text-white">{connectedDevice}</strong></div>
            <div>Auth: <span className="text-emerald-400">HMAC-SHA256 Token</span></div>
            <div>Latency: <span className="text-cyan-400">1.8 ms (Local Wi-Fi)</span></div>
          </div>
          <div className="pt-2 flex items-center gap-1 text-[10px] text-emerald-400">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>Zero Unauthenticated Endpoints</span>
          </div>
        </div>
      </div>
    </div>
  );
};
