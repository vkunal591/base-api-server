import jsPDF from "jspdf";
import dayjs from "dayjs";

export const generateInvoicePDF = (formData: any, signBase64?: string) => {
  const doc = new jsPDF("p", "mm", "a4");

  /* ================= CONFIG ================= */
  const PAGE_HEIGHT = 297;
  const PAGE_WIDTH = 210;
  const MARGIN = 10;
  const FOOTER_REQUIRED_HEIGHT = 85;
  const ROW_HEIGHT = 10;    

  let currentY = 15;
  let totalAmount = 0;

  /* ================= PAGE MANAGEMENT ================= */
  const ensureSpace = (requiredHeight: number) => {
    if (currentY + requiredHeight > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      currentY = MARGIN;
      drawHeader();
    }
  };

  /* ================= HEADER ================= */
  const drawHeader = () => {
    currentY = 15;

    doc.setLineWidth(0.6).line(5, currentY, 205, currentY);
    doc.setFont("helvetica", "bold").setFontSize(24);
    doc.text("SUD Group H.K. Co., Ltd.", 60, currentY + 12);

    doc.setFontSize(13);
    doc.text(
      "Unit 719B, 7/F, Tower B, Southmark, 11 Yip Hing Street, Wong Chuk Hang, Hong Kong.",
      20,
      currentY + 20
    );

    currentY += 35;
  };

  /* ================= TABLE HEADER ================= */
  const drawTableHeader = () => {
    ensureSpace(ROW_HEIGHT);

    doc.setLineWidth(0.4);
    doc.line(5, currentY, 205, currentY);

    doc.setFontSize(11);
    doc.text("Item", 7, currentY + 6);
    doc.text("Description", 35, currentY + 6);
    doc.text("Unit", 120, currentY + 6);
    doc.text("Cost", 138, currentY + 6);
    doc.text("Qty", 158, currentY + 6);
    doc.text("Amount", 180, currentY + 6);

    currentY += ROW_HEIGHT;
  };

  /* ================= TABLE ================= */
  const drawTable = (items: any[]) => {
    drawTableHeader();

    items.forEach((item, index) => {
      ensureSpace(ROW_HEIGHT);

      const unitCost = Number(item.unitCost) || 0;
      const qty = Number(item.quantity) || 0;
      const amount = unitCost * qty;
      totalAmount += amount;

      doc.setFontSize(9);
      doc.text(String(index + 1), 7, currentY + 6);
      doc.text(doc.splitTextToSize(item.itemDesc || "", 80), 35, currentY + 6);
      doc.text(item.unit || "", 120, currentY + 6);
      doc.text(unitCost.toLocaleString("en-US"), 138, currentY + 6);
      doc.text(qty.toString(), 158, currentY + 6);
      doc.text(amount.toLocaleString("en-US"), 180, currentY + 6);

      currentY += ROW_HEIGHT;
    });
  };

  /* ================= FOOTER ================= */
  const drawFooter = () => {
    ensureSpace(FOOTER_REQUIRED_HEIGHT);

    doc.setFontSize(16);
    doc.text("Total Invoice Amount (USD)", 7, currentY);
    doc.text(totalAmount.toLocaleString("en-US") + "/-", 160, currentY);

    currentY += 8;
    doc.setFontSize(10);
    doc.text("Amount in words:", 7, currentY);
    doc.text(formData.totalAmountInWords, 40, currentY);

    currentY += 12;
    doc.setFontSize(14);
    doc.text("Bank Details", 7, currentY);

    currentY += 8;
    doc.setFontSize(11);
    doc.text("Account Name: SUD Group Hong Kong Company Limited", 7, currentY);
    doc.text("Account Number: 582-634960-838", 7, currentY + 5);
    doc.text("Bank: HSBC (Hong Kong)", 7, currentY + 10);
    doc.text("Swift: HSBCHKHHHKH", 7, currentY + 15);

    if (signBase64) {
      doc.addImage(signBase64, "PNG", 140, currentY - 5, 45, 25);
    }
  };

  /* ================= EXECUTION ================= */
  drawHeader();
  drawTable(formData.workDetails);
  drawFooter();

  window.open(doc.output("bloburl"), "_blank");
};
