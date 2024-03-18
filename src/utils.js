import "./pdfkit.standalone";

import "./blob-stream";
import SVGtoPDF from "svg-to-pdfkit";

PDFDocument.prototype.addSVG = function (svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

const pageMargin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

export async function createPDF(chartCtr) {
  console.log(chartCtr);
  const doc = new PDFDocument({
    pdfVersion: "1.5",
    lang: "en-US",
    tagged: true,
    displayTitle: true,
  });
  doc.registerFont("heading", "Times-Roman", "Playfair");
  doc.registerFont("subtitle", "Helvetica", "Helvetica");
  //   get title and subtitle .headline and .subtitle with styles
  const title = chartCtr.querySelector(".headline");
  const subtitle = chartCtr.querySelector(".subtitle");

  // get the chart
  // get the svg
  const svg = chartCtr.querySelector("svg");

  /*
    doc [PDFDocument] = the PDF document created with PDFKit
    svg [SVGElement or string] = the SVG object or XML code
    x, y [number] = the position where the SVG will be added
    options [Object] = >
        - width, height [number] = initial viewport, by default it's the page dimensions
        - preserveAspectRatio [string] = override alignment of the SVG content inside its viewport
        - useCSS [boolean] = use the CSS styles computed by the browser (for SVGElement only)
        - fontCallback [function] = function called to get the fonts, see source code
        - imageCallback [function] = same as above for the images (for Node.js)
        - documentCallback [function] = same as above for the external SVG documents
        - colorCallback [function] = function called to get color, making mapping to CMYK possible
        - warningCallback [function] = function called when there is a warning
        - assumePt [boolean] = assume that units are PDF points instead of SVG pixels
        - precision [number] = precision factor for approximative calculations (default = 3)
    */

  // get the svg, headline and subtitles' x and y client rects relative to the chartCtr
  const svgRect = svg.getBoundingClientRect();
  const titleRect = title.getBoundingClientRect();
  const subtitleRect = subtitle.getBoundingClientRect();
  const chartRect = chartCtr.getBoundingClientRect();

  // get the svg, headline and subtitles' x and y client rects relative to the chartCtr
  const svgX = svgRect.x - chartRect.x + pageMargin.left;
  const svgY = svgRect.y - chartRect.y + pageMargin.top;
  const titleX = titleRect.x - chartRect.x + pageMargin.left;
  const titleY = titleRect.y - chartRect.y + pageMargin.top;
  const subtitleX = subtitleRect.x - chartRect.x + pageMargin.left;
  const subtitleY = subtitleRect.y - chartRect.y + pageMargin.top;

  //   get font sizes computed
  const titleFontSize = +window
    .getComputedStyle(title)
    .fontSize.replace("px", "");
  const subtitleFontSize = +window
    .getComputedStyle(subtitle)
    .fontSize.replace("px", "");

  // add the title and subtitle
  doc
    .font("heading")
    .fontSize(titleFontSize)
    .text(title.textContent, titleX, titleY);

  doc
    .font("subtitle")
    .fontSize(subtitleFontSize)
    .text(subtitle.textContent, subtitleX, subtitleY);

  // add the svg
  doc.addSVG(svg, svgX, svgY, {
    preserveAspectRatio: "xMinYMin meet",
    width: 500,
    useCSS: true,
  });

  // add your content to the document here, as usual
  // get a blob when you're done
  doc.end();

  const stream = doc.pipe(blobStream());
  stream.on("finish", function () {
    // get a blob you can do whatever you like with
    const blob = stream.toBlob("application/pdf");
    // download to file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "example.pdf";
    a.click();
  });
}
