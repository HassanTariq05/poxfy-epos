package com.awesomeproject;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.AwesomeProject.MainApplication;
import com.AwesomeProject.R;
import com.pax.dal.exceptions.PrinterDevException;
import com.pax.gl.page.IPage;
import com.pax.gl.page.PaxGLPage;

import org.json.JSONArray;
import org.json.JSONException;

public class PrintReceipt {
    private Bitmap bitmap;
    private Handler handler = new Handler();
    private Context context;
    private JSONArray multiInvoices;
    private Bitmap logoBMp;
    private int index;

    public PrintReceipt(Context context) {
        this.context = context;
    }

    public void printReceipt(String invoiceData) throws JSONException {
//        logoBMp = BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher);

        if (invoiceData == null || invoiceData.isEmpty()) {
            return;
        }

        multiInvoices = new JSONArray(invoiceData);
        index = 0;
        generateInvoice();

    }

    private void generateInvoice() throws JSONException {
        
        if (index >= multiInvoices.length()) {
            return;
        }
        
        PaxGLPage paxGLPage = PaxGLPage.getInstance(context);
        IPage page = paxGLPage.createPage();
        page.adjustLineSpace(-9);


        page.addLine().addUnit(logoBMp, IPage.EAlign.CENTER);
        page.addLine().addUnit("\n", 7);
        JSONArray invoice = multiInvoices.getJSONArray(index);
        Log.i("Data", invoice.toString());
        for (int j = 0; j < invoice.length(); j++) {
            Log.i("Data", invoice.optJSONObject(j).toString());
            String text = invoice.optJSONObject(j).getString("text");
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
            page.addLine().addUnit(text, textSize, align, style);
            page.addLine().addUnit("\n", 5);

        }
        page.addLine().addUnit("\n", 30);
        
//        bitmap = paxGLPage.pageToBitmap(page, 384);
        printReceipt();

    }

    public void printReceipt() {

        Toast.makeText(context, "Printing receipt ...", Toast.LENGTH_SHORT).show();
        
        Log.i("printReceipt", Build.MANUFACTURER.toUpperCase()+'\n'+
                Build.BRAND.toUpperCase()+'\n'+
                Build.DEVICE.toUpperCase()+'\n'+
                Build.MODEL.toUpperCase()+'\n'+
                Build.PRODUCT.toUpperCase()+'\n'
        );

        if ("PAX".equalsIgnoreCase(Build.BRAND) || "PAX".equalsIgnoreCase(Build.MANUFACTURER)) { //case of pax device
            new Thread(() -> {
                PaxPrinter.getInstance().init();
                try {

//                    PaxPrinter.getInstance().printBitmap(bitmap);

//                    onShowMessage(PaxPrinter.getInstance().start());

                    Toast.makeText(context, PaxPrinter.getInstance().start(), Toast.LENGTH_SHORT).show();

                } catch (PrinterDevException e) {
                    Toast.makeText(context, "Error: "+e.getMessage(), Toast.LENGTH_SHORT).show();
                }
                
            }).start();

        } else { //for other devices use bluetooth print
            Log.i("printReceipt", "not pax\n");

            Toast.makeText(context, "PAX printer not found ...", Toast.LENGTH_SHORT).show();
        }
    }

    private void onShowMessage(final String message) {
        handler.post(() -> {
            if (!message.equals("Success")) {
                AlertDialog.Builder alertDialog = new AlertDialog.Builder(context);
                alertDialog.setTitle("Oops!");
                alertDialog.setMessage(message);
                alertDialog.setPositiveButton("Try Again",
                        (dialog, which) -> {
                            printReceipt();
                            dialog.cancel();
                        });
                alertDialog.setNegativeButton("Cancel",
                        (dialog, which) -> {
                            dialog.cancel();
                            index++;
                            try {
                                generateInvoice();
                            } catch (JSONException e) {
                                onShowMessage(message);
                            }
                        });
                alertDialog.show();
            } else {
                index++;
                try {
                    generateInvoice();
                } catch (JSONException e) {
                    onShowMessage(message);
                }
            }

        });

    }
}
