export const generateCode = () => {
    const code = Math.floor(Math.random() * 999999).toString();
    return code.padStart(6, '0');
};