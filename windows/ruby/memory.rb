# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Local-First Encrypted Personal Memory Subsystem
# AES-256-GCM encrypted persistence for contacts, aliases, preferences, and routines.
# Strict data boundary: Zero transmission to third-party ad networks or unapproved servers.
# ==============================================================================

require 'json'
require 'openssl'
require 'fileutils'
require 'securerandom'

module RubyAI
  class MemoryEngine
    CIPHER_ALGO = 'aes-256-gcm'

    attr_reader :store_path, :data

    def initialize(store_path = nil, master_key = nil)
      @store_path = store_path || File.expand_path('../../config/ruby_memory.enc', __FILE__)
      @master_key = master_key || default_key
      @data = {
        user_profile: {
          name: "Sudeendra",
          default_language: :en,
          wake_word: "Hey Ruby"
        },
        contacts: [
          { id: "c-001", name: "Amma", aliases: ["Mom", "Maa", "அம்மா"], phone: "+91 98450 11223", emergency: true, riding_bypass: true },
          { id: "c-002", name: "Appa", aliases: ["Dad", "அப்பா", "पापा"], phone: "+91 98450 22334", emergency: true, riding_bypass: true },
          { id: "c-003", name: "Project Lead", aliases: ["Manager", "Colleague"], phone: "+91 98765 43210", emergency: false, riding_bypass: false }
        ],
        preferences: {
          call_assistant_enabled: true,
          riding_mode_call_policy: "AI_ASSISTANT",
          auto_sms_template: "I am riding my motorcycle right now. RUBY AI has received your call and will notify me once I arrive safely.",
          ai_disclosure: true
        },
        audit_logs: []
      }
      load_memory
    end

    def find_contact(query)
      q = query.to_s.downcase.strip
      @data[:contacts].find do |c|
        c[:name].downcase == q || (c[:aliases] && c[:aliases].any? { |a| a.downcase == q })
      end
    end

    def add_contact(name, phone, aliases = [], emergency = false)
      id = "c-#{SecureRandom.hex(4)}"
      contact = {
        id: id,
        name: name,
        phone: phone,
        aliases: aliases,
        emergency: emergency,
        riding_bypass: emergency
      }
      @data[:contacts] << contact
      save_memory
      log_audit("Added contact: #{name} (#{phone})")
      contact
    end

    def update_preference(key, value)
      @data[:preferences][key.to_sym] = value
      save_memory
      log_audit("Updated preference #{key} to #{value}")
    end

    def log_audit(action)
      entry = {
        id: SecureRandom.hex(4),
        timestamp: Time.now.utc.iso8601,
        action: action
      }
      @data[:audit_logs].unshift(entry)
      @data[:audit_logs] = @data[:audit_logs].first(50) # Maintain last 50 events
    end

    def save_memory
      FileUtils.mkdir_p(File.dirname(@store_path))
      cipher = OpenSSL::Cipher.new(CIPHER_ALGO).encrypt
      cipher.key = @master_key
      iv = cipher.random_iv
      cipher.iv = iv
      cipher.auth_data = "RUBY_AI_MEMORY_V1"

      payload = JSON.generate(@data)
      encrypted_bytes = cipher.update(payload) + cipher.final
      auth_tag = cipher.auth_tag

      File.open(@store_path, 'wb') do |f|
        f.write([iv.bytesize].pack('C'))
        f.write(iv)
        f.write([auth_tag.bytesize].pack('C'))
        f.write(auth_tag)
        f.write(encrypted_bytes)
      end
      true
    rescue StandardError => e
      warn "[RUBY MEMORY ERROR] Failed to encrypt memory: #{e.message}"
      false
    end

    def load_memory
      return unless File.exist?(@store_path)

      File.open(@store_path, 'rb') do |f|
        iv_len = f.read(1).unpack1('C')
        iv = f.read(iv_len)
        tag_len = f.read(1).unpack1('C')
        tag = f.read(tag_len)
        encrypted_bytes = f.read

        decipher = OpenSSL::Cipher.new(CIPHER_ALGO).decrypt
        decipher.key = @master_key
        decipher.iv = iv
        decipher.auth_tag = tag
        decipher.auth_data = "RUBY_AI_MEMORY_V1"

        json_str = decipher.update(encrypted_bytes) + decipher.final
        @data = JSON.parse(json_str, symbolize_names: true)
      end
    rescue StandardError => e
      warn "[RUBY MEMORY NOTICE] Initializing fresh encrypted vault: #{e.message}"
      save_memory
    end

    private

    def default_key
      # In production, derived via PBKDF2 from hardware key
      OpenSSL::Digest::SHA256.digest("RUBY_AI_DEFAULT_LOCAL_KEY_2026")
    end
  end
end
