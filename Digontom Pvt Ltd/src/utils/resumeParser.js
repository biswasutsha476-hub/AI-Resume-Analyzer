// File parsing helper for PDF and text files in browser

export const parseResumeFile = async (file) => {
  if (!file) return "";

  const fileType = file.name.split('.').pop().toLowerCase();

  if (fileType === 'txt' || fileType === 'md') {
    return await readAsText(file);
  } else if (fileType === 'pdf') {
    return await readPdfFile(file);
  } else {
    // Fallback try reading as text
    return await readAsText(file);
  }
};

const readAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || "");
    reader.onerror = () => reject(new Error("Failed to read text file"));
    reader.readAsText(file);
  });
};

const readPdfFile = async (file) => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Set worker src if needed
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim();
  } catch (err) {
    console.warn("PDF parsing fallback to raw text read:", err);
    return await readAsText(file);
  }
};
