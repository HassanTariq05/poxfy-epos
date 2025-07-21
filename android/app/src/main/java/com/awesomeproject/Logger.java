package com.awesomeproject;

import android.content.Context;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.Date;

public class Logger {
    private static final String LOG_TAG = "MyAppLogger";
    private static final String LOG_FILE_NAME = "app_logs.txt";
    private static File logFile;

    public static void init(Context context) {
        try {
            File dir = new File(context.getExternalFilesDir(null), "logs");
            if (!dir.exists()) {
                dir.mkdirs();
            }
            logFile = new File(dir, LOG_FILE_NAME);

            if (!logFile.exists()) {
                logFile.createNewFile();
            }

            // Redirect System.out and System.err to the log file
            PrintStream printStream = new PrintStream(new FileOutputStream(logFile, true));
            System.setOut(printStream);
            System.setErr(printStream);

            Log.d(LOG_TAG, "Logging initialized to: " + logFile.getAbsolutePath());

        } catch (IOException e) {
            Log.e(LOG_TAG, "Failed to initialize logging", e);
        }
    }

    public static void i(String tag, String message) {
        Log.d(LOG_TAG, message);
        System.out.println(new Date().toString() + " - " + tag + " - " + message);
    }

    public static File getLogFile() {
        return logFile;
    }
}

