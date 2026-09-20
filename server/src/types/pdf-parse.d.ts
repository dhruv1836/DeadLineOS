declare module 'pdf-parse' {
  interface PdfData {
    text: string;
    numpages: number;
  }

  const parsePdf: (buffer: Buffer) => Promise<PdfData>;
  export default parsePdf;
}