export type Language = 'EN' | 'BS' | 'DE';

interface TranslationStrings {
  // Common
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  search: string;
  filter: string;
  export: string;
  noData: string;
  actions: string;
  confirmDelete: string;
  allStatuses: string;
  
  // Auth
  login: string;
  signup: string;
  logout: string;
  email: string;
  password: string;
  fullName: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  welcomeBack: string;
  createAccount: string;
  continueWithGoogle: string;
  orContinueWith: string;
  gdprNotice: string;
  
  // Navigation
  dashboard: string;
  leads: string;
  analytics: string;
  campaigns: string;
  settings: string;
  visitors: string;
  contracts: string;
  
  // Dashboard
  totalLeads: string;
  conversionRate: string;
  activeCampaigns: string;
  revenue: string;
  performanceTrends: string;
  recentActivity: string;
  leadSources: string;
  quickActions: string;
  
  // Leads
  addLead: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadStatus: string;
  leadSource: string;
  leadNotes: string;
  newLead: string;
  contacted: string;
  qualified: string;
  converted: string;
  rejected: string;
  
  // Campaigns
  addCampaign: string;
  campaignName: string;
  campaignDescription: string;
  campaignStatus: string;
  campaignBudget: string;
  campaignChannels: string;
  startDate: string;
  endDate: string;
  active: string;
  paused: string;
  completed: string;
  draft: string;
  
  // Settings
  profileSettings: string;
  appearance: string;
  language: string;
  darkMode: string;
  lightMode: string;
  notifications: string;
  
  // Messages
  saveSuccess: string;
  saveError: string;
  requiredField: string;
  invalidValue: string;
  deleteSuccess: string;
  deleteError: string;
  loginError: string;
  signupSuccess: string;

  // Visitors
  visitorsDescription: string;
  addVisitor: string;
  editVisitor: string;
  totalVisitors: string;
  visitedCount: string;
  enrolledCount: string;
  conversionRateVisit: string;
  visitToEnrollment: string;
  
  // Visitor form tabs
  child: string;
  parents: string;
  visit: string;
  financial: string;
  
  // Child info
  childInfo: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  citizenship: string;
  address: string;
  addressPlaceholder: string;
  childName: string;
  
  // Parent info
  parentInfo: string;
  mother: string;
  father: string;
  guardian: string;
  phone: string;
  profession: string;
  
  // Visit details
  visitDetails: string;
  visitType: string;
  inPerson: string;
  online: string;
  visitDate: string;
  visitorStatus: string;
  scheduled: string;
  visited: string;
  enrolledStatus: string;
  pending: string;
  referralSource: string;
  referralSourcePlaceholder: string;
  visitTime: string;
  emailNotSent: string;
  allEmailStatuses: string;
  visitNotes: string;
  
  // Enrollment assessment
  enrollmentAssessment: string;
  enrollmentDecision: string;
  selectDecision: string;
  approved: string;
  conditional: string;
  decisionRejected: string;
  pendingReview: string;
  decisionNotes: string;
  decisionNotesPlaceholder: string;
  
  // Financial
  financialDetails: string;
  targetGrade: string;
  selectGrade: string;
  grade: string;
  schoolYear: string;
  enrollmentSemester: string;
  semester1Full: string;
  semester2Only: string;
  residentType: string;
  domestic: string;
  foreign: string;
  paymentType: string;
  fullPayment: string;
  installments: string;
  monthsToPay: string;
  
  // Discounts
  discountsWaivers: string;
  siblingDiscount: string;
  noDiscount: string;
  secondChild: string;
  thirdChild: string;
  scholarshipPercent: string;
  scholarshipType: string;
  scholarshipTypePlaceholder: string;
  registrationFeeWaived: string;
  usesExtendedStay: string;
  
  // Fee summary
  feeSummary: string;
  registrationFee: string;
  deposit: string;
  baseTuition: string;
  siblingDiscountAmount: string;
  scholarshipDiscountAmount: string;
  extendedStay: string;
  proRated: string;
  months: string;
  totalAmountDue: string;
  
  // Pricing Management
  pricingManagement: string;
  manageFees: string;
  saveChanges: string;
  generalSettings: string;
  activePricing: string;
  activePricingDesc: string;
  registrationDeposit: string;
  registrationDepositDesc: string;
  registrationFeeDomestic: string;
  registrationFeeForeign: string;
  depositAmount: string;
  tuitionFees: string;
  tuitionFeesDesc: string;
  grades1to4: string;
  grades5to9: string;
  domesticTuition: string;
  foreignTuition: string;
  additionalFeesDiscounts: string;
  additionalFeesDesc: string;
  extendedStayFee: string;
  siblingDiscount2nd: string;
  siblingDiscount3rd: string;
  accessDenied: string;
  adminOnlyAccess: string;
  
  // Dashboard widgets
  upcomingVisits: string;
  viewAll: string;
  noUpcomingVisits: string;
  scheduleVisit: string;
  today: string;
  tomorrow: string;
  conversionTrends: string;
  exportCSV: string;
  exportExcel: string;

