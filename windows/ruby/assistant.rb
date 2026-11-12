# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Windows Assistant Core & Action Engine
# Executes allowlisted local tasks, interacts with C subsystem, manages conversation.
# ==============================================================================

require_relative 'language'
require_relative 'memory'
require_relative 'planner'
require_relative 'telephony'
require_relative 'security'

module RubyAI
  class Assistant
    attr_reader :language_engine, :memory_engine, :security_engine, :telephony_engine, :planner

    def initialize
      @language_engine = LanguageEngine.new(:en)
      @memory_engine = MemoryEngine.new
      @security_engine = SecurityEngine.new
      @telephony_engine = TelephonyEngine.new(@memory_engine, @language_engine)
      @planner = TaskPlanner.new(@security_engine, self)
    end

    # High-level entry point to process a voice or text command
    def process_command(input_text, source_device = "WINDOWS_LOCAL")
      classification = @language_engine.classify(input_text)
      lang = classification[:language]

      case classification[:intent]
      when :call_contact
        contact = @memory_engine.find_contact(classification[:parameter])
        if contact
          speech = @language_engine.generate_response(:call_contact, { contact: contact[:name] }, lang)
          @memory_engine.log_audit("Initiated call to #{contact[:name]} (#{contact[:phone]}) via #{source_device}")
          {
            status: :success,
            intent: :call_contact,
            speech: speech,
            action: "DIAL_SIM",
            payload: { contact_name: contact[:name], phone: contact[:phone] }
          }
        else
          {
            status: :not_found,
            intent: :call_contact,
            speech: "Could not find #{classification[:parameter]} in your verified contacts.",
            action: "NONE"
          }
        end

      when :activate_riding_mode
        @memory_engine.update_preference(:riding_mode_call_policy, "AI_ASSISTANT")
        speech = @language_engine.generate_response(:activate_riding_mode, {}, lang)
        {
          status: :success,
          intent: :activate_riding_mode,
          speech: speech,
          action: "ENABLE_RIDING_HUD"
        }

      when :deactivate_riding_mode
        @memory_engine.update_preference(:riding_mode_call_policy, "NORMAL")
        speech = @language_engine.generate_response(:deactivate_riding_mode, {}, lang)
        {
          status: :success,
          intent: :deactivate_riding_mode,
          speech: speech,
          action: "DISABLE_RIDING_HUD"
        }

      when :check_system_status
        telemetry = query_system_telemetry
        speech = @language_engine.generate_response(:check_system_status, telemetry, lang)
        {
          status: :success,
          intent: :check_system_status,
          speech: speech,
          payload: telemetry
        }

      when :open_application
        app_name = classification[:parameter].to_s.downcase.strip
        if @security_engine.allowlisted_app?(app_name)
          path = @security_engine.resolve_app_path(app_name)
          speech = @language_engine.generate_response(:open_application, { app: app_name }, lang)
          @memory_engine.log_audit("Launched application: #{app_name}")
          {
            status: :success,
            intent: :open_application,
            speech: speech,
            action: "LAUNCH_EXE",
            payload: { app: app_name, path: path }
          }
        else
          {
            status: :security_blocked,
            intent: :open_application,
            speech: "Application '#{app_name}' is not in the authorized Windows allowlist.",
            action: "SECURITY_BLOCK"
          }
        end

      else
        speech = @language_engine.generate_response(:general_query, {}, lang)
        {
          status: :conversational,
          intent: :general_query,
          speech: speech
        }
      end
    end

    def query_system_telemetry
      # In production, calls ruby_get_system_telemetry from C DLL
      # Providing calibrated values for Intel Core i5 / 16 GB RAM baseline:
      {
        cpu_pct: "6%",
        ram_used: "4.8 GB / 16.0 GB",
        ram_free: "11.2 GB",
        threads: 14,
        os: "Windows 11 Pro 64-bit",
        device: "Intel Core i5-1135G7 @ 2.40GHz"
      }
    end

    # Step executor for DAG task planner
    def execute_step(action_type, payload, _previous_results)
      case action_type
      when :lookup_contact
        contact = @memory_engine.find_contact(payload[:query])
        contact ? { success: true, contact: contact } : { success: false, error: "Contact not found" }
      when :check_riding_policy
        policy = @memory_engine.data.dig(:preferences, :riding_mode_call_policy)
        { success: true, policy: policy }
      when :initiate_sim_call
        { success: true, dispatched: true }
      when :query_system_telemetry
        { success: true, telemetry: query_system_telemetry }
      when :verify_app_allowlist
        allowed = @security_engine.allowlisted_app?(payload[:app])
        allowed ? { success: true } : { success: false, error: "App not in allowlist" }
      when :launch_process
        { success: true, launched: payload[:app] }
      else
        { success: true }
      end
    end
  end
end
