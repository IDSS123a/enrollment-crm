// Number-to-text conversion for BA (Bosnian), EN (English), and DE (German)

export type NumberTextLanguage = 'BA' | 'BS' | 'EN' | 'DE';

// ============ BOSNIAN ============
function numberToTextBA(n: number): string {
  if (n === 0) return 'nula';
  if (n < 0) return 'minus ' + numberToTextBA(-n);

  n = Math.floor(n);

  const units = ['', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];
  const teens = ['deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest',
    'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'];
  const tens = ['', '', 'dvadeset', 'trideset', 'četrdeset', 'pedeset',
    'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'];
  const hundreds = ['', 'sto', 'dvjesto', 'tristo', 'četiristo', 'petsto',
    'šeststo', 'sedamsto', 'osamsto', 'devetsto'];

  const parts: string[] = [];

  if (n >= 1000000) {
    const mil = Math.floor(n / 1000000);
    if (mil === 1) parts.push('milion');
    else if (mil >= 2 && mil <= 4) parts.push(numberToTextBA(mil) + ' miliona');
    else parts.push(numberToTextBA(mil) + ' miliona');
    n %= 1000000;
  }

  if (n >= 1000) {
    const tho = Math.floor(n / 1000);
    if (tho === 1) parts.push('hiljadu');
    else if (tho >= 2 && tho <= 4) parts.push(numberToTextBA(tho) + ' hiljade');
    else parts.push(numberToTextBA(tho) + ' hiljada');
    n %= 1000;
  }

  if (n >= 100) {
    parts.push(hundreds[Math.floor(n / 100)]);
    n %= 100;
  }

  if (n >= 20) {
    parts.push(tens[Math.floor(n / 10)]);
    n %= 10;
  }

  if (n >= 10) {
    parts.push(teens[n - 10]);
    n = 0;
  }

  if (n >= 1) {
    parts.push(units[n]);
  }

  return parts.filter(Boolean).join(' ').trim();
}

// ============ ENGLISH ============
function numberToTextEN(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return 'minus ' + numberToTextEN(-n);

  n = Math.floor(n);

  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty',
    'sixty', 'seventy', 'eighty', 'ninety'];

  const parts: string[] = [];

  if (n >= 1000000) {
    const mil = Math.floor(n / 1000000);
    parts.push(numberToTextEN(mil) + ' million');
    n %= 1000000;
  }

  if (n >= 1000) {
    const tho = Math.floor(n / 1000);
    parts.push(numberToTextEN(tho) + ' thousand');
    n %= 1000;
  }

  if (n >= 100) {
    parts.push(units[Math.floor(n / 100)] + ' hundred');
    n %= 100;
  }

  if (n >= 20) {
    const t = tens[Math.floor(n / 10)];
    const u = n % 10 > 0 ? '-' + units[n % 10] : '';
    parts.push(t + u);
    n = 0;
  } else if (n >= 10) {
    parts.push(teens[n - 10]);
    n = 0;
  }

  if (n >= 1) {
    parts.push(units[n]);
  }

  return parts.filter(Boolean).join(' ').trim();
}

// ============ GERMAN ============
function numberToTextDE(n: number): string {
  if (n === 0) return 'null';
  if (n < 0) return 'minus ' + numberToTextDE(-n);

  n = Math.floor(n);

  const units = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
  const teens = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn',
    'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
  const tens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig',
    'sechzig', 'siebzig', 'achtzig', 'neunzig'];

  const parts: string[] = [];

  if (n >= 1000000) {
    const mil = Math.floor(n / 1000000);
    if (mil === 1) parts.push('eine Million');
    else parts.push(numberToTextDE(mil) + ' Millionen');
    n %= 1000000;
  }

  if (n >= 1000) {
    const tho = Math.floor(n / 1000);
    if (tho === 1) parts.push('eintausend');
    else parts.push(numberToTextDE(tho) + 'tausend');
    n %= 1000;
  }

  if (n >= 100) {
    const h = Math.floor(n / 100);
    parts.push(units[h] + 'hundert');
    n %= 100;
  }

  if (n >= 20) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u > 0) {
      parts.push(units[u] + 'und' + tens[t]);
    } else {
      parts.push(tens[t]);
    }
    n = 0;
  } else if (n >= 10) {
    parts.push(teens[n - 10]);
    n = 0;
  } else if (n >= 1) {
    parts.push(units[n]);
  }

  return parts.filter(Boolean).join('').trim();
}

export function numberToText(n: number, language: NumberTextLanguage): string {
  switch (language) {
    case 'BA':
    case 'BS':
      return numberToTextBA(n);
    case 'EN':
      return numberToTextEN(n);
    case 'DE':
      return numberToTextDE(n);
    default:
      return numberToTextEN(n);
  }
}

// Grade names by language
export const gradeNames: Record<string, string[]> = {
  BA: ['prvi', 'drugi', 'treći', 'četvrti', 'peti', 'šesti', 'sedmi', 'osmi', 'deveti'],
  BS: ['prvi', 'drugi', 'treći', 'četvrti', 'peti', 'šesti', 'sedmi', 'osmi', 'deveti'],
  EN: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'],
  DE: ['erste', 'zweite', 'dritte', 'vierte', 'fünfte', 'sechste', 'siebte', 'achte', 'neunte'],
};

// Roman numerals
export function toRomanNumeral(n: number): string {
  const map: [number, string][] = [
    [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let result = '';
  for (const [val, sym] of map) {
    while (n >= val) {
      result += sym;
      n -= val;
    }
  }
  return result;
}

// Date formatting by locale
export function formatDateByLocale(date: Date | string, language: NumberTextLanguage): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  switch (language) {
    case 'BA':
    case 'BS':
      return d.toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit', year: 'numeric' }) + '.';
    case 'EN':
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    case 'DE':
      return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    default:
      return d.toLocaleDateString();
  }
}

// Currency formatting by locale
export function formatCurrencyByLocale(amount: number, language: NumberTextLanguage): string {
  switch (language) {
    case 'BA':
    case 'BS':
      return new Intl.NumberFormat('bs-BA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' KM';
    case 'EN':
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' KM';
    case 'DE':
      return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' KM';
    default:
      return amount.toFixed(2) + ' KM';
  }
}
