// Contract HTML templates — IDSS Enrollment CRM
// Matches original IDSS contract PDF exactly (BA/EN/DE)
// Font: Century Gothic | Format: A4 | Professional layout

export interface ContractTemplateData {
  grade_number: string;
  grade_text: string;
  contract_date: string;
  parent1_full_name: string;
  parent2_full_name: string;
  child_full_name: string;
  child_dob: string;
  address: string;
  enrollment_fee_amount: string;
  enrollment_fee_text: string;
  deposit_amount: string;
  deposit_text: string;
  tuition_annual_amount: string;
  tuition_annual_text: string;
  installments_number: string;
  installments_text: string;
  first_payment_date: string;
  extended_stay_amount: string;
  extended_stay_text: string;
  signature_date: string;
  payment_type: string;
  contract_number: string;
  academic_year: string;
  uses_extended_stay?: boolean;
}

function commonStyles(): string {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Century+Gothic&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      @media print {
        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none; }
        .page-break { page-break-before: always; break-before: page; }
      }

      body {
        font-family: 'Century Gothic', 'CenturyGothic', 'AppleGothic', Calibri, Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #000;
        background: white;
      }

      .contract-body {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 15mm 18mm 25mm 20mm;
        background: white;
        position: relative;
      }

      @media print {
        .contract-body {
          width: 210mm;
          padding: 15mm 18mm 25mm 20mm;
          margin: 0;
        }
        @page {
          size: A4;
          margin: 0;
        }
      }

      .page-header {
        text-align: right;
        font-size: 9pt;
        color: #555;
        margin-bottom: 8mm;
        font-family: 'Century Gothic', 'CenturyGothic', Calibri, Arial, sans-serif;
      }

      h1.contract-title {
        font-family: 'Century Gothic', 'CenturyGothic', Calibri, Arial, sans-serif;
        font-size: 18pt;
        font-weight: bold;
        text-align: center;
        letter-spacing: 8px;
        margin-bottom: 6mm;
        color: #000;
      }

      .contract-subtitle {
        font-family: 'Century Gothic', 'CenturyGothic', Calibri, Arial, sans-serif;
        font-size: 11pt;
        text-align: justify;
        margin-bottom: 8mm;
        line-height: 1.6;
      }

      .parties-label {
        font-weight: bold;
        margin-bottom: 3mm;
        font-size: 11pt;
      }

      .parties-block {
        margin-bottom: 8mm;
        padding-left: 5mm;
      }

      .parties-block p {
        margin-bottom: 2mm;
        text-align: justify;
        line-height: 1.6;
      }

      .article {
        margin-top: 6mm;
        margin-bottom: 2mm;
      }

      .article-number {
        font-weight: bold;
        text-align: center;
        font-size: 11pt;
        margin-bottom: 1mm;
      }

      .article-subtitle {
        font-weight: bold;
        text-align: center;
        font-size: 11pt;
        margin-bottom: 3mm;
      }

      .article p {
        text-align: justify;
        margin-bottom: 2mm;
        line-height: 1.6;
      }

      .article ul {
        padding-left: 8mm;
        margin: 2mm 0 2mm 4mm;
      }

      .article ul li {
        margin-bottom: 1.5mm;
        text-align: justify;
        line-height: 1.6;
      }

      .fill-field {
        border-bottom: 1px solid #000;
        min-width: 150px;
        display: inline-block;
        font-weight: bold;
        padding: 0 2px;
      }

      .section-heading {
        font-weight: bold;
        text-align: center;
        font-size: 11pt;
        margin-top: 8mm;
        margin-bottom: 4mm;
        text-transform: uppercase;
      }

      .signature-block {
        margin-top: 12mm;
      }

      .signature-block p {
        margin-bottom: 2mm;
        line-height: 1.6;
      }

      .signature-line {
        display: inline-block;
        width: 180px;
        border-bottom: 1px solid #000;
        vertical-align: bottom;
        margin: 0 2px;
      }

      .signature-quote {
        font-style: italic;
        margin: 4mm 0;
        text-align: justify;
        line-height: 1.6;
      }

      .stamp-area {
        display: inline-block;
        width: 80px;
        height: 80px;
        border: 1px solid #ccc;
        vertical-align: middle;
        margin-right: 10mm;
      }

      /* Annex table */
      .annex-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 5mm;
        font-size: 10pt;
      }

      .annex-table th {
        background-color: #e8e8e8;
        border: 1px solid #000;
        padding: 3mm 4mm;
        text-align: left;
        font-weight: bold;
      }

      .annex-table td {
        border: 1px solid #000;
        padding: 2.5mm 4mm;
        text-align: left;
      }

      .annex-table tr.section-row td {
        font-weight: bold;
        background-color: #f5f5f5;
      }

      .annex-table td:nth-child(2),
      .annex-table td:nth-child(3) {
        text-align: right;
        white-space: nowrap;
      }
    </style>
  `;
}

export function generateContractHTML(data: ContractTemplateData, language: string): string {
  switch (language.toUpperCase()) {
    case 'BA':
    case 'BS':
      return generateBA(data);
    case 'EN':
      return generateEN(data);
    case 'DE':
      return generateDE(data);
    default:
      return generateEN(data);
  }
}

// ============================================================
// BOSNIAN CONTRACT (BA)
// ============================================================
function generateBA(d: ContractTemplateData): string {
  const extendedStaySection = d.uses_extended_stay ? `
    <p>2. Cijena usluge produženog boravka iznosi <span class="fill-field">${d.extended_stay_amount}</span> KM (slovima: <span class="fill-field">${d.extended_stay_text}</span> i 00/100 KM), za cijelu školsku godinu, tj. od septembra tekuće do juna naredne godine.</p>
    <p>3. Cijena produženog boravka je fiksna i plaća se u punom iznosu, tj. ne umanjuje se i ne vraća se, bez obzira na odsustvo djeteta iz škole (npr. zbog bolesti, privatnog odmora/putovanja, odmora i praznika, roditeljske/starateljske poslovne obaveze ili zatvaranja ustanove radi okolnosti uzrokovanih višom silom).</p>
    <p>4. Roditelj/staratelj je obavezan izvršiti uplatu produženog boravka za narednu školsku godinu u punom iznosu a najkasnije do 31.07. tekuće godine na bankovni račun IDSS naznačen u Članu 3. ovog Ugovora.</p>
  ` : `
    <p>Produženi boravak nije uključen u ovaj ugovor.</p>
  `;

  const installmentSection = d.payment_type === 'installments' ? `
    <p>Ako se roditelj/staratelj odluči na plaćanje školarine u mjesečnim ratama u tom slučaju plaćanje školarine vršiće se u <span class="fill-field">${d.installments_number}</span> (slovima: <span class="fill-field">${d.installments_text}</span>) jednakih mjesečnih rata, a prva mjesečna rata dospijeva dana <span class="fill-field">${d.first_payment_date}</span> godine.</p>
  ` : '';

  return `<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ugovor ${d.contract_number}</title>
  ${commonStyles()}
