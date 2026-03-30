# ACA TASK — Contract Template Alignment with Original PDF
## Fix contractTemplates.ts to match original IDSS contract exactly

**Issued by:** Senior Architect  
**Date:** 2026-03-28  
**File:** `src/lib/contractTemplates.ts`  
**Reference:** Original IDSS contract PDF (U_G_O_V_O_R.pdf)

---

## CRITICAL: Član 4 (ISPISI) — Fix numbering

In the `generateBA` function, find the Član 4 section.

**Current (WRONG) — mixed numbering:**
```html
<p>4. Ukoliko roditelj/staratelj ispiše svoje dijete za I. polugodište...
<p>5. Upisnine su bespovratna sredstva...
<p>6. Dijete zadržava pravo...
<p>7. Ako je roditelj/staratelj izvršio uplatu...
<p>e. Ako se školarina plaća obročno...
<p>4. IDSS zadržava uplaćene...
```

**Replace with (CORRECT) — matching original PDF exactly:**
```html
<p>3. Roditelj/staratelj je obavezan obavijesti IDSS o namjeri ispisa djeteta isključivo u pisanoj formi i to dva mjeseca prije planiranog ispisa.</p>
<p>a. Ukoliko roditelj/staratelj ispiše svoje dijete za I. polugodište, a izvršio je uplatu cjelokupnog iznosa školarine do 31.12. tekuće godine, tada IDSS vrši povrat u iznosu od tri mjesečne rate, a najkasnije 4 mjeseca nakon pismenog obavještenja od strane roditelja/staratelja.</p>
<p>b. Upisnine su bespovratna sredstva i IDSS zadržava upisninu bez obzira na prijevremeni istek ili raskid ugovora.</p>
<p>c. Dijete zadržava pravo na pohađanje nastave uprkos ispisa za prvo polugodište, sve do završetka prvog polugodišta tj. do 31.01. tekuće godine.</p>
<p>d. Ako je roditelj/staratelj izvršio uplatu cjelokupne školarine za narednu školsku godinu do 10.05. tekuće godine, a raskine ugovor prije početka nove školske godine, IDSS vrši povrat uplaćene tri mjesečne rate najkasnije do 30.10. tekuće godine.</p>
<p>e. Ako se školarina plaća obročno, a roditelj/staratelj ispiše dijete poštivajući pismenu najavu u skladu sa Članom.3, ovog Ugovora, IDSS zadržava sve uplaćene rate kao i iznos depozita umanjen za realne troškove koji mogu proisteći ispisom djeteta. Roditelj/staratelj je dužan isplatiti školarinu do 31.12. ako se dijete ispisuje u prvom polugodištu ili ako se dijete ispisuje u drugom polugodištu do 30.06.</p>
<p>4. IDSS zadržava uplaćene mjesečne školarine za tekuću godinu, te sve rate za tekuću i prethodne školske godine, kao i ukupan iznos depozita ukoliko roditelj/staratelj ne obavijesti IDSS u pisanoj formi o namjeri prekida školovanja i to do 31.12. tekuće godine za narednu školsku godinu.</p>
```

---

## FIX: Add page numbering header

In `generateBA`, after the opening `<div class="contract-body">` tag, add:
```html
<p class="page-num" style="text-align:right; font-size:9pt; color:#666; margin-bottom: 20pt;">Stranica 1 od 6</p>
```

---

## FIX: Aneks 1 — Add pricing table

At the very end of `generateBA`, before the closing `</div></body></html>`, add the Aneks 1 pricing table:

```html
<div class="article" style="page-break-before: always;">
  <p class="page-num" style="text-align:right; font-size:9pt; color:#666;">Stranica 6 od 6</p>
  <p class="article-title">Aneks 1.</p>
  <p class="article-subtitle">Cjenovnik za akademsku ${d.academic_year} godinu</p>
  <p>Ovaj Aneks dio je Ugovora o osnovnoškolskom odgoju i obrazovanju i važeći je na dan potpisivanja ovog Ugovora.</p>
  <table>
    <thead>
      <tr>
        <th>Usluge</th>
        <th>Domaća lica (KM)</th>
        <th>Strana lica (KM)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td colspan="3"><strong>Osnovna škola</strong></td></tr>
      <tr><td>Upisnina</td><td>1.000</td><td>1.500</td></tr>
      <tr><td>Depozit (samo za obročno plaćanje)</td><td>1.500</td><td>1.500</td></tr>
      <tr><td>Produženi boravak (od I do IX razreda)</td><td>2.000</td><td>2.000</td></tr>
      <tr><td>Školarina (od I do IV razreda)</td><td>9.700</td><td>11.970</td></tr>
      <tr><td>- za upisano drugo dijete (10%)</td><td>8.730</td><td>10.773</td></tr>
      <tr><td>- za upisano treće dijete (15%)</td><td>8.245</td><td>10.175</td></tr>
      <tr><td>Školarina (od V do IX razreda)</td><td>11.030</td><td>13.700</td></tr>
      <tr><td>- za upisano drugo dijete (10%)</td><td>9.927</td><td>12.330</td></tr>
      <tr><td>- za upisano treće dijete (15%)</td><td>9.376</td><td>11.645</td></tr>
    </tbody>
  </table>
</div>
```

---

## After fixes

Run:
```cmd
npm run build
```

Then commit:
```cmd
git add src/lib/contractTemplates.ts
git commit -m "fix(contracts): align BA template with original IDSS PDF contract

- Fixed Clan 4 numbering (a,b,c,d,e instead of 4,5,6,7)
- Added Aneks 1 pricing table
- Added page numbering"
git push origin HEAD:main --force
```