  // Contracts
  generateContract: string;
  contractsList: string;
  contractsDescription: string;
  contractNumber: string;
  contractDate: string;
  contractStatus: string;
  contractLanguage: string;
  contractDraft: string;
  contractGenerated: string;
  contractSent: string;
  contractSigned: string;
  downloadPDF: string;
  downloadDOCX: string;
  sendContract: string;
  markSigned: string;
  verifyInformation: string;
  confirmFinancials: string;
  setDates: string;
  previewGenerate: string;
  contractGenerateSuccess: string;
  contractSendSuccess: string;
  contractSignedSuccess: string;
  noContracts: string;
  childMustBeEnrolled: string;
  contractAlreadyExists: string;
  parentInfoMissing: string;
  firstPaymentDate: string;
  signatureDate: string;
  enrollmentAgreement: string;
  annualTuition: string;
  monthlyInstallment: string;
  totalContractsLabel: string;
  signedContractsLabel: string;
  pendingContractsLabel: string;

  // Pagination
  page: string;
  of: string;
  rowsPerPage: string;
  showing: string;
  entries: string;
  previous: string;
  next: string;

  // Contract preview
  fullContractPreview: string;
  printContract: string;
}

const translations: Record<Language, TranslationStrings> = {
  EN: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    noData: 'No data available',
    actions: 'Actions',
    confirmDelete: 'Are you sure you want to delete this?',
    allStatuses: 'All Statuses',
    
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    welcomeBack: 'Welcome back',
    createAccount: 'Create your account',
    continueWithGoogle: 'Continue with Google',
    orContinueWith: 'or continue with email',
    gdprNotice: 'By signing in, you agree to our Privacy Policy and Terms of Service. Your data is protected in accordance with GDPR.',
    
    dashboard: 'Dashboard',
    leads: 'Leads',
    analytics: 'Analytics',
    campaigns: 'Campaigns',
    settings: 'Settings',
    visitors: 'Visitors',
    contracts: 'Contracts',
    
    totalLeads: 'Total Leads',
    conversionRate: 'Conversion Rate',
    activeCampaigns: 'Active Campaigns',
    revenue: 'Revenue',
    performanceTrends: 'Performance Trends',
    recentActivity: 'Recent Activity',
    leadSources: 'Lead Sources',
    quickActions: 'Quick Actions',
    
    addLead: 'Add Lead',
    leadName: 'Name',
    leadEmail: 'Email',
    leadPhone: 'Phone',
    leadStatus: 'Status',
    leadSource: 'Source',
    leadNotes: 'Notes',
    newLead: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    converted: 'Converted',
    rejected: 'Rejected',
    
    addCampaign: 'Add Campaign',
    campaignName: 'Campaign Name',
    campaignDescription: 'Description',
    campaignStatus: 'Status',
    campaignBudget: 'Budget',
    campaignChannels: 'Channels',
    startDate: 'Start Date',
    endDate: 'End Date',
    active: 'Active',
    paused: 'Paused',
    completed: 'Completed',
    draft: 'Draft',
    
    profileSettings: 'Profile Settings',
    appearance: 'Appearance',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    notifications: 'Notifications',
    
    saveSuccess: 'Saved successfully',
    saveError: 'Failed to save',
    requiredField: 'This field is required',
    invalidValue: 'Invalid value',
    deleteSuccess: 'Deleted successfully',
    deleteError: 'Failed to delete',
    loginError: 'Login failed. Please check your credentials.',
    signupSuccess: 'Account created successfully!',

    visitorsDescription: 'Manage school visitors and enrollment applications',
    addVisitor: 'Add Visitor',
    editVisitor: 'Edit Visitor',
    totalVisitors: 'Total Visitors',
    visitedCount: 'Visits Completed',
    enrolledCount: 'Enrolled',
    conversionRateVisit: 'Conversion Rate',
    visitToEnrollment: 'Visit to enrollment',
    
    child: 'Child',
    parents: 'Parents',
    visit: 'Visit',
    financial: 'Financial',
    
    childInfo: 'Child Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    citizenship: 'Citizenship',
    address: 'Address',
    addressPlaceholder: 'City, Street and Number, ZIP',
    childName: 'Child Name',
    
    parentInfo: 'Parent/Guardian Information',
    mother: 'Mother',
    father: 'Father',
    guardian: 'Guardian (if applicable)',
    phone: 'Phone',
    profession: 'Profession',
    
    visitDetails: 'Visit Details',
    visitType: 'Visit Type',
    inPerson: 'In Person',
    online: 'Online',
    visitDate: 'Visit Date',
    visitorStatus: 'Status',
    scheduled: 'Scheduled',
    visited: 'Visited',
    enrolledStatus: 'Enrolled',
    pending: 'Pending',
    referralSource: 'How did you find us?',
    referralSourcePlaceholder: 'Website, Friend, Social Media...',
    visitTime: 'Visit Time',
    emailNotSent: 'Email Not Sent',
    allEmailStatuses: 'All Email Statuses',
    visitNotes: 'Visit Notes',
    
    enrollmentAssessment: 'Enrollment Assessment',
    enrollmentDecision: 'Decision',
    selectDecision: 'Select decision',
    approved: 'Approved',
    conditional: 'Conditional',
    decisionRejected: 'Rejected',
    pendingReview: 'Pending Review',
    decisionNotes: 'Decision Notes',
    decisionNotesPlaceholder: 'Notes about the enrollment decision...',
    
    financialDetails: 'Financial Details',
    targetGrade: 'Target Grade',
    selectGrade: 'Select grade',
    grade: 'Grade',
    schoolYear: 'School Year',
    enrollmentSemester: 'Enrollment Period',
    semester1Full: 'Full Year (Semester 1)',
    semester2Only: 'Second Semester Only',
    residentType: 'Resident Type',
    domestic: 'Domestic',
    foreign: 'Foreign',
    paymentType: 'Payment Type',
    fullPayment: 'Full Payment',
    installments: 'Installments',
    monthsToPay: 'Months to Pay',
    
    discountsWaivers: 'Discounts & Waivers',
    siblingDiscount: 'Sibling Discount',
    noDiscount: 'No Discount',
    secondChild: '2nd child',
    thirdChild: '3rd child',
    scholarshipPercent: 'Scholarship %',
    scholarshipType: 'Scholarship Type',
    scholarshipTypePlaceholder: 'e.g., School Board Decision, Merit...',
    registrationFeeWaived: 'Registration Fee Waived',
    usesExtendedStay: 'Uses Extended Stay Program',
    
    feeSummary: 'Fee Summary',
    registrationFee: 'Registration Fee',
    deposit: 'Deposit',
    baseTuition: 'Base Tuition',
    siblingDiscountAmount: 'Sibling Discount',
    scholarshipDiscountAmount: 'Scholarship Discount',
    extendedStay: 'Extended Stay',
    proRated: 'Pro-rated',
    months: 'months',
    totalAmountDue: 'Total Amount Due',
    
    pricingManagement: 'Pricing Management',
    manageFees: 'Manage school fees and discounts',
    saveChanges: 'Save Changes',
    generalSettings: 'General Settings',
    activePricing: 'Active Pricing',
    activePricingDesc: 'Set as the active pricing for new enrollments',
    registrationDeposit: 'Registration & Deposit',
    registrationDepositDesc: 'One-time fees charged at enrollment',
    registrationFeeDomestic: 'Registration Fee (Domestic)',
    registrationFeeForeign: 'Registration Fee (Foreign)',
    depositAmount: 'Deposit Amount',
    tuitionFees: 'Tuition Fees',
    tuitionFeesDesc: 'Annual tuition by grade level and residency',
    grades1to4: 'Grades 1-4',
    grades5to9: 'Grades 5-9',
    domesticTuition: 'Domestic Tuition',
    foreignTuition: 'Foreign Tuition',
    additionalFeesDiscounts: 'Additional Fees & Discounts',
    additionalFeesDesc: 'Optional fees and discount percentages',
    extendedStayFee: 'Extended Stay Fee',
    siblingDiscount2nd: 'Sibling Discount (2nd child)',
    siblingDiscount3rd: 'Sibling Discount (3rd child)',
    accessDenied: 'Access Denied',
    adminOnlyAccess: 'This page is only accessible to administrators.',
    
    upcomingVisits: 'Upcoming Visits',
    viewAll: 'View All',
    noUpcomingVisits: 'No scheduled visits in the next 7 days',
    scheduleVisit: 'Schedule a Visit',
    today: 'Today',
    tomorrow: 'Tomorrow',
    conversionTrends: 'Visitor Conversion Trends',
    exportCSV: 'Export CSV',
    exportExcel: 'Export Excel',

    // Contracts
    generateContract: 'Generate Contract',
    contractsList: 'Contracts',
    contractsDescription: 'Manage enrollment contracts',
    contractNumber: 'Contract Number',
    contractDate: 'Contract Date',
    contractStatus: 'Status',
    contractLanguage: 'Contract Language',
    contractDraft: 'Draft',
    contractGenerated: 'Generated',
    contractSent: 'Sent',
    contractSigned: 'Signed',
    downloadPDF: 'Download PDF',
    downloadDOCX: 'Download DOCX',
    sendContract: 'Send Contract',
    markSigned: 'Mark as Signed',
    verifyInformation: 'Verify Information',
    confirmFinancials: 'Confirm Financials',
    setDates: 'Set Dates',
    previewGenerate: 'Preview & Generate',
    contractGenerateSuccess: 'Contract generated successfully',
    contractSendSuccess: 'Contract sent successfully',
    contractSignedSuccess: 'Contract marked as signed',
    noContracts: 'No contracts yet',
    childMustBeEnrolled: 'Child must be enrolled before generating a contract',
    contractAlreadyExists: 'Contract already exists for this academic year',
    parentInfoMissing: 'Parent information is missing',
    firstPaymentDate: 'First Payment Date',
    signatureDate: 'Signature Date',
    enrollmentAgreement: 'Enrollment Agreement',
    annualTuition: 'Annual Tuition',
    monthlyInstallment: 'Monthly Installment',
    totalContractsLabel: 'Total Contracts',
    signedContractsLabel: 'Signed',
    pendingContractsLabel: 'Pending',
    page: 'Page',
    of: 'of',
    rowsPerPage: 'Rows per page',
    showing: 'Showing',
    entries: 'entries',
    previous: 'Previous',
    next: 'Next',
    fullContractPreview: 'Full Contract Preview',
    printContract: 'Print Contract',
  },

  BS: {
    loading: 'Učitavanje...',
    save: 'Sačuvaj',
    cancel: 'Otkaži',
    delete: 'Obriši',
    edit: 'Uredi',
    add: 'Dodaj',
    search: 'Pretraži',
    filter: 'Filter',
    export: 'Izvezi',
    noData: 'Nema dostupnih podataka',
    actions: 'Akcije',
    confirmDelete: 'Jeste li sigurni da želite obrisati?',
    allStatuses: 'Svi statusi',
    
    login: 'Prijava',
    signup: 'Registracija',
    logout: 'Odjava',
    email: 'Email',
    password: 'Lozinka',
    fullName: 'Ime i prezime',
    forgotPassword: 'Zaboravljena lozinka?',
    dontHaveAccount: 'Nemate račun?',
    alreadyHaveAccount: 'Već imate račun?',
    welcomeBack: 'Dobrodošli',
    createAccount: 'Kreirajte račun',
    continueWithGoogle: 'Nastavite s Google računom',
    orContinueWith: 'ili nastavite s emailom',
    gdprNotice: 'Prijavom prihvatate našu Politiku privatnosti i Uvjete korištenja. Vaši podaci su zaštićeni u skladu s GDPR-om.',
    
    dashboard: 'Kontrolna tabla',
    leads: 'Kandidati',
    analytics: 'Analitika',
    campaigns: 'Kampanje',
    settings: 'Postavke',
    visitors: 'Posjetioci',
    contracts: 'Ugovori',
    
    totalLeads: 'Ukupno kandidata',
    conversionRate: 'Stopa konverzije',
    activeCampaigns: 'Aktivne kampanje',
    revenue: 'Prihod',
    performanceTrends: 'Trendovi performansi',
    recentActivity: 'Nedavne aktivnosti',
    leadSources: 'Izvori kandidata',
    quickActions: 'Brze akcije',
    
    addLead: 'Dodaj kandidata',
    leadName: 'Ime',
    leadEmail: 'Email',
    leadPhone: 'Telefon',
    leadStatus: 'Status',
    leadSource: 'Izvor',
    leadNotes: 'Bilješke',
    newLead: 'Novi',
    contacted: 'Kontaktiran',
    qualified: 'Kvalifikovan',
    converted: 'Konvertovan',
    rejected: 'Odbijen',
    
    addCampaign: 'Dodaj kampanju',
    campaignName: 'Naziv kampanje',
    campaignDescription: 'Opis',
    campaignStatus: 'Status',
    campaignBudget: 'Budžet',
    campaignChannels: 'Kanali',
    startDate: 'Datum početka',
    endDate: 'Datum završetka',
    active: 'Aktivna',
    paused: 'Pauzirana',
    completed: 'Završena',
    draft: 'Nacrt',
    
    profileSettings: 'Postavke profila',
    appearance: 'Izgled',
    language: 'Jezik',
    darkMode: 'Tamni režim',
    lightMode: 'Svijetli režim',
    notifications: 'Obavještenja',
    
    saveSuccess: 'Uspješno sačuvano',
    saveError: 'Greška pri čuvanju',
    requiredField: 'Obavezno polje',
    invalidValue: 'Neispravna vrijednost',
    deleteSuccess: 'Uspješno obrisano',
    deleteError: 'Greška pri brisanju',
    loginError: 'Prijava nije uspjela. Provjerite podatke.',
    signupSuccess: 'Račun je uspješno kreiran!',

    visitorsDescription: 'Upravljanje posjetiocima škole i prijavama za upis',
    addVisitor: 'Dodaj posjetioca',
    editVisitor: 'Uredi posjetioca',
    totalVisitors: 'Ukupno posjetilaca',
    visitedCount: 'Završene posjete',
    enrolledCount: 'Upisani',
    conversionRateVisit: 'Stopa konverzije',
    visitToEnrollment: 'Posjeta do upisa',
    
    child: 'Dijete',
    parents: 'Roditelji',
    visit: 'Posjeta',
    financial: 'Financije',
    
    childInfo: 'Informacije o djetetu',
    firstName: 'Ime',
    lastName: 'Prezime',
    dateOfBirth: 'Datum rođenja',
    citizenship: 'Državljanstvo',
    address: 'Adresa',
    addressPlaceholder: 'Mjesto, ulica i broj, poštanski broj',
    childName: 'Ime djeteta',
    
    parentInfo: 'Informacije o roditeljima/starateljima',
    mother: 'Majka',
    father: 'Otac',
    guardian: 'Staratelj (ako je primjenjivo)',
    phone: 'Telefon',
    profession: 'Zanimanje',
    
    visitDetails: 'Detalji posjete',
    visitType: 'Tip posjete',
    inPerson: 'Uživo',
    online: 'Online',
    visitDate: 'Datum posjete',
    visitorStatus: 'Status',
    scheduled: 'Zakazano',
    visited: 'Posjetio',
    enrolledStatus: 'Upisan',
    pending: 'Na čekanju',
    referralSource: 'Kako ste saznali za nas?',
    referralSourcePlaceholder: 'Web stranica, prijatelj, društvene mreže...',
    visitTime: 'Vrijeme posjete',
    emailNotSent: 'Email nije poslan',
    allEmailStatuses: 'Svi statusi emaila',
    visitNotes: 'Bilješke o posjeti',
    
    enrollmentAssessment: 'Procjena upisa',
    enrollmentDecision: 'Odluka',
    selectDecision: 'Odaberite odluku',
    approved: 'Odobreno',
    conditional: 'Uslovno',
    decisionRejected: 'Odbijeno',
    pendingReview: 'U razmatranju',
    decisionNotes: 'Bilješke o odluci',
    decisionNotesPlaceholder: 'Bilješke o odluci o upisu...',
    
    financialDetails: 'Financijski detalji',
    targetGrade: 'Ciljni razred',
    selectGrade: 'Odaberite razred',
    grade: 'Razred',
    schoolYear: 'Školska godina',
    enrollmentSemester: 'Period upisa',
    semester1Full: 'Cijela godina (1. polugodište)',
    semester2Only: 'Samo drugo polugodište',
    residentType: 'Tip rezidenta',
    domestic: 'Domaće lice',
    foreign: 'Strano lice',
    paymentType: 'Tip plaćanja',
    fullPayment: 'Jednokratno',
    installments: 'Na rate',
    monthsToPay: 'Broj mjeseci',
    
    discountsWaivers: 'Popusti i oslobođenja',
    siblingDiscount: 'Popust za brata/sestru',
    noDiscount: 'Bez popusta',
    secondChild: '2. dijete',
    thirdChild: '3. dijete',
    scholarshipPercent: 'Stipendija %',
    scholarshipType: 'Tip stipendije',
    scholarshipTypePlaceholder: 'npr. Odluka Školskog odbora, Zasluge...',
    registrationFeeWaived: 'Oslobođenje od upisnine',
    usesExtendedStay: 'Koristi produženi boravak',
    
    feeSummary: 'Pregled troškova',
    registrationFee: 'Upisnina',
    deposit: 'Depozit',
    baseTuition: 'Osnovna školarina',
    siblingDiscountAmount: 'Popust za brata/sestru',
    scholarshipDiscountAmount: 'Popust stipendije',
    extendedStay: 'Produženi boravak',
    proRated: 'Pro-rata',
    months: 'mjeseci',
    totalAmountDue: 'Ukupno za plaćanje',
    
    pricingManagement: 'Upravljanje cijenama',
    manageFees: 'Upravljanje školskim naknadama i popustima',
    saveChanges: 'Sačuvaj izmjene',
    generalSettings: 'Opće postavke',
    activePricing: 'Aktivne cijene',
    activePricingDesc: 'Postavi kao aktivne cijene za nove upise',
    registrationDeposit: 'Upisnina i depozit',
    registrationDepositDesc: 'Jednokratne naknade pri upisu',
    registrationFeeDomestic: 'Upisnina (domaće lice)',
    registrationFeeForeign: 'Upisnina (strano lice)',
    depositAmount: 'Iznos depozita',
    tuitionFees: 'Školarine',
    tuitionFeesDesc: 'Godišnja školarina po razredu i tipu rezidenta',
    grades1to4: 'Razredi 1-4',
    grades5to9: 'Razredi 5-9',
    domesticTuition: 'Školarina (domaće)',
    foreignTuition: 'Školarina (strano)',
    additionalFeesDiscounts: 'Dodatne naknade i popusti',
    additionalFeesDesc: 'Opcionalne naknade i postoci popusta',
    extendedStayFee: 'Naknada za produženi boravak',
    siblingDiscount2nd: 'Popust za brata/sestru (2. dijete)',
    siblingDiscount3rd: 'Popust za brata/sestru (3. dijete)',
    accessDenied: 'Pristup odbijen',
    adminOnlyAccess: 'Ova stranica je dostupna samo administratorima.',
    
    upcomingVisits: 'Predstojeće posjete',
    viewAll: 'Vidi sve',
    noUpcomingVisits: 'Nema zakazanih posjeta u narednih 7 dana',
    scheduleVisit: 'Zakaži posjetu',
    today: 'Danas',
    tomorrow: 'Sutra',
    conversionTrends: 'Trendovi konverzije posjetilaca',
    exportCSV: 'Izvezi CSV',
    exportExcel: 'Izvezi Excel',

    // Contracts
    generateContract: 'Generiši ugovor',
    contractsList: 'Ugovori',
    contractsDescription: 'Upravljanje ugovorima o upisu',
    contractNumber: 'Broj ugovora',
    contractDate: 'Datum ugovora',
    contractStatus: 'Status',
    contractLanguage: 'Jezik ugovora',
    contractDraft: 'Nacrt',
    contractGenerated: 'Generisan',
    contractSent: 'Poslan',
    contractSigned: 'Potpisan',
    downloadPDF: 'Preuzmi PDF',
    downloadDOCX: 'Preuzmi DOCX',
    sendContract: 'Pošalji ugovor',
    markSigned: 'Označi kao potpisan',
    verifyInformation: 'Provjeri podatke',
    confirmFinancials: 'Potvrdi financije',
    setDates: 'Postavi datume',
    previewGenerate: 'Pregled i generisanje',
    contractGenerateSuccess: 'Ugovor je uspješno generisan',
    contractSendSuccess: 'Ugovor je uspješno poslan',
    contractSignedSuccess: 'Ugovor je označen kao potpisan',
    noContracts: 'Još nema ugovora',
    childMustBeEnrolled: 'Dijete mora biti upisano prije generisanja ugovora',
    contractAlreadyExists: 'Ugovor već postoji za ovu školsku godinu',
    parentInfoMissing: 'Nedostaju podaci o roditeljima',
    firstPaymentDate: 'Datum prvog plaćanja',
    signatureDate: 'Datum potpisa',
    enrollmentAgreement: 'Ugovor o upisu',
    annualTuition: 'Godišnja školarina',
    monthlyInstallment: 'Mjesečna rata',
    totalContractsLabel: 'Ukupno ugovora',
    signedContractsLabel: 'Potpisani',
    pendingContractsLabel: 'Na čekanju',
    page: 'Stranica',
    of: 'od',
    rowsPerPage: 'Redova po stranici',
    showing: 'Prikazano',
    entries: 'zapisa',
    previous: 'Prethodna',
    next: 'Sljedeća',
    fullContractPreview: 'Puni pregled ugovora',
    printContract: 'Štampaj ugovor',
  },

  DE: {
    loading: 'Laden...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suchen',
    filter: 'Filter',
    export: 'Exportieren',
    noData: 'Keine Daten verfügbar',
    actions: 'Aktionen',
    confirmDelete: 'Sind Sie sicher, dass Sie dies löschen möchten?',
    allStatuses: 'Alle Status',
    
    login: 'Anmelden',
    signup: 'Registrieren',
    logout: 'Abmelden',
    email: 'E-Mail',
    password: 'Passwort',
    fullName: 'Vollständiger Name',
    forgotPassword: 'Passwort vergessen?',
    dontHaveAccount: 'Noch kein Konto?',
    alreadyHaveAccount: 'Bereits ein Konto?',
    welcomeBack: 'Willkommen zurück',
    createAccount: 'Konto erstellen',
    continueWithGoogle: 'Mit Google fortfahren',
    orContinueWith: 'oder mit E-Mail fortfahren',
    gdprNotice: 'Mit der Anmeldung akzeptieren Sie unsere Datenschutzrichtlinie und Nutzungsbedingungen. Ihre Daten sind gemäß DSGVO geschützt.',
    
    dashboard: 'Dashboard',
    leads: 'Interessenten',
    analytics: 'Analytik',
    campaigns: 'Kampagnen',
    settings: 'Einstellungen',
    visitors: 'Besucher',
    contracts: 'Verträge',
    
    totalLeads: 'Interessenten gesamt',
    conversionRate: 'Konversionsrate',
    activeCampaigns: 'Aktive Kampagnen',
    revenue: 'Umsatz',
    performanceTrends: 'Leistungstrends',
    recentActivity: 'Letzte Aktivitäten',
    leadSources: 'Quellen der Interessenten',
    quickActions: 'Schnellaktionen',
    
    addLead: 'Interessent hinzufügen',
    leadName: 'Name',
    leadEmail: 'E-Mail',
    leadPhone: 'Telefon',
    leadStatus: 'Status',
    leadSource: 'Quelle',
    leadNotes: 'Notizen',
    newLead: 'Neu',
    contacted: 'Kontaktiert',
    qualified: 'Qualifiziert',
    converted: 'Konvertiert',
    rejected: 'Abgelehnt',
    
    addCampaign: 'Kampagne hinzufügen',
    campaignName: 'Kampagnenname',
    campaignDescription: 'Beschreibung',
    campaignStatus: 'Status',
    campaignBudget: 'Budget',
    campaignChannels: 'Kanäle',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    active: 'Aktiv',
    paused: 'Pausiert',
    completed: 'Abgeschlossen',
    draft: 'Entwurf',
    
    profileSettings: 'Profileinstellungen',
    appearance: 'Erscheinungsbild',
    language: 'Sprache',
    darkMode: 'Dunkler Modus',
    lightMode: 'Heller Modus',
    notifications: 'Benachrichtigungen',
    
    saveSuccess: 'Erfolgreich gespeichert',
    saveError: 'Fehler beim Speichern',
    requiredField: 'Pflichtfeld',
    invalidValue: 'Ungültiger Wert',
    deleteSuccess: 'Erfolgreich gelöscht',
    deleteError: 'Fehler beim Löschen',
    loginError: 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.',
    signupSuccess: 'Konto erfolgreich erstellt!',

    visitorsDescription: 'Schulbesucher und Einschreibungsanträge verwalten',
    addVisitor: 'Besucher hinzufügen',
    editVisitor: 'Besucher bearbeiten',
    totalVisitors: 'Besucher gesamt',
    visitedCount: 'Besuche abgeschlossen',
    enrolledCount: 'Eingeschrieben',
    conversionRateVisit: 'Konversionsrate',
    visitToEnrollment: 'Besuch zur Einschreibung',
    
    child: 'Kind',
    parents: 'Eltern',
    visit: 'Besuch',
    financial: 'Finanzen',
    
    childInfo: 'Kindesinformationen',
    firstName: 'Vorname',
    lastName: 'Nachname',
    dateOfBirth: 'Geburtsdatum',
    citizenship: 'Staatsangehörigkeit',
    address: 'Adresse',
    addressPlaceholder: 'Stadt, Straße und Hausnummer, PLZ',
    childName: 'Name des Kindes',
    
    parentInfo: 'Eltern-/Vormund-Informationen',
    mother: 'Mutter',
    father: 'Vater',
    guardian: 'Vormund (falls zutreffend)',
    phone: 'Telefon',
    profession: 'Beruf',
    
    visitDetails: 'Besuchsdetails',
    visitType: 'Besuchsart',
    inPerson: 'Persönlich',
    online: 'Online',
    visitDate: 'Besuchsdatum',
    visitorStatus: 'Status',
    scheduled: 'Geplant',
    visited: 'Besucht',
    enrolledStatus: 'Eingeschrieben',
    pending: 'Ausstehend',
    referralSource: 'Wie haben Sie uns gefunden?',
    referralSourcePlaceholder: 'Website, Freund, Soziale Medien...',
    visitTime: 'Besuchszeit',
    emailNotSent: 'E-Mail nicht gesendet',
    allEmailStatuses: 'Alle E-Mail-Status',
    visitNotes: 'Besuchsnotizen',
    
    enrollmentAssessment: 'Einschreibungsbewertung',
    enrollmentDecision: 'Entscheidung',
    selectDecision: 'Entscheidung auswählen',
    approved: 'Genehmigt',
    conditional: 'Bedingt',
    decisionRejected: 'Abgelehnt',
    pendingReview: 'Überprüfung ausstehend',
    decisionNotes: 'Entscheidungsnotizen',
    decisionNotesPlaceholder: 'Notizen zur Einschreibungsentscheidung...',
    
    financialDetails: 'Finanzdetails',
    targetGrade: 'Zielklasse',
    selectGrade: 'Klasse auswählen',
    grade: 'Klasse',
    schoolYear: 'Schuljahr',
    enrollmentSemester: 'Einschreibungszeitraum',
    semester1Full: 'Ganzes Jahr (1. Semester)',
    semester2Only: 'Nur zweites Semester',
    residentType: 'Aufenthaltsstatus',
    domestic: 'Inländisch',
    foreign: 'Ausländisch',
    paymentType: 'Zahlungsart',
    fullPayment: 'Einmalzahlung',
    installments: 'Ratenzahlung',
    monthsToPay: 'Zahlungsmonate',
    
    discountsWaivers: 'Rabatte & Befreiungen',
    siblingDiscount: 'Geschwisterrabatt',
    noDiscount: 'Kein Rabatt',
    secondChild: '2. Kind',
    thirdChild: '3. Kind',
    scholarshipPercent: 'Stipendium %',
    scholarshipType: 'Stipendienart',
    scholarshipTypePlaceholder: 'z.B. Schulratsbeschluss, Leistung...',
    registrationFeeWaived: 'Anmeldegebühr erlassen',
    usesExtendedStay: 'Nutzt Nachmittagsbetreuung',
    
    feeSummary: 'Kostenübersicht',
    registrationFee: 'Anmeldegebühr',
    deposit: 'Kaution',
    baseTuition: 'Grundschulgeld',
    siblingDiscountAmount: 'Geschwisterrabatt',
    scholarshipDiscountAmount: 'Stipendienrabatt',
    extendedStay: 'Nachmittagsbetreuung',
    proRated: 'Anteilig',
    months: 'Monate',
    totalAmountDue: 'Gesamtbetrag fällig',
    
    pricingManagement: 'Preisverwaltung',
    manageFees: 'Schulgebühren und Rabatte verwalten',
    saveChanges: 'Änderungen speichern',
    generalSettings: 'Allgemeine Einstellungen',
    activePricing: 'Aktive Preise',
    activePricingDesc: 'Als aktive Preise für neue Einschreibungen festlegen',
    registrationDeposit: 'Anmeldung & Kaution',
    registrationDepositDesc: 'Einmalige Gebühren bei der Einschreibung',
    registrationFeeDomestic: 'Anmeldegebühr (Inländisch)',
    registrationFeeForeign: 'Anmeldegebühr (Ausländisch)',
    depositAmount: 'Kautionsbetrag',
    tuitionFees: 'Schulgebühren',
    tuitionFeesDesc: 'Jährliches Schulgeld nach Klassenstufe und Aufenthaltsstatus',
    grades1to4: 'Klassen 1-4',
    grades5to9: 'Klassen 5-9',
    domesticTuition: 'Schulgeld (Inländisch)',
    foreignTuition: 'Schulgeld (Ausländisch)',
    additionalFeesDiscounts: 'Zusätzliche Gebühren & Rabatte',
    additionalFeesDesc: 'Optionale Gebühren und Rabattprozentsätze',
    extendedStayFee: 'Nachmittagsbetreuungsgebühr',
    siblingDiscount2nd: 'Geschwisterrabatt (2. Kind)',
    siblingDiscount3rd: 'Geschwisterrabatt (3. Kind)',
    accessDenied: 'Zugriff verweigert',
    adminOnlyAccess: 'Diese Seite ist nur für Administratoren zugänglich.',
    
    upcomingVisits: 'Bevorstehende Besuche',
    viewAll: 'Alle anzeigen',
    noUpcomingVisits: 'Keine geplanten Besuche in den nächsten 7 Tagen',
    scheduleVisit: 'Besuch planen',
    today: 'Heute',
    tomorrow: 'Morgen',
    conversionTrends: 'Konversionstrends der Besucher',
    exportCSV: 'CSV exportieren',
    exportExcel: 'Excel exportieren',

    // Contracts
    generateContract: 'Vertrag generieren',
    contractsList: 'Verträge',
    contractsDescription: 'Einschreibungsverträge verwalten',
    contractNumber: 'Vertragsnummer',
    contractDate: 'Vertragsdatum',
    contractStatus: 'Status',
    contractLanguage: 'Vertragssprache',
    contractDraft: 'Entwurf',
    contractGenerated: 'Generiert',
    contractSent: 'Gesendet',
    contractSigned: 'Unterzeichnet',
    downloadPDF: 'PDF herunterladen',
    downloadDOCX: 'DOCX herunterladen',
    sendContract: 'Vertrag senden',
    markSigned: 'Als unterzeichnet markieren',
    verifyInformation: 'Informationen überprüfen',
    confirmFinancials: 'Finanzen bestätigen',
    setDates: 'Termine festlegen',
    previewGenerate: 'Vorschau & Generieren',
    contractGenerateSuccess: 'Vertrag erfolgreich generiert',
    contractSendSuccess: 'Vertrag erfolgreich gesendet',
    contractSignedSuccess: 'Vertrag als unterzeichnet markiert',
    noContracts: 'Noch keine Verträge',
    childMustBeEnrolled: 'Kind muss eingeschrieben sein, bevor ein Vertrag erstellt werden kann',
    contractAlreadyExists: 'Vertrag existiert bereits für dieses Schuljahr',
    parentInfoMissing: 'Elterninformationen fehlen',
    firstPaymentDate: 'Datum der ersten Zahlung',
    signatureDate: 'Unterschriftsdatum',
    enrollmentAgreement: 'Einschreibungsvertrag',
    annualTuition: 'Jährliches Schulgeld',
    monthlyInstallment: 'Monatliche Rate',
    totalContractsLabel: 'Verträge gesamt',
    signedContractsLabel: 'Unterzeichnet',
    pendingContractsLabel: 'Ausstehend',
    page: 'Seite',
    of: 'von',
    rowsPerPage: 'Zeilen pro Seite',
    showing: 'Anzeige',
    entries: 'Einträge',
    previous: 'Zurück',
    next: 'Weiter',
    fullContractPreview: 'Vollständige Vertragsvorschau',
    printContract: 'Vertrag drucken',
  },
};

export function t(key: keyof TranslationStrings, language: Language = 'EN'): string {
  return translations[language][key] || key;
}

export function getAvailableLanguages(): { code: Language; name: string }[] {
  return [
    { code: 'EN', name: 'English' },
    { code: 'BS', name: 'Bosanski' },
    { code: 'DE', name: 'Deutsch' },
  ];
}