</head>
<body>
<div class="contract-body">

  <div class="page-header">Stranica 1 od 6</div>

  <h1 class="contract-title">U G O V O R</h1>

  <p class="contract-subtitle">
    o osnovnoškolskom odgoju i obrazovanju za upis učenika u
    <strong>${d.grade_number}</strong> (slovima: <strong>${d.grade_text}</strong>) razred,
    zaključen dana <strong>${d.contract_date}</strong> godine u Sarajevu.
  </p>

  <p class="parties-label">Ugovorne strane:</p>
  <div class="parties-block">
    <p>1. P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo,
    ID Broj 4202220420007, Buka 13, 71 000 Sarajevo, zastupana po direktoru Davor Mulalić
    (u daljem tekstu: IDSS)</p>
    <p>i</p>
    <p>2. <span class="fill-field">${d.parent1_full_name}</span> (ime i prezime majke/staratelja)</p>
    <p>&nbsp;&nbsp;&nbsp;<span class="fill-field">${d.parent2_full_name}</span> (ime i prezime oca/staratelja)</p>
    <p>&nbsp;&nbsp;&nbsp;<span class="fill-field">${d.address}</span> (adresa prebivališta)</p>
    <p>kao Korisnik usluga (u daljem tekstu: roditelj/staratelj)</p>
  </div>

  <div class="article">
    <p class="article-number">Član 1.</p>
    <p class="article-subtitle">(PREDMET UGOVORA)</p>
    <p>1. Predmet ovog Ugovora je utvrđivanje zajedničkih prava i obaveza IDSS i roditelja/staratelja, čijem djetetu IDSS pruža uslugu osnovnoškolskog odgoja i obrazovanja.</p>
    <p>2. Potpisivanjem ovog Ugovora roditelj/staratelj upisuje svoje dijete</p>
    <p>(ime i prezime djeteta) <span class="fill-field">${d.child_full_name}</span></p>
    <p>(datum rođenja) <span class="fill-field">${d.child_dob}</span></p>
    <p>u osnovnu školu IDSS, u svrhu sticanja osnovnoškolskog odgoja i obrazovanja.
    IDSS ima obavezu da obezbijedi utvrđene usluge u skladu sa Zakonom o osnovnom odgoju i
    obrazovanju Kantona Sarajevo, Zakonom o ustanovama, Pedagoškim standardima za osnovno
    obrazovanje, kao i u skladu sa Standardima i općim normativima o radnom prostoru, opremi,
    i nastavnim sredstvima i učilima po predmetima za osnovnu školu.</p>
    <p>3. IDSS će pružati sljedeće usluge:</p>
    <ul>
      <li>provoditi njemački nastavni plan i program usklađen sa nastavnim planom i programom za osnovne škole Kantona Sarajevo.</li>
      <li>pratiti razvoj djeteta i o tome redovno informisati roditelja/staratelja.</li>
      <li>obezbijediti didaktički materijal (udžbenike, radne bilježnice i sl.) kao i drugi obrazovni materijal.</li>
      <li>provoditi multilingvalni program (njemački jezik, engleski jezik, B/H/S jezik).</li>
      <li>obezbijediti adekvatan odgojni kadar, obučen u skladu sa lokalnim zakonima i pedagoškim standardima.</li>
      <li>održavati redovno roditeljske sastanke.</li>
      <li>voditi svakodnevnu evidenciju o dolasku djece u školu kao i prisustvu djece na nastavi.</li>
      <li>obezbijediti online nastavu po potrebi.</li>
      <li>osigurati dijete kod osiguravajućeg društva.</li>
      <li>omogućiti roditeljima/starateljima pristup rezultatima koje dijete ostvaruje.</li>
      <li>obezbijediti jedan topli obrok svaki dan, a ako dijete pohađa produženi boravak obezbijediti i užinu.</li>
      <li>IDSS će obezbijediti i doručak za one učenike čiji roditelji iskažu potrebu, po cijeni od 50,00 KM mjesečno.</li>
    </ul>
  </div>

  <div class="article">
    <p class="article-number">Član 2.</p>
    <p class="article-subtitle">(NOVI I REDOVNI UPISI)</p>
    <p>Dijete će se smatrati upisanim i njegovo mjesto u IDSS će biti rezervisano nakon:</p>
    <p>1. dostavljenog kompletno popunjenog i od strane roditelja/staratelja potpisanog upisnog obrasca.</p>
    <p>2. izvršene uplate upisnine u iznosu od <span class="fill-field">${d.enrollment_fee_amount}</span> KM
    (slovima: <span class="fill-field">${d.enrollment_fee_text}</span> i 00/100 KM),
    ako se dijete prvi put upisuje u IDSS.</p>
    <p>3. izvršene uplate depozita u iznosu od <span class="fill-field">${d.deposit_amount}</span> KM
    (slovima: <span class="fill-field">${d.deposit_text}</span> i 00/100 KM),
    ako se plaćanje školarine vrši obročno.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 3.</p>
    <p class="article-subtitle">(ŠKOLARINA I UPLATA)</p>
    <p>Godišnja školarina za školsku ${d.academic_year} godinu, za ovo dijete iznosi:
    <span class="fill-field">${d.tuition_annual_amount}</span> KM
    (slovima: <span class="fill-field">${d.tuition_annual_text}</span> i 00/100 KM),
    a prema važećem cjenovniku iz Aneksa 1. koji je sastavni dio ovog Ugovora.</p>
    <p>Roditelj/staratelj može uplatiti školarinu na dva načina:</p>
    <p>1. jednokratno, u cjelokupnom iznosu ili</p>
    <p>2. obročno, u jednakim mjesečnim ratama, kako je definisano u ovom članu ugovora.</p>
    ${installmentSection}
    <p>Ako dođe do značajnih promjena na tržištu novca, kao i ekonomskim prilikama, IDSS zadržava
    pravo izmjene cjenovnika iz Aneksa 1. ovog ugovora, o čemu će se zaključiti poseban Aneks ugovora.</p>
    <p>Uplate upisnine, depozita kao i školarine vrše se na sljedeći bankovni račun:</p>
    <p><strong>P.U. Internationale Deutsche Schule Sarajevo</strong></p>
    <p>SPARKASSE BANK d.d., Sarajevo</p>
    <p>BROJ RAČUNA: 1994990021809884</p>
    <p>IBAN BA39 1994990021809884 &nbsp; SWIFT (BIC) ABSBBA22</p>
    <p>Troškove bankovnih naknada, vezanih za sve uplate definisane ovim Ugovorom,
    preuzima roditelj/staratelj u cijelosti.</p>
    <p>Uplata se vrši na račun škole kako je objašnjeno u ovom Članu, ovog Pravilnika
    i to najkasnije do 5.-og u tekućem mjesecu.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 4.</p>
    <p class="article-subtitle">(ISPISI)</p>
    <p>1. Roditelj/staratelj ima pravo da ispiše svoje dijete iz IDSS i da jednostrano raskine Ugovor prije njegovog isteka.</p>
    <p>2. Ispis djeteta iz IDSS se realizuje za I. polugodište ili na kraju školske godine tj. II. polugodište.</p>
    <p>3. Roditelj/staratelj je obavezan obavijesti IDSS o namjeri ispisa djeteta isključivo u pisanoj formi i to dva mjeseca prije planiranog ispisa.</p>
    <p>a. Ukoliko roditelj/staratelj ispiše svoje dijete za I. polugodište, a izvršio je uplatu cjelokupnog iznosa školarine do 31.12. tekuće godine, tada IDSS vrši povrat u iznosu od tri mjesečne rate, a najkasnije 4 mjeseca nakon pismenog obavještenja od strane roditelja/staratelja.</p>
    <p>b. Upisnine su bespovratna sredstva i IDSS zadržava upisninu bez obzira na prijevremeni istek ili raskid ugovora.</p>
    <p>c. Dijete zadržava pravo na pohađanje nastave uprkos ispisa za prvo polugodište, sve do završetka prvog polugodišta tj. do 31.01. tekuće godine.</p>
    <p>d. Ako je roditelj/staratelj izvršio uplatu cjelokupne školarine za narednu školsku godinu do 10.05. tekuće godine, a raskine ugovor prije početka nove školske godine, IDSS vrši povrat uplaćene tri mjesečne rate najkasnije do 30.10. tekuće godine.</p>
    <p>e. Ako se školarina plaća obročno, a roditelj/staratelj ispiše dijete poštivajući pismenu najavu u skladu sa Članom.3, ovog Ugovora, IDSS zadržava sve uplaćene rate kao i iznos depozita umanjen za realne troškove koji mogu proisteći ispisom djeteta. Roditelj/staratelj je dužan isplatiti školarinu do 31.12. ako se dijete ispisuje u prvom polugodištu ili ako se dijete ispisuje u drugom polugodištu do 30.06.</p>
    <p>4. IDSS zadržava uplaćene mjesečne školarine za tekuću godinu, te sve rate za tekuću i prethodne školske godine, kao i ukupan iznos depozita ukoliko roditelj/staratelj ne obavijesti IDSS u pisanoj formi o namjeri prekida školovanja i to do 31.12. tekuće godine za narednu školsku godinu.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 5.</p>
    <p class="article-subtitle">(RADNO VRIJEME)</p>
    <p>Nastava u IDSS održava se od ponedjeljka do petka u terminu od 8:00 do 14:40 sati. Dani vikenda su neradni.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 6.</p>
    <p class="article-subtitle">(NERADNI DANI)</p>
    <p>1. IDSS zadržava pravo da svoj raspored rada usklađuje sa odmorima, lokalnim praznicima, te ljetnim i zimskim raspustima.</p>
    <p>2. Škola će biti zatvorena na sljedeće datume: Dan Njemačkog ujedinjenja, Jesenji raspust, Dan Državnosti, Zimski raspust, Dan Nezavisnosti, Proljetni raspust, Dan Rada, Ramazanski i Kurbanski Bajram i Ljetni raspust.</p>
    <p>3. Na početku svake školske godine roditelji/staratelji će biti upoznati sa školskim kalendarom za tekuću školsku godinu. Školski kalendar će biti postavljen na internet stranici IDSS (http://idss.edu.ba/).</p>
    <p>4. IDSS zadržava pravo na izmjene datuma neradnih dana o čemu će roditelji/staratelji biti blagovremeno obaviješteni.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 7.</p>
    <p class="article-subtitle">(PRODUŽENI BORAVAK)</p>
    <p>1. Produženi boravak je usluga po izboru i obuhvata petodnevni program pružanja pomoći u pisanju domaćih zadaća, slobodne i druge planirane aktivnosti poslije nastave, i po procjeni individualne časove harmonizacije znanja njemačkog jezika (DaF), u vremenu od 15:15 do 17:00 sati, svakog radnog dana.</p>
    ${extendedStaySection}
  </div>

  <div class="article">
    <p class="article-number">Član 8.</p>
    <p class="article-subtitle">(IZLETI, LOKALNE POSJETE I MANIFESTACIJE)</p>
    <p>1. Ukoliko roditelj/staratelj želi da njegovo dijete učestvuje u školskim izletima, lokalnim posjetama i manifestacijama, treba da potpiše odgovarajuću saglasnost. Samo uz potpisivanje te saglasnosti djetetu je dopušteno da učestvuje u školskim izletima, lokalnim posjetama i manifestacijama.</p>
    <p>2. Roditelj/staratelj snosi troškove izleta i lokalnih posjeta u punom iznosu, osim ako IDSS ne odredi drugačije.</p>
    <p>3. Izlet je zakonska obaveza i na taj dan IDSS ne održava redovnu nastavu za djecu koja ne prisustvuju izletu. Roditelji/staratelji će blagovremeno biti obaviješteni o planiranim izletima, lokalnim posjetama i manifestacijama.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 9.</p>
    <p class="article-subtitle">(RASKID UGOVORA)</p>
    <p>1. Ovaj ugovor sačinjen je u skladu sa Pravilima Škole, Pravilnikom o radu, i ostalim poslovno normativnim aktima IDSS.</p>
    <p>2. U slučaju da se roditelj/staratelj ne pridržava odredbi Pravilnika o kućnom redu IDSS, koji se može preuzeti na službenoj stranici IDSS (www.idss.edu.ba), uključujući, ali ne ograničavajući se na dolje navedeno, IDSS ima pravo da raskine ovaj ugovor prije završetka školske godine.</p>
    <p>a. Ako roditelj/staratelj ne izmiri obaveze prema IDSS kako je ugovorom utvrđeno, najkasnije 7 dana od datuma dospijeća obaveze, IDSS zadržava pravo da poduzme sve odgovarajuće zakonske mjere za ostvarivanje neisplaćenih dugovanja.</p>
    <p>b. Ako roditelj/staratelj dovede bolesno dijete u IDSS ili ne donese odgovarajuću zdravstvenu potvrdu ili na bilo koji drugi način ugrozi ostalu djecu i zaposlenike IDSS ili se ne pridržava detalja propisanih COVID-19 protokolom.</p>
    <p>c. Ako roditelj/staratelj stalno kasni unatoč opomenama nastavnog osoblja i uprave IDSS, kod dovođenja ili odvođenja djeteta, te tako ne poštuje odredbe Pravilnika o kućnom redu IDSS.</p>
    <p>d. Ako se roditelj/staratelj uprkos upozorenjima ophodi bez poštovanja prema osoblju IDSS, djeci ili drugim roditeljima.</p>
    <p>e. Ako roditelj/staratelj čini radnje kojima bi IDSS bila nanesena šteta, a koje bi uticale na rad i ugled IDSS.</p>
    <p>3. U svim gore navedenim slučajevima, IDSS ima pravo da zadrži sva uplaćena sredstva kao i pravo da traži srazmjernu odštetu za povredu iz Člana 9. stav (2)(e) ovog Ugovora.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 10.</p>
    <p class="article-subtitle">(DOLAZAK PO DIJETE)</p>
    <p>1. Roditelj/staratelj lično dolazi po svoje dijete u IDSS u 14:40 sati, odnosno u 17:00 sati, ako je dijete korisnik usluge produženog boravka.</p>
    <p>2. Zadržavanje učenika koji ne pohađaju program produženog boravka u školi nije dozvoljeno, osim ako postoji izričito odobrenje škole.</p>
    <p>3. U slučaju spriječenosti roditelj/staratelj ima obavezu pravovremeno i pismenim putem obavijestiti IDSS, koja će druga punoljetna osoba doći po dijete.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 11.</p>
    <p class="article-subtitle">(OSIGURANJE)</p>
    <p>Učenici IDSS su osigurani kod osiguravajućeg društva, koje nudi policu kolektivnog osiguranja učenika u slučaju nezgoda.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 12.</p>
    <p>U slučaju oštećenja poslovnih prostorija, inventara ili nastavnih učila, a za koje se utvrdi da je dijete namjerno i pored upozorenja nastavnog kadra oštetilo, roditelj je dužan bez odlaganja istu štetu namiriti na način ili da izvrši adekvatnu naknadu ili na svoj teret sanira učinjeno oštećenje.</p>
  </div>

  <p class="section-heading">V. PRELAZNE I ZAVRŠNE ODREDBE</p>

  <div class="article">
    <p class="article-number">Član 13.</p>
    <p>Eventualni sporovi iz ovog Ugovora rješavat će se putem dogovora, u protivnom nezadovoljna strana ostvaruje svoja prava kod nadležnog suda u Sarajevu.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 14.</p>
    <p>Za sve što nije izričito regulisano odredbama ovog ugovora primjenjivat će se važeći propisi.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 15.</p>
    <p>Ugovorne strane su saglasne, da bitni elementi predmetnog ugovora predstavljaju povjerljive informacije.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 16.</p>
    <p>Ugovor stupa na snagu danom potpisivanja i važi dok ga jedna od ugovornih strana sporazumno ne raskine, a najduže do završetka tekuće školske godine.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 17.</p>
    <p>Eventualne izmjene pojedinih odredbi ovog ugovora je moguće izvršiti aneksom ugovora.</p>
  </div>

  <div class="article">
    <p class="article-number">Član 18.</p>
    <p>Ugovor je zaključen u dva identična primjerka, od kojih IDSS zadržava 1 (jedan) a roditelj/staratelj 1 (jedan) primjerak.</p>
  </div>

  <div class="signature-block">
    <p><strong>P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo</strong></p>
    <p>M.P.</p>
    <br>
    <p><span class="signature-line"></span></p>
    <p>(Davor Mulalić, Direktor)</p>
    <br>
    <p class="signature-quote">"Ovim potpisom potvrđujemo da želimo upisati svoje dijete u Međunarodnu njemačku školu
    Sarajevo (IDSS). Obavezujemo se da ćemo u interesu djeteta poštovati organizaciju rada ove
    ustanove kao i odluke koje donese uprava i osoblje škole."</p>
    <br>
    <p><span class="fill-field">${d.parent1_full_name}</span> (ime i prezime majke/staratelja)</p>
    <p><span class="signature-line"></span> (potpis majke/staratelja)</p>
    <br>
    <p><span class="fill-field">${d.parent2_full_name}</span> (ime i prezime oca/staratelja)</p>
    <p><span class="signature-line"></span> (potpis oca/staratelja)</p>
    <br>
    <p><span class="fill-field">${d.signature_date}</span> (datum)</p>
  </div>

  <!-- ANNEX 1 -->
  <div class="article page-break">
    <div class="page-header">Stranica 6 od 6</div>
    <p class="article-number">Aneks 1.</p>
    <p class="article-subtitle">Cjenovnik za akademsku ${d.academic_year} godinu</p>
    <p>Ovaj Aneks dio je Ugovora o osnovnoškolskom odgoju i obrazovanju i važeći je na dan potpisivanja ovog Ugovora.</p>
    <br>
    <table class="annex-table">
      <thead>
        <tr>
          <th>Usluge</th>
          <th>Domaća lica (KM)</th>
          <th>Strana lica (KM)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="section-row">
          <td colspan="3">Osnovna škola</td>
        </tr>
        <tr>
          <td>Upisnina</td>
          <td>1.000</td>
          <td>1.500</td>
        </tr>
        <tr>
          <td>Depozit (samo za obročno plaćanje)</td>
          <td>1.500</td>
          <td>1.500</td>
        </tr>
        <tr>
          <td>Produženi boravak (od I do IX razreda)</td>
          <td>2.000</td>
          <td>2.000</td>
        </tr>
        <tr class="section-row">
          <td colspan="3">Školarina (od I do IV razreda)</td>
        </tr>
        <tr>
          <td>Osnovna cijena</td>
          <td>9.700</td>
          <td>11.970</td>
        </tr>
        <tr>
          <td>Popust za upisano drugo dijete (10%)</td>
          <td>8.730</td>
          <td>10.773</td>
        </tr>
        <tr>
          <td>Popust za upisano treće dijete (15%)</td>
          <td>8.245</td>
          <td>10.175</td>
        </tr>
        <tr class="section-row">
          <td colspan="3">Školarina (od V do IX razreda)</td>
        </tr>
        <tr>
          <td>Osnovna cijena</td>
          <td>11.030</td>
          <td>13.700</td>
        </tr>
        <tr>
          <td>Popust za upisano drugo dijete (10%)</td>
          <td>9.927</td>
          <td>12.330</td>
        </tr>
        <tr>
          <td>Popust za upisano treće dijete (15%)</td>
          <td>9.376</td>
          <td>11.645</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
</body>
</html>`;
}

// ============================================================
// ENGLISH CONTRACT (EN)
// ============================================================
function generateEN(d: ContractTemplateData): string {
  const extendedStaySection = d.uses_extended_stay ? `
    <p>2. The price of the afternoon program is <span class="fill-field">${d.extended_stay_amount}</span> KM
    (in letters: <span class="fill-field">${d.extended_stay_text}</span> and 00/100 KM),
    for the whole school year, i.e. from September of the current to June of the following year.</p>
    <p>3. The price of the afternoon program is fixed and paid in full, i.e. it is not reduced or refunded,
    regardless of the child's absence from school (e.g. due to illness, private holiday/travel,
    holidays, parental/guardian business obligations or closure of the institution due to force majeure).</p>
    <p>4. The parent/guardian is obliged to pay the afternoon program for the next school year in full
    no later than 31.07. of the current year to the IDSS bank account specified in Article 3 of this Agreement.</p>
  ` : `
    <p>The afternoon program is not included in this agreement.</p>
  `;

  const installmentSection = d.payment_type === 'installments' ? `
    <p>If the parent/guardian decides to pay the tuition fee in monthly installments,
    the tuition fee will be paid in <span class="fill-field">${d.installments_number}</span>
    (in letters: <span class="fill-field">${d.installments_text}</span>) equal monthly installments,
    and the first monthly installment is due on <span class="fill-field">${d.first_payment_date}</span>.</p>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agreement ${d.contract_number}</title>
  ${commonStyles()}
