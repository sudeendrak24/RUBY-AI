# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Security, Authorization & Audit Subsystem
# Zero arbitrary execution. Parameter allowlists. Cryptographic HMAC verification.
# ==============================================================================

require 'openssl'
require 'securerandom'

module RubyAI
  class SecurityEngine
    ALLOWED_APPS = {
      'code'        => 'C:\\Users\\Sudeendra\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
      'vscode'      => 'C:\\Users\\Sudeendra\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
      'notepad'     => 'C:\\Windows\\notepad.exe',
      'explorer'    => 'C:\\Windows\\explorer.exe',
      'terminal'    => 'C:\\Windows\\System32\\cmd.exe',
      'chrome'      => 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'edge'        => 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    }.freeze

    attr_reader :active_tokens

    def initialize(shared_secret = nil)
      @shared_secret = shared_secret || "RUBY_AI_DEVICE_SHARED_SECRET_2026"
      @active_tokens = {}
      @rate_limits = Hash.new { |h, k| h[k] = [] }
    end

    # Verifies if application key exists in the verified allowlist
    def allowlisted_app?(app_key)
      ALLOWED_APPS.key?(app_key.to_s.downcase.strip)
    end

    def resolve_app_path(app_key)
      ALLOWED_APPS[app_key.to_s.downcase.strip]
    end

    # Issues an HMAC-SHA256 session token for Android device pairing
    def generate_device_token(device_id)
      nonce = SecureRandom.hex(16)
      timestamp = Time.now.to_i
      payload = "#{device_id}:#{nonce}:#{timestamp}"
      digest = OpenSSL::HMAC.hexdigest('SHA256', @shared_secret, payload)
      token = "#{payload}:#{digest}"
      @active_tokens[token] = { device_id: device_id, issued_at: timestamp, expires_at: timestamp + 86_400 }
      token
    end

    # Validates token authenticity and timestamp drift (< 24 hours)
    def authenticate_token(token)
      return false if token.nil? || token.empty?
      record = @active_tokens[token]
      return false unless record
      return false if Time.now.to_i > record[:expires_at]

      parts = token.split(':')
      return false unless parts.length == 4

      device_id, nonce, timestamp, signature = parts
      expected = OpenSSL::HMAC.hexdigest('SHA256', @shared_secret, "#{device_id}:#{nonce}:#{timestamp}")
      Rack::Utils.secure_compare(expected, signature) rescue (expected == signature)
    end

    # Rate limiting check: max 20 requests per minute per IP
    def allow_request?(client_ip)
      now = Time.now.to_i
      @rate_limits[client_ip].reject! { |t| t < now - 60 }
      if @rate_limits[client_ip].size >= 20
        false
      else
        @rate_limits[client_ip] << now
        true
      end
    end
  end
end
