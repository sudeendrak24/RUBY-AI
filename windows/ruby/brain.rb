# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Windows Central Intelligence Brain CLI Entry Point
# "Your Personal Intelligence. Your Voice. Your Control."
# ==============================================================================

require_relative 'assistant'

module RubyAI
  class CLI
    def self.run
      puts "=========================================================="
      puts "  RUBY AI — Personal Intelligence System (Windows 11)"
      puts "  Version: 1.0.0-PROD | Trilingual Voice Engine: EN, TA, HI"
      puts "=========================================================="
      puts "Type a command or phrase in English, Tamil, or Hindi:"
      puts "(Commands: 'status', 'riding on', 'riding off', 'exit')\n\n"

      assistant = Assistant.new

      loop do
        print "RUBY AI > "
        input = gets&.strip
        break if input.nil? || input.downcase == 'exit'
        next if input.empty?

        result = assistant.process_command(input)
        puts "\n[Intent Detected]: #{result[:intent]}"
        puts "[Speech Output]:  #{result[:speech]}"
        puts "[Action Executed]: #{result[:action] || 'NONE'}"
        puts "[Payload]:         #{result[:payload].inspect}" if result[:payload]
        puts "----------------------------------------------------------\n"
      end
    end
  end
end

RubyAI::CLI.run if __FILE__ == $PROGRAM_NAME
