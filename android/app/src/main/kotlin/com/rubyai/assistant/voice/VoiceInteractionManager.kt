package com.rubyai.assistant.voice

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale

enum class AssistantListeningState {
    IDLE,
    LISTENING,
    PROCESSING,
    SPEAKING
}

/**
 * Trilingual Voice Engine for Android.
 * Supports English (en-IN), Tamil (ta-IN), and Hindi (hi-IN).
 */
class VoiceInteractionManager(private val context: Context) : TextToSpeech.OnInitListener {

    private val _listeningState = MutableStateFlow(AssistantListeningState.IDLE)
    val listeningState = _listeningState.asStateFlow()

    private var speechRecognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private var currentLanguage = Locale("en", "IN")

    init {
        tts = TextToSpeech(context, this)
        initRecognizer()
    }

    private fun initRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(context)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        _listeningState.value = AssistantListeningState.LISTENING
                    }
                    override fun onBeginningOfSpeech() {}
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {
                        _listeningState.value = AssistantListeningState.PROCESSING
                    }
                    override fun onError(error: Int) {
                        Log.e("RubyVoice", "Speech recognition error code: $error")
                        _listeningState.value = AssistantListeningState.IDLE
                    }
                    override fun onResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        val text = matches?.firstOrNull() ?: ""
                        Log.i("RubyVoice", "Recognized voice command: $text")
                        _listeningState.value = AssistantListeningState.IDLE
                    }
                    override fun onPartialResults(partialResults: Bundle?) {}
                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }
        }
    }

    fun startListening(locale: Locale = currentLanguage) {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, locale.toLanguageTag())
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
        }
        speechRecognizer?.startListening(intent)
    }

    fun speak(text: String, locale: Locale = currentLanguage) {
        tts?.language = locale
        _listeningState.value = AssistantListeningState.SPEAKING
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "RubyUtterance")
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = currentLanguage
        }
    }

    fun destroy() {
        speechRecognizer?.destroy()
        tts?.stop()
        tts?.shutdown()
    }
}
