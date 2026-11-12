import { Contact, RubyLanguage, SystemTelemetry } from '../types/ruby';

export interface BrainResult {
  status: 'success' | 'security_blocked' | 'not_found' | 'conversational';
  intent: string;
  language: RubyLanguage;
  speech: string;
  action?: string;
  payload?: any;
}

export interface CallRecord {
  id: string;
  callerName: string;
  callerNumber: string;
  type: 'INCOMING' | 'OUTGOING' | 'MISSED' | 'AI_SCREENED';
  timestamp: string;
  durationSeconds: number;
  carrier: string;
  summaryNote?: string;
  urgency: 'HIGH' | 'NORMAL' | 'SPAM';
  actionTaken?: string;
}

export interface CallLogSummary {
  title: string;
  conversationalSummary: string;
  keyTakeaways: {
    icon: string;
    contact: string;
    detail: string;
    tag: string;
    tagType: 'success' | 'warning' | 'alert' | 'info';
  }[];
  stats: {
    totalCalls: number;
    screenedCalls: number;
    spamBlocked: number;
    totalDurationFormatted: string;
  };
  lastUpdated: string;
}

export class RubyBrainSimulator {
  private contacts: Contact[] = [
    {
      id: 'c-001',
      name: 'Amma',
      phone: '+91 98450 11223',
      aliases: ['Mom', 'Maa', 'அம்மா', 'माँ'],
      relationship: 'Mother',
      isEmergency: true,
      ridingBypass: true,
    },
    {
      id: 'c-002',
      name: 'Appa',
      phone: '+91 98450 22334',
      aliases: ['Dad', 'அப்பா', 'पापा'],
      relationship: 'Father',
      isEmergency: true,
      ridingBypass: true,
    },
    {
      id: 'c-003',
      name: 'Rohan (Teammate)',
      phone: '+91 98765 43210',
      aliases: ['Project teammate', 'College friend', 'Rohan', 'நண்பன்', 'दोस्त'],
      relationship: 'Colleague',
      isEmergency: false,
      ridingBypass: false,
    },
    {
      id: 'c-004',
      name: 'Dr. Ramesh Kumar',
      phone: '+91 98111 22334',
      aliases: ['Doctor', 'Clinic', 'மருத்துவர்'],
      relationship: 'Physician',
      isEmergency: true,
      ridingBypass: true,
    },
  ];

  private callRecords: CallRecord[] = [
    {
      id: 'call-rec-1',
      callerName: 'Amma',
      callerNumber: '+91 98450 11223',
      type: 'OUTGOING',
      timestamp: '10:15 AM',
      durationSeconds: 165,
      carrier: 'Airtel India SIM 1',
      summaryNote: 'Confirmed weekend dinner plans and train arrival time at Bangalore station.',
      urgency: 'HIGH',
      actionTaken: 'Completed via VoLTE (Airtel SIM 1)',
    },
    {
      id: 'call-rec-2',
      callerName: 'Rohan (Teammate)',
      callerNumber: '+91 98765 43210',
      type: 'AI_SCREENED',
      timestamp: '09:42 AM',
      durationSeconds: 72,
      carrier: 'Airtel India SIM 1',
      summaryNote: 'AI screening engaged with formal disclosure: Rohan requested code review on Android InCallService PR before 3 PM.',
      urgency: 'NORMAL',
      actionTaken: 'Transcript saved to inbox & SMS acknowledgment sent',
    },
    {
      id: 'call-rec-3',
      callerName: 'Dr. Ramesh Kumar',
      callerNumber: '+91 98111 22334',
      type: 'INCOMING',
      timestamp: '09:18 AM',
      durationSeconds: 54,
      carrier: 'Airtel India SIM 1',
      summaryNote: 'Clinic receptionist notified that annual health checkup lab reports are ready for pickup.',
      urgency: 'HIGH',
      actionTaken: 'Emergency whitelist bypass allowed ringthrough',
    },
    {
      id: 'call-rec-4',
      callerName: 'HDFC Card Promotion',
      callerNumber: '+91 14099 88771',
      type: 'MISSED',
      timestamp: '08:50 AM',
      durationSeconds: 0,
      carrier: 'Airtel India SIM 1',
      summaryNote: 'Carrier spam pattern detected by CallScreeningService. Handset did not vibrate or ring.',
      urgency: 'SPAM',
      actionTaken: 'Auto-blocked silently by CallScreeningService',
    },
    {
      id: 'call-rec-5',
      callerName: 'Appa',
      callerNumber: '+91 98450 22334',
      type: 'MISSED',
      timestamp: '08:15 AM',
      durationSeconds: 0,
      carrier: 'Airtel India SIM 1',
      summaryNote: 'Call arrived while Motorcycle Riding Mode was active. Auto-SMS sent: "Sudeendra is riding. Will call back soon."',
      urgency: 'HIGH',
      actionTaken: 'Riding Mode automated SMS dispatched',
    },
  ];