</head>
<body>
<div class="contract-body">

  <div class="page-header">Page 1 of 6</div>

  <h1 class="contract-title">A G R E E M E N T</h1>

  <p class="contract-subtitle">
    on primary school education for enrollment of a student in
    <strong>${d.grade_number}</strong> (in letters: <strong>${d.grade_text}</strong>) grade,
    concluded on <strong>${d.contract_date}</strong> in Sarajevo.
  </p>

  <p class="parties-label">Agreement Parties:</p>
  <div class="parties-block">
    <p>1. P.U. Internationale Deutsche Schule Sarajevo - International German School Sarajevo,
    ID Number 4202220420007, Buka 13, 71 000 Sarajevo, represented by director Davor Mulalić
    (hereinafter: IDSS)</p>
    <p>and</p>
    <p>2. <span class="fill-field">${d.parent1_full_name}</span> (name and surname of mother/guardian)</p>
    <p>&nbsp;&nbsp;&nbsp;<span class="fill-field">${d.parent2_full_name}</span> (name and surname of father/guardian)</p>
    <p>&nbsp;&nbsp;&nbsp;<span class="fill-field">${d.address}</span> (address of residence)</p>
    <p>as the Service User (hereinafter: parent/guardian)</p>
  </div>

  <div class="article">
    <p class="article-number">Article 1.</p>
    <p class="article-subtitle">(SUBJECT OF THE AGREEMENT)</p>
    <p>1. The subject of this Agreement is to determine the joint rights and obligations of IDSS and
    parents/guardians, to whose child IDSS provides primary school education.</p>
    <p>2. By signing this Agreement, the parent/guardian enrolls their child</p>
    <p>(name and surname of the child) <span class="fill-field">${d.child_full_name}</span></p>
    <p>(date of birth) <span class="fill-field">${d.child_dob}</span></p>
    <p>into the IDSS primary school, for the purpose of acquiring primary education.
    IDSS is obliged to provide established services in accordance with the Law on Primary Education
    of Sarajevo Canton, the Law on Institutions, Pedagogical Standards for Primary Education,
    as well as in accordance with the Standards and General Norms on workspace, equipment,
    and teaching aids for primary school.</p>
    <p>3. IDSS will provide the following services:</p>
    <ul>
      <li>Implement the German curriculum in line with the curriculum for primary schools in Sarajevo Canton.</li>
      <li>Monitor the child's development and regularly inform the parent/guardian.</li>
      <li>Provide didactic material (textbooks, workbooks, etc.) as well as other educational material.</li>
      <li>Implement a multilingual program (German, English, B/H/S language).</li>
      <li>Provide adequate educational staff, trained in accordance with local laws and pedagogical standards.</li>
      <li>Hold regular parent meetings.</li>
      <li>Keep daily records of children's arrival at school and attendance at classes.</li>
      <li>Provide online classes as needed.</li>
      <li>Insure the child with an insurance company.</li>
      <li>Provide parents/guardians with access to the results achieved by the child.</li>
      <li>Provide one hot meal every day, and if the child attends the afternoon program, also provide a snack.</li>
      <li>IDSS will provide breakfast for those students whose parents express the need, at a price of 50.00 KM per month.</li>
    </ul>
  </div>

  <div class="article">
    <p class="article-number">Article 2.</p>
    <p class="article-subtitle">(NEW AND REGULAR ENROLLMENTS)</p>
    <p>The child will be considered enrolled and their place at IDSS will be reserved after:</p>
    <p>1. Submission of a complete enrollment form signed by the parent/guardian.</p>
    <p>2. Payment of the registration fee in the amount of <span class="fill-field">${d.enrollment_fee_amount}</span> KM
    (in letters: <span class="fill-field">${d.enrollment_fee_text}</span> and 00/100 KM),
    if the child is enrolling at IDSS for the first time.</p>
    <p>3. Payment of a deposit in the amount of <span class="fill-field">${d.deposit_amount}</span> KM
    (in letters: <span class="fill-field">${d.deposit_text}</span> and 00/100 KM),
    if the tuition fee payment is made in installments.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 3.</p>
    <p class="article-subtitle">(TUITION FEES AND PAYMENT)</p>
    <p>The annual tuition for school year ${d.academic_year} for this child amounts to:
    <span class="fill-field">${d.tuition_annual_amount}</span> KM
    (in letters: <span class="fill-field">${d.tuition_annual_text}</span> and 00/100 KM),
    according to the valid price list from Annex 1, which is an integral part of this Agreement.</p>
    <p>The parent/guardian may pay the tuition fee in two ways:</p>
    <p>1. Once, in the full amount, or</p>
    <p>2. In installments, in equal monthly amounts, as defined in this Article.</p>
    ${installmentSection}
    <p>In the case of significant changes in the money market or economic conditions, IDSS reserves the right
    to amend the price list from Annex 1, which will be concluded in a separate Annex to this Agreement.</p>
    <p>Payments of registration fees, deposits, and tuition fees are made to the following bank account:</p>
    <p><strong>P.U. Internationale Deutsche Schule Sarajevo</strong></p>
    <p>SPARKASSE BANK d.d., Sarajevo</p>
    <p>ACCOUNT NUMBER: 1994990021809884</p>
    <p>IBAN BA39 1994990021809884 &nbsp; SWIFT (BIC) ABSBBA22</p>
    <p>The costs of bank fees related to all payments defined in this Agreement shall be borne in full by the parent/guardian.</p>
    <p>Payment is made to the school's account as explained in this Article, no later than the 5th of the current month.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 4.</p>
    <p class="article-subtitle">(WITHDRAWALS)</p>
    <p>1. The parent/guardian has the right to withdraw their child from IDSS and to unilaterally terminate
    the Agreement before its expiration.</p>
    <p>2. The child's withdrawal from IDSS is realized for the first semester or at the end of the school year,
    i.e. the second semester.</p>
    <p>3. The parent/guardian is obliged to notify IDSS of the intention to withdraw the child exclusively
    in writing, two months before the planned withdrawal.</p>
    <p>a. If the parent/guardian withdraws their child for the first semester and has paid the full tuition
    by 31.12. of the current year, IDSS shall refund the amount of three monthly installments,
    no later than 4 months after written notification from the parent/guardian.</p>
    <p>b. Registration fees are non-refundable and IDSS retains the registration fee regardless of early
    termination or cancellation of the agreement.</p>
    <p>c. The child retains the right to attend classes despite withdrawal for the first semester,
    until the end of the first semester, i.e. until 31.01. of the current year.</p>
    <p>d. If the parent/guardian has paid the full tuition for the next school year by 10.05. of the current year
    and cancels the agreement before the start of the new school year, IDSS shall refund three monthly
    installments no later than 30.10. of the current year.</p>
    <p>e. If the tuition is paid in installments and the parent/guardian withdraws the child following the
    written notice in accordance with Article 3 of this Agreement, IDSS retains all paid installments
    as well as the deposit amount reduced by actual costs that may arise from the child's withdrawal.
    The parent/guardian is obliged to pay the tuition by 31.12. if the child is withdrawn in the first
    semester, or by 30.06. if withdrawn in the second semester.</p>
    <p>4. IDSS retains paid monthly tuition fees for the current year, all installments for the current and
    previous school years, as well as the total deposit amount if the parent/guardian does not notify
    IDSS in writing of the intention to discontinue schooling by 31.12. of the current year for the
    following school year.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 5.</p>
    <p class="article-subtitle">(WORKING HOURS)</p>
    <p>Classes at IDSS are held Monday through Friday from 8:00 a.m. to 2:40 p.m. Weekends are non-working days.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 6.</p>
    <p class="article-subtitle">(NON-WORKING DAYS)</p>
    <p>1. IDSS reserves the right to adjust its work schedule to school holidays, local public holidays,
    and summer and winter breaks.</p>
    <p>2. The school will be closed on the following dates: German Unification Day, Autumn Break,
    Statehood Day, Winter Break, Independence Day, Spring Break, Labour Day,
    Ramadan Eid and Eid al-Adha and Summer Break.</p>
    <p>3. At the beginning of each school year, parents/guardians will be informed about the school
    calendar for the current school year. The school calendar will be posted on the IDSS website (http://idss.edu.ba/).</p>
    <p>4. IDSS reserves the right to change the dates of non-working days, of which parents/guardians
    will be informed in a timely manner.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 7.</p>
    <p class="article-subtitle">(AFTERNOON PROGRAM)</p>
    <p>1. The afternoon program is an optional service and includes a five-day program of homework support,
    free and other planned after-school activities, and, as assessed, individual German language
    harmonization classes (DaF), from 3:15 p.m. to 5:00 p.m. every working day.</p>
    ${extendedStaySection}
  </div>

  <div class="article">
    <p class="article-number">Article 8.</p>
    <p class="article-subtitle">(EXCURSIONS, LOCAL VISITS AND EVENTS)</p>
    <p>1. If the parent/guardian wishes their child to participate in school trips, local visits and events,
    they must sign the appropriate consent form. Only upon signing this consent is the child
    permitted to participate in school trips, local visits and events.</p>
    <p>2. The parent/guardian bears the costs of excursions and local visits in full,
    unless IDSS determines otherwise.</p>
    <p>3. The excursion is a legal obligation and on that day IDSS does not hold regular classes
    for children who do not attend the excursion. Parents/guardians will be notified in a timely
    manner about planned excursions, local visits and events.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 9.</p>
    <p class="article-subtitle">(AGREEMENT TERMINATION)</p>
    <p>1. This agreement is made in accordance with the School Rules, Rules of Procedure,
    and other business regulations of IDSS.</p>
    <p>2. In the event that the parent/guardian does not comply with the provisions of the IDSS
    House Rules, available on the official IDSS website (www.idss.edu.ba), including but not
    limited to the following, IDSS has the right to terminate this agreement before the end of
    the school year.</p>
    <p>a. If the parent/guardian fails to meet their obligations to IDSS as stipulated by the agreement,
    no later than 7 days from the due date, IDSS reserves the right to take all appropriate legal
    measures to recover unpaid debts.</p>
    <p>b. If the parent/guardian brings a sick child to IDSS or fails to provide appropriate medical
    documentation or in any other way endangers other children and IDSS employees.</p>
    <p>c. If the parent/guardian is consistently late despite warnings from IDSS teaching staff and
    management when dropping off or picking up the child.</p>
    <p>d. If the parent/guardian, despite warnings, behaves disrespectfully towards IDSS staff,
    children, or other parents.</p>
    <p>e. If the parent/guardian takes actions that would cause damage to IDSS, affecting its
    operations and reputation.</p>
    <p>3. In all of the above cases, IDSS has the right to retain all funds paid as well as the right
    to seek proportionate compensation for the breach under Article 9, paragraph (2)(e) of this Agreement.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 10.</p>
    <p class="article-subtitle">(PICKING UP THE CHILD)</p>
    <p>1. The parent/guardian personally picks up their child from IDSS at 2:40 p.m.,
    or at 5:00 p.m. if the child is a beneficiary of the afternoon program.</p>
    <p>2. Keeping students who do not attend the afternoon program at school is not permitted,
    unless there is express approval from the school.</p>
    <p>3. In case of impediment, the parent/guardian is obliged to notify IDSS in a timely manner
    and in writing which other adult will come to pick up the child.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 11.</p>
    <p class="article-subtitle">(INSURANCE)</p>
    <p>IDSS students are insured with an insurance company that offers a collective student
    insurance policy in the event of an accident.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 12.</p>
    <p>In case of damage to business premises, inventory, or teaching aids, and for which it is
    determined that the child intentionally caused the damage despite warnings from the teaching
    staff, the parent is obliged to compensate the same damage without delay, either by making
    adequate compensation or by repairing the damage at their own expense.</p>
  </div>

  <p class="section-heading">V. TRANSITIONAL AND FINAL PROVISIONS</p>

  <div class="article">
    <p class="article-number">Article 13.</p>
    <p>Any disputes arising from this Agreement shall be resolved through mutual agreement;
    otherwise, the dissatisfied party shall exercise its rights before the competent court in Sarajevo.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 14.</p>
    <p>For all matters not explicitly regulated by the provisions of this agreement, applicable regulations shall apply.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 15.</p>
    <p>The agreement parties agree that the essential elements of this agreement constitute confidential information.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 16.</p>
    <p>The agreement enters into force on the day of signing and is valid until one of the agreement parties
    terminates it by mutual agreement, but no later than the end of the current school year.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 17.</p>
    <p>Any amendments to certain provisions of this agreement may be made by an annex to the agreement.</p>
  </div>

  <div class="article">
    <p class="article-number">Article 18.</p>
    <p>The agreement was concluded in two identical copies, of which IDSS retains 1 (one)
    and the parent/guardian retains 1 (one) copy.</p>
  </div>

  <div class="signature-block">
    <p><strong>P.U. Internationale Deutsche Schule Sarajevo - International German School Sarajevo</strong></p>
    <p>P.S.</p>
    <br>
    <p><span class="signature-line"></span></p>
    <p>(Davor Mulalić, Director)</p>
    <br>
    <p class="signature-quote">"With this signature, we confirm that we wish to enroll our child in the International
    German School Sarajevo (IDSS). We undertake to respect the organization of work of this institution
    in the interest of the child, as well as the decisions made by the management and staff of IDSS."</p>
    <br>
    <p><span class="fill-field">${d.parent1_full_name}</span> (name and surname of mother/guardian)</p>
    <p><span class="signature-line"></span> (signature of mother/guardian)</p>
    <br>
    <p><span class="fill-field">${d.parent2_full_name}</span> (name and surname of father/guardian)</p>
    <p><span class="signature-line"></span> (signature of father/guardian)</p>
    <br>
    <p><span class="fill-field">${d.signature_date}</span> (date)</p>
  </div>

  <!-- ANNEX 1 -->
  <div class="article page-break">
    <div class="page-header">Page 6 of 6</div>
    <p class="article-number">Annex 1.</p>
    <p class="article-subtitle">Price List for Academic Year ${d.academic_year}</p>
    <p>This Annex is part of the Agreement on Primary School Education and is valid on the date of signing this Agreement.</p>
    <br>
    <table class="annex-table">
      <thead>
        <tr>
          <th>Services</th>
          <th>Domestic (KM)</th>
          <th>Foreign (KM)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="section-row">
          <td colspan="3">Primary School</td>
        </tr>
        <tr><td>Registration Fee</td><td>1,000</td><td>1,500</td></tr>
        <tr><td>Deposit (installment payments only)</td><td>1,500</td><td>1,500</td></tr>
        <tr><td>Afternoon Program (Grades 1–9)</td><td>2,000</td><td>2,000</td></tr>
        <tr class="section-row"><td colspan="3">Tuition (Grades 1–4)</td></tr>
        <tr><td>Base price</td><td>9,700</td><td>11,970</td></tr>
        <tr><td>Discount for 2nd enrolled child (10%)</td><td>8,730</td><td>10,773</td></tr>
        <tr><td>Discount for 3rd enrolled child (15%)</td><td>8,245</td><td>10,175</td></tr>
        <tr class="section-row"><td colspan="3">Tuition (Grades 5–9)</td></tr>
        <tr><td>Base price</td><td>11,030</td><td>13,700</td></tr>
        <tr><td>Discount for 2nd enrolled child (10%)</td><td>9,927</td><td>12,330</td></tr>
        <tr><td>Discount for 3rd enrolled child (15%)</td><td>9,376</td><td>11,645</td></tr>
      </tbody>
    </table>
  </div>

</div>
</body>
</html>`;
}

// ============================================================
// GERMAN CONTRACT (DE)
// ============================================================
function generateDE(d: ContractTemplateData): string {
  const extendedStaySection = d.uses_extended_stay ? `
    <p>2. Der Preis für die Nachmittagsbetreuung beträgt <span class="fill-field">${d.extended_stay_amount}</span> KM
    (in Worten: <span class="fill-field">${d.extended_stay_text}</span> und 00/100 KM)
    für das gesamte Schuljahr, d.h. von September des laufenden bis Juni des folgenden Jahres.</p>
    <p>3. Der Preis für die Nachmittagsbetreuung ist fix und wird in voller Höhe bezahlt,
    d.h. er wird nicht reduziert und nicht erstattet, unabhängig von der Abwesenheit des Kindes
    von der Schule (z.B. wegen Krankheit, privatem Urlaub/Reise, Feiertagen, beruflichen
    Verpflichtungen der Eltern/des Vormunds oder Schließung der Einrichtung aufgrund höherer Gewalt).</p>
    <p>4. Die Eltern/Vormünder sind verpflichtet, die Zahlung für die Nachmittagsbetreuung für das
    kommende Schuljahr in voller Höhe spätestens bis zum 31.07. des laufenden Jahres auf das
    in Artikel 3 dieses Vertrags angegebene Bankkonto der IDSS zu leisten.</p>
  ` : `
    <p>Die Nachmittagsbetreuung ist in diesem Vertrag nicht enthalten.</p>
  `;

  const installmentSection = d.payment_type === 'installments' ? `
    <p>Wenn sich die Eltern/der Vormund für die monatliche Ratenzahlung des Schulgeldes entscheiden,
    erfolgt die Zahlung in <span class="fill-field">${d.installments_number}</span>
    (in Worten: <span class="fill-field">${d.installments_text}</span>) gleichen monatlichen Raten,
    wobei die erste Rate am <span class="fill-field">${d.first_payment_date}</span> fällig wird.</p>
  ` : '';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vertrag ${d.contract_number}</title>
  ${commonStyles()}
</head>
<body>
<div class="contract-body">

  <div class="page-header">Seite 1 von 6</div>

  <h1 class="contract-title">V E R T R A G</h1>

  <p class="contract-subtitle">
    über die Grundschulbildung und -erziehung für die Einschreibung eines Schülers in die
    <strong>${d.grade_number}.</strong> (in Worten: <strong>${d.grade_text}</strong>) Klasse,
    geschlossen am <strong>${d.contract_date}</strong> in Sarajevo.
  </p>

  <p class="parties-label">Vertragsparteien:</p>
  <div class="parties-block">
    <p>1. P.U. Internationale Deutsche Schule Sarajevo, ID-Nummer 4202220420007,
    Buka 13, 71 000 Sarajevo, vertreten durch den Direktor Davor Mulalić (im Folgenden: IDSS)</p>
    <p>und</p>
    <p>2. <span class="fill-field">${d.parent1_full_name}</span> (Vor- und Nachname der Mutter/des Vormunds)</p>
    <p>&nbsp;&nbsp;&nbsp;<span class="fill-field">${d.parent2_full_name}</span> (Vor- und Nachname des Vaters/des Vormunds)</p>
    <p>&nbsp;&nbsp;&nbsp;<span class="fill-field">${d.address}</span> (Wohnadresse)</p>
    <p>als Leistungsempfänger (im Folgenden: Eltern/Vormund)</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 1.</p>
    <p class="article-subtitle">(VERTRAGSGEGENSTAND)</p>
    <p>1. Gegenstand dieses Vertrags ist die Festlegung der gemeinsamen Rechte und Pflichten der IDSS
    und der Eltern/des Vormunds, deren Kind die IDSS Grundschulbildung und -erziehung anbietet.</p>
    <p>2. Mit der Unterzeichnung dieses Vertrags schreiben die Eltern/der Vormund ihr Kind</p>
    <p>(Vor- und Nachname des Kindes) <span class="fill-field">${d.child_full_name}</span></p>
    <p>(Geburtsdatum) <span class="fill-field">${d.child_dob}</span></p>
    <p>in die Grundschule IDSS zum Zweck der Grundschulbildung und -erziehung ein.
    Die IDSS verpflichtet sich, die festgelegten Leistungen gemäß dem Grundschulbildungs- und
    Erziehungsgesetz des Kantons Sarajevo, dem Institutionsgesetz, den pädagogischen Standards
    für die Grundschulbildung sowie gemäß den Standards und allgemeinen Normen für Arbeitsräume,
    Ausstattung und Lehrmittel für die Grundschule zu erbringen.</p>
    <p>3. Die IDSS wird folgende Leistungen erbringen:</p>
    <ul>
      <li>Durchführung des deutschen Lehrplans in Übereinstimmung mit dem Lehrplan für Grundschulen des Kantons Sarajevo.</li>
      <li>Beobachtung der Entwicklung des Kindes und regelmäßige Information der Eltern/des Vormunds.</li>
      <li>Bereitstellung von didaktischem Material (Lehrbücher, Arbeitshefte usw.) sowie anderen Bildungsmaterialien.</li>
      <li>Durchführung eines mehrsprachigen Programms (Deutsch, Englisch, B/K/S).</li>
      <li>Bereitstellung von qualifiziertem pädagogischem Personal gemäß lokalen Gesetzen und pädagogischen Standards.</li>
      <li>Regelmäßige Durchführung von Elternabenden.</li>
      <li>Tägliche Dokumentation der Anwesenheit der Kinder in der Schule und im Unterricht.</li>
      <li>Bereitstellung von Online-Unterricht bei Bedarf.</li>
      <li>Versicherung des Kindes bei einer Versicherungsgesellschaft.</li>
      <li>Ermöglichung des Zugangs zu den Leistungsergebnissen des Kindes für die Eltern/den Vormund.</li>
      <li>Bereitstellung einer warmen Mahlzeit täglich; bei Besuch der Nachmittagsbetreuung auch eines Snacks.</li>
      <li>Die IDSS stellt Frühstück für Schüler bereit, deren Eltern dies wünschen, zum Preis von 50,00 KM monatlich.</li>
    </ul>
  </div>

  <div class="article">
    <p class="article-number">Artikel 2.</p>
    <p class="article-subtitle">(NEUE UND REGULÄRE EINSCHREIBUNGEN)</p>
    <p>Das Kind gilt als eingeschrieben und sein Platz in der IDSS als reserviert nach:</p>
    <p>1. Einreichung des vollständig ausgefüllten und von den Eltern/dem Vormund unterzeichneten Anmeldeformulars.</p>
    <p>2. Zahlung der Einschreibegebühr in Höhe von <span class="fill-field">${d.enrollment_fee_amount}</span> KM
    (in Worten: <span class="fill-field">${d.enrollment_fee_text}</span> und 00/100 KM),
    wenn das Kind erstmals in die IDSS eingeschrieben wird.</p>
    <p>3. Zahlung einer Kaution in Höhe von <span class="fill-field">${d.deposit_amount}</span> KM
    (in Worten: <span class="fill-field">${d.deposit_text}</span> und 00/100 KM),
    wenn das Schulgeld in Raten gezahlt wird.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 3.</p>
    <p class="article-subtitle">(SCHULGELD UND ZAHLUNG)</p>
    <p>Das jährliche Schulgeld für das Schuljahr ${d.academic_year} beträgt für dieses Kind:
    <span class="fill-field">${d.tuition_annual_amount}</span> KM
    (in Worten: <span class="fill-field">${d.tuition_annual_text}</span> und 00/100 KM),
    gemäß der gültigen Preisliste aus Anhang 1, der Bestandteil dieses Vertrags ist.</p>
    <p>Die Eltern/der Vormund können das Schulgeld auf zwei Arten zahlen:</p>
    <p>1. Einmalig als Gesamtbetrag, oder</p>
    <p>2. In Raten, in gleichen monatlichen Beträgen, wie in diesem Artikel definiert.</p>
    ${installmentSection}
    <p>Bei wesentlichen Änderungen am Geldmarkt sowie der wirtschaftlichen Lage behält sich die IDSS
    das Recht vor, die Preisliste aus Anhang 1 dieses Vertrags zu ändern, worüber ein gesonderter
    Vertragsanhang geschlossen wird.</p>
    <p>Die Zahlung der Einschreibegebühr, Kaution sowie des Schulgeldes erfolgt auf folgendes Bankkonto:</p>
    <p><strong>P.U. Internationale Deutsche Schule Sarajevo</strong></p>
    <p>SPARKASSE BANK d.d., Sarajevo</p>
    <p>KONTONUMMER: 1994990021809884</p>
    <p>IBAN BA39 1994990021809884 &nbsp; SWIFT (BIC) ABSBBA22</p>
    <p>Die Bankgebühren im Zusammenhang mit allen in diesem Vertrag definierten Zahlungen
    übernehmen die Eltern/der Vormund vollständig.</p>
    <p>Die Zahlung erfolgt auf das Schulkonto wie in diesem Artikel erklärt, spätestens bis zum 5. des laufenden Monats.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 4.</p>
    <p class="article-subtitle">(ABMELDUNGEN)</p>
    <p>1. Die Eltern/der Vormund haben das Recht, ihr Kind von der IDSS abzumelden und den Vertrag
    vor seinem Ablauf einseitig zu kündigen.</p>
    <p>2. Die Abmeldung des Kindes von der IDSS erfolgt zum I. Halbjahr oder am Ende des Schuljahres,
    d.h. II. Halbjahr.</p>
    <p>3. Die Eltern/der Vormund sind verpflichtet, die IDSS über die beabsichtigte Abmeldung
    ausschließlich schriftlich und zwei Monate vor der geplanten Abmeldung zu informieren.</p>
    <p>a. Wenn die Eltern/der Vormund ihr Kind für das I. Halbjahr abmelden und das gesamte Schulgeld
    bis zum 31.12. des laufenden Jahres gezahlt haben, erstattet die IDSS drei Monatsraten,
    spätestens 4 Monate nach der schriftlichen Benachrichtigung.</p>
    <p>b. Einschreibegebühren sind nicht erstattungsfähig und die IDSS behält die Einschreibegebühr
    unabhängig von einer vorzeitigen Beendigung oder Kündigung des Vertrags.</p>
    <p>c. Das Kind behält das Recht, trotz der Abmeldung für das erste Halbjahr den Unterricht zu
    besuchen, bis zum Ende des ersten Halbjahres, d.h. bis zum 31.01. des laufenden Jahres.</p>
    <p>d. Wenn die Eltern/der Vormund das gesamte Schulgeld für das nächste Schuljahr bis zum 10.05.
    des laufenden Jahres gezahlt haben und den Vertrag vor Beginn des neuen Schuljahres kündigen,
    erstattet die IDSS drei Monatsraten spätestens bis zum 30.10. des laufenden Jahres.</p>
    <p>e. Wenn das Schulgeld in Raten gezahlt wird und die Eltern/der Vormund das Kind unter Einhaltung
    der schriftlichen Ankündigung gemäß Artikel 3 dieses Vertrags abmelden, behält die IDSS alle
    bezahlten Raten sowie den Kautionsbetrag abzüglich der tatsächlichen Kosten, die durch die
    Abmeldung entstehen können. Die Eltern/der Vormund sind verpflichtet, das Schulgeld bis zum
    31.12. zu zahlen, wenn das Kind im ersten Halbjahr abgemeldet wird, bzw. bis zum 30.06.,
    wenn die Abmeldung im zweiten Halbjahr erfolgt.</p>
    <p>4. Die IDSS behält die bezahlten monatlichen Schulgelder für das laufende Jahr, alle Raten für
    das laufende und vorherige Schuljahre sowie den Gesamtbetrag der Kaution, wenn die Eltern/der
    Vormund die IDSS nicht bis zum 31.12. des laufenden Jahres schriftlich über die Absicht informieren,
    die Schulausbildung für das folgende Schuljahr zu beenden.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 5.</p>
    <p class="article-subtitle">(ARBEITSZEIT)</p>
    <p>Der Unterricht in der IDSS findet von Montag bis Freitag von 8:00 bis 14:40 Uhr statt.
    Die Wochenenden sind unterrichtsfrei.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 6.</p>
    <p class="article-subtitle">(SCHULFREIE TAGE)</p>
    <p>1. Die IDSS behält sich das Recht vor, ihren Arbeitsplan an Ferien, lokale Feiertage sowie
    Sommer- und Winterferien anzupassen.</p>
    <p>2. Die Schule bleibt an folgenden Terminen geschlossen: Tag der Deutschen Einheit,
    Herbstferien, Tag der Staatlichkeit, Winterferien, Unabhängigkeitstag, Frühlingsferien,
    Tag der Arbeit, Ramadan- und Opferfest und Sommerferien.</p>
    <p>3. Zu Beginn jedes Schuljahres werden die Eltern/Vormünder über den Schulkalender für das
    laufende Schuljahr informiert. Der Schulkalender wird auf der IDSS-Website veröffentlicht (http://idss.edu.ba/).</p>
    <p>4. Die IDSS behält sich das Recht vor, die Termine der schulfreien Tage zu ändern,
    worüber die Eltern/Vormünder rechtzeitig informiert werden.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 7.</p>
    <p class="article-subtitle">(NACHMITTAGSBETREUUNG)</p>
    <p>1. Die Nachmittagsbetreuung ist eine optionale Leistung und umfasst ein Fünf-Tage-Programm
    mit Hausaufgabenhilfe, freien und anderen geplanten Aktivitäten nach dem Unterricht sowie
    nach Einschätzung individuelle DaF-Harmonisierungsstunden, von 15:15 bis 17:00 Uhr an jedem Werktag.</p>
    ${extendedStaySection}
  </div>

  <div class="article">
    <p class="article-number">Artikel 8.</p>
    <p class="article-subtitle">(AUSFLÜGE, LOKALE BESUCHE UND VERANSTALTUNGEN)</p>
    <p>1. Wenn die Eltern/Vormünder wünschen, dass ihr Kind an Schulausflügen, lokalen Besuchen und
    Veranstaltungen teilnimmt, müssen sie eine entsprechende Einverständniserklärung unterzeichnen.
    Nur mit dieser Einverständniserklärung ist dem Kind die Teilnahme gestattet.</p>
    <p>2. Die Eltern/Vormünder tragen die Kosten für Ausflüge und lokale Besuche in voller Höhe,
    sofern die IDSS nichts anderes bestimmt.</p>
    <p>3. Der Ausflug ist eine gesetzliche Verpflichtung, und an diesem Tag findet kein regulärer
    Unterricht für Kinder statt, die nicht am Ausflug teilnehmen. Die Eltern/Vormünder werden
    rechtzeitig über geplante Ausflüge, lokale Besuche und Veranstaltungen informiert.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 9.</p>
    <p class="article-subtitle">(VERTRAGSKÜNDIGUNG)</p>
    <p>1. Dieser Vertrag wurde in Übereinstimmung mit der Schulordnung, der Arbeitsordnung und
    anderen geschäftsnormativen Akten der IDSS erstellt.</p>
    <p>2. Falls sich die Eltern/Vormünder nicht an die Bestimmungen der IDSS-Hausordnung halten,
    die auf der offiziellen IDSS-Website (www.idss.edu.ba) verfügbar ist, hat die IDSS das Recht,
    diesen Vertrag vor Ende des Schuljahres zu kündigen, einschließlich aber nicht beschränkt auf:</p>
    <p>a. Wenn die Eltern/Vormünder ihre Verpflichtungen gegenüber der IDSS nicht erfüllen,
    spätestens 7 Tage nach dem Fälligkeitsdatum, behält sich die IDSS das Recht vor,
    alle geeigneten rechtlichen Maßnahmen zur Eintreibung ausstehender Schulden zu ergreifen.</p>
    <p>b. Wenn die Eltern/Vormünder ein krankes Kind zur IDSS bringen oder keine entsprechende
    ärztliche Bescheinigung vorlegen oder auf andere Weise andere Kinder und IDSS-Mitarbeiter gefährden.</p>
    <p>c. Wenn die Eltern/Vormünder trotz Warnungen des Lehrpersonals und der IDSS-Leitung beim
    Bringen oder Abholen des Kindes ständig zu spät kommen.</p>
    <p>d. Wenn sich die Eltern/Vormünder trotz Warnungen respektlos gegenüber dem IDSS-Personal,
    Kindern oder anderen Eltern verhalten.</p>
    <p>e. Wenn die Eltern/Vormünder Handlungen vornehmen, die der IDSS schaden und ihren Betrieb
    und Ruf beeinträchtigen würden.</p>
    <p>3. In allen oben genannten Fällen hat die IDSS das Recht, alle eingezahlten Beträge einzubehalten
    sowie das Recht, eine verhältnismäßige Entschädigung für den Verstoß gemäß Artikel 9 Absatz (2)(e)
    dieses Vertrags zu fordern.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 10.</p>
    <p class="article-subtitle">(ABHOLEN DES KINDES)</p>
    <p>1. Die Eltern/Vormünder holen ihr Kind persönlich um 14:40 Uhr von der IDSS ab,
    bzw. um 17:00 Uhr, wenn das Kind die Nachmittagsbetreuung nutzt.</p>
    <p>2. Das Verbleiben von Schülern, die nicht am Nachmittagsbetreuungsprogramm teilnehmen,
    ist in der Schule nicht gestattet, es sei denn, es liegt eine ausdrückliche Genehmigung der Schule vor.</p>
    <p>3. Im Falle einer Verhinderung sind die Eltern/Vormünder verpflichtet, die IDSS rechtzeitig
    und schriftlich darüber zu informieren, welche andere volljährige Person das Kind abholen wird.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 11.</p>
    <p class="article-subtitle">(VERSICHERUNG)</p>
    <p>Die Schüler der IDSS sind bei einer Versicherungsgesellschaft versichert,
    die eine Kollektivunfallversicherung für Schüler anbietet.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 12.</p>
    <p>Im Falle einer Beschädigung von Geschäftsräumen, Inventar oder Lehrmitteln, bei der festgestellt
    wird, dass das Kind diese trotz Warnung des Lehrpersonals vorsätzlich beschädigt hat, sind die
    Eltern verpflichtet, den Schaden unverzüglich zu beheben, entweder durch eine angemessene
    Entschädigung oder durch die Reparatur auf eigene Kosten.</p>
  </div>

  <p class="section-heading">V. ÜBERGANGS- UND SCHLUSSBESTIMMUNGEN</p>

  <div class="article">
    <p class="article-number">Artikel 13.</p>
    <p>Eventuelle Streitigkeiten aus diesem Vertrag werden durch Vereinbarung gelöst, andernfalls
    macht die unzufriedene Partei ihre Rechte beim zuständigen Gericht in Sarajevo geltend.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 14.</p>
    <p>Für alles, was nicht ausdrücklich durch die Bestimmungen dieses Vertrags geregelt ist,
    gelten die geltenden Vorschriften.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 15.</p>
    <p>Die Vertragsparteien stimmen zu, dass die wesentlichen Elemente des vorliegenden Vertrags
    vertrauliche Informationen darstellen.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 16.</p>
    <p>Der Vertrag tritt am Tag der Unterzeichnung in Kraft und gilt, bis ihn eine der Vertragsparteien
    einvernehmlich kündigt, längstens jedoch bis zum Ende des laufenden Schuljahres.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 17.</p>
    <p>Eventuelle Änderungen einzelner Bestimmungen dieses Vertrags können durch einen
    Vertragsanhang vorgenommen werden.</p>
  </div>

  <div class="article">
    <p class="article-number">Artikel 18.</p>
    <p>Der Vertrag wird in zwei identischen Exemplaren geschlossen, von denen die IDSS 1 (ein)
    und die Eltern/Vormünder 1 (ein) Exemplar behalten.</p>
  </div>

  <div class="signature-block">
    <p><strong>P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo</strong></p>
    <p>L.S.</p>
    <br>
    <p><span class="signature-line"></span></p>
    <p>(Davor Mulalić, Direktor)</p>
    <br>
    <p class="signature-quote">"Mit dieser Unterschrift bestätigen wir, dass wir unser Kind in die Internationale
    Deutsche Schule Sarajevo (IDSS) einschreiben möchten. Wir verpflichten uns, im Interesse des Kindes
    die Arbeitsorganisation dieser Einrichtung sowie die Entscheidungen der Schulleitung und des
    Schulpersonals zu respektieren."</p>
    <br>
    <p><span class="fill-field">${d.parent1_full_name}</span> (Vor- und Nachname der Mutter/des Vormunds)</p>
    <p><span class="signature-line"></span> (Unterschrift der Mutter/des Vormunds)</p>
    <br>
    <p><span class="fill-field">${d.parent2_full_name}</span> (Vor- und Nachname des Vaters/des Vormunds)</p>
    <p><span class="signature-line"></span> (Unterschrift des Vaters/des Vormunds)</p>
    <br>
    <p><span class="fill-field">${d.signature_date}</span> (Datum)</p>
  </div>

  <!-- ANHANG 1 -->
  <div class="article page-break">
    <div class="page-header">Seite 6 von 6</div>
    <p class="article-number">Anhang 1.</p>
    <p class="article-subtitle">Preisliste für das Schuljahr ${d.academic_year}</p>
    <p>Dieser Anhang ist Bestandteil des Vertrags über die Grundschulbildung und -erziehung
    und gilt zum Zeitpunkt der Unterzeichnung dieses Vertrags.</p>
    <br>
    <table class="annex-table">
      <thead>
        <tr>
          <th>Leistungen</th>
          <th>Inländer (KM)</th>
          <th>Ausländer (KM)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="section-row">
          <td colspan="3">Grundschule</td>
        </tr>
        <tr><td>Einschreibegebühr</td><td>1.000</td><td>1.500</td></tr>
        <tr><td>Kaution (nur bei Ratenzahlung)</td><td>1.500</td><td>1.500</td></tr>
        <tr><td>Nachmittagsbetreuung (Klassen 1–9)</td><td>2.000</td><td>2.000</td></tr>
        <tr class="section-row"><td colspan="3">Schulgeld (Klassen 1–4)</td></tr>
        <tr><td>Grundpreis</td><td>9.700</td><td>11.970</td></tr>
        <tr><td>Rabatt für 2. eingeschriebenes Kind (10%)</td><td>8.730</td><td>10.773</td></tr>
        <tr><td>Rabatt für 3. eingeschriebenes Kind (15%)</td><td>8.245</td><td>10.175</td></tr>
        <tr class="section-row"><td colspan="3">Schulgeld (Klassen 5–9)</td></tr>
        <tr><td>Grundpreis</td><td>11.030</td><td>13.700</td></tr>
        <tr><td>Rabatt für 2. eingeschriebenes Kind (10%)</td><td>9.927</td><td>12.330</td></tr>
        <tr><td>Rabatt für 3. eingeschriebenes Kind (15%)</td><td>9.376</td><td>11.645</td></tr>
      </tbody>
    </table>
  </div>

</div>
</body>
</html>`;
}
