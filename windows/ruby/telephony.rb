# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Telephony & AI Call Assistant Module
# Coordinates Airtel India SIM incoming screening, AI call answering,
# caller disclosure, and message transcription inbox.
# ==============================================================================

module RubyAI
  class TelephonyEngine
    attr_reader :call_history, :active_calls

    def initialize(memory_engine, language_engine)
      @memory_engine = memory_engine
      @language_engine = language_engine
      @call_history = []
      @active_calls = {}
    end

    # Evaluates incoming carrier call against user policies
    def screen_incoming_call(caller_number, caller_name = nil, carrier = "Airtel India")
      contact = @memory_engine.find_contact(caller_name || caller_number)
      is_emergency = contact ? contact[:emergency] : false
      riding_mode = @memory_engine.data.dig(:preferences, :riding_mode_call_policy) || "NORMAL"

      decision = if is_emergency
                   :ALLOW_IMMEDIATE_RING
                 elsif riding_mode == "EMERGENCY_ONLY"
                   :SEND_RIDING_SMS_REJECT
                 elsif @memory_engine.data.dig(:preferences, :call_assistant_enabled)
                   :DELEGATE_TO_AI_ASSISTANT
                 else
                   :RING_NORMAL
                 end

      {
        caller_number: caller_number,
        caller_name: contact ? contact[:name] : (caller_name || "Unknown Caller"),
        carrier: carrier,
        is_contact: !contact.nil?,
        is_emergency: is_emergency,
        policy_decision: decision
      }
    end

    # Generates conversational script for the AI answering workflow
    def generate_answering_script(step, caller_input = "", language = :en)
      case step
      when :greeting
        case language
        when :ta
          "வணக்கம்! நான் ரூபி, சுதீந்திராவின் செயற்கை நுண்ணறிவு உதவியாளர். அவர் தற்போது பேச இயலாத நிலையில் உள்ளார். நீங்கள் யார் என்று தெரிந்து கொள்ளலாமா?"
        when :hi
          "नमस्ते! मैं रूबी हूँ, सुधींद्र की एआई सहायक। वे इस समय उपलब्ध नहीं हैं। क्या मैं जान सकती हूँ कि आप कौन बोल रहे हैं?"
        else
          "Hello! I am RUBY, Sudeendra's AI assistant. He is currently unavailable. May I know who is calling and what this call is regarding?"
        end

      when :ask_for_message
        case language
        when :ta
          "நன்றி. நீங்கள் அவருக்கு ஏதேனும் செய்தி விட்டுச் செல்ல விரும்புகிறீர்களா?"
        when :hi
          "धन्यवाद। क्या आप उनके लिए कोई संदेश छोड़ना चाहेंगे?"
        else
          "Thank you. Would you like to leave a message for him?"
        end

      when :farewell
        case language
        when :ta
          "உங்கள் செய்தி பத்திரமாக பதிவு செய்யப்பட்டுள்ளது. அவர் வந்தவுடன் தெரிவிக்கிறேன். நன்றி, நல்ல நாளாக அமையட்டும்!"
        when :hi
          "आपका संदेश सहेज लिया गया है। मैं उन्हें जल्द ही सूचित कर दूंगी। धन्यवाद, आपका दिन शुभ हो!"
        else
          "Your message has been saved locally. I will notify him as soon as he is available. Thank you, have a great day!"
        end
      end
    end

    # Records call event into history log
    def record_call_event(event_data)
      event = event_data.merge(
        id: "call-#{Time.now.to_i}-#{rand(100..999)}",
        timestamp: Time.now.utc.iso8601
      )
      @call_history.unshift(event)
      @call_history = @call_history.first(100) # Keep 100 recent calls
      event
    end
  end
end
