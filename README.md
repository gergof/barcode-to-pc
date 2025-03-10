# barcode-to-pc
Use your phone as a barcode scanner for your PC

This is a simple app you can use to turn your smartphone into a barcode scanner.

To use it, you have to download both a server application and an Android application from here: https://github.com/gergof/barcode-to-pc/releases/latest

Once downloaded start the server. It will show a QR code you have to scan with your phone. After that, the scanning mode is activated. The app will scan the supported barcodes (code-128, code-39, code-93, codabar, ean-13, ean-8, itf, upc-e, upc-a, qr, pdf-417, aztec, data-matrix) every 500ms and send them to the server where the code is inputted and the enter key is pressed. The same code will not be scanned twice for 5 seconds in a row.
