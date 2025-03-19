/**
 * The string typically looks like:
 *   c("https://example.com/img1.jpg", "https://example.com/img2.jpg", ...)
 * We remove the 'c(' prefix, trailing ')', then split by '", "'
 * and strip any extra quotes.
 */
export function parseImagesString(imageString: string): string[] {
  if (!imageString) return [];

  // Trim whitespace just in case
  let cleaned = imageString.trim();

  // Remove leading c(" if present
  if (cleaned.startsWith('c("')) {
    cleaned = cleaned.substring(3);
  }

  // Remove trailing ) if present
  if (cleaned.endsWith(")")) {
    cleaned = cleaned.slice(0, -1);
  }

  // Now we have something like: "https://example.com/img1.jpg", "https://example.com/img2.jpg", ...
  // Split on '", "'
  const parts = cleaned.split('", "');

  // Remove any leading or trailing double quotes on each part
  const urls = parts.map((part) =>
    part.replace(/^"/, "").replace(/"$/, "").trim()
  );

  console.log(urls);
  // Filter out empty strings if any
  return urls.filter((url) => url.length > 0);
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
