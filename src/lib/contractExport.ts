import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopPosition, TabStopType } from 'docx';
import { saveAs } from 'file-saver';
import type { ContractTemplateData } from './contractTemplates';

// ============ PDF EXPORT (via print) ============
export function exportContractPDF(html: string, filename: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.document.title = filename;
      printWindow.print();
    }, 500);
  };
}

// ============ DOCX EXPORT ============
export async function exportContractDOCX(data: ContractTemplateData, language: string, filename: string) {
  const lang = language.toUpperCase();
  const doc = buildDocx(data, lang);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

function buildDocx(d: ContractTemplateData, lang: string): Document {
  const sections = lang === 'DE' ? buildDE(d) : lang === 'EN' ? buildEN(d) : buildBA(d);
  
  return new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 22 },
          paragraph: { spacing: { after: 80 } },
        },
      },
    },
    sections: [{ children: sections }],
  });
}

function title(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: 'Times New Roman', characterSpacing: 200 })],
  });
}

function subtitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [new TextRun({ text, size: 22, font: 'Times New Roman' })],
  });
}

function articleTitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 60 },
    children: [new TextRun({ text, bold: true, size: 22, font: 'Times New Roman' })],
  });
}

function articleSubtitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: true, size: 20, font: 'Times New Roman' })],
  });
}

function para(text: string, bold = false): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 22, font: 'Times New Roman', bold })],
  });
}

function filledPara(label: string, value: string, suffix: string = ''): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({ text: label, size: 22, font: 'Times New Roman' }),
      new TextRun({ text: value, size: 22, font: 'Times New Roman', bold: true, underline: {} }),
      new TextRun({ text: suffix, size: 22, font: 'Times New Roman' }),
    ],
  });
}

function bulletItem(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 22, font: 'Times New Roman' })],
  });
}

function signatureLine(label: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200 },
    children: [
      new TextRun({ text: '_____________________________________________ ', size: 22, font: 'Times New Roman' }),
      new TextRun({ text: `(${label})`, size: 22, font: 'Times New Roman' }),
    ],
  });
}

function buildBA(d: ContractTemplateData): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(title('U G O V O R'));
  paragraphs.push(subtitle(`o osnovnoškolskom odgoju i obrazovanju za upis učenika u ${d.grade_number} (slovima: ${d.grade_text}) razred, zaključen dana ${d.contract_date} godine u Sarajevu.`));
  
  paragraphs.push(para('Ugovorne strane:', true));
  paragraphs.push(para('1. P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo, ID Broj 4202220420007, Buka 13, 71 000 Sarajevo, zastupana po direktoru Davor Mulalić (u daljem tekstu: IDSS)'));
  paragraphs.push(filledPara('2. ', d.parent1_full_name, ' (ime i prezime majke/staratelja)'));
  paragraphs.push(filledPara('', d.parent2_full_name, ' (ime i prezime oca/staratelja)'));
  paragraphs.push(filledPara('', d.address, ' (adresa prebivališta)'));
  paragraphs.push(para('kao Korisnik usluga (u daljem tekstu: roditelj/staratelj)'));

  // Član 1
  paragraphs.push(articleTitle('Član 1.'));
  paragraphs.push(articleSubtitle('(PREDMET UGOVORA)'));
  paragraphs.push(para('1. Predmet ovog Ugovora je utvrđivanje zajedničkih prava i obaveza IDSS i roditelja/staratelja, čijem djetetu IDSS pruža uslugu osnovnoškolskog odgoja i obrazovanja.'));
  paragraphs.push(para('2. Potpisivanjem ovog Ugovora roditelj/staratelj upisuje svoje dijete'));
  paragraphs.push(filledPara('(ime i prezime djeteta) ', d.child_full_name));
  paragraphs.push(filledPara('(datum rođenja) ', d.child_dob));
  paragraphs.push(para('u osnovnu školu IDSS, u svrhu sticanja osnovnoškolskog odgoja i obrazovanja.'));

  // Član 2
  paragraphs.push(articleTitle('Član 2.'));
  paragraphs.push(articleSubtitle('(NOVI I REDOVNI UPISI)'));
  paragraphs.push(para('Dijete će se smatrati upisanim i njegovo mjesto u IDSS će biti rezervisano nakon:'));
  paragraphs.push(filledPara('1. dostavljenog kompletno popunjenog upisnog obrasca.\n2. izvršene uplate upisnine u iznosu od ', d.enrollment_fee_amount, ` KM (slovima: ${d.enrollment_fee_text} i 00/100 KM).`));
  paragraphs.push(filledPara('3. izvršene uplate depozita u iznosu od ', d.deposit_amount, ` KM (slovima: ${d.deposit_text} i 00/100 KM).`));

  // Član 3
  paragraphs.push(articleTitle('Član 3.'));
  paragraphs.push(articleSubtitle('(ŠKOLARINA I UPLATA)'));
  paragraphs.push(filledPara(`Godišnja školarina za školsku ${d.academic_year} godinu iznosi: `, d.tuition_annual_amount, ` KM (slovima: ${d.tuition_annual_text} i 00/100 KM).`));

  if (d.payment_type === 'installments') {
    paragraphs.push(filledPara('Plaćanje školarine vršiće se u ', d.installments_number, ` (slovima: ${d.installments_text}) jednakih mjesečnih rata, a prva mjesečna rata dospijeva dana ${d.first_payment_date}.`));
  }

  paragraphs.push(para('P.U. Internationale Deutsche Schule Sarajevo'));
  paragraphs.push(para('SPARKASSE BANK d.d., Sarajevo'));
  paragraphs.push(para('BROJ RAČUNA: 1994990021809884'));
  paragraphs.push(para('IBAN BA39 1994990021809884 SWIFT (BIC) ABSBBA22'));

  // Articles 4-18 (abbreviated for DOCX)
  for (let i = 4; i <= 18; i++) {
    paragraphs.push(articleTitle(`Član ${i}.`));
    paragraphs.push(para(getArticleTextBA(i, d)));
  }

  // Signatures
  paragraphs.push(para('P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo'));
  paragraphs.push(signatureLine('Davor Mulalić, Direktor'));
  paragraphs.push(para('"Ovim potpisom potvrđujemo da želimo upisati svoje dijete u Međunarodnu njemačku školu Sarajevo (IDSS)."'));
  paragraphs.push(filledPara('', d.parent1_full_name, ' (ime i prezime majke/staratelja)'));
  paragraphs.push(signatureLine('potpis majke/staratelja'));
  paragraphs.push(filledPara('', d.parent2_full_name, ' (ime i prezime oca/staratelja)'));
  paragraphs.push(signatureLine('potpis oca/staratelja'));
  paragraphs.push(filledPara('', d.signature_date, ' (datum)'));

  return paragraphs;
}

