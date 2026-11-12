package com.rubyai.assistant.telephony

import android.telecom.Call
import android.telecom.InCallService
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Official Android Telecom InCallService implementation.
 * Manages carrier SIM calls (e.g., Airtel India) through standard Telecom APIs.
 */
class RubyInCallService : InCallService() {

    companion object {
        private const val TAG = "RubyInCallService"
        private val _currentCallState = MutableStateFlow<CallStateInfo?>(null)
        val currentCallState = _currentCallState.asStateFlow()

        var activeCallInstance: Call? = null
            private set
    }

    data class CallStateInfo(
        val callerNumber: String,
        val callerName: String?,
        val state: Int,
        val isAiAssisted: Boolean = false,
        val durationSeconds: Long = 0
    )

    private val callCallback = object : Call.Callback() {
        override fun onStateChanged(call: Call?, state: Int) {
            super.onStateChanged(call, state)
            updateCallState(call)
        }
    }

    override fun onCallAdded(call: Call) {
        super.onCallAdded(call)
        Log.i(TAG, "Telephony Call Added: ${call.details?.handle?.schemeSpecificPart}")
        activeCallInstance = call
        call.registerCallback(callCallback)
        updateCallState(call)
    }

    override fun onCallRemoved(call: Call) {
        super.onCallRemoved(call)
        Log.i(TAG, "Telephony Call Removed")
        call.unregisterCallback(callCallback)
        if (activeCallInstance == call) {
            activeCallInstance = null
            _currentCallState.value = null
        }
    }

    private fun updateCallState(call: Call?) {
        if (call == null) {
            _currentCallState.value = null
            return
        }
        val handle = call.details?.handle?.schemeSpecificPart ?: "Unknown"
        val name = call.details?.callerDisplayName
        _currentCallState.value = CallStateInfo(
            callerNumber = handle,
            callerName = name,
            state = call.state
        )
    }

    fun answerCall() {
        activeCallInstance?.answer(android.telecom.VideoProfile.STATE_AUDIO_ONLY)
    }

    fun disconnectCall() {
        activeCallInstance?.disconnect()
    }
}
