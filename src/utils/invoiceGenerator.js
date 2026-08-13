import apiService from "../services/apiServices";

export const downloadInvoice = async (booking, type = "puja") => {
  if (!booking) {
    alert("Booking data is missing.");
    return;
  }

  const isPuja = type === "puja";
  const bookingIdStr = isPuja
    ? (booking.puja_booking_id || booking._id)
    : (booking.chadhava_booking_id || booking._id);

  try {
    const endpoint = isPuja
      ? "https://admin.diviniq.in/puja/downloadinvoice/" + booking._id
      : "https://admin.diviniq.in/puja/downloadchadhavainvoice/" + booking._id;

    const blob = await apiService.getBearerBlob(endpoint);
    if (blob && blob.type && blob.type.includes("pdf") && blob.size > 500) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Invoice-" + bookingIdStr + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return;
    }
  } catch (err) {
    console.warn("Backend invoice fetch failed or not PDF, using client generator:", err);
  }

  const title = isPuja
    ? (booking.puja_id?.title || booking.puja_type || "Sacred Puja Offering")
    : (booking.chadhava_id?.title || "Sacred Chadhava Offering");

  const totalAmount = Number(
    isPuja
      ? (booking.puja_amount || booking.total_amount || 0)
      : (booking.chadhava_amount || booking.total_amount || 0)
  );

  const rawDate = isPuja ? (booking.puja_date || booking.createdAt) : booking.createdAt;
  const dateStr = rawDate
    ? new Date(rawDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const paymentStatus = (booking.payment_status || "Success").toUpperCase();
  const paymentMode = booking.payment_mode || "Online Payment";

  const userDetails = booking.userDetails || {};
  const devoteeName = userDetails.name || booking.name || "Devotee";
  const devoteePhone = userDetails.whatsappNumber || userDetails.phone || booking.phone || "—";
  const gotra = userDetails.gotra || "";

  const addressObj = booking.deliveryAddress;
  const formattedAddress = addressObj
    ? [
        addressObj.houseNumber,
        addressObj.area,
        addressObj.city,
        addressObj.state,
        addressObj.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const addonsList = isPuja
    ? [...(booking.addons_selected || []), ...(booking.home_addons_selected || [])]
    : [...(booking.addons_selected || []), ...(booking.prasad_selected || [])];

  const subtotal = Number((totalAmount / 1.18).toFixed(2));
  const gstAmount = Number((totalAmount - subtotal).toFixed(2));

  const logoUrl = window.location.origin + "/assets/img/logo123.svg";

  let addonsRows = "";
  if (addonsList.length > 0) {
    addonsRows = addonsList
      .map(function (addon, i) {
        const itemTitle = addon.addon_name || addon.name || addon.title || "Addon / Prasad Item";
        const itemQty = addon.qty || 1;
        return "<tr>" +
          "<td>" + (i + 2) + "</td>" +
          "<td>" + itemTitle + " (Qty: " + itemQty + ")</td>" +
          "<td>Addon</td>" +
          '<td class="text-right">Included</td>' +
          "</tr>";
      })
      .join("");
  }

  const gotraHtml = gotra ? "<p>Gotra: " + gotra + "</p>" : "";
  const addressHtml = formattedAddress
    ? '<p style="margin-top:6px;"><strong>Delivery Address:</strong><br/>' + formattedAddress + "</p>"
    : "";
  const pkgInfoHtml =
    isPuja && booking.puja_type
      ? '<div style="font-size:12px; color:#718096;">Package: ' + booking.puja_type + "</div>"
      : "";

  const htmlLines = [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="UTF-8">',
    "  <title>Invoice - " + bookingIdStr + "</title>",
    "  <style>",
    "    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }",
    "    body { background: #fdfdfd; color: #2d3748; padding: 30px; }",
    "    .invoice-box {",
    "      max-width: 800px;",
    "      margin: auto;",
    "      padding: 35px;",
    "      border: 1px solid #eee;",
    "      border-radius: 12px;",
    "      background: #ffffff;",
    "      box-shadow: 0 4px 20px rgba(0,0,0,0.05);",
    "    }",
    "    .header {",
    "      display: flex;",
    "      justify-content: space-between;",
    "      align-items: center;",
    "      padding-bottom: 24px;",
    "      border-bottom: 2px solid #7B1C38;",
    "    }",
    "    .logo-section img {",
    "      max-height: 52px;",
    "      width: auto;",
    "    }",
    "    .logo-section p {",
    "      font-size: 12px;",
    "      color: #718096;",
    "      margin-top: 4px;",
    "    }",
    "    .invoice-title-badge {",
    "      text-align: right;",
    "    }",
    "    .invoice-title-badge h2 {",
    "      color: #7B1C38;",
    "      font-size: 24px;",
    "      letter-spacing: 1px;",
    "      margin-bottom: 4px;",
    "    }",
    "    .invoice-title-badge .status-tag {",
    "      display: inline-block;",
    "      background: #dcfce7;",
    "      color: #15803d;",
    "      font-size: 11px;",
    "      font-weight: 700;",
    "      padding: 3px 10px;",
    "      border-radius: 12px;",
    "      text-transform: uppercase;",
    "    }",
    "    .details-grid {",
    "      display: flex;",
    "      justify-content: space-between;",
    "      margin: 24px 0;",
    "      gap: 20px;",
    "    }",
    "    .box {",
    "      flex: 1;",
    "      background: #fdf8f4;",
    "      padding: 16px;",
    "      border-radius: 8px;",
    "      border: 1px solid #f6e0d3;",
    "    }",
    "    .box h4 {",
    "      font-size: 12px;",
    "      text-transform: uppercase;",
    "      color: #7B1C38;",
    "      letter-spacing: 0.5px;",
    "      margin-bottom: 8px;",
    "    }",
    "    .box p {",
    "      font-size: 13.5px;",
    "      color: #4a5568;",
    "      line-height: 1.5;",
    "    }",
    "    .box p strong {",
    "      color: #1a202c;",
    "    }",
    "    table {",
    "      width: 100%;",
    "      border-collapse: collapse;",
    "      margin-top: 20px;",
    "    }",
    "    th {",
    "      background: #7B1C38;",
    "      color: #ffffff;",
    "      font-size: 12.5px;",
    "      text-transform: uppercase;",
    "      letter-spacing: 0.5px;",
    "      padding: 12px 14px;",
    "      text-align: left;",
    "    }",
    "    td {",
    "      padding: 12px 14px;",
    "      border-bottom: 1px solid #e2e8f0;",
    "      font-size: 13.5px;",
    "      color: #2d3748;",
    "    }",
    "    .text-right { text-align: right; }",
    "    .summary-section {",
    "      display: flex;",
    "      justify-content: flex-end;",
    "      margin-top: 20px;",
    "    }",
    "    .summary-table {",
    "      width: 320px;",
    "      border-collapse: collapse;",
    "    }",
    "    .summary-table td {",
    "      padding: 8px 12px;",
    "      border-bottom: 1px solid #edf2f7;",
    "      font-size: 13.5px;",
    "    }",
    "    .summary-table tr.total-row td {",
    "      border-top: 2px solid #7B1C38;",
    "      border-bottom: none;",
    "      font-weight: 700;",
    "      font-size: 16px;",
    "      color: #7B1C38;",
    "    }",
    "    .footer-note {",
    "      margin-top: 35px;",
    "      padding-top: 20px;",
    "      border-top: 1px dashed #cbd5e0;",
    "      text-align: center;",
    "      font-size: 12px;",
    "      color: #718096;",
    "      line-height: 1.6;",
    "    }",
    "    .footer-note span {",
    "      color: #7B1C38;",
    "      font-weight: 600;",
    "    }",
    "    @media print {",
    "      body { background: #fff; padding: 0; }",
    "      .invoice-box { border: none; box-shadow: none; padding: 0; }",
    "    }",
    "  </style>",
    "</head>",
    "<body>",
    '  <div class="invoice-box">',
    '    <div class="header">',
    '      <div class="logo-section">',
    '        <img src="' + logoUrl + '" alt="DivinIQ Logo" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';" />',
    '        <h2 style="display:none; color:#7B1C38; font-size:24px; font-weight:bold;">DivinIQ</h2>',
    "        <p>Sacred Rituals &amp; Divine Offerings</p>",
    '        <p style="font-size:11px; color:#a0aec0;">www.diviniq.store | support@diviniq.store</p>',
    "      </div>",
    '      <div class="invoice-title-badge">',
    "        <h2>TAX INVOICE</h2>",
    '        <span class="status-tag">' + paymentStatus + "</span>",
    "      </div>",
    "    </div>",
    '    <div class="details-grid">',
    '      <div class="box">',
    "        <h4>Billed To (Devotee)</h4>",
    "        <p><strong>" + devoteeName + "</strong></p>",
    "        <p>Phone: +91 " + devoteePhone + "</p>",
    "        " + gotraHtml,
    "        " + addressHtml,
    "      </div>",
    '      <div class="box">',
    "        <h4>Invoice Info</h4>",
    "        <p><strong>Invoice No:</strong> #" + bookingIdStr + "</p>",
    "        <p><strong>Booking Type:</strong> " + (isPuja ? "Puja Seva" : "Chadhava Seva") + "</p>",
    "        <p><strong>Date:</strong> " + dateStr + "</p>",
    "        <p><strong>Payment Mode:</strong> " + paymentMode + "</p>",
    "      </div>",
    "    </div>",
    "    <table>",
    "      <thead>",
    "        <tr>",
    "          <th>#</th>",
    "          <th>Service / Item Description</th>",
    "          <th>Category</th>",
    '          <th class="text-right">Amount</th>',
    "        </tr>",
    "      </thead>",
    "      <tbody>",
    "        <tr>",
    "          <td>1</td>",
    "          <td>",
    "            <strong>" + title + "</strong>",
    "            " + pkgInfoHtml,
    "          </td>",
    "          <td>" + (isPuja ? "Puja Ritual" : "Chadhava Offering") + "</td>",
    '          <td class="text-right">&#8377;' + subtotal.toFixed(2) + "</td>",
    "        </tr>",
    "        " + addonsRows,
    "      </tbody>",
    "    </table>",
    '    <div class="summary-section">',
    '      <table class="summary-table">',
    "        <tr>",
    "          <td>Taxable Amount (Subtotal)</td>",
    '          <td class="text-right">&#8377;' + subtotal.toFixed(2) + "</td>",
    "        </tr>",
    "        <tr>",
    "          <td>GST (18%)</td>",
    '          <td class="text-right">&#8377;' + gstAmount.toFixed(2) + "</td>",
    "        </tr>",
    "        <tr>",
    "          <td>Platform Fee</td>",
    '          <td class="text-right">&#8377;0.00</td>',
    "        </tr>",
    '        <tr class="total-row">',
    "          <td>Total Amount Paid</td>",
    '          <td class="text-right">&#8377;' + totalAmount.toFixed(2) + "</td>",
    "        </tr>",
    "      </table>",
    "    </div>",
    '    <div class="footer-note">',
    "      <p>Thank you for using <span>DivinIQ</span> for your sacred offerings.</p>",
    "      <p>May divine grace and blessings bring prosperity and peace to your family.</p>",
    '      <p style="margin-top: 8px; font-size: 11px; color: #a0aec0;">This is a computer-generated invoice and requires no physical signature.</p>',
    "    </div>",
    "  </div>",
    "</body>",
    "</html>"
  ];

  const htmlContent = htmlLines.join("\n");

  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(function () {
      try {
        printWindow.print();
      } catch (e) {
        console.error("Print error:", e);
      }
    }, 400);
  } else {
    alert("Pop-up blocker is preventing the invoice from opening. Please allow pop-ups for this site.");
  }
};

export default downloadInvoice;
