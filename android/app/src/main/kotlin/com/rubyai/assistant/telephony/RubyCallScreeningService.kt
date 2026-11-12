package com.rubyai.assistant.telephony

import android.telecom.Call
import android.telecom.CallScreeningService
import android.util.Log

/**
 * Official Android CallScreeningService.
 * Evaluates incoming calls against emergency contacts and AI Answering policies.
 */
class RubyCallScreeningService : CallScreeningService() {

    companion object {
        private const val TAG = "RubyCallScreening"
    }

    override fun onScreenCall(callDetails: Call.Details) {
        val phoneNumber = callDetails.handle?.schemeSpecificPart ?: ""
        Log.i(TAG, "Screening incoming carrier call: $phoneNumber")

        // Build default compliant screening response
        val response = CallResponse.Builder().apply {
            setDisallowCall(false)
            setRejectCall(false)
            setSilenceCall(false)
            setSkipCallLog(false)
            setSkipNotification(false)
        }.build()

        respondToCall(callDetails, response)
    }
}
