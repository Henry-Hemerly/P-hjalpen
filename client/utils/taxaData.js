export const taxa1 = ['Taxa1'];
export const taxa2 = ['Norrmalm', 'Gamla Stan', 'City'];
export const taxa3 = [
  'Kungsholmen',
  'Vasastan',
  'Östermalm',
  'Södermalm',
  'Södra Hammarbyhamnen',
  'Hjorthagen',
  'Kristineberg',
  'Marieberg',
  'Reimersholme',
  'Lilla Essingen',
  'Hammarby Sjöstad',
  'Gärdet',
];
export const taxa4 = [
  'Traneberg',
  'Ulvsunda',
  'Stora Essingen',
  'Gröndal',
  'Aspudden',
  'Midsommarkransen',
  'Liljeholmen',
  'Västberga',
  'Årsta',
  'Östberga',
  'Enskedefältet',
  'Enskede gård',
  'Johanneshov',
  'Gamla Enskede',
  'Hammarbyhöjden',
  'Kärrtorp',
  'Enskededalen',
  'Björkhagen',
];
export const taxa5 = [
  'Mariehäll',
  'Åkeshov',
  'Alvik',
  'Ålsten',
  'Bromma',
  'Hägersten',
  'Västertorp',
  'Bagarmossen',
];

export function checkTaxa(omrade) {
  if (taxa1.includes(omrade)) {
    return ['Taxa 1', '50kr/h 00-24', '50kr/h 00-24', '50kr/h 00-24'];
  } else if (taxa2.includes(omrade)) {
    return ['Taxa 2', '26kr/h 07-21', '26kr/h 09-19', '15kr/h'];
  } else if (taxa3.includes(omrade)) {
    return ['Taxa 3', '15kr/h 07-19', '10kr/h 11-17', 'ingen avgift'];
  } else if (taxa4.includes(omrade)) {
    return ['Taxa 4', '10kr/h 07-19', '10kr/h 11-17', 'ingen avgift'];
  } else if (taxa5.includes(omrade)) {
    return ['Taxa 5', '5kr/h 07-19', 'ingen avgift', 'ingen avgift'];
  }
  return ['Okänt', 'Okänt', 'Okänt', 'Okänt'];
}

export function checkAvgif(omrade) {
  let date = new Date().getDay();
  if (date > 0 && date < 6) {
    return checkTaxa(omrade)[1];
  } else if (date == 6) {
    return checkTaxa(omrade)[2];
  } else if (date == 0) {
    return checkTaxa(omrade)[3];
  }
}
