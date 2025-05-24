package com.awesomeproject;

import android.widget.Toast;

import com.facebook.fbreact.specs.NativePrintSdkSpec;
import com.facebook.react.bridge.ReactApplicationContext;

public class PrintSdkModule extends NativePrintSdkSpec {

    public PrintSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void printJson(String value) {

        try {
            new PrintReceipt(getReactApplicationContext()).printReceipt(value);
//            new PrintReceipt(getReactApplicationContext()).printReceipt("[\n" +
//                    "  [\n" +
//                    "    {\n" +
//                    "      \"text\": \"Print Demo\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"28\",\n" +
//                    "\t  \"style\": \"bold\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"************************\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"20\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"الشركة: أورانج\",\n" +
//                    "      \"dir\": \"left\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"الخدمة: كروت اكسترا\",\n" +
//                    "      \"dir\": \"left\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"فئة: كروت اكسترا 4.25 جنيه\",\n" +
//                    "      \"dir\": \"left\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"كود الشحن:\",\n" +
//                    "      \"dir\": \"left\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"5779143519415884\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"30\",\n" +
//                    "\t  \"style\": \"bold\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"رقم المسلسل: 1700001741640383\",\n" +
//                    "      \"dir\": \"left\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"القيمة: 4.25\",\n" +
//                    "      \"dir\": \"left\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"رقم العملية:ECV212022415029518015\",\n" +
//                    "      \"dir\": \"left\",\n" +
//                    "      \"size\": \"24\"\n" +
//                    "    },\n" +
//                    "    {\n" +
//                    "      \"text\": \"************************\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"20\"\n" +
//                    "    },\n" +
//                    "{\n" +
//                    "      \"text\": \"خدمة العملاء\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "{\n" +
//                    "      \"text\": \"+20(2)33383949\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "{\n" +
//                    "      \"text\": \"www.ebe.com.eg\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"28\"\n" +
//                    "    },\n" +
//                    "{\n" +
//                    "      \"text\": \"************************\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"20\"\n" +
//                    "    },\n" +
//                    "{\n" +
//                    "      \"text\": \"POWERED BY EBE!\",\n" +
//                    "      \"dir\": \"center\",\n" +
//                    "      \"size\": \"24\",\n" +
//                    "      \"style\": \"bold\"\n" +
//                    "    }\n" +
//                    "  ]\n" +
//                    "]\n");
        } catch (Exception e) {
            Toast.makeText(getReactApplicationContext(), e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
        }
    }
}
