/**
 * RUBY AI — Native C Systems Layer Header
 * Copyright (c) 2026 RUBY AI Ecosystem.
 * License: Apache-2.0
 */

#ifndef RUBY_AI_NATIVE_H
#define RUBY_AI_NATIVE_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef _WIN32
  #define RUBY_EXPORT __declspec(dllexport)
#else
  #define RUBY_EXPORT __attribute__((visibility("default")))
#endif

#ifdef __cplusplus
extern "C" {
#endif

/* -------------------------------------------------------------
 * 1. Low-Latency Audio Ringbuffer & Voice Activity Detection (VAD)
 * ------------------------------------------------------------- */
typedef struct {
    int16_t *buffer;
    size_t capacity;
    size_t write_pos;
    size_t read_pos;
    float energy_threshold;
    bool is_speaking;
} RubyAudioRingBuffer;

RUBY_EXPORT RubyAudioRingBuffer* ruby_audio_create(size_t sample_capacity, float energy_threshold);
RUBY_EXPORT void ruby_audio_write(RubyAudioRingBuffer *ring, const int16_t *samples, size_t count);
RUBY_EXPORT size_t ruby_audio_read(RubyAudioRingBuffer *ring, int16_t *destination, size_t max_count);
RUBY_EXPORT bool ruby_audio_detect_speech(RubyAudioRingBuffer *ring);
RUBY_EXPORT void ruby_audio_destroy(RubyAudioRingBuffer *ring);

/* -------------------------------------------------------------
 * 2. High-Performance Phonetic & Intent Classifier
 * ------------------------------------------------------------- */
RUBY_EXPORT int ruby_levenshtein_distance(const char *s1, const char *s2);
RUBY_EXPORT float ruby_phonetic_similarity(const char *phrase, const char *candidate);
RUBY_EXPORT int ruby_match_intent_fast(const char *input, const char **intent_keys, int key_count);

/* -------------------------------------------------------------
 * 3. Windows Win32 Systems Telemetry & Process Management
 * ------------------------------------------------------------- */
typedef struct {
    double cpu_usage_pct;
    uint64_t total_ram_mb;
    uint64_t used_ram_mb;
    uint64_t free_ram_mb;
    int active_thread_count;
} RubySystemTelemetry;

RUBY_EXPORT bool ruby_get_system_telemetry(RubySystemTelemetry *telemetry);
RUBY_EXPORT bool ruby_launch_allowlisted_app(const char *app_key, const char *path);

#ifdef __cplusplus
}
#endif

#endif /* RUBY_AI_NATIVE_H */
