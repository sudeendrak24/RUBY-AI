# ==============================================================================
# RUBY AI — Android Production ProGuard & R8 Configuration
# Version: 1.0.0-PROD
# Full R8 Code Shrinking & Obfuscation with Telecom & Room Keep Rules
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Android Telecom Subsystem (Airtel India & Cellular Carrier SIM Calls)
# ------------------------------------------------------------------------------
# Essential: Keep InCallService, CallScreeningService, and Binder IPC callbacks
-keep public class com.rubyai.assistant.telephony.RubyInCallService {
    public *;
}
-keep public class com.rubyai.assistant.telephony.RubyCallScreeningService {
    public *;
}
-keepclasseswithmembers class android.telecom.InCallService {
    public *;
}
-keepclasseswithmembers class android.telecom.CallScreeningService {
    public *;
}
-keep class com.rubyai.assistant.telephony.RubyInCallService$** { *; }

# ------------------------------------------------------------------------------
# 2. Local-First Room Database & SQLCipher Encryption
# ------------------------------------------------------------------------------
-keep class androidx.room.** { *; }
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Dao interface * { *; }
-keep @androidx.room.Entity class * { *; }
-dontwarn androidx.room.paging.**

# Room generated synthetic classes
-keep class com.rubyai.assistant.memory.RubyDatabase_Impl {
    public *;
}
-keep class com.rubyai.assistant.memory.ContactDao_Impl {
    public *;
}
-keep class com.rubyai.assistant.memory.ContactEntity { *; }

# SQLCipher Native SQLite bindings
-keep class net.zetetic.database.sqlcipher.** { *; }
-keep class net.zetetic.database.** { *; }

# ------------------------------------------------------------------------------
# 3. Multilingual Speech & Voice Engine (English, Tamil, Hindi)
# ------------------------------------------------------------------------------
-keep class com.rubyai.assistant.voice.VoiceInteractionManager { *; }
-keep class com.rubyai.assistant.voice.AssistantListeningState { *; }
-keep class android.speech.** { *; }
-keep class android.speech.tts.** { *; }

# ------------------------------------------------------------------------------
# 4. Motorcycle Riding Mode Controller
# ------------------------------------------------------------------------------
-keep class com.rubyai.assistant.riding.RidingModeController { *; }
-keep class com.rubyai.assistant.riding.RidingState { *; }
-keep class com.rubyai.assistant.riding.RidingCallPolicy { *; }

# ------------------------------------------------------------------------------
# 5. OkHttp, Coroutines & Network IPC
# ------------------------------------------------------------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
-keep class kotlinx.coroutines.** { *; }

# ------------------------------------------------------------------------------
# 6. General Optimization & Line Number Preservation for Crash Audits
# ------------------------------------------------------------------------------
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