  private allowedWindowsApps = ['code', 'vscode', 'notepad', 'explorer', 'terminal', 'chrome', 'edge'];

  public detectLanguage(text: string): RubyLanguage {
    if (!text) return 'en';
    // Tamil Unicode block: \u0B80-\u0BFF
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    // Devanagari / Hindi Unicode block: \u0900-\u097F
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    // Tanglish heuristics
    if (/\b(pannu|kodu|vaanga|sollu|amma|appa|nanba|call pannu)\b/i.test(text)) return 'ta';
    // Hinglish heuristics
    if (/\b(karo|batao|kholo|bhai|yaar|dost|kaise|call karo)\b/i.test(text)) return 'hi';
    return 'en';
  }

  public getContacts(): Contact[] {
    return this.contacts;
  }

  public addContact(contact: Contact) {
    this.contacts.push(contact);
  }

  public deleteContact(id: string) {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }

  public findContact(query: string): Contact | undefined {
    const q = query.toLowerCase().trim();
    return this.contacts.find(
      c => c.name.toLowerCase() === q || c.aliases.some(a => a.toLowerCase() === q)
    );
  }

  public getCallRecords(): CallRecord[] {
    return this.callRecords;
  }

  public addCallRecord(record: CallRecord) {
    this.callRecords.unshift(record);
  }

