package com.awesomeproject;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;

import com.AwesomeProject.R;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.facebook.fbreact.specs.NativePrintSdkSpec;
import com.facebook.react.bridge.ReactApplicationContext;
import com.pax.dal.IDAL;
import com.pax.dal.IPrinter;
import com.pax.dal.exceptions.PrinterDevException;
import com.pax.gl.page.IPage;
import com.pax.gl.page.PaxGLPage;
import com.pax.neptunelite.api.NeptuneLiteUser;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class PrintSdkModule extends NativePrintSdkSpec {

    private static final String TAG = "PrintTestApp";
    private IPrinter printer = null;
    private IDAL dal = null;

    private Bitmap logoBMp;

    public PrintSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void printJson(String value) {

        try {
            NeptuneLiteUser neptuneLiteUser = NeptuneLiteUser.getInstance();

            if (neptuneLiteUser == null) {
                Logger.i(TAG, "NeptuneLiteUser.getInstance() returned null!");
                Toast.makeText(getReactApplicationContext(), "Error: NeptuneLiteUser instance is null", Toast.LENGTH_LONG).show();
                // Consider stopping further initialization if this fails
                return;
            }
            Logger.i(TAG, "NeptuneLiteUser instance obtained. Attempting to get DAL...");
            Context appContext = getReactApplicationContext();
            if (appContext == null) {
                Logger.i(TAG, "getApplicationContext() returned null!");
                Toast.makeText(getReactApplicationContext(), "Error: Application context is null", Toast.LENGTH_LONG).show();
                return;
            }
            dal = neptuneLiteUser.getDal(appContext);
            if (dal != null) {
                Logger.i(TAG, "PAX DAL instance obtained successfully. Attempting to get Printer...");
                printer = dal.getPrinter();
                if (printer != null) {
                    Logger.i(TAG, "PAX Printer instance obtained successfully.");
                } else {
                    Logger.i(TAG, "Failed to get PAX Printer instance from DAL.");
                    Toast.makeText(appContext, "Error: Failed to get Printer instance", Toast.LENGTH_LONG).show();
                }
            } else {
                Logger.i(TAG, "Failed to get PAX DAL instance (getDal returned null).");
                Toast.makeText(appContext, "Error: Failed to get DAL instance", Toast.LENGTH_LONG).show();
            }
        } catch (Throwable t) { // Catch Throwable to capture Errors as well
            Logger.i(TAG, "Critical Error during DAL/Printer initialization: " + t.getMessage());
            String initErrorMsg = t.getMessage();
            if (initErrorMsg == null) {
                initErrorMsg = "Unknown critical initialization error: " + t.getClass().getSimpleName();
            }
            Toast.makeText(getReactApplicationContext(), "Critical Init Error: " + initErrorMsg, Toast.LENGTH_LONG).show();
        }
        Logger.i(TAG, "DAL/Printer initialization block finished.");

        if (printer == null) {
            Toast.makeText(getReactApplicationContext(), "Printer not initialized! Check logs.", Toast.LENGTH_SHORT).show();
            Logger.i(TAG, "Print button clicked, but printer is null.");
            return;
        }

        // Run print task in a background thread to avoid blocking the UI
        new Thread(new Runnable() {
            @Override
            public void run() {
                Logger.i(TAG, "Print thread started.");
                try {
                    // Minimal print sequence based on analysis
                    Logger.i(TAG, "Attempting printer.init()...");
                    printer.init();
                    Logger.i(TAG, "Printer init() called successfully.");

                    // Optional: Set font if needed, default is usually fine for testing
                    // printer.fontSet(EFontTypeAscii.FONT_8_16, EFontTypeExtCode.FONT_16_16);

                    generateInvoice(value, true);

                }
                catch (final PrinterDevException e) {
                    Logger.i(TAG, "PrinterDevException in print thread: " + e.getMessage());
                    generateInvoice(value, false);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            String errorMessage = e.getMessage();
                            if (errorMessage == null) {
                                errorMessage = "Unknown PrinterDevException"; // Provide a default message
                            }
                            Toast.makeText(getReactApplicationContext(), "Printer Error: " + errorMessage, Toast.LENGTH_LONG).show();
                        }
                    });
                }
                catch (final Throwable t) { // Catch Throwable for broader error capture
                    Logger.i(TAG, "General Throwable in print thread: " + t.getMessage());
                    generateInvoice(value, false);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            String errorMessage = t.getMessage();
                            if (errorMessage == null) {
                                errorMessage = "Unknown general error: " + t.getClass().getSimpleName(); // Provide a default message
                            }
                            Toast.makeText(getReactApplicationContext(), "Error: " + errorMessage, Toast.LENGTH_LONG).show();
                        }
                    });
                }
                Logger.i(TAG, "Print thread finished.");
            }
        }).start();
    }

    private void generateInvoice(String invoiceData, Boolean printerReady) {

        Logger.i(TAG, "generateInvoice called");

        JSONArray multiInvoices;
        try {
            Log.i("Data", invoiceData);
            multiInvoices = new JSONArray(invoiceData);
        } catch (JSONException e) {
            Logger.i(TAG, "Data parse Error: " + e.getMessage());
            Toast.makeText(getReactApplicationContext(), "Data parse Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
            e.printStackTrace();
            return;
        }

        Logger.i(TAG, "Invoices Length: " + multiInvoices.length());

        if(multiInvoices.length() == 0) {
            return;
        }

        PaxGLPage paxGLPage = PaxGLPage.getInstance(getReactApplicationContext());
        IPage page = paxGLPage.createPage();

        try {

            JSONArray invoice = multiInvoices.getJSONArray(0);
            Log.i("Data", invoice.toString());

            if(invoice.optJSONObject(0).has("type")) {
                String text = invoice.optJSONObject(0).getString("text");
                Logger.i(TAG, "Fetching Store Logo: " + text);

                final boolean[] hasLogoLoaded = {false};

                Glide.with(getCurrentActivity())
                        .asBitmap()
                        .load(text)
                        .into(new CustomTarget<Bitmap>() {
                            @Override
                            public void onResourceReady(@NonNull Bitmap resource, @Nullable Transition<? super Bitmap> transition) {
                                Logger.i(TAG, "Fetched Store Logo Successfully");
                                page.addLine().addUnit(resource, IPage.EAlign.CENTER);
                                page.addLine().addUnit("\n", 7);
                                if(invoice.length() > 0) {
                                    processPrintItems(page, invoice, paxGLPage, printerReady);
                                }
                            }

                            @Override
                            public void onLoadCleared(@Nullable Drawable placeholder) {}

                            @Override
                            public void onLoadFailed(@Nullable Drawable errorDrawable) {
                                if (hasLogoLoaded[0]) return;
                                hasLogoLoaded[0] = true;
                                super.onLoadFailed(errorDrawable);
                                Logger.i(TAG, "Failed to fetch Store Logo");
                                if(invoice.length() > 0) {
                                    processPrintItems(page, invoice, paxGLPage, printerReady);
                                }
                            }
                        });
            }
        } catch (JSONException e) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getReactApplicationContext(), "Data parse Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
            e.printStackTrace();
            Logger.i(TAG, "Data parse Error: " + e.getMessage());
        }
    }

    private void showBitmap(Bitmap bitmap) {

        Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.e("MyModule", "Activity is null, cannot show dialog");
            return;
        }

        ImageView imageView = new ImageView(activity);
        imageView.setImageBitmap(bitmap);
        imageView.setAdjustViewBounds(true);

        imageView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));

        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("Preview");
        builder.setView(imageView);
        builder.setPositiveButton("Close", (dialog, which) -> dialog.dismiss());

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    public void processPrintItems(IPage page, JSONArray invoice, PaxGLPage paxGLPage, Boolean printerReady) {


        Logger.i(TAG, "processPrintItems called, invoice objects = "+invoice.length());
        try {
            IPage.ILine line = page.addLine();
            for (int j = 1; j < invoice.length(); j++) {

                Log.i("Data", invoice.optJSONObject(j).toString());

                String text = "--";
                if(invoice.optJSONObject(j).has("text")) {
                    text = invoice.optJSONObject(j).getString("text");
                }
                boolean nextLine = invoice.optJSONObject(j).getBoolean("next_line");

                IPage.EAlign align;
                switch (invoice.optJSONObject(j).optString("dir")) {
                    case "right":
                        align = IPage.EAlign.RIGHT;
                        break;
                    case "left":
                        align = IPage.EAlign.LEFT;
                        break;
                    default:
                        align = IPage.EAlign.CENTER;

                }
                int textSize = Integer.parseInt(invoice.optJSONObject(j).getString("size"));
                int style;
                switch (invoice.optJSONObject(j).optString("style")) {
                    case "bold":
                        style = IPage.ILine.IUnit.TEXT_STYLE_BOLD;
                        break;
                    case "italic":
                        style = IPage.ILine.IUnit.TEXT_STYLE_ITALIC;
                        break;
                    case "underline":
                        style = IPage.ILine.IUnit.TEXT_STYLE_UNDERLINE;
                        break;
                    default:
                        style = IPage.ILine.IUnit.TEXT_STYLE_NORMAL;

                }
                if(invoice.optJSONObject(j).has("weight")) {
                    float weight = invoice.optJSONObject(j).getLong("weight");
                    line.addUnit(text, textSize, align, style, weight);
                    Logger.i(TAG, "Adding object with weight");
                } else {
                    line.addUnit(text, textSize, align, style);
                    Logger.i(TAG, "Adding object");
                }
                if(nextLine) {
                    line = page.addLine();
                }

            }
            Logger.i(TAG, "Adding final line space 10");
            page.addLine().addUnit("\n", 10);

            Bitmap bitmap = paxGLPage.pageToBitmap(page, 520);

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Logger.i(TAG, "Showing bitmap");
                    showBitmap(bitmap);
                }
            });

            if(printerReady) {
                Logger.i(TAG, "Printing bitmap");
                printer.printBitmap(bitmap);

                Logger.i(TAG, "Attempting printer.start()...");
                final int status = printer.start();
                Logger.i(TAG, "Printer start() called, status code: " + status);

                // Show result on UI thread
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String statusString = PaxPrinter.statusCode2Str(status);
                        // Although statusCode2Str should not return null based on its code, add check for safety
                        if (statusString == null) {
                            statusString = "Unknown status code: " + status;
                        }
                        String statusMessage = "Print Status: " + statusString;
                        Toast.makeText(getReactApplicationContext(), statusMessage, Toast.LENGTH_LONG).show();
                        Logger.i(TAG, "Print finished. Displaying status: " + statusMessage);
                    }
                });


                if (status != 0) {
                    Logger.i(TAG, "Printer not ready to cut: " + status);
                    return;
                }

                Logger.i(TAG, "Cutting paper");
                printer.cutPaper(0);
            }

            invoice = new JSONArray();

        } catch (JSONException e) {
            Logger.i(TAG, "Data parse Error: " + e.getMessage());
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getReactApplicationContext(), "Data parse Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
        }
//        catch (PrinterDevException e) {
//            Logger.i(TAG, "PrinterDevException: " + e.getMessage());
//            runOnUiThread(new Runnable() {
//                @Override
//                public void run() {
//                    Toast.makeText(getReactApplicationContext(), "PrinterDevException: " + e.getMessage(), Toast.LENGTH_LONG).show();
//                }
//            });
//        }
        catch (Exception e) {
            Logger.i(TAG, "Exception: " + e.getMessage());
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getReactApplicationContext(), "Exception: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
        }
    }
}
