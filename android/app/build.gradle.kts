plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
}

android {
    namespace = "com.rubyai.assistant"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.rubyai.assistant"
        minSdk = 29
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0-PROD"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    signingConfigs {
        create("release") {
            // Automated Production Release Keystore Configuration
            val keystoreFile = file(
                project.findProperty("RUBY_RELEASE_KEYSTORE_PATH") as String?
                    ?: System.getenv("RUBY_RELEASE_KEYSTORE_PATH")
                    ?: "ruby-release.keystore"
            )
            storeFile = keystoreFile
            storePassword = (project.findProperty("RUBY_RELEASE_STORE_PASSWORD") as String?
                ?: System.getenv("RUBY_RELEASE_STORE_PASSWORD")
                ?: "ruby_ai_secure_store_2026")
            keyAlias = (project.findProperty("RUBY_RELEASE_KEY_ALIAS") as String?
                ?: System.getenv("RUBY_RELEASE_KEY_ALIAS")
                ?: "ruby_release_key")
            keyPassword = (project.findProperty("RUBY_RELEASE_KEY_PASSWORD") as String?
                ?: System.getenv("RUBY_RELEASE_KEY_PASSWORD")
                ?: "ruby_ai_secure_key_2026")

            // Verified Full Signature Scheme Support
            enableV1Signing = true
            enableV2Signing = true
            enableV3Signing = true
            enableV4Signing = false
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            isMinifyEnabled = false
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // AndroidX & Core KTX
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Jetpack Compose & Material 3 (Futuristic Black & Orange Theme)
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.compose.material:material-icons-extended")

    // Telecom & Audio Subsystem (Airtel India & Indian Carriers)
    implementation("androidx.core:core-telecom:1.0.0-alpha02")

    // Room Database (Local-first memory & encrypted contact cache)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")
    implementation("net.zetetic:android-database-sqlcipher:4.5.4")

    // Networking & WebSockets
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
