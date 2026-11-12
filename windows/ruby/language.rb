# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Multilingual Natural Language & Intent Engine
# Supports English, Tamil (தமிழ்), Hindi (हिंदी), and colloquial Tanglish/Hinglish.
# Zero Python. Zero mandatory cloud APIs. Local-first deterministic NLP.
# ==============================================================================

module RubyAI
  class LanguageEngine
    SUPPORTED_LANGUAGES = %i[en ta hi].freeze

    INTENTS = {
      call_contact: {
        en: [/\b(call|phone|ring|dial)\s+([a-zA-Z\s]+)/i, /\bcall\s+(my\s+)?([a-zA-Z]+)/i],
        ta: [/(?:என்\s+)?([^\s]+)(?:க்கு|கிட்ட|க்கு)\s+(?:போன்|கால்)\s+(?:பண்ணு|போடு)/u, /கால்\s+பண்ணு/u],
        hi: [/(?:मेरे\s+)?([^\s]+)(?:\s+को)?\s+(?:फोन|कॉल)\s+(?:करो|लगाओ)/u, /कॉल\s+करो/u]
      },
      activate_riding_mode: {
        en: [/\b(activate|start|turn on|enable)\s+(riding|bike|motorcycle)\s+mode/i, /\briding mode\b/i],
        ta: [/ரைடிங்\s+(?:மோட்|முறை)\s+(?:ஆன்\s+பண்ணு|துவங்கு|செயல்படுத்து)/u, /பைக்\s+மோட்/u],
        hi: [/राइडिंग\s+(?:मोड|तरीका)\s+(?:चालू|शुरू|ऑन)\s+करो/u, /बाइक\s+मोड/u]
      },
      deactivate_riding_mode: {
        en: [/\b(deactivate|stop|turn off|disable|exit)\s+riding\s+mode/i],
        ta: [/ரைடிங்\s+மோட்\s+(?:ஆப்|நிறுத்து|முடக்கு)/u],
        hi: [/राइडिंग\s+मोड\s+(?:बंद|ऑफ)\s+करो/u]
      },
      check_system_status: {
        en: [/\b(system\s+status|ram\s+usage|cpu\s+usage|system\s+ram|specs)\b/i],
        ta: [/சிஸ்டம்\s+(?:நிலை|ரேம்|சிபியு|விவரம்)/u, /ரேம்\s+எவ்வளவு/u],
        hi: [/सिस्टम\s+(?:स्थिति|रैम|सीपीयू|हाल)/u, /रैम\s+कितना\s+है/u]
      },
      open_application: {
        en: [/\bopen\s+([a-zA-Z0-9_\-\s]+)/i, /\blaunch\s+([a-zA-Z0-9_\-\s]+)/i],
        ta: [/([a-zA-Z0-9_\-]+)\s+(?:திற|ஓபன்\s+பண்ணு)/u],
        hi: [/([a-zA-Z0-9_\-]+)\s+(?:खोलो|ओपन\s+करो)/u]
      },
      show_memory: {
        en: [/\b(show|what is in my|read)\s+memory\b/i, /\blist\s+contacts\b/i],
        ta: [/மெமரி\s+(?:காட்டு|பார்)/u, /நினைவகத்தை\s+காட்டு/u],
        hi: [/मेमोरी\s+(?:दिखाओ|बताओ)/u, /याददाश्त\s+दिखाओ/u]
      }
    }.freeze

    def initialize(default_language = :en)
      @default_language = default_language
    end

    # Detect language from script or colloquial keywords
    def detect_language(text)
      return @default_language if text.nil? || text.strip.empty?

      # Tamil Unicode Block: U+0B80 to U+0BFF
      return :ta if text =~ /[\u0B80-\u0BFF]/

      # Devanagari / Hindi Unicode Block: U+0900 to U+097F
      return :hi if text =~ /[\u0900-\u097F]/

      # Colloquial Tanglish heuristic
      return :ta if text =~ /\b(pannu|kodu|vaanga|sollu|amma|appa|nanba)\b/i

      # Colloquial Hinglish heuristic
      return :hi if text =~ /\b(karo|batao|kholo|bhai|yaar|dost|kaise)\b/i

      :en
    end

    # Classifies user query into intent and extracts parameters
    def classify(input_text)
      clean_text = input_text.to_s.strip
      lang = detect_language(clean_text)

      INTENTS.each do |intent, patterns_by_lang|
        patterns = patterns_by_lang[lang] || []
        patterns.each do |regex|
          if (match = clean_text.match(regex))
            target = match.captures.last&.strip
            return {
              intent: intent,
              language: lang,
              parameter: target,
              confidence: 0.95,
              raw_text: clean_text
            }
          end
        end
      end

      # Fallback to conversational or unknown intent
      {
        intent: :general_query,
        language: lang,
        parameter: clean_text,
        confidence: 0.50,
        raw_text: clean_text
      }
    end

    # Generate localized, polite natural voice responses
    def generate_response(intent, params = {}, language = :en)
      case intent
      when :call_contact
        contact = params[:contact] || "friend"
        case language
        when :ta
          "சரிங்க, #{contact}-க்கு இப்போது போன் செய்கிறேன்."
        when :hi
          "जी, मैं अभी #{contact} को कॉल मिला रहा हूँ।"
        else
          "Connecting call to #{contact} through native SIM."
        end

      when :activate_riding_mode
        case language
        when :ta
          "ரைடிங் மோட் இயக்கப்பட்டது. பாதுகாப்பாக வண்டி ஓட்டுங்கள்."
        when :hi
          "राइडिंग मोड सक्रिय कर दिया गया है। कृपया सावधानी से गाड़ी चलाएं।"
        else
          "Riding mode activated. Distraction-free voice HUD is ready. Ride safely."
        end

      when :deactivate_riding_mode
        case language
        when :ta
          "ரைடிங் மோட் நிறுத்தப்பட்டது."
        when :hi
          "राइडिंग मोड निष्क्रिय कर दिया गया है।"
        else
          "Riding mode deactivated. Returning to standard companion mode."
        end

      when :check_system_status
        ram = params[:ram_used] || "4.2 GB / 16 GB"
        cpu = params[:cpu_pct] || "8%"
        case language
        when :ta
          "கணினி நிலை சீராக உள்ளது. ரேம் பயன்பாடு: #{ram}, சிபியு: #{cpu}."
        when :hi
          "सिस्टम सामान्य चल रहा है। रैम उपयोग: #{ram}, सीपीयू: #{cpu}."
        else
          "System running optimally. CPU: #{cpu}, RAM in use: #{ram}."
        end

      when :open_application
        app = params[:app] || "Application"
        case language
        when :ta
          "#{app} செயலியை திறக்கிறேன்."
        when :hi
          "#{app} खोला जा रहा है।"
        else
          "Opening #{app} on Windows."
        end

      else
        case language
        when :ta
          "வணக்கம்! நான் ரூபி, உங்கள் தனிப்பட்ட உதவியாளர். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
        when :hi
          "नमस्ते! मैं रूबी हूँ, आपकी व्यक्तिगत बुद्धिमत्ता। मैं आपकी क्या मदद कर सकती हूँ?"
        else
          "I am RUBY, your personal intelligence. How may I assist you today?"
        end
      end
    end
  end
end
