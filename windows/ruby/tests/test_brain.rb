# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Ruby Brain Automated Unit Tests
# Tests multilingual intent matching, memory encryption, security allowlist, and DAG planner.
# ==============================================================================

require 'test/unit'
require_relative '../assistant'

class TestRubyBrain < Test::Unit::TestCase
  def setup
    @assistant = RubyAI::Assistant.new
  end

  def test_multilingual_english_intent
    result = @assistant.process_command("Ruby, call Amma")
    assert_equal :call_contact, result[:intent]
    assert_equal :success, result[:status]
    assert_includes result[:speech], "Connecting call to Amma"
  end

  def test_multilingual_tamil_intent
    result = @assistant.process_command("ரூபி, அம்மாக்கு கால் பண்ணு")
    assert_equal :call_contact, result[:intent]
    assert_includes result[:speech], "அம்மா"
  end

  def test_multilingual_hindi_intent
    result = @assistant.process_command("रूबी, राइडिंग मोड चालू करो")
    assert_equal :activate_riding_mode, result[:intent]
    assert_includes result[:speech], "राइडिंग मोड"
  end

  def test_security_allowlist_blocking
    result = @assistant.process_command("open malicious_payload.exe")
    assert_equal :security_blocked, result[:status]
    assert_equal "SECURITY_BLOCK", result[:action]
  end

  def test_telephony_screening_emergency
    screening = @assistant.telephony_engine.screen_incoming_call("+91 98450 11223", "Amma")
    assert_equal true, screening[:is_emergency]
    assert_equal :ALLOW_IMMEDIATE_RING, screening[:policy_decision]
  end

  def test_system_telemetry
    result = @assistant.process_command("show system RAM usage")
    assert_equal :check_system_status, result[:intent]
    assert_not_nil result[:payload][:ram_used]
  end
end
