package com.rubyai.assistant.riding

import android.content.Context
import android.telephony.SmsManager
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

enum class RidingCallPolicy {
    NORMAL,
    AI_ASSISTANT,
    EMERGENCY_ONLY
}

data class RidingState(
    val isActive: Boolean = false,
    val callPolicy: RidingCallPolicy = RidingCallPolicy.AI_ASSISTANT,
    val connectedBluetoothDevice: String? = null,
    val currentSpeedKmh: Float = 0.0f
)

/**
 * Controller for RUBY RIDING MODE.
 * Minimizes driver distraction while riding a motorcycle.
 */
class RidingModeController(private val context: Context) {

    private val _ridingState = MutableStateFlow(RidingState())
    val ridingState = _ridingState.asStateFlow()

    fun activateRidingMode(policy: RidingCallPolicy = RidingCallPolicy.AI_ASSISTANT) {
        _ridingState.value = _ridingState.value.copy(
            isActive = true,
            callPolicy = policy
        )
        Log.i("RubyRiding", "Riding mode activated with policy: $policy")
    }

    fun deactivateRidingMode() {
        _ridingState.value = _ridingState.value.copy(isActive = false)
        Log.i("RubyRiding", "Riding mode deactivated.")
    }

    fun sendAutoSms(phoneNumber: String, customMessage: String?) {
        try {
            val message = customMessage ?: "I am riding my motorcycle right now. RUBY AI received your call and will notify me once I reach safely."
            val smsManager = context.getSystemService(SmsManager::class.java)
            smsManager.sendTextMessage(phoneNumber, null, message, null, null)
            Log.i("RubyRiding", "Sent auto-SMS to $phoneNumber")
        } catch (e: Exception) {
            Log.e("RubyRiding", "Failed to dispatch auto-SMS: ${e.message}")
        }
    }
}