  public generateCallLogSummary(language: RubyLanguage = 'en'): CallLogSummary {
    const totalCalls = this.callRecords.length;
    const screenedCalls = this.callRecords.filter(c => c.type === 'AI_SCREENED').length;
    const spamBlocked = this.callRecords.filter(c => c.urgency === 'SPAM').length;
    const totalSeconds = this.callRecords.reduce((acc, c) => acc + c.durationSeconds, 0);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const totalDurationFormatted = `${mins}m ${secs}s`;

    // Multilingual Conversational Summaries
    let title = 'Telephony Call Log Summary';
    let conversationalSummary = '';

    if (language === 'ta') {
      title = 'அழைப்பு சுருக்கம் மற்றும் நிலை விவரம்';
      conversationalSummary = `வணக்கம் சுதீந்திரா! இன்று ஏர்டெல் சிம்மில் மொத்தம் ${totalCalls} அழைப்புகள் பதிவாகியுள்ளன. ${spamBlocked} ஸ்பேம் அழைப்பை நமது சிஸ்டம் தானாகவே தடுத்துவிட்டது. ரோகன் ஆண்ட்ராய்டு பிஆர் குறித்து தகவல் அனுப்பியுள்ளார், அம்மாவின் அழைப்பும் வெற்றிகரமாக முடிந்தது. டாக்டர் ரமேஷ் அறிக்கையும் தயார் நிலையில் உள்ளது. நீங்கள் உடனடி கவனத்திற்கு எடுக்க வேண்டிய சிக்கலான அழைப்புகள் எதுவும் நிலுவையில் இல்லை.`;
    } else if (language === 'hi') {
      title = 'कॉल सारांश एवं टेलीफोनी ब्रीफिंग';
      conversationalSummary = `नमस्ते सुधींद्र! आज आपके एयरटेल सिम पर कुल ${totalCalls} कॉल आए। ${spamBlocked} अनचाहे स्पैम कॉल को तुरंत ब्लॉक कर दिया गया, रोहन ने एंड्रॉयड पीआर के बारे में संदेश छोड़ा है जो इनबॉक्स में सुरक्षित है, और अम्मा से आपकी बात पूरी हो चुकी है। डॉक्टर रमेश की रिपोर्ट भी क्लिनिक पर तैयार है। कोई भी जरूरी काम लंबित नहीं है।`;
    } else {
      title = 'Telephony Call Log Summary';
      conversationalSummary = `Hi Sudeendra, here is your carrier call recap for today on Airtel SIM 1. You had ${totalCalls} total calls. ${spamBlocked} spam telemarketer was silently filtered without ringing, and Rohan's project update was handled by your AI screening assistant. Your call with Amma lasted ${totalDurationFormatted}, and Dr. Ramesh confirmed your health report is ready at the clinic. Everything critical is up to date.`;
    }

    const keyTakeaways = this.callRecords.slice(0, 4).map(c => {
      let tagType: 'success' | 'warning' | 'alert' | 'info' = 'info';
      let tag = c.type as string;
      let icon = 'phone';

      if (c.urgency === 'SPAM') {
        tagType = 'alert';
        tag = 'SPAM BLOCKED';
        icon = 'shield-alert';
      } else if (c.type === 'AI_SCREENED') {
        tagType = 'warning';
        tag = 'AI SCREENED';
        icon = 'bot';
      } else if (c.type === 'OUTGOING') {
        tagType = 'success';
        tag = 'VOICE CONNECTED';
        icon = 'phone-outgoing';
      } else if (c.type === 'MISSED' && c.urgency === 'HIGH') {
        tagType = 'info';
        tag = 'RIDING AUTO-SMS';
        icon = 'bike';
      }

      return {
        icon,
        contact: `${c.callerName} (${c.callerNumber})`,
        detail: c.summaryNote || c.actionTaken || '',
        tag,
        tagType,
      };
    });

    return {
      title,
      conversationalSummary,
      keyTakeaways,
      stats: {
        totalCalls,
        screenedCalls,
        spamBlocked,
        totalDurationFormatted,
      },
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  }

  public getTelemetry(): SystemTelemetry {
    return {
      cpuUsagePct: Math.floor(6 + Math.random() * 5),
      ramUsedMb: 4850,
      ramTotalMb: 16384,
      activeThreads: 14,
      uptimeSeconds: 3840,
      model: 'Intel Core i5-1135G7 @ 2.40GHz (Integrated Graphics)',
      os: 'Windows 11 Pro 64-bit',
    };
  }

  public processCommand(input: string, forcedLang?: RubyLanguage): BrainResult {
    const text = input.trim();
    const lang = forcedLang || this.detectLanguage(text);

    // 1. Call Contact Intent
    const callMatch = text.match(/(?:call|phone|ring|dial|கால்\s+பண்ணு|போன்\s+பண்ணு|कॉल\s+करो)\s*(?:my|to|என்|मेरे)?\s*([a-zA-Z\u0B80-\u0BFF\u0900-\u097F\s]+)/i);
    if (callMatch || /call|போன்|கால்|फोन|कॉल/i.test(text)) {
      const targetQuery = callMatch ? callMatch[1].trim() : 'Amma';
      const contact = this.findContact(targetQuery) || this.contacts[0];

      let speech = `Connecting call to ${contact.name} via Airtel India SIM.`;
      if (lang === 'ta') {
        speech = `சரிங்க, ${contact.name}-க்கு இப்போது ஏர்டெல் சிம் மூலம் போன் செய்கிறேன்.`;
      } else if (lang === 'hi') {
        speech = `जी, मैं अभी एयरटेल सिम से ${contact.name} को कॉल मिला रहा हूँ।`;
      }

      return {
        status: 'success',
        intent: 'call_contact',
        language: lang,
        speech,
        action: 'DIAL_SIM',
        payload: { contact },
      };
    }

    // 2. Riding Mode Activation
    if (/riding mode|bike mode|motorcycle|ரைடிங் மோட்|பைக்|राइडिंग मोड|बाइक/i.test(text)) {
      if (/off|stop|deactivate|exit|ஆப்|நிறுத்து|बंद|ऑफ/i.test(text)) {
        let speech = 'Riding mode deactivated. Returning to regular companion mode.';
        if (lang === 'ta') speech = 'ரைடிங் மோட் நிறுத்தப்பட்டது.';
        if (lang === 'hi') speech = 'राइडिंग मोड निष्क्रिय कर दिया गया है।';

        return {
          status: 'success',
          intent: 'deactivate_riding_mode',
          language: lang,
          speech,
          action: 'DISABLE_RIDING_HUD',
        };
      } else {
        let speech = 'Riding mode activated. High-contrast voice HUD ready. Ride safely.';
        if (lang === 'ta') speech = 'ரைடிங் மோட் இயக்கப்பட்டது. பாதுகாப்பாக வண்டி ஓட்டுங்கள்.';
        if (lang === 'hi') speech = 'राइडिंग मोड सक्रिय कर दिया गया है। कृपया सावधानी से बाइक चलाएं।';

        return {
          status: 'success',
          intent: 'activate_riding_mode',
          language: lang,
          speech,
          action: 'ENABLE_RIDING_HUD',
        };
      }
    }

    // 3. System Telemetry / Specs
    if (/system status|ram|cpu|specs|சிஸ்டம்|ரேம்|सिस्टम|रैम/i.test(text)) {
      const telemetry = this.getTelemetry();
      let speech = `System running optimally. CPU: ${telemetry.cpuUsagePct}%, RAM: 4.8 GB of 16 GB used.`;
      if (lang === 'ta') speech = `கணினி நிலை சீராக உள்ளது. ரேம் பயன்பாடு 4.8 GB / 16 GB, சிபியு: ${telemetry.cpuUsagePct}%.`;
      if (lang === 'hi') speech = `सिस्टम सामान्य चल रहा है। रैम उपयोग: 4.8 GB / 16 GB, सीपीयू: ${telemetry.cpuUsagePct}%.`;

      return {
        status: 'success',
        intent: 'check_system_status',
        language: lang,
        speech,
        action: 'DISPLAY_TELEMETRY',
        payload: telemetry,
      };
    }

    // 4. Open Application
    const openMatch = text.match(/(?:open|launch|திற|खोलो)\s+([a-zA-Z0-9_\-\s]+)/i);
    if (openMatch) {
      const appKey = openMatch[1].trim().toLowerCase();
      if (this.allowedWindowsApps.includes(appKey)) {
        let speech = `Opening ${appKey} on Windows 11.`;
        if (lang === 'ta') speech = `${appKey} செயலியை திறக்கிறேன்.`;
        if (lang === 'hi') speech = `${appKey} खोला जा रहा है।`;

        return {
          status: 'success',
          intent: 'open_application',
          language: lang,
          speech,
          action: 'LAUNCH_EXE',
          payload: { app: appKey },
        };
      } else {
        return {
          status: 'security_blocked',
          intent: 'open_application',
          language: lang,
          speech: `Application '${appKey}' is not in the authorized Windows execution allowlist.`,
          action: 'SECURITY_BLOCK',
        };
      }
    }

    // 5. Memory / Contacts
    if (/memory|contacts|நினைவகம்|मेमोरी|याद/i.test(text)) {
      let speech = `You have ${this.contacts.length} saved contacts with AES-256 local encryption.`;
      if (lang === 'ta') speech = `உங்களிடம் ${this.contacts.length} சேமிக்கப்பட்ட தொடர்புகள் உள்ளூர் பாதுகாப்பில் உள்ளன.`;
      if (lang === 'hi') speech = `आपकी एन्क्रिप्टेड स्थानीय मेमोरी में ${this.contacts.length} संपर्क सुरक्षित हैं।`;

      return {
        status: 'success',
        intent: 'show_memory',
        language: lang,
        speech,
        action: 'SHOW_MEMORY',
      };
    }

    // Default Conversational Fallback
    let speech = 'I am RUBY, your personal intelligence. Your voice, your control. How may I assist you?';
    if (lang === 'ta') {
      speech = 'வணக்கம்! நான் ரூபி, உங்கள் தனிப்பட்ட உதவியாளர். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?';
    } else if (lang === 'hi') {
      speech = 'नमस्ते! मैं रूबी हूँ, आपकी व्यक्तिगत बुद्धिमत्ता। मैं आपकी क्या सेवा कर सकती हूँ?';
    }

    return {
      status: 'conversational',
      intent: 'general_query',
      language: lang,
      speech,
    };
  }
}

export const brainSimulator = new RubyBrainSimulator();
