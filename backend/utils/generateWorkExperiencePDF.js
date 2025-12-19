import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateWorkExperiencePDF = (request) =>
  new Promise((resolve) => {
    const uploadsDir = "uploads";

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filePath = path.join(
      uploadsDir,
      `work_experience_${request._id}.pdf`
    );

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc
      .fontSize(18)
      .text("Debre Tabor University", { align: "center" })
      .moveDown();

    doc.fontSize(22).text("WORK EXPERIENCE CERTIFICATE", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14).text(
      `This is to certify that ${request.employee.name} served in the ${request.employee.department} department for a period of ${request.yearsOfService} years at Debre Tabor University.`,
      { align: "left" }
    );

    doc.end();

    resolve(filePath);
  });

export default generateWorkExperiencePDF;
