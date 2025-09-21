# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
}

# Keep JavaScript interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebView related classes
-keep class android.webkit.** { *; }
-keep class * extends android.webkit.WebViewClient
-keep class * extends android.webkit.WebChromeClient

# Keep JSON serialization/deserialization classes
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-dontwarn sun.misc.Unsafe

# Keep Cordova/Capacitor plugins
-keep class org.apache.cordova.** { *; }
-keep class com.capacitor.** { *; }

# Optimize for smaller APK
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# Remove logging code in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
}

# Keep data classes
-keepclassmembers class com.pawsitivecheck.app.** {
    <fields>;
    <init>(...);
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelables
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep BuildConfig
-keep class com.pawsitivecheck.BuildConfig { *; }
-keep class com.pawsitivecheck.app.BuildConfig { *; }

# Keep R resources
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Optimize APK size
-repackageclasses ''
-allowaccessmodification