function buildEN(d: ContractTemplateData): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(title('A G R E E M E N T'));
  paragraphs.push(subtitle(`on primary school education for enrollment of students in ${d.grade_number} (in letters: ${d.grade_text}) class, concluded on ${d.contract_date} in Sarajevo.`));
  
  paragraphs.push(para('Agreement Parties:', true));
  paragraphs.push(para('1. P.U. Internationale Deutsche Schule Sarajevo, ID 4202220420007, Buka 13, 71 000 Sarajevo, represented by director Davor Mulalić (hereinafter: IDSS)'));
  paragraphs.push(filledPara('2. ', d.parent1_full_name, ' (name and surname of mother/guardian)'));
  paragraphs.push(filledPara('', d.parent2_full_name, ' (name and surname of father/guardian)'));
  paragraphs.push(filledPara('', d.address, ' (address of residence)'));
  paragraphs.push(para('as the Service User (hereinafter: parent/guardian).'));

  paragraphs.push(articleTitle('Article 1.'));
  paragraphs.push(articleSubtitle('(SUBJECT OF THE AGREEMENT)'));
  paragraphs.push(filledPara('(name and surname of the child) ', d.child_full_name));
  paragraphs.push(filledPara('(date of birth) ', d.child_dob));

  paragraphs.push(articleTitle('Article 2.'));
  paragraphs.push(articleSubtitle('(NEW AND REGULAR ENROLLMENTS)'));
  paragraphs.push(filledPara('Registration fee: ', d.enrollment_fee_amount, ` KM (in letters: ${d.enrollment_fee_text} and 00/100 KM).`));
  paragraphs.push(filledPara('Deposit: ', d.deposit_amount, ` KM (in letters: ${d.deposit_text} and 00/100 KM).`));

  paragraphs.push(articleTitle('Article 3.'));
  paragraphs.push(articleSubtitle('(TUITION FEES AND PAYMENT)'));
  paragraphs.push(filledPara(`Annual tuition for ${d.academic_year}: `, d.tuition_annual_amount, ` KM (in letters: ${d.tuition_annual_text} and 00/100 KM).`));

  if (d.payment_type === 'installments') {
    paragraphs.push(filledPara('Payable in ', d.installments_number, ` (in letters: ${d.installments_text}) equal monthly installments, first due on ${d.first_payment_date}.`));
  }

  paragraphs.push(para('SPARKASSE BANK d.d., Sarajevo'));
  paragraphs.push(para('ACCOUNT NUMBER: 1994990021809884'));
  paragraphs.push(para('IBAN BA39 1994990021809884 SWIFT (BIC) ABSBBA22'));

  for (let i = 4; i <= 18; i++) {
    paragraphs.push(articleTitle(`Article ${i}.`));
    paragraphs.push(para(getArticleTextEN(i)));
  }

  paragraphs.push(signatureLine('Davor Mulalić, Director'));
  paragraphs.push(filledPara('', d.parent1_full_name, ' (mother/guardian)'));
  paragraphs.push(signatureLine('signature'));
  paragraphs.push(filledPara('', d.parent2_full_name, ' (father/guardian)'));
  paragraphs.push(signatureLine('signature'));
  paragraphs.push(filledPara('', d.signature_date, ' (date)'));

  return paragraphs;
}

