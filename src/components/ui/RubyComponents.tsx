import React from 'react';
import { LucideIcon } from 'lucide-react';

// 1. RubyPrimaryButton
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const RubyPrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon: Icon,
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`px-4 py-2.5 bg-[#FF7900] hover:bg-[#FF9D32] text-[#080808] font-bold text-xs rounded-[14px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(255,121,0,0.25)] ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};

// 2. RubySecondaryButton
export const RubySecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon: Icon,
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`px-4 py-2.5 bg-[#1B1B1B] hover:bg-[#252525] border border-[#2A2A2A] text-white font-medium text-xs rounded-[14px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 text-[#FF9D32] shrink-0" />
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};

// 3. RubyIconButton
export const RubyIconButton: React.FC<{
  icon: LucideIcon;
  onClick?: () => void;
  title?: string;
  variant?: 'primary' | 'surface' | 'danger';
  active?: boolean;
  className?: string;
}> = ({ icon: Icon, onClick, title, variant = 'surface', active, className = '' }) => {
  const variantClass = {
    primary: active ? 'bg-[#FF7900] text-[#080808]' : 'bg-[#1B1B1B] text-[#FF7900] hover:bg-[#282828]',
    surface: active ? 'bg-[#FF7900]/20 text-[#FF7900] border border-[#FF7900]/40' : 'bg-[#111111] text-[#A1A1AA] hover:text-white border border-[#222222]',
    danger: 'bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/50',
  }[variant];

  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all active:scale-95 ${variantClass} ${className}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

// 4. RubyCard
export const RubyCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 bg-[#111111] border border-[#222222] rounded-[18px] transition-all ${
        onClick ? 'cursor-pointer hover:border-[#FF7900]/40' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 5. RubyGlassPanel
export const RubyGlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 bg-[#1B1B1B]/90 border border-[#2A2A2A] rounded-[24px] ${className}`}>
      {children}
    </div>
  );
};

// 6. RubyStatusIndicator
export const RubyStatusIndicator: React.FC<{
  label: string;
  status: 'online' | 'busy' | 'offline' | 'warning';
  subLabel?: string;
}> = ({ label, status, subLabel }) => {
  const statusColor = {
    online: 'text-[#35C98A]',
    busy: 'text-[#FF9D32]',
    offline: 'text-[#A1A1AA]',
    warning: 'text-[#FF4545]',
  }[status];

  return (
    <div className="flex items-center gap-2 text-xs font-mono-num">
      <span className={`w-2 h-2 rounded-full ${statusColor} bg-current`} />
      <span className="text-white font-medium">{label}</span>
      {subLabel && <span className="text-[#A1A1AA] text-[11px]">· {subLabel}</span>}
    </div>
  );
};

// 7. RubyVoiceVisualizer
export const RubyVoiceVisualizer: React.FC<{
  isActive: boolean;
  frequencyData?: number[];
}> = ({ isActive }) => {
  const bars = [35, 65, 90, 50, 75, 40, 85, 60, 30];

  return (
    <div className="flex items-center justify-center gap-1 h-8 px-3">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            isActive ? 'bg-[#FF7900]' : 'bg-[#2A2A2A]'
          }`}
          style={{
            height: isActive ? `${h}%` : '20%',
            animation: isActive ? `waveOscillate ${0.3 + (i * 0.08)}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
};

// 8. RubyMessageBubble
export const RubyMessageBubble: React.FC<{
  sender: 'user' | 'ruby';
  text: string;
  timestamp?: string;
  onReplay?: () => void;
}> = ({ sender, text, timestamp, onReplay }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-[16px] text-xs leading-relaxed ${
          isUser
            ? 'bg-[#1B1B1B] text-white rounded-tr-none border border-[#2A2A2A]'
            : 'bg-[#111111] text-[#FFFFFF] border border-[#FF7900]/30 rounded-tl-none shadow-[0_0_15px_rgba(255,121,0,0.1)]'
        }`}
      >
        <p>{text}</p>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-[#A1A1AA] font-mono-num px-1">
        {timestamp && <span>{timestamp}</span>}
        {!isUser && onReplay && (
          <button onClick={onReplay} className="text-[#FF9D32] hover:underline">
            Replay
          </button>
        )}
      </div>
    </div>
  );
};

// 9. RubyCallActionButton
export const RubyCallActionButton: React.FC<{
  type: 'answer' | 'reject' | 'delegate';
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}> = ({ type, label, icon: Icon, onClick }) => {
  const typeStyle = {
    answer: 'bg-[#35C98A] hover:bg-[#2eb37a] text-black font-bold',
    reject: 'bg-[#FF4545] hover:bg-[#e63e3e] text-white font-bold',
    delegate: 'bg-[#FF7900] hover:bg-[#FF9D32] text-black font-bold shadow-[0_0_20px_rgba(255,121,0,0.4)]',
  }[type];

  return (
    <button
      onClick={onClick}
      className={`w-full py-3.5 px-4 rounded-[14px] flex items-center justify-center gap-2.5 text-xs transition-all active:scale-[0.98] ${typeStyle}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};
