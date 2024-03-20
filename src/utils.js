import "./blob-stream";
import { createPdf } from "pdfmake";

import "./vfs_fonts";

console.log(createPdf);

var fonts = {
  Inter: {
    normal: "Inter-regular.ttf",
  },
};

const pageMargin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

export function createPDF(chartCtr) {
  // get svg string
  const svg = chartCtr.querySelector("svg");

  //   get title and subtitle .headline and .subtitle with styles
  const title = chartCtr.querySelector(".headline");
  const subtitle = chartCtr.querySelector(".subtitle");

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

  var docDefinition = {
    defaultStyle: {
      font: "Inter",
    },
    content: [
      {
        text: title.textContent,
        style: "header",
      },
      {
        svg: svg.outerHTML,
        width: 600,
        height: 400,
        css: true,
      },
      {
        text: subtitle.textContent,
        style: "subheader",
      },
    ],
    styles: {
      header: {
        font: "Inter",
        fontSize: titleFontSize,
      },
      subheader: {
        font: "Inter",
        fontSize: subtitleFontSize,
      },
    },
  };

  var doc = createPdf(docDefinition, null, fonts);

  doc.getBlob((blob) => {
    // download to file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "example.pdf";
    a.click();
  });
}
