/**
 * RUBY AI — Low-Latency Audio Ringbuffer & VAD Implementation
 * Zero external dependencies. C99 Standard.
 */

#include "include/ruby_ai_native.h"
#include <stdlib.h>
#include <string.h>
#include <math.h>

RubyAudioRingBuffer* ruby_audio_create(size_t sample_capacity, float energy_threshold) {
    RubyAudioRingBuffer *ring = (RubyAudioRingBuffer*)malloc(sizeof(RubyAudioRingBuffer));
    if (!ring) return NULL;

    ring->capacity = sample_capacity > 0 ? sample_capacity : 16000 * 5; // Default 5 seconds at 16kHz
    ring->buffer = (int16_t*)calloc(ring->capacity, sizeof(int16_t));
    if (!ring->buffer) {
        free(ring);
        return NULL;
    }
    ring->write_pos = 0;
    ring->read_pos = 0;
    ring->energy_threshold = energy_threshold > 0.0f ? energy_threshold : 0.015f;
    ring->is_speaking = false;
    return ring;
}

void ruby_audio_write(RubyAudioRingBuffer *ring, const int16_t *samples, size_t count) {
    if (!ring || !ring->buffer || !samples || count == 0) return;

    for (size_t i = 0; i < count; ++i) {
        ring->buffer[ring->write_pos] = samples[i];
        ring->write_pos = (ring->write_pos + 1) % ring->capacity;
    }
}

size_t ruby_audio_read(RubyAudioRingBuffer *ring, int16_t *destination, size_t max_count) {
    if (!ring || !ring->buffer || !destination || max_count == 0) return 0;

    size_t count = 0;
    while (ring->read_pos != ring->write_pos && count < max_count) {
        destination[count++] = ring->buffer[ring->read_pos];
        ring->read_pos = (ring->read_pos + 1) % ring->capacity;
    }
    return count;
}

bool ruby_audio_detect_speech(RubyAudioRingBuffer *ring) {
    if (!ring || !ring->buffer) return false;

    // Calculate Root Mean Square (RMS) energy over the last 512 samples
    size_t window_size = 512;
    if (ring->capacity < window_size) window_size = ring->capacity;

    int64_t sum_squares = 0;
    size_t idx = (ring->write_pos >= window_size) ? (ring->write_pos - window_size) : (ring->capacity - (window_size - ring->write_pos));

    for (size_t i = 0; i < window_size; ++i) {
        int16_t val = ring->buffer[(idx + i) % ring->capacity];
        sum_squares += (int32_t)val * (int32_t)val;
    }

    double mean = (double)sum_squares / (double)window_size;
    double rms = sqrt(mean) / 32768.0; // Normalized between 0.0 and 1.0

    ring->is_speaking = (rms >= ring->energy_threshold);
    return ring->is_speaking;
}

void ruby_audio_destroy(RubyAudioRingBuffer *ring) {
    if (ring) {
        if (ring->buffer) free(ring->buffer);
        free(ring);
    }
}