function buildDE(d: ContractTemplateData): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(title('V E R T R A G'));
  paragraphs.push(subtitle(`über die Grundschulbildung für die Einschreibung in die ${d.grade_number}. (in Worten: ${d.grade_text}) Klasse, geschlossen am ${d.contract_date} in Sarajevo.`));
  
  paragraphs.push(para('Vertragsparteien:', true));
  paragraphs.push(para('1. P.U. Internationale Deutsche Schule Sarajevo, ID-Nummer 4202220420007, Buka 13, 71 000 Sarajevo, vertreten durch den Direktor Davor Mulalić (im Folgenden: IDSS).'));
  paragraphs.push(filledPara('2. ', d.parent1_full_name, ' (Vor- und Nachname der Mutter/des Vormunds)'));
  paragraphs.push(filledPara('3. ', d.parent2_full_name, ' (Vor- und Nachname des Vaters/des Vormunds)'));
  paragraphs.push(filledPara('4. ', d.address, ' (Wohnadresse)'));

  paragraphs.push(articleTitle('Artikel 1'));
  paragraphs.push(articleSubtitle('(VERTRAGSGEGENSTAND)'));
  paragraphs.push(filledPara('(Vor- und Nachname des Kindes) ', d.child_full_name));
  paragraphs.push(filledPara('(Geburtsdatum) ', d.child_dob));

  paragraphs.push(articleTitle('Artikel 2'));
  paragraphs.push(articleSubtitle('(NEUE UND REGULÄRE EINSCHREIBUNGEN)'));
  paragraphs.push(filledPara('Einschreibegebühr: ', d.enrollment_fee_amount, ` KM (in Worten: ${d.enrollment_fee_text} und 00/100 KM).`));
  paragraphs.push(filledPara('Kaution: ', d.deposit_amount, ` KM (in Worten: ${d.deposit_text} und 00/100 KM).`));

  paragraphs.push(articleTitle('Artikel 3'));
  paragraphs.push(articleSubtitle('(SCHULGELD UND ZAHLUNG)'));
  paragraphs.push(filledPara(`Jährliches Schulgeld ${d.academic_year}: `, d.tuition_annual_amount, ` KM (in Worten: ${d.tuition_annual_text} und 00/100 KM).`));

  if (d.payment_type === 'installments') {
    paragraphs.push(filledPara('Zahlung in ', d.installments_number, ` (in Worten: ${d.installments_text}) gleichen monatlichen Raten, erste Rate fällig am ${d.first_payment_date}.`));
  }

  paragraphs.push(para('SPARKASSE BANK d.d., Sarajevo'));
  paragraphs.push(para('KONTONUMMER: 1994990021809884'));
  paragraphs.push(para('IBAN BA39 1994990021809884 SWIFT (BIC) ABSBBA22'));

  for (let i = 4; i <= 18; i++) {
    paragraphs.push(articleTitle(`Artikel ${i}`));
    paragraphs.push(para(getArticleTextDE(i)));
  }

  paragraphs.push(signatureLine('Davor Mulalić, Direktor'));
  paragraphs.push(filledPara('', d.parent1_full_name, ' (Mutter/Vormund)'));
  paragraphs.push(signatureLine('Unterschrift'));
  paragraphs.push(filledPara('', d.parent2_full_name, ' (Vater/Vormund)'));
  paragraphs.push(signatureLine('Unterschrift'));
  paragraphs.push(filledPara('', d.signature_date, ' (Datum)'));

  return paragraphs;
}

