# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Windows Brain REST API & WebSocket Communication Daemon
# Standard library implementation (WEBrick / Socket) requiring zero paid gems.
# ==============================================================================

require 'webrick'
require 'json'
require_relative 'assistant'

module RubyAI
  class Server
    def initialize(port = 8443)
      @port = port
      @assistant = Assistant.new
    end

    def start
      server = WEBrick::HTTPServer.new(
        Port: @port,
        Logger: WEBrick::Log.new($stdout, WEBrick::Log::INFO),
        AccessLog: []
      )

      # Health & Status Endpoint
      server.mount_proc '/api/status' do |_req, res|
        res['Content-Type'] = 'application/json'
        res['Access-Control-Allow-Origin'] = '*'
        res.body = JSON.generate({
          app: "RUBY AI Windows Brain",
          status: "ONLINE",
          version: "1.0.0",
          platform: "Windows 11",
          telemetry: @assistant.query_system_telemetry
        })
      end

      # Voice / Text Command Endpoint
      server.mount_proc '/api/command' do |req, res|
        res['Content-Type'] = 'application/json'
        res['Access-Control-Allow-Origin'] = '*'

        if req.request_method == 'POST'
          body = JSON.parse(req.body) rescue {}
          input_text = body['text'] || ""
          source = body['source'] || "REST_CLIENT"
          result = @assistant.process_command(input_text, source)
          res.body = JSON.generate(result)
        else
          res.status = 405
          res.body = JSON.generate({ error: "Method not allowed" })
        end
      end

      # Incoming Call Event from Android Telecom
      server.mount_proc '/api/telephony/incoming' do |req, res|
        res['Content-Type'] = 'application/json'
        res['Access-Control-Allow-Origin'] = '*'

        if req.request_method == 'POST'
          data = JSON.parse(req.body) rescue {}
          caller_number = data['caller_number']
          caller_name = data['caller_name']
          screening = @assistant.telephony_engine.screen_incoming_call(caller_number, caller_name)
          res.body = JSON.generate(screening)
        end
      end

      trap('INT') { server.shutdown }
      trap('TERM') { server.shutdown }

      puts "[RUBY AI] Windows Brain Daemon active on port #{@port}"
      server.start
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  port = ARGV[0] ? ARGV[0].to_i : 8443
  RubyAI::Server.new(port).start
end
