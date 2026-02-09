// Contract HTML templates based on the actual IDSS contracts (BA/EN/DE)
// These templates match the original .dotx documents exactly

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
      @media print { body { margin: 0; } }
      body, .contract-body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #000;
        max-width: 210mm;
        margin: 0 auto;
        padding: 20mm 25mm;
        background: white;
      }
      .contract-body h1 { font-size: 16pt; text-align: center; letter-spacing: 6px; margin-bottom: 12pt; font-weight: bold; }
      .contract-body h2 { font-size: 12pt; text-align: center; font-weight: bold; margin: 18pt 0 6pt; }
      .contract-body h3 { font-size: 11pt; text-align: center; font-weight: bold; margin: 6pt 0; text-transform: uppercase; }
      .contract-body p { margin: 4pt 0; text-align: justify; }
      .contract-body .subtitle { text-align: center; margin-bottom: 16pt; font-size: 11pt; }
      .contract-body .parties { margin: 12pt 0; }
      .contract-body .article { margin-top: 16pt; }
      .contract-body .article-title { font-weight: bold; text-align: center; font-size: 11pt; }
      .contract-body .article-subtitle { font-weight: bold; text-align: center; font-size: 10pt; text-transform: uppercase; margin-bottom: 8pt; }
      .contract-body ul { margin: 4pt 0 4pt 20pt; }
      .contract-body li { margin: 2pt 0; }
      .contract-body .signature-block { margin-top: 30pt; }
      .contract-body .signature-line { border-bottom: 1px solid #000; width: 300px; display: inline-block; margin: 8pt 0; }
      .contract-body .fill-field { border-bottom: 1px solid #000; min-width: 200px; display: inline-block; font-weight: bold; }
      .contract-body .page-num { text-align: center; font-size: 9pt; color: #666; margin-top: 20pt; }
      .contract-body table { width: 100%; border-collapse: collapse; margin: 10pt 0; }
      .contract-body table th, .contract-body table td { border: 1px solid #000; padding: 4pt 8pt; text-align: left; font-size: 10pt; }
      .contract-body table th { background: #f0f0f0; font-weight: bold; }
      .contract-body .bold { font-weight: bold; }
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

function generateBA(d: ContractTemplateData): string {
  const extendedStaySection = d.uses_extended_stay ? `
    <p>2. Cijena usluge produženog boravka iznosi <span class="fill-field">${d.extended_stay_amount}</span> KM (slovima: <span class="fill-field">${d.extended_stay_text}</span> i 00/100 KM), za cijelu školsku godinu, tj. od septembra tekuće do juna naredne godine.</p>
    <p>3. Cijena produženog boravka je fiksna i plaća se u punom iznosu, tj. ne umanjuje se i ne vraća se, bez obzira na odsustvo djeteta iz škole (npr. zbog bolesti, privatnog odmora/putovanja, odmora i praznika, roditeljske/starateljske poslovne obaveze ili zatvaranja ustanove radi okolnosti uzrokovanih višom silom).</p>
    <p>4. Roditelj/staratelj je obavezan izvršiti uplatu produženog boravka za narednu školsku godinu u punom iznosu a najkasnije do 31.07. tekuće godine na bankovni račun IDSS naznačen u Članu 3. ovog Ugovora.</p>
  ` : '';

  const installmentSection = d.payment_type === 'installments' ? `
    <p>Ako se roditelj/staratelj odluči na plaćanje školarine u mjesečnim ratama u tom slučaju plaćanje školarine vršiće se u <span class="fill-field">${d.installments_number}</span> (slovima: <span class="fill-field">${d.installments_text}</span>) jednakih mjesečnih rata, a prva mjesečna rata dospijeva dana <span class="fill-field">${d.first_payment_date}</span> godine.</p>
  ` : '';

  return `<!DOCTYPE html><html lang="bs"><head><meta charset="UTF-8">${commonStyles()}</head><body>
<div class="contract-body">
  <h1>U G O V O R</h1>
  <p class="subtitle">o osnovnoškolskom odgoju i obrazovanju za upis učenika u ${d.grade_number} (slovima: ${d.grade_text}) razred, zaključen dana ${d.contract_date} godine u Sarajevu.</p>
  
  <p class="bold">Ugovorne strane:</p>
  <div class="parties">
    <p>1. P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo, ID Broj 4202220420007, Buka 13, 71 000 Sarajevo, zastupana po direktoru Davor Mulalić (u daljem tekstu: IDSS)</p>
    <p>2. <span class="fill-field">${d.parent1_full_name}</span> (ime i prezime majke/staratelja)</p>
    <p><span class="fill-field">${d.parent2_full_name}</span> (ime i prezime oca/staratelja)</p>
    <p><span class="fill-field">${d.address}</span> (adresa prebivališta)</p>
    <p>kao Korisnik usluga (u daljem tekstu: roditelj/staratelj)</p>
  </div>

  <div class="article">
    <p class="article-title">Član 1.</p>
    <p class="article-subtitle">(PREDMET UGOVORA)</p>
    <p>1. Predmet ovog Ugovora je utvrđivanje zajedničkih prava i obaveza IDSS i roditelja/staratelja, čijem djetetu IDSS pruža uslugu osnovnoškolskog odgoja i obrazovanja.</p>
    <p>2. Potpisivanjem ovog Ugovora roditelj/staratelj upisuje svoje dijete</p>
    <p>(ime i prezime djeteta) <span class="fill-field">${d.child_full_name}</span></p>
    <p>(datum rođenja) <span class="fill-field">${d.child_dob}</span></p>
    <p>u osnovnu školu IDSS, u svrhu sticanja osnovnoškolskog odgoja i obrazovanja. IDSS ima obavezu da obezbijedi utvrđene usluge u skladu sa Zakonom o osnovnom odgoju i obrazovanju Kantona Sarajevo, Zakonom o ustanovama, Pedagoškim standardima za osnovno obrazovanje, kao i u skladu sa Standardima i općim normativima o radnom prostoru, opremi, i nastavnim sredstvima i učilima po predmetima za osnovnu školu.</p>
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
    <p class="article-title">Član 2.</p>
    <p class="article-subtitle">(NOVI I REDOVNI UPISI)</p>
    <p>Dijete će se smatrati upisanim i njegovo mjesto u IDSS će biti rezervisano nakon:</p>
    <p>1. dostavljenog kompletno popunjenog i od strane roditelja/staratelja potpisanog upisnog obrasca.</p>
    <p>2. izvršene uplate upisnine u iznosu od <span class="fill-field">${d.enrollment_fee_amount}</span> KM (slovima: <span class="fill-field">${d.enrollment_fee_text}</span> i 00/100 KM), ako se dijete prvi put upisuje u IDSS.</p>
    <p>3. izvršene uplate depozita u iznosu od <span class="fill-field">${d.deposit_amount}</span> KM (slovima: <span class="fill-field">${d.deposit_text}</span> i 00/100 KM), ako se plaćanje školarine vrši obročno.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 3.</p>
    <p class="article-subtitle">(ŠKOLARINA I UPLATA)</p>
    <p>Godišnja školarina za školsku ${d.academic_year} godinu, za ovo dijete iznosi: <span class="fill-field">${d.tuition_annual_amount}</span> KM (slovima: <span class="fill-field">${d.tuition_annual_text}</span> i 00/100 KM), a prema važećem cjenovniku iz Aneksa 1. koji je sastavni dio ovog Ugovora.</p>
    <p>Roditelj/staratelj može uplatiti školarinu na dva načina:</p>
    <p>1. jednokratno, u cjelokupnom iznosu ili</p>
    <p>2. obročno, u jednakim mjesečnim ratama, kako je definisano u ovom članu ugovora.</p>
    ${installmentSection}
    <p>Ako dođe do značajnih promjena na tržištu novca, kao i ekonomskim prilikama, IDSS zadržava pravo izmjene cjenovnika iz Aneksa 1. ovog ugovora, o čemu će se zaključiti poseban Aneks ugovora.</p>
    <p>Uplate upisnine, depozita kao i školarine vrše se na sljedeći bankovni račun:</p>
    <p>P.U. Internationale Deutsche Schule Sarajevo</p>
    <p>SPARKASSE BANK d.d., Sarajevo</p>
    <p>BROJ RAČUNA: 1994990021809884</p>
    <p>IBAN BA39 1994990021809884 SWIFT (BIC) ABSBBA22</p>
    <p>Troškove bankovnih naknada, vezanih za sve uplate definisane ovim Ugovorom, preuzima roditelj/staratelj u cijelosti.</p>
    <p>Uplata se vrši na račun škole kako je objašnjeno u ovom Članu, ovog Pravilnika i to najkasnije do 5.-og u tekućem mjesecu.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 4.</p>
    <p class="article-subtitle">(ISPISI)</p>
    <p>1. Roditelj/staratelj ima pravo da ispiše svoje dijete iz IDSS i da jednostrano raskine Ugovor prije njegovog isteka.</p>
    <p>2. Ispis djeteta iz IDSS se realizuje za I. polugodište ili na kraju školske godine tj. II. polugodište.</p>
    <p>3. Roditelj/staratelj je obavezan obavijesti IDSS o namjeri ispisa djeteta isključivo u pisanoj formi i to dva mjeseca prije planiranog ispisa.</p>
    <p>4. Ukoliko roditelj/staratelj ispiše svoje dijete za I. polugodište, a izvršio je uplatu cjelokupnog iznosa školarine do 31.12. tekuće godine, tada IDSS vrši povrat u iznosu od tri mjesečne rate, a najkasnije 4 mjeseca nakon pismenog obavještenja od strane roditelja/staratelja.</p>
    <p>5. Upisnine su bespovratna sredstva i IDSS zadržava upisninu bez obzira na prijevremeni istek ili raskid ugovora.</p>
    <p>6. Dijete zadržava pravo na pohađanje nastave uprkos ispisa za prvo polugodište, sve do završetka prvog polugodišta tj. do 31.01. tekuće godine.</p>
    <p>7. Ako je roditelj/staratelj izvršio uplatu cjelokupne školarine za narednu školsku godinu do 10.05. tekuće godine, a raskine ugovor prije početka nove školske godine, IDSS vrši povrat uplaćene tri mjesečne rate najkasnije do 30.10. tekuće godine.</p>
    <p>e. Ako se školarina plaća obročno, a roditelj/staratelj ispiše dijete poštivajući pismenu najavu u skladu sa Članom 3, ovog Ugovora, IDSS zadržava sve uplaćene rate kao i iznos depozita umanjen za realne troškove koji mogu proisteći ispisom djeteta. Roditelj/staratelj je dužan isplatiti školarinu do 31.12. ako se dijete ispisuje u prvom polugodištu ili ako se dijete ispisuje u drugom polugodištu do 30.06.</p>
    <p>4. IDSS zadržava uplaćene mjesečne školarine za tekuću godinu, te sve rate za tekuću i prethodne školske godine, kao i ukupan iznos depozita ukoliko roditelj/staratelj ne obavijesti IDSS u pisanoj formi o namjeri prekida školovanja i to do 31.12. tekuće godine za narednu školsku godinu.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 5.</p>
    <p class="article-subtitle">(RADNO VRIJEME)</p>
    <p>Nastava u IDSS održava se od ponedjeljka do petka u terminu od 8:00 do 14:40 sati. Dani vikenda su neradni.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 6.</p>
    <p class="article-subtitle">(NERADNI DANI)</p>
    <p>1. IDSS zadržava pravo da svoj raspored rada usklađuje sa odmorima, lokalnim praznicima, te ljetnim i zimskim raspustima.</p>
    <p>2. Škola će biti zatvorena na sljedeće datume: Dan Njemačkog ujedinjenja, Jesenji raspust, Dan Državnosti, Zimski raspust, Dan Nezavisnosti, Proljetni raspust, Dan Rada, Ramazanski i Kurbanski Bajram i Ljetni raspust.</p>
    <p>3. Na početku svake školske godine roditelji/staratelji će biti upoznati sa školskim kalendarom za tekuću školsku godinu. Školski kalendar će biti postavljen na internet stranici IDSS (http://idss.edu.ba/).</p>
    <p>4. IDSS zadržava pravo na izmjene datuma neradnih dana o čemu će roditelji/staratelji biti blagovremeno obaviješteni.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 7.</p>
    <p class="article-subtitle">(PRODUŽENI BORAVAK)</p>
    <p>1. Produženi boravak je usluga po izboru i obuhvata petodnevni program pružanja pomoći u pisanju domaćih zadaća, slobodne i druge planirane aktivnosti poslije nastave, i po procjeni individualne časove harmonizacije znanja njemačkog jezika (DaF), u vremenu od 15:15 do 17:00 sati, svakog radnog dana.</p>
    ${extendedStaySection}
  </div>

  <div class="article">
    <p class="article-title">Član 8.</p>
    <p class="article-subtitle">(IZLETI, LOKALNE POSJETE I MANIFESTACIJE)</p>
    <p>1. Ukoliko roditelj/staratelj želi da njegovo dijete učestvuje u školskim izletima, lokalnim posjetama i manifestacijama, treba da potpiše odgovarajuću saglasnost. Samo uz potpisivanje te saglasnosti djetetu je dozvoljeno da učestvuje u školskim izletima, lokalnim posjetama i manifestacijama.</p>
    <p>2. Roditelj/staratelj snosi troškove izleta i lokalnih posjeta u cijelosti, osim ako IDSS ne odluči drugačije.</p>
    <p>3. Izlet je zakonska obaveza i tog dana IDSS ne drži redovnu nastavu za djecu koja ne prisustvuju izletu. Roditelji/staratelji će biti blagovremeno obaviješteni o planiranim izletima, lokalnim posjetama ili manifestacijama.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 9.</p>
    <p class="article-subtitle">(RASKID UGOVORA)</p>
    <p>1. Ovaj ugovor sačinjen je u skladu sa Pravilima Škole, Pravilnikom o radu, i ostalim poslovno normativnim aktima IDSS.</p>
    <p>2. U slučaju da se roditelj/staratelj ne pridržava odredbi Pravilnika o kućnom redu IDSS, koji se može preuzeti na službenoj stranici IDSS (www.idss.edu.ba), uključujući, ali ne ograničavajući se na dolje navedeno, IDSS ima pravo da raskine ovaj ugovor prije završetka školske godine.</p>
    <ul>
      <li>a. Ako roditelj/staratelj ne izmiri obaveze prema IDSS kako je ugovorom utvrđeno, najkasnije 7 dana od datuma dospijeća obaveze, IDSS zadržava pravo da poduzme sve odgovarajuće zakonske mjere za ostvarivanje neisplaćenih dugovanja.</li>
      <li>b. Ako roditelj/staratelj dovede bolesno dijete u IDSS ili ne donese odgovarajuću zdravstvenu potvrdu ili na bilo koji drugi način ugrozi ostalu djecu i zaposlenike IDSS.</li>
      <li>c. Ako roditelj/staratelj stalno kasni unatoč opomenama nastavnog osoblja i uprave IDSS, kod dovođenja ili odvođenja djeteta.</li>
      <li>d. Ako se roditelj/staratelj uprkos upozorenjima ophodi bez poštovanja prema osoblju IDSS, djeci ili drugim roditeljima.</li>
      <li>e. Ako roditelj/staratelj čini radnje kojima bi IDSS bila nanesena šteta, a koje bi uticale na rad i ugled IDSS.</li>
    </ul>
    <p>3. U svim gore navedenim slučajevima, IDSS ima pravo da zadrži sva uplaćena sredstva kao i pravo da traži srazmjernu odštetu za povredu iz Člana 9. stav (2)(e) ovog Ugovora.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 10.</p>
    <p class="article-subtitle">(DOLAZAK PO DIJETE)</p>
    <p>1. Roditelj/staratelj lično dolazi po svoje dijete u IDSS u 14:40 sati, odnosno u 17:00 sati, ako je dijete korisnik usluge produženog boravka.</p>
    <p>2. Zadržavanje učenika koji ne pohađaju program produženog boravka u školi nije dozvoljeno, osim ako postoji izričito odobrenje škole.</p>
    <p>3. U slučaju spriječenosti roditelj/staratelj ima obavezu pravovremeno i pismenim putem obavijestiti IDSS, koja će druga punoljetna osoba doći po dijete.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 11.</p>
    <p class="article-subtitle">(OSIGURANJE)</p>
    <p>Učenici IDSS su osigurani kod osiguravajućeg društva, koje nudi policu kolektivnog osiguranja učenika u slučaju nezgoda.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 12.</p>
    <p>U slučaju oštećenja poslovnih prostorija, inventara ili nastavnih učila, a za koje se utvrdi da je dijete namjerno i pored upozorenja nastavnog kadra oštetilo, roditelj je dužan bez odlaganja istu štetu namiriti na način ili da izvrši adekvatnu naknadu ili na svoj teret sanira učinjeno oštećenje.</p>
  </div>

  <h3>V. PRELAZNE I ZAVRŠNE ODREDBE</h3>

  <div class="article">
    <p class="article-title">Član 13.</p>
    <p>Eventualni sporovi iz ovog Ugovora rješavat će se putem dogovora, u protivnom nezadovoljna strana ostvaruje svoja prava kod nadležnog suda u Sarajevu.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 14.</p>
    <p>Za sve što nije izričito regulisano odredbama ovog ugovora primjenjivat će se važeći propisi.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 15.</p>
    <p>Ugovorne strane su saglasne, da bitni elementi predmetnog ugovora predstavljaju povjerljive informacije.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 16.</p>
    <p>Ugovor stupa na snagu danom potpisivanja i važi dok ga jedna od ugovornih strana sporazumno ne raskine, a najduže do završetka tekuće školske godine.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 17.</p>
    <p>Eventualne izmjene pojedinih odredbi ovog ugovora je moguće izvršiti aneksom ugovora.</p>
  </div>

  <div class="article">
    <p class="article-title">Član 18.</p>
    <p>Ugovor je zaključen u dva identična primjerka, od kojih IDSS zadržava 1 (jedan) a roditelj/staratelj 1 (jedan) primjerak.</p>
  </div>

  <div class="signature-block">
    <p>P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo</p>
    <p>M.P.</p>
    <p><span class="signature-line"></span> (Davor Mulalić, Direktor)</p>
    <br/>
    <p><em>"Ovim potpisom potvrđujemo da želimo upisati svoje dijete u Međunarodnu njemačku školu Sarajevo (IDSS). Obavezujemo se da ćemo u interesu djeteta poštovati organizaciju rada ove ustanove kao i odluke koje donese uprava i osoblje škole."</em></p>
    <br/>
    <p><span class="fill-field">${d.parent1_full_name}</span> (ime i prezime majke/staratelja)</p>
    <p><span class="signature-line"></span> (potpis majke/staratelja)</p>
    <br/>
    <p><span class="fill-field">${d.parent2_full_name}</span> (ime i prezime oca/staratelja)</p>
    <p><span class="signature-line"></span> (potpis oca/staratelja)</p>
    <br/>
    <p><span class="fill-field">${d.signature_date}</span> (datum)</p>
  </div>
</div>
</body></html>`;
}

function generateEN(d: ContractTemplateData): string {
  const extendedStaySection = d.uses_extended_stay ? `
    <p>2. The price of afternoon program is <span class="fill-field">${d.extended_stay_amount}</span> KM (in letters: <span class="fill-field">${d.extended_stay_text}</span> and 00/100 KM), for the whole school year, i.e. from September of the current to June of the following year.</p>
    <p>3. The price of the afternoon program is fixed and paid in full, i.e. it is not reduced or refunded, regardless of the child's absence from school.</p>
    <p>4. The parent/guardian is obliged to pay the afternoon program for the next school year in full and no later than 31.07. current year to the IDSS bank account specified in Article 3 of this Agreement.</p>
  ` : '';

  const installmentSection = d.payment_type === 'installments' ? `
    <p>If the parent/guardian decides to pay the tuition fee in monthly installments, in that case the tuition fee will be paid in <span class="fill-field">${d.installments_number}</span> (in letters: <span class="fill-field">${d.installments_text}</span>) equal monthly installments, and the first monthly installment is due on the day <span class="fill-field">${d.first_payment_date}</span>.</p>
  ` : '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${commonStyles()}</head><body>
<div class="contract-body">
  <h1>A G R E E M E N T</h1>
  <p class="subtitle">on primary school education for enrollment of students in ${d.grade_number} (in letters: ${d.grade_text}) class, concluded on ${d.contract_date} in Sarajevo.</p>
  
  <p class="bold">Agreement Parties:</p>
  <div class="parties">
    <p>1. P.U. Internationale Deutsche Schule Sarajevo - Međunarodna njemačka škola Sarajevo, ID 4202220420007, Buka 13, 71 000 Sarajevo, represented by director Davor Mulalić (hereinafter: IDSS)</p>
    <p>2. <span class="fill-field">${d.parent1_full_name}</span> (name and surname of mother/guardian)</p>
    <p><span class="fill-field">${d.parent2_full_name}</span> (name and surname of father/guardian)</p>
    <p><span class="fill-field">${d.address}</span> (address of residence)</p>
    <p>as the Service User (hereinafter: parent/guardian).</p>
  </div>

  <div class="article">
    <p class="article-title">Article 1.</p>
    <p class="article-subtitle">(SUBJECT OF THE AGREEMENT)</p>
    <p>1. The subject of this Agreement is to determine the joint rights and obligations of IDSS and parents/guardians, to whose child IDSS provides primary school education.</p>
    <p>2. By signing this Agreement, the parent/guardian enrolls his child</p>
    <p>(name and surname of the child) <span class="fill-field">${d.child_full_name}</span></p>
    <p>(date of birth) <span class="fill-field">${d.child_dob}</span></p>
    <p>to the IDSS, for the purpose of acquiring primary education. IDSS is obliged to provide established services in accordance with the Law on Primary Education of the Sarajevo Canton, the Law on Institutions, Pedagogical Standards for Primary Education, as well as in accordance with the Standards and General Norms on Workspace, Equipment, and Teaching Aids for primary school.</p>
    <p>3. IDSS will provide the following services:</p>
    <ul>
      <li>implement the German curriculum in line with the curriculum for primary schools in Sarajevo Canton.</li>
      <li>monitor the child's development and regularly inform the parent/guardian.</li>
      <li>provide didactic material (textbooks, workbooks, etc.) as well as other educational material.</li>
      <li>implement a multilingual program (German, English, B/H/S language).</li>
      <li>provide adequate educational staff, trained in accordance with local laws and pedagogical standards.</li>
      <li>hold regular parent meetings.</li>
      <li>keep daily records of children's arrival at IDSS as well as children's attendance at classes.</li>
      <li>provide online classes as needed.</li>
      <li>insure the child with an insurance company.</li>
      <li>provide parents/guardians with access to the results achieved by the child.</li>
      <li>provide one hot meal every day, and if the child attends an extended stay, provide snacks.</li>
      <li>IDSS will provide breakfast for those students whose parents express the need, at a price of 50,00 KM monthly.</li>
    </ul>
  </div>

  <div class="article">
    <p class="article-title">Article 2.</p>
    <p class="article-subtitle">(NEW AND REGULAR ENROLLMENTS)</p>
    <p>The child will be considered enrolled and his/her place in the IDSS will be reserved afterwards:</p>
    <p>1. submitted complete enrollment form signed by the parent/guardian.</p>
    <p>2. payment of the registration fee in the amount of <span class="fill-field">${d.enrollment_fee_amount}</span> KM (in letters: <span class="fill-field">${d.enrollment_fee_text}</span> and 00/100 KM), if the child is enrolled for the first time in IDSS.</p>
    <p>3. made deposit payments in the amount of <span class="fill-field">${d.deposit_amount}</span> KM (in letters: <span class="fill-field">${d.deposit_text}</span> and 00/100 KM), if the tuition payment is made in installments.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 3.</p>
    <p class="article-subtitle">(TUITION FEES AND PAYMENT)</p>
    <p>The annual tuition for the school year ${d.academic_year} for this child is: <span class="fill-field">${d.tuition_annual_amount}</span> KM (in letters: <span class="fill-field">${d.tuition_annual_text}</span> and 00/100 KM), and according to the valid price list from Annex 1., which is an integral part of this Agreement.</p>
    <p>The parent/guardian can pay the tuition fee in two ways:</p>
    <p>1. once, in the full amount or</p>
    <p>2. in equal monthly installments, as defined in this Article of this Agreement.</p>
    ${installmentSection}
    <p>In the case of significant changes in the money market, as well as economic circumstances, IDSS reserves the right to change the price list from Annex 1 of this agreement, which will be concluded in a special Annex to the agreement.</p>
    <p>Payments of registration fees, deposits and tuition fees are made to the next bank account:</p>
    <p>P.U. Internationale Deutsche Schule Sarajevo</p>
    <p>SPARKASSE BANK d.d., Sarajevo</p>
    <p>ACCOUNT NUMBER: 1994990021809884</p>
    <p>IBAN BA39 1994990021809884 SWIFT (BIC) ABSBBA22</p>
    <p>The costs of bank fees, related to all payments defined in this Agreement, shall be borne in full by the parent/guardian.</p>
    <p>Payment is made to the school's account as explained in this Article, no later than the 5th of the current month.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 4.</p>
    <p class="article-subtitle">(WITHDRAWALS)</p>
    <p>1. The parent/guardian has the right to withdraw his/her child from the IDSS and to unilaterally terminate the Agreement before its expiration.</p>
    <p>2. The child withdraws from the IDSS is realized for the first semester or at the end of the school year, i.e., in the second semester.</p>
    <p>3. The parent/guardian is obliged to inform the IDSS about the intention to withdraw the child exclusively in writing, two months before the planned withdrawal.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 5.</p>
    <p class="article-subtitle">(WORKING HOURS)</p>
    <p>Classes at IDSS are held Monday through Friday from 8:00 a.m. to 2:40 p.m. The weekends are non-working days.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 6.</p>
    <p class="article-subtitle">(NON-WORKING DAYS)</p>
    <p>1. IDSS reserves the right to adjust its work schedule to holidays, local holidays, and summer and winter holidays.</p>
    <p>2. IDSS will be closed on the following dates: German Unification Day, Autumn Holiday, Statehood Day, Winter Holiday, Independence Day, Spring Holiday, Labor Day, Ramadan and Eid al-Adha and Summer Holiday.</p>
    <p>3. At the beginning of each school year, parents/guardians will be introduced to the school calendar for the current school year.</p>
    <p>4. IDSS reserves the right to change the date of non-working days of which parents/guardians will be notified in a timely manner.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 7.</p>
    <p class="article-subtitle">(AFTERNOON PROGRAM)</p>
    <p>1. Afternoon program is an optional service and includes a five-day program to support with homework, free and other planned activities after school, and to assess individual German Language Harmonization (DaF) classes, from 03:15 p.m. to 05:00 p.m., every working day.</p>
    ${extendedStaySection}
  </div>

  <div class="article">
    <p class="article-title">Article 8.</p>
    <p class="article-subtitle">(EXCURSIONS, LOCAL VISITS AND EVENTS)</p>
    <p>1. If the parent/guardian wants his/her child to take part in school trips, local visits or events, he/she should sign the appropriate consent.</p>
    <p>2. The parent/guardian bears the costs of excursions and local visits in full, unless the IDSS determines otherwise.</p>
    <p>3. The excursion is a legal obligation and, on that day, IDSS does not hold regular classes for children who do not attend the excursion.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 9.</p>
    <p class="article-subtitle">(AGREEMENT TERMINATION)</p>
    <p>1. This agreement is made in accordance with the Rules of the School, the Rules of Procedure, and other business regulations of the IDSS.</p>
    <p>2. In the event that the parent/guardian does not comply with the provisions of the IDSS Rules of Procedure, IDSS has the right to terminate this agreement before the end of the school year.</p>
    <p>3. In all the above cases, IDSS has the right to retain all funds paid as well as the right to seek proportionate compensation.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 10.</p>
    <p class="article-subtitle">(ARRIVAL FOR THE CHILD)</p>
    <p>1. The parent/guardian personally comes to pick up his/her child at the IDSS at 02:40 p.m., or at 05:00 p.m., if the child is a beneficiary of the afternoon program.</p>
    <p>2. Retention of students who do not attend the afternoon program at school is not allowed, unless there is an express approval of the school.</p>
    <p>3. In case of impediment, the parent/guardian has the obligation to inform IDSS in a timely manner and in writing, which another adult will come to pick up the child.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 11.</p>
    <p class="article-subtitle">(INSURANCE)</p>
    <p>IDSS students are insured with an insurance company, which offers a student collective insurance policy in the event of an accident.</p>
  </div>

  <div class="article">
    <p class="article-title">Article 12.</p>
    <p>In case of damage to business premises, inventory, or teaching aids, and for which it is determined that the child intentionally damaged despite the warning of the teaching staff, the parent is obliged to compensate the same damage without delay.</p>
  </div>

  <h3>V. TRANSITIONAL AND FINAL TERMS</h3>

  <div class="article">
    <p class="article-title">Article 13.</p>
    <p>Any disputes under this Agreement shall be resolved amicably otherwise, the dissatisfied party exercises its rights before the competent court in Sarajevo.</p>
  </div>
  <div class="article">
    <p class="article-title">Article 14.</p>
    <p>For all that is not explicitly regulated by the provisions of this agreement, the applicable regulations will apply.</p>
  </div>
  <div class="article">
    <p class="article-title">Article 15.</p>
    <p>The agreement parties agree that the essential elements of the agreement are confidential information.</p>
  </div>
  <div class="article">
    <p class="article-title">Article 16.</p>
    <p>The agreement enters into force on the day of signing and is valid until one of the agreement parties terminates it by mutual agreement, and no later than the end of the current school year.</p>
  </div>
  <div class="article">
    <p class="article-title">Article 17.</p>
    <p>Any changes to certain provisions of this agreement may be made by an annex to the agreement.</p>
  </div>
  <div class="article">
    <p class="article-title">Article 18.</p>
    <p>The agreement was concluded in two identical copies, of which IDSS retains 1 (one) and the parent/guardian 1 (one).</p>
  </div>

  <div class="signature-block">
    <p>P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo</p>
    <p>P.S.</p>
    <p><span class="signature-line"></span> (Davor Mulalić, Director)</p>
    <br/>
    <p><em>"With this signature, we confirm that we want to enroll our child in IDSS. We undertake to respect the organization of the work of this institution in the interest of the child, as well as the decisions made by the management and staff of IDSS."</em></p>
    <br/>
    <p><span class="fill-field">${d.parent1_full_name}</span> (name and surname of mother/guardian)</p>
    <p><span class="signature-line"></span> (signature of mother/guardian)</p>
    <br/>
    <p><span class="fill-field">${d.parent2_full_name}</span> (name and surname of father/guardian)</p>
    <p><span class="signature-line"></span> (signature of father/guardian)</p>
    <br/>
    <p><span class="fill-field">${d.signature_date}</span> (date)</p>
  </div>
</div>
</body></html>`;
}

function generateDE(d: ContractTemplateData): string {
  const extendedStaySection = d.uses_extended_stay ? `
    <p>2. Der Preis für die Nachmittagsbetreuung beträgt <span class="fill-field">${d.extended_stay_amount}</span> KM (in Worten: <span class="fill-field">${d.extended_stay_text}</span> und 00/100 KM) für das gesamte Schuljahr, d.h. von September des laufenden bis Juni des folgenden Jahres.</p>
    <p>3. Der Preis für die Nachmittagsbetreuung ist fix und wird in voller Höhe bezahlt, d.h. er wird nicht reduziert und nicht erstattet, unabhängig von der Abwesenheit des Kindes von der Schule.</p>
    <p>4. Die Eltern/Vormünder sind verpflichtet, die Zahlung für die Nachmittagsbetreuung für das kommende Schuljahr in voller Höhe spätestens bis zum 31.07. des laufenden Jahres auf das in Artikel 3 dieses Vertrags angegebene Bankkonto der IDSS zu leisten.</p>
  ` : '';

  const installmentSection = d.payment_type === 'installments' ? `
    <p>Wenn sich die Eltern/der Vormund für die Zahlung des Schulgeldes in monatlichen Raten entscheiden, erfolgt die Zahlung in <span class="fill-field">${d.installments_number}</span> (in Worten: <span class="fill-field">${d.installments_text}</span>) gleichen monatlichen Raten, wobei die erste monatliche Rate am <span class="fill-field">${d.first_payment_date}</span> fällig wird.</p>
  ` : '';

  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">${commonStyles()}</head><body>
<div class="contract-body">
  <h1>V E R T R A G</h1>
  <p class="subtitle">über die Grundschulbildung und -erziehung für die Einschreibung eines Schülers in die ${d.grade_number}. (in Worten: ${d.grade_text}) Klasse, geschlossen am ${d.contract_date} in Sarajevo.</p>
  
  <p class="bold">Vertragsparteien:</p>
  <div class="parties">
    <p>1. P.U. Internationale Deutsche Schule Sarajevo, ID-Nummer 4202220420007, Buka 13, 71 000 Sarajevo, vertreten durch den Direktor Davor Mulalić (im Folgenden: IDSS).</p>
    <p>2. <span class="fill-field">${d.parent1_full_name}</span> (Vor- und Nachname der Mutter/des Vormunds)</p>
    <p>3. <span class="fill-field">${d.parent2_full_name}</span> (Vor- und Nachname des Vaters/des Vormunds)</p>
    <p>4. <span class="fill-field">${d.address}</span> (Wohnadresse) als Leistungsempfänger (im Folgenden: Eltern/Vormund).</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 1</p>
    <p class="article-subtitle">(VERTRAGSGEGENSTAND)</p>
    <p>1. Gegenstand dieses Vertrags ist die Festlegung der gemeinsamen Rechte und Pflichten der IDSS und der Eltern/des Vormunds, deren Kind die IDSS Grundschulbildung und -erziehung anbietet.</p>
    <p>2. Mit der Unterzeichnung dieses Vertrags schreiben die Eltern/der Vormund ihr Kind</p>
    <p>(Vor- und Nachname des Kindes) <span class="fill-field">${d.child_full_name}</span></p>
    <p>(Geburtsdatum) <span class="fill-field">${d.child_dob}</span></p>
    <p>in die Grundschule IDSS zum Zweck der Grundschulbildung und -erziehung ein. Die IDSS verpflichtet sich, die festgelegten Leistungen gemäß dem Grundschulbildungs- und Erziehungsgesetz des Kantons Sarajevo, dem Institutionsgesetz, den pädagogischen Standards für die Grundschulbildung sowie gemäß den Standards und allgemeinen Normen für Arbeitsräume, Ausstattung und Lehrmittel nach Fächern für die Grundschule zu erbringen.</p>
    <p>3. Die IDSS wird folgende Leistungen erbringen:</p>
    <ul>
      <li>Durchführung des deutschen Lehrplans in Übereinstimmung mit dem Lehrplan für Grundschulen des Kantons Sarajevo.</li>
      <li>Beobachtung der Entwicklung des Kindes und regelmäßige Information der Eltern/des Vormunds.</li>
      <li>Bereitstellung von didaktischem Material (Lehrbücher, Arbeitshefte usw.) sowie anderen Bildungsmaterialien.</li>
      <li>Durchführung eines mehrsprachigen Programms (Deutsch, Englisch, B/K/S).</li>
      <li>Bereitstellung von qualifiziertem pädagogischem Personal, ausgebildet gemäß lokalen Gesetzen und pädagogischen Standards.</li>
      <li>Regelmäßige Durchführung von Elternabenden.</li>
      <li>Tägliche Dokumentation der Anwesenheit der Kinder in der Schule und im Unterricht.</li>
      <li>Bereitstellung von Online-Unterricht bei Bedarf.</li>
      <li>Versicherung des Kindes bei einer Versicherungsgesellschaft.</li>
      <li>Ermöglichung des Zugangs zu den Leistungsergebnissen des Kindes für die Eltern/den Vormund.</li>
      <li>Bereitstellung einer warmen Mahlzeit täglich, und bei Besuch der Nachmittagsbetreuung auch eines Snacks.</li>
      <li>Die IDSS stellt auch Frühstück für Schüler bereit, deren Eltern dies wünschen, zum Preis von 50,00 KM monatlich.</li>
    </ul>
  </div>

  <div class="article">
    <p class="article-title">Artikel 2</p>
    <p class="article-subtitle">(NEUE UND REGULÄRE EINSCHREIBUNGEN)</p>
    <p>Das Kind gilt als eingeschrieben und sein Platz in der IDSS als reserviert nach:</p>
    <p>1. Einreichung des vollständig ausgefüllten und von den Eltern/dem Vormund unterzeichneten Anmeldeformulars.</p>
    <p>2. Zahlung der Einschreibegebühr in Höhe von <span class="fill-field">${d.enrollment_fee_amount}</span> KM (in Worten: <span class="fill-field">${d.enrollment_fee_text}</span> und 00/100 KM), wenn das Kind erstmals in die IDSS eingeschrieben wird.</p>
    <p>3. Zahlung einer Kaution in Höhe von <span class="fill-field">${d.deposit_amount}</span> KM (in Worten: <span class="fill-field">${d.deposit_text}</span> und 00/100 KM), wenn das Schulgeld in Raten gezahlt wird.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 3</p>
    <p class="article-subtitle">(SCHULGELD UND ZAHLUNG)</p>
    <p>Das jährliche Schulgeld für das Schuljahr ${d.academic_year} beträgt für dieses Kind: <span class="fill-field">${d.tuition_annual_amount}</span> KM (in Worten: <span class="fill-field">${d.tuition_annual_text}</span> und 00/100 KM), gemäß der gültigen Preisliste aus Anhang 1, der Bestandteil dieses Vertrags ist.</p>
    <p>Die Eltern/der Vormund können das Schulgeld auf zwei Arten zahlen:</p>
    <p>1. einmalig, als Gesamtbetrag oder</p>
    <p>2. in Raten, in gleichen monatlichen Beträgen, wie in diesem Artikel definiert.</p>
    ${installmentSection}
    <p>Bei wesentlichen Änderungen am Geldmarkt sowie der wirtschaftlichen Lage behält sich die IDSS das Recht vor, die Preisliste aus Anhang 1 dieses Vertrags zu ändern, worüber ein gesonderter Vertragsanhang geschlossen wird.</p>
    <p>Die Zahlung der Einschreibegebühr, Kaution sowie des Schulgeldes erfolgt auf folgendes Bankkonto:</p>
    <p>P.U. Internationale Deutsche Schule Sarajevo</p>
    <p>SPARKASSE BANK d.d., Sarajevo</p>
    <p>KONTONUMMER: 1994990021809884</p>
    <p>IBAN BA39 1994990021809884 SWIFT (BIC) ABSBBA22</p>
    <p>Die Bankgebühren im Zusammenhang mit allen in diesem Vertrag definierten Zahlungen übernehmen die Eltern/der Vormund vollständig.</p>
    <p>Die Zahlung erfolgt auf das Schulkonto wie in diesem Artikel dieser Ordnung erklärt, und zwar spätestens bis zum 5. des laufenden Monats.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 4</p>
    <p class="article-subtitle">(ABMELDUNGEN)</p>
    <p>1. Die Eltern/der Vormund haben das Recht, ihr Kind von der IDSS abzumelden und den Vertrag vor seinem Ablauf einseitig zu kündigen.</p>
    <p>2. Die Abmeldung des Kindes von der IDSS erfolgt zum I. Halbjahr oder am Ende des Schuljahres, d.h. II. Halbjahr.</p>
    <p>3. Die Eltern/der Vormund sind verpflichtet, die IDSS über die beabsichtigte Abmeldung des Kindes ausschließlich schriftlich und zwei Monate vor der geplanten Abmeldung zu informieren.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 5</p>
    <p class="article-subtitle">(ARBEITSZEIT)</p>
    <p>Der Unterricht in der IDSS findet von Montag bis Freitag von 8:00 bis 14:40 Uhr statt. Die Wochenenden sind unterrichtsfrei.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 6</p>
    <p class="article-subtitle">(SCHULFREIE TAGE)</p>
    <p>1. Die IDSS behält sich das Recht vor, ihren Arbeitsplan an Ferien, lokale Feiertage sowie Sommer- und Winterferien anzupassen.</p>
    <p>2. Die Schule bleibt an folgenden Terminen geschlossen: Tag der Deutschen Einheit, Herbstferien, Tag der Staatlichkeit, Winterferien, Unabhängigkeitstag, Frühlingsferien, Tag der Arbeit, Ramadan- und Opferfest und Sommerferien.</p>
    <p>3. Zu Beginn jedes Schuljahres werden die Eltern/Vormünder über den Schulkalender für das laufende Schuljahr informiert.</p>
    <p>4. Die IDSS behält sich das Recht vor, die Termine der schulfreien Tage zu ändern, worüber die Eltern/Vormünder rechtzeitig informiert werden.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 7</p>
    <p class="article-subtitle">(NACHMITTAGSBETREUUNG)</p>
    <p>1. Die Nachmittagsbetreuung ist eine optionale Leistung und umfasst ein Fünf-Tage-Programm mit Hausaufgabenhilfe, freien und anderen geplanten Aktivitäten nach dem Unterricht sowie nach Einschätzung individuelle Harmonisierungsstunden für Deutsch als Fremdsprache (DaF), von 15:15 bis 17:00 Uhr an jedem Werktag.</p>
    ${extendedStaySection}
  </div>

  <div class="article">
    <p class="article-title">Artikel 8</p>
    <p class="article-subtitle">(AUSFLÜGE, LOKALE BESUCHE UND VERANSTALTUNGEN)</p>
    <p>1. Wenn die Eltern/Vormünder wünschen, dass ihr Kind an Schulausflügen, lokalen Besuchen und Veranstaltungen teilnimmt, müssen sie eine entsprechende Einverständniserklärung unterschreiben.</p>
    <p>2. Die Eltern/Vormünder tragen die Kosten für Ausflüge und lokale Besuche in voller Höhe, sofern die IDSS nichts anderes bestimmt.</p>
    <p>3. Der Ausflug ist eine gesetzliche Verpflichtung, und an diesem Tag findet kein regulärer Unterricht für Kinder statt, die nicht am Ausflug teilnehmen.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 9</p>
    <p class="article-subtitle">(VERTRAGSKÜNDIGUNG)</p>
    <p>1. Dieser Vertrag wurde in Übereinstimmung mit der Schulordnung, der Arbeitsordnung und anderen geschäftsnormativen Akten der IDSS erstellt.</p>
    <p>2. Falls sich die Eltern/Vormünder nicht an die Bestimmungen der IDSS-Hausordnung halten, hat die IDSS das Recht, diesen Vertrag vor Ende des Schuljahres zu kündigen.</p>
    <p>3. In allen oben genannten Fällen hat die IDSS das Recht, alle eingezahlten Beträge einzubehalten sowie das Recht, eine verhältnismäßige Entschädigung zu fordern.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 10</p>
    <p class="article-subtitle">(ABHOLEN DES KINDES)</p>
    <p>1. Die Eltern/Vormünder holen ihr Kind persönlich um 14:40 Uhr bzw. um 17:00 Uhr von der IDSS ab, wenn das Kind die Nachmittagsbetreuung nutzt.</p>
    <p>2. Der Aufenthalt von Schülern, die nicht am Nachmittagsbetreuungsprogramm teilnehmen, ist in der Schule nicht gestattet, es sei denn, es liegt eine ausdrückliche Genehmigung der Schule vor.</p>
    <p>3. Im Falle einer Verhinderung sind die Eltern/Vormünder verpflichtet, die IDSS rechtzeitig und schriftlich darüber zu informieren, welche andere volljährige Person das Kind abholen wird.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 11</p>
    <p class="article-subtitle">(VERSICHERUNG)</p>
    <p>Die Schüler der IDSS sind bei einer Versicherungsgesellschaft versichert, die eine Kollektivunfallversicherung für Schüler anbietet.</p>
  </div>

  <div class="article">
    <p class="article-title">Artikel 12</p>
    <p>Im Falle einer Beschädigung von Geschäftsräumen, Inventar oder Lehrmitteln, bei der festgestellt wird, dass das Kind diese trotz Warnung des Lehrpersonals vorsätzlich beschädigt hat, sind die Eltern verpflichtet, den Schaden unverzüglich zu beheben.</p>
  </div>

  <h3>V. ÜBERGANGS- UND SCHLUSSBESTIMMUNGEN</h3>

  <div class="article">
    <p class="article-title">Artikel 13</p>
    <p>Eventuelle Streitigkeiten aus diesem Vertrag werden durch Vereinbarung gelöst, andernfalls macht die unzufriedene Partei ihre Rechte beim zuständigen Gericht in Sarajevo geltend.</p>
  </div>
  <div class="article">
    <p class="article-title">Artikel 14</p>
    <p>Für alles, was nicht ausdrücklich durch die Bestimmungen dieses Vertrags geregelt ist, gelten die geltenden Vorschriften.</p>
  </div>
  <div class="article">
    <p class="article-title">Artikel 15</p>
    <p>Die Vertragsparteien stimmen zu, dass die wesentlichen Elemente des vorliegenden Vertrags vertrauliche Informationen darstellen.</p>
  </div>
  <div class="article">
    <p class="article-title">Artikel 16</p>
    <p>Der Vertrag tritt am Tag der Unterzeichnung in Kraft und gilt, bis ihn eine der Vertragsparteien einvernehmlich kündigt, längstens jedoch bis zum Ende des laufenden Schuljahres.</p>
  </div>
  <div class="article">
    <p class="article-title">Artikel 17</p>
    <p>Eventuelle Änderungen einzelner Bestimmungen dieses Vertrags können durch einen Vertragsanhang vorgenommen werden.</p>
  </div>
  <div class="article">
    <p class="article-title">Artikel 18</p>
    <p>Der Vertrag wird in zwei identischen Exemplaren geschlossen, von denen die IDSS 1 (ein) und die Eltern/Vormünder 1 (ein) Exemplar behalten.</p>
  </div>

  <div class="signature-block">
    <p>P.U. Internationale Deutsche Schule Sarajevo - Međunarodna Njemačka Škola Sarajevo</p>
    <p>L.S.</p>
    <p><span class="signature-line"></span> (Davor Mulalić, Direktor)</p>
    <br/>
    <p><em>"Mit dieser Unterschrift bestätigen wir, dass wir unser Kind in die Internationale Deutsche Schule Sarajevo (IDSS) einschreiben möchten. Wir verpflichten uns, im Interesse des Kindes die Arbeitsorganisation dieser Einrichtung sowie die Entscheidungen der Schulleitung und des Schulpersonals zu respektieren."</em></p>
    <br/>
    <p><span class="fill-field">${d.parent1_full_name}</span> (Vor- und Nachname der Mutter/des Vormunds)</p>
    <p><span class="signature-line"></span> (Unterschrift der Mutter/des Vormunds)</p>
    <br/>
    <p><span class="fill-field">${d.parent2_full_name}</span> (Vor- und Nachname des Vaters/des Vormunds)</p>
    <p><span class="signature-line"></span> (Unterschrift des Vaters/des Vormunds)</p>
    <br/>
    <p><span class="fill-field">${d.signature_date}</span> (Datum)</p>
  </div>
</div>
</body></html>`;
}
