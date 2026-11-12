package com.rubyai.assistant.ui.screens

/**
 * RUBY AI — Material Design 3 Screen Identifiers & Specifications
 * Covers all 18 specified Android screens in the Master Prompt.
 */
enum class RubyScreen(val title: String, val category: String) {
    SPLASH("Splash Screen", "System"),
    ONBOARDING("Welcome & Onboarding", "System"),
    DEVICE_PAIRING("Secure Device Pairing", "Connectivity"),
    HOME_DASHBOARD("Home Dashboard", "Core"),
    VOICE_ASSISTANT("Voice Assistant & Orb", "Core"),
    CONVERSATION_HISTORY("AI Conversation History", "Core"),
    INCOMING_CALL("Incoming Call Screen", "Telephony"),
    ACTIVE_CALL("Active Call Screen", "Telephony"),
    OUTGOING_CALL("Outgoing Call Screen", "Telephony"),
    CONTACTS("Contacts & Aliases", "Telephony"),
    CALL_SETTINGS("Call Assistant Settings", "Telephony"),
    RIDING_MODE("Riding Mode HUD", "Safety"),
    MEMORY_MANAGEMENT("Personal Memory", "Intelligence"),
    LANGUAGE_SETTINGS("Language Settings", "Intelligence"),
    WINDOWS_CONNECTION("Windows Connection", "Connectivity"),
    PERMISSIONS_PRIVACY("Permissions & Privacy", "Security"),
    SECURITY_DASHBOARD("Security Dashboard", "Security"),
    ABOUT_RUBY("About RUBY AI", "System")
}

data class RubyUiState(
    val currentScreen: RubyScreen = RubyScreen.HOME_DASHBOARD,
    val isListening: Boolean = false,
    val selectedLanguage: String = "English",
    val isRidingModeActive: Boolean = false,
    val isWindowsConnected: Boolean = true,
    val activeCallNumber: String? = null
)
