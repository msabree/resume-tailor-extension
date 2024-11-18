export const detectPlaceholders = (text: string): boolean => {
    // Regular expression to detect placeholders (anything between square brackets)
    const pattern = /\[.*?\]/g;
    
    // Test if the pattern matches any placeholder text
    const placeholders = text.match(pattern);
    
    // Return true if placeholders are found, otherwise false
    return placeholders !== null;
}