// Abbreviated article text for DOCX (key articles are included, minor ones summarized)
function getArticleTextBA(i: number, d: ContractTemplateData): string {
  const texts: Record<number, string> = {
    4: 'Roditelj/staratelj ima pravo da ispiše svoje dijete iz IDSS i da jednostrano raskine Ugovor prije njegovog isteka. Ispis djeteta realizuje se za I. polugodište ili na kraju školske godine.',
    5: 'Nastava u IDSS održava se od ponedjeljka do petka u terminu od 8:00 do 14:40 sati.',
    6: 'IDSS zadržava pravo da svoj raspored rada usklađuje sa odmorima, lokalnim praznicima, te ljetnim i zimskim raspustima.',
    7: `Produženi boravak je usluga po izboru i obuhvata petodnevni program pružanja pomoći u pisanju domaćih zadaća u vremenu od 15:15 do 17:00 sati.${d.uses_extended_stay ? ` Cijena: ${d.extended_stay_amount} KM (${d.extended_stay_text}).` : ''}`,
    8: 'Ukoliko roditelj/staratelj želi da njegovo dijete učestvuje u školskim izletima, treba da potpiše odgovarajuću saglasnost.',
    9: 'Ovaj ugovor sačinjen je u skladu sa Pravilima Škole. IDSS ima pravo da raskine ovaj ugovor u slučaju nepoštovanja pravila.',
    10: 'Roditelj/staratelj lično dolazi po svoje dijete u IDSS u 14:40 sati, odnosno u 17:00 sati za produženi boravak.',
    11: 'Učenici IDSS su osigurani kod osiguravajućeg društva.',
    12: 'U slučaju oštećenja, roditelj je dužan namiriti štetu.',
    13: 'Eventualni sporovi rješavat će se putem dogovora ili kod nadležnog suda u Sarajevu.',
    14: 'Za sve što nije regulisano primjenjivat će se važeći propisi.',
    15: 'Bitni elementi ugovora predstavljaju povjerljive informacije.',
    16: 'Ugovor stupa na snagu danom potpisivanja i važi do završetka tekuće školske godine.',
    17: 'Izmjene je moguće izvršiti aneksom ugovora.',
    18: 'Ugovor je zaključen u dva identična primjerka.',
  };
  return texts[i] || '';
}

function getArticleTextEN(i: number): string {
  const texts: Record<number, string> = {
    4: 'The parent/guardian has the right to withdraw his/her child from IDSS and to unilaterally terminate the Agreement.',
    5: 'Classes at IDSS are held Monday through Friday from 8:00 a.m. to 2:40 p.m.',
    6: 'IDSS reserves the right to adjust its work schedule to holidays and vacations.',
    7: 'Afternoon program is an optional service from 3:15 p.m. to 5:00 p.m., every working day.',
    8: 'If the parent/guardian wants the child to take part in school trips, appropriate consent must be signed.',
    9: 'This agreement is made in accordance with the Rules of the School. IDSS may terminate if rules are violated.',
    10: 'The parent/guardian personally picks up the child at 2:40 p.m. or 5:00 p.m. for afternoon program.',
    11: 'IDSS students are insured with an insurance company.',
    12: 'In case of damage, the parent is obliged to compensate without delay.',
    13: 'Any disputes shall be resolved amicably or before the competent court in Sarajevo.',
    14: 'For all not regulated, applicable regulations will apply.',
    15: 'Essential elements of the agreement are confidential information.',
    16: 'The agreement enters into force on the day of signing until end of school year.',
    17: 'Changes may be made by an annex to the agreement.',
    18: 'The agreement was concluded in two identical copies.',
  };
  return texts[i] || '';
}

function getArticleTextDE(i: number): string {
  const texts: Record<number, string> = {
    4: 'Die Eltern haben das Recht, ihr Kind von der IDSS abzumelden und den Vertrag einseitig zu kündigen.',
    5: 'Der Unterricht findet von Montag bis Freitag von 8:00 bis 14:40 Uhr statt.',
    6: 'Die IDSS behält sich das Recht vor, ihren Arbeitsplan an Ferien und Feiertage anzupassen.',
    7: 'Die Nachmittagsbetreuung ist eine optionale Leistung von 15:15 bis 17:00 Uhr an jedem Werktag.',
    8: 'Für die Teilnahme an Schulausflügen ist eine Einverständniserklärung erforderlich.',
    9: 'Dieser Vertrag wurde gemäß der Schulordnung erstellt. Bei Verstößen kann die IDSS kündigen.',
    10: 'Die Eltern holen ihr Kind um 14:40 Uhr bzw. 17:00 Uhr (Nachmittagsbetreuung) ab.',
    11: 'Die Schüler sind bei einer Versicherungsgesellschaft versichert.',
    12: 'Bei Beschädigungen sind die Eltern zur Schadensbehebung verpflichtet.',
    13: 'Streitigkeiten werden durch Vereinbarung oder beim zuständigen Gericht gelöst.',
    14: 'Für nicht geregelte Fälle gelten die geltenden Vorschriften.',
    15: 'Wesentliche Vertragselemente sind vertraulich.',
    16: 'Der Vertrag gilt ab Unterzeichnung bis zum Ende des Schuljahres.',
    17: 'Änderungen können durch einen Vertragsanhang vorgenommen werden.',
    18: 'Der Vertrag wird in zwei identischen Exemplaren geschlossen.',
  };
  return texts[i] || '';
}
