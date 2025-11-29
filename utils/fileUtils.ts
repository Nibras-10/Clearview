import * as pdfjsLib from 'pdfjs-dist';

// Explicitly set the worker source to match the version in importmap
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://aistudiocdn.com/pdfjs-dist@4.0.379/build/pdf.worker.mjs';

export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const readPdfFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Using 'any' for the document loading to bypass strict type checks in this environment
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items = textContent.items as any[];
      
      if (items.length === 0) continue;

      // 1. Sort items: Top to Bottom (Y desc), then Left to Right (X asc)
      // PDF coordinates: (0,0) is usually bottom-left.
      items.sort((a, b) => {
        const yA = a.transform[5];
        const yB = b.transform[5];
        
        // Tolerance for same line (e.g. 5 units)
        if (Math.abs(yA - yB) > 5) {
          return yB - yA; // Descending Y
        }
        return a.transform[4] - b.transform[4]; // Ascending X
      });

      // 2. Reconstruct text with smart spacing
      let pageText = '';
      let lastY = -1;
      let lastX = -1;
      let lastWidth = 0;

      for (const item of items) {
        const str = item.str;
        const x = item.transform[4];
        const y = item.transform[5];
        const width = item.width || 0;

        if (lastY === -1) {
          // First item
          pageText += str;
        } else {
          // Check for new line (significant Y difference)
          if (Math.abs(y - lastY) > 8) { 
             pageText += '\n';
             // Double newline if gap is large (paragraph break)
             if (Math.abs(y - lastY) > 24) {
               pageText += '\n';
             }
          } else {
             // Same line: Calculate gap
             // Gap = current_x - (prev_x + prev_width)
             const gap = x - (lastX + lastWidth);
             
             // If gap is greater than ~2 units, it's likely a space.
             // If gap is small or negative, it's kerning/ligatures (part of same word).
             if (gap > 3.5 && str.trim().length > 0) {
               pageText += ' ';
             }
          }
          // Append current text, but don't add duplicate text if it's exactly the same position (sometimes happens in PDFs)
          // Actually, just append.
          if (pageText.endsWith('\n')) {
             // If we just added a newline, trimming leading spaces of the new chunk is usually good
             pageText += str.trimStart();
          } else {
             pageText += str;
          }
        }

        lastY = y;
        lastX = x;
        lastWidth = width;
      }
      
      fullText += pageText + '\n\n';
    }
    
    // Post-processing cleaning
    return fullText
      // Fix specific artifact "nn" at start of lines (often bullet points)
      .replace(/(\n|^)\s*nn\s+/g, '$1• ') 
      .replace(/(\n|^)\s*n\s+/g, '$1• ')
      // Normalize newlines
      .replace(/\r\n/g, '\n') 
      // Reduce excessive newlines
      .replace(/\n{3,}/g, '\n\n') 
      .trim();
      
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw new Error("Failed to parse PDF file.");
  }
};