/**
 * The string typically looks like:
 *   c("https://example.com/img1.jpg", "https://example.com/img2.jpg", ...)
 * We remove the 'c(' prefix, trailing ')', then split by '", "'
 * and strip any extra quotes.
 */
export function parseImagesString(imageString: string): string[] {
  
  if (!imageString) return [];

  // If the server returns `character(0)`, treat it as no images
  if (imageString.trim() === 'character(0)') {
    return [];
  }

  let cleaned = imageString.trim();

  // If it starts with c( or c ( or c( plus maybe spacing, remove that prefix
  const cLeftParenRegex = /^c\s?\(\s?/;
  if (cLeftParenRegex.test(cleaned)) {
    cleaned = cleaned.replace(cLeftParenRegex, '');
  }

  // If it ends with ) remove it
  if (cleaned.endsWith(')')) {
    cleaned = cleaned.slice(0, -1).trim();
  }

  // Now we might have something like:
  //  "https://example.com/img1.jpg", "https://example.com/img2.jpg", ...
  // If there's a '", "' or '","' we split by that. Otherwise, it could be just one URL
  let parts: string[] = [];
  if (cleaned.includes('", "')) {
    parts = cleaned.split('", "');
  } else if (cleaned.includes('","')) {
    parts = cleaned.split('","');
  } else {
    
    parts = [cleaned];
  }

  // Remove leading/trailing quotes from each part
  parts = parts.map((part) =>
    part.replace(/^"/, '').replace(/"$/, '').trim()
  );

  // Filter out empty strings
  return parts.filter((url) => url.length > 0);
}

export function parseInstructionsString(instructions: string): string[] {
  if (!instructions) return [];

  let cleaned = instructions.trim();

  // Remove leading c(" if present
  if (cleaned.startsWith('c("')) {
    cleaned = cleaned.substring(3);
  }

  // Remove trailing ) if present
  if (cleaned.endsWith(")")) {
    cleaned = cleaned.slice(0, -1);
  }

  // Split on '", "' to get each instruction
  const parts = cleaned.split('", "');
  // Remove any stray quotes and trim whitespace
  const steps = parts.map((part) =>
    part.replace(/^"/, "").replace(/"$/, "").trim()
  );

  return steps.filter((step) => step.length > 0);
}
