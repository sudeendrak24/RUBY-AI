/**
 * RUBY AI — Fast Phonetic & Levenshtein Token Matcher
 * Zero external dependencies. C99 Standard.
 */

#include "include/ruby_ai_native.h"
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

static int min3(int a, int b, int c) {
    int m = a;
    if (b < m) m = b;
    if (c < m) m = c;
    return m;
}

int ruby_levenshtein_distance(const char *s1, const char *s2) {
    if (!s1 || !s2) return 999;
    int len1 = (int)strlen(s1);
    int len2 = (int)strlen(s2);
    if (len1 == 0) return len2;
    if (len2 == 0) return len1;

    int *d = (int*)malloc((len1 + 1) * (len2 + 1) * sizeof(int));
    if (!d) return 999;

    for (int i = 0; i <= len1; i++) d[i * (len2 + 1)] = i;
    for (int j = 0; j <= len2; j++) d[j] = j;

    for (int i = 1; i <= len1; i++) {
        for (int j = 1; j <= len2; j++) {
            char c1 = tolower(s1[i - 1]);
            char c2 = tolower(s2[j - 1]);
            int cost = (c1 == c2) ? 0 : 1;
            d[i * (len2 + 1) + j] = min3(
                d[(i - 1) * (len2 + 1) + j] + 1,        // deletion
                d[i * (len2 + 1) + (j - 1)] + 1,        // insertion
                d[(i - 1) * (len2 + 1) + (j - 1)] + cost // substitution
            );
        }
    }

    int result = d[len1 * (len2 + 1) + len2];
    free(d);
    return result;
}

float ruby_phonetic_similarity(const char *phrase, const char *candidate) {
    if (!phrase || !candidate) return 0.0f;
    int dist = ruby_levenshtein_distance(phrase, candidate);
    int max_len = (int)strlen(phrase);
    int cand_len = (int)strlen(candidate);
    if (cand_len > max_len) max_len = cand_len;
    if (max_len == 0) return 1.0f;

    float sim = 1.0f - ((float)dist / (float)max_len);
    return sim < 0.0f ? 0.0f : sim;
}

int ruby_match_intent_fast(const char *input, const char **intent_keys, int key_count) {
    if (!input || !intent_keys || key_count <= 0) return -1;

    int best_index = -1;
    float highest_score = 0.0f;

    for (int i = 0; i < key_count; ++i) {
        float score = ruby_phonetic_similarity(input, intent_keys[i]);
        if (score > highest_score) {
            highest_score = score;
            best_index = i;
        }
    }

    // Return match only if confidence exceeds 65%
    if (highest_score >= 0.65f) {
        return best_index;
    }
    return -1;
}
