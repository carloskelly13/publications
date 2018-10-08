import React from "react";
import ReactDOMServer from "react-dom/server";
import * as htmlPdf from "html-pdf-chrome";
import { RequestHandler } from "express";
import db from "../database/";
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

const documentPdfHandler: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const [document] = await db.getDocument({ id, userId: req.user.id });
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
};

const generateHtmlFromDocument = (document: PubDocument): string => {
  const canvas = React.createElement(Canvas, {
    ...defaultProps,
    width: document.pages[0].width,
    height: document.pages[0].height,
    sortedShapes: document.pages[0].shapes,
  });
  return ReactDOMServer.renderToString(canvas);
};

export default documentPdfHandler;
