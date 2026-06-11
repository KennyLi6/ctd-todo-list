import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim(), {
        ALLOWED_TAGS: [], // Remove all HTML tags
        ALLOWED_ATTR: []  // Remove all attributes
    });
}