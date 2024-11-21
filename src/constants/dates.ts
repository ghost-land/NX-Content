export const DATE_FORMATS = [
  {
    // ISO format: YYYY-MM-DD
    pattern: /^(\d{4})-(\d{2})-(\d{2})(?:T|\s|$)/,
    parse: (match: RegExpMatchArray) => new Date(
      parseInt(match[1]), 
      parseInt(match[2]) - 1, 
      parseInt(match[3])
    )
  },
  {
    // Compact format: YYYYMMDD
    pattern: /^(\d{4})(\d{2})(\d{2})/,
    parse: (match: RegExpMatchArray) => new Date(
      parseInt(match[1]), 
      parseInt(match[2]) - 1, 
      parseInt(match[3])
    )
  }
];