/**
 * Verify if input string is a single capital letter
 * @param {string} str 
 * @returns boolean
 */
export const isSingleLetter = (str) => {
  return /^[A-Z]$/.test(str);
}

/**
 * Verify if the player wins 
 * @param {number[]} score 
 * @returns boolean
 */
export const checkForWin = (score) => {
  return score.every(x => x === 2);
}