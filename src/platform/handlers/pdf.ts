import React from "react";
import ReactDOMServer from "react-dom/server";
import * as htmlPdf from "html-pdf-chrome";
import { Request, Response } from "express";
import { PubDocument, PubPage } from "../../types/pub-objects";
import Canvas from "../../components/canvas";

const defaultProps = {
  thumbnail: false,
  dpi: 96,
  zoom: 1,
  allowsEditing: false,
  selectedShape: null,
  updateSelectedObject: () => {},
};

const basePrintOptions = {
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  pageRanges: "1",
};

const baseHtml = `
  <style>
    p { font-size: 14px; font-family: sans-serif; margin: 0; padding: 0; line-height: 1; }
  </style>
`;

function generateHtmlFromDocument(document: PubDocument) {
  const canvas = React.createElement(Canvas, {
    ...defaultProps,
    width: document.pages[0].width,
    height: document.pages[0].height,
    sortedShapes: document.pages[0].shapes,
  });
  return ReactDOMServer.renderToString(canvas);
}

export default async function documentPdfHandler(req: Request, res: Response) {
  const { document } = req.body;
  try {
    const documentHtml = generateHtmlFromDocument(document as any);
    const { width, height } = document.pages[0] as PubPage;
    const isLandscape = width > height;
    const pdf = await htmlPdf.create(
      `
      ${baseHtml}
      <div ${
        isLandscape ? `style="transform: scale3d(1.03, 1.042, 1.0);` : ""
      }">
        ${documentHtml}
      </div>
    `,
      {
        port: 9922,
        printOptions: {
          ...basePrintOptions,
          landscape: isLandscape,
          paperWidth: isLandscape ? height : width,
          paperHeight: isLandscape ? width : height,
          printBackground: true,
        },
      }
    );
    return res.send(pdf.toBuffer());
  } catch (e) {
    return res.status(404).send();
  }
}
