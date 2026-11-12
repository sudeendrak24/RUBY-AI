# frozen_string_literal: true
# ==============================================================================
# RUBY AI — Directed Acyclic Graph (DAG) Task Planner
# Decomposes multi-step user intentions into sequenced, validated actions.
# Includes pre-flight security clearance and graceful failure recovery.
# ==============================================================================

module RubyAI
  class TaskPlanner
    TaskStep = Struct.new(:id, :name, :action_type, :payload, :status, :depends_on, keyword_init: true)

    def initialize(security_engine, assistant)
      @security_engine = security_engine
      @assistant = assistant
    end

    # Parses input into an executable step plan
    def plan(intent_hash)
      steps = []
      case intent_hash[:intent]
      when :call_contact
        contact_name = intent_hash[:parameter]
        steps << TaskStep.new(
          id: "step-1",
          name: "Resolve Contact Alias",
          action_type: :lookup_contact,
          payload: { query: contact_name },
          status: :pending,
          depends_on: []
        )
        steps << TaskStep.new(
          id: "step-2",
          name: "Check Riding Safety Restrictions",
          action_type: :check_riding_policy,
          payload: {},
          status: :pending,
          depends_on: ["step-1"]
        )
        steps << TaskStep.new(
          id: "step-3",
          name: "Dispatch SIM Call to Android",
          action_type: :initiate_sim_call,
          payload: { sim_slot: 0 },
          status: :pending,
          depends_on: ["step-2"]
        )

      when :check_system_status
        steps << TaskStep.new(
          id: "step-1",
          name: "Query Win32 Memory & CPU",
          action_type: :query_system_telemetry,
          payload: {},
          status: :pending,
          depends_on: []
        )

      when :open_application
        steps << TaskStep.new(
          id: "step-1",
          name: "Verify Allowlisted Executable",
          action_type: :verify_app_allowlist,
          payload: { app: intent_hash[:parameter] },
          status: :pending,
          depends_on: []
        )
        steps << TaskStep.new(
          id: "step-2",
          name: "Launch Process",
          action_type: :launch_process,
          payload: { app: intent_hash[:parameter] },
          status: :pending,
          depends_on: ["step-1"]
        )

      else
        steps << TaskStep.new(
          id: "step-1",
          name: "Execute Conversational Query",
          action_type: :conversational_reply,
          payload: { text: intent_hash[:raw_text] },
          status: :pending,
          depends_on: []
        )
      end
      steps
    end

    # Executes a DAG plan sequentially with security validation
    def execute_plan(steps)
      results = {}
      steps.each do |step|
        # Verify dependency satisfaction
        step.depends_on.each do |dep_id|
          unless results[dep_id] && results[dep_id][:success]
            step.status = :blocked
            return { success: false, failed_step: step.id, reason: "Dependency #{dep_id} failed" }
          end
        end

        step.status = :running
        result = @assistant.execute_step(step.action_type, step.payload, results)
        if result[:success]
          step.status = :completed
          results[step.id] = result
        else
          step.status = :failed
          return { success: false, failed_step: step.id, error: result[:error] }
        end
      end
      { success: true, results: results }
    end
  end
end
