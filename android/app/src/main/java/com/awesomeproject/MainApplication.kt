package com.AwesomeProject

import android.app.Application
import com.awesomeproject.NativePrintSdkPackage
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.pax.dal.IDAL
import com.pax.dal.IPrinter
import com.pax.neptunelite.api.NeptuneLiteUser

class MainApplication : Application(), ReactApplication {

    companion object {
        private var dal: IDAL? = null
        private var printer: IPrinter? = null
        private var instance: MainApplication? = null

        fun getInstance(): MainApplication? {
            return instance
        }
    }



  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
                // Packages that cannot be autolinked yet can be added manually here, for example:
                add(NativePrintSdkPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
      instance = this
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }




    fun getPrinter(): IPrinter? {
        if (printer == null) {
            printer = getDal()?.printer
        }
        return printer
    }

    fun getDal(): IDAL? {
        if (dal == null) {
            try {
                dal = NeptuneLiteUser.getInstance()
                    .getDal(getInstance())
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        return dal
    }
}
