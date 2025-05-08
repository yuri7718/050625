/**
 * Verify if input string is a single capital letter
 * @param {string} str 
 * @returns boolean
 */
export const isSingleLetter = (str) => {
  return /^[A-Z]$/.test(str);
}