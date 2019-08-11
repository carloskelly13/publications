import { PubDocument } from "../types/pub-objects";
import { packageDocument } from "./package-document";

export default async function downloadPdf(doc: PubDocument) {
  const authorizationToken = localStorage.getItem("authorization_token");
  try {
    const response = await fetch(`/documents/${doc.id}/pdf`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authorizationToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document: packageDocument(doc),
      }),
    });
    const blob = await response.blob();
    const url = await URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.style.display = "none";
    a.download = `${doc.name}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);
  }
}
