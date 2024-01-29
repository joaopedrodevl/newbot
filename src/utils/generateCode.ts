/**
 * Generates a random code with 6 digits.
 * @returns The generated code.
 */
export const generateCode = () => {
    const code = Math.floor(Math.random() * 999999).toString();
    return code.padStart(6, '0');
};