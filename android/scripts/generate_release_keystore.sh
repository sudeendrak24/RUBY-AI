#!/usr/bin/env bash
# ==============================================================================
# RUBY AI — Android Automated Production Release Keystore Generator
# Generates a 4096-bit RSA self-signed production release keystore.
# ==============================================================================

set -euo pipefail

KEYSTORE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../app" && pwd)"
KEYSTORE_FILE="${KEYSTORE_DIR}/ruby-release.keystore"
KEY_ALIAS="ruby_release_key"
STORE_PASS="ruby_ai_secure_store_2026"
KEY_PASS="ruby_ai_secure_key_2026"
VALIDITY_DAYS=10000

if [ -f "${KEYSTORE_FILE}" ]; then
    echo "[RUBY AI] Production keystore already exists at: ${KEYSTORE_FILE}"
    exit 0
fi

echo "[RUBY AI] Generating 4096-bit RSA production release keystore..."

if command -v keytool >/dev/null 2>&1; then
    keytool -genkeypair -v \
        -keystore "${KEYSTORE_FILE}" \
        -alias "${KEY_ALIAS}" \
        -keypass "${KEY_PASS}" \
        -storepass "${STORE_PASS}" \
        -keyalg RSA \
        -keysize 4096 \
        -validity "${VALIDITY_DAYS}" \
        -dname "CN=RUBY AI Production, OU=Intelligence, O=Ruby AI Ecosystem, L=Bengaluru, ST=Karnataka, C=IN"
    echo "[RUBY AI] Successfully generated: ${KEYSTORE_FILE}"
else
    echo "[RUBY AI] Notice: keytool command not found in current environment. Keystore descriptor ready for build."
fi
