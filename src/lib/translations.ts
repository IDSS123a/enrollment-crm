export type Language = 'EN' | 'BS';

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
  
  // Navigation
  dashboard: string;
  leads: string;
  analytics: string;
  campaigns: string;
  settings: string;
  visitors: string;
  
  // Dashboard
  totalLeads: string;
  conversionRate: string;
  activeCampaigns: string;
  revenue: string;
  performanceTrends: string;
  recentActivity: string;
  leadSources: string;
  
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
    
    dashboard: 'Dashboard',
    leads: 'Leads',
    analytics: 'Analytics',
    campaigns: 'Campaigns',
    settings: 'Settings',
    visitors: 'Visitors',
    
    totalLeads: 'Total Leads',
    conversionRate: 'Conversion Rate',
    activeCampaigns: 'Active Campaigns',
    revenue: 'Revenue',
    performanceTrends: 'Performance Trends',
    recentActivity: 'Recent Activity',
    leadSources: 'Lead Sources',
    
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
    deleteSuccess: 'Deleted successfully',
    deleteError: 'Failed to delete',
    loginError: 'Login failed. Please check your credentials.',
    signupSuccess: 'Account created successfully!',

    // Visitors
    visitorsDescription: 'Manage school visitors and enrollment applications',
    addVisitor: 'Add Visitor',
    editVisitor: 'Edit Visitor',
    totalVisitors: 'Total Visitors',
    visitedCount: 'Visits Completed',
    enrolledCount: 'Enrolled',
    conversionRateVisit: 'Conversion Rate',
    visitToEnrollment: 'Visit to enrollment',
    
    // Visitor form tabs
    child: 'Child',
    parents: 'Parents',
    visit: 'Visit',
    financial: 'Financial',
    
    // Child info
    childInfo: 'Child Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    citizenship: 'Citizenship',
    address: 'Address',
    addressPlaceholder: 'City, Street and Number, ZIP',
    childName: 'Child Name',
    
    // Parent info
    parentInfo: 'Parent/Guardian Information',
    mother: 'Mother',
    father: 'Father',
    guardian: 'Guardian (if applicable)',
    phone: 'Phone',
    profession: 'Profession',
    
    // Visit details
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
    visitNotes: 'Visit Notes',
    
    // Enrollment assessment
    enrollmentAssessment: 'Enrollment Assessment',
    enrollmentDecision: 'Decision',
    selectDecision: 'Select decision',
    approved: 'Approved',
    conditional: 'Conditional',
    decisionRejected: 'Rejected',
    pendingReview: 'Pending Review',
    decisionNotes: 'Decision Notes',
    decisionNotesPlaceholder: 'Notes about the enrollment decision...',
    
    // Financial
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
    
    // Discounts
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
    
    // Fee summary
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
    
    dashboard: 'Kontrolna tabla',
    leads: 'Kandidati',
    analytics: 'Analitika',
    campaigns: 'Kampanje',
    settings: 'Postavke',
    visitors: 'Posjetioci',
    
    totalLeads: 'Ukupno kandidata',
    conversionRate: 'Stopa konverzije',
    activeCampaigns: 'Aktivne kampanje',
    revenue: 'Prihod',
    performanceTrends: 'Trendovi performansi',
    recentActivity: 'Nedavne aktivnosti',
    leadSources: 'Izvori kandidata',
    
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
    deleteSuccess: 'Uspješno obrisano',
    deleteError: 'Greška pri brisanju',
    loginError: 'Prijava nije uspjela. Provjerite podatke.',
    signupSuccess: 'Račun je uspješno kreiran!',

    // Visitors
    visitorsDescription: 'Upravljanje posjetiocima škole i prijavama za upis',
    addVisitor: 'Dodaj posjetioca',
    editVisitor: 'Uredi posjetioca',
    totalVisitors: 'Ukupno posjetilaca',
    visitedCount: 'Završene posjete',
    enrolledCount: 'Upisani',
    conversionRateVisit: 'Stopa konverzije',
    visitToEnrollment: 'Posjeta do upisa',
    
    // Visitor form tabs
    child: 'Dijete',
    parents: 'Roditelji',
    visit: 'Posjeta',
    financial: 'Financije',
    
    // Child info
    childInfo: 'Informacije o djetetu',
    firstName: 'Ime',
    lastName: 'Prezime',
    dateOfBirth: 'Datum rođenja',
    citizenship: 'Državljanstvo',
    address: 'Adresa',
    addressPlaceholder: 'Mjesto, ulica i broj, poštanski broj',
    childName: 'Ime djeteta',
    
    // Parent info
    parentInfo: 'Informacije o roditeljima/starateljima',
    mother: 'Majka',
    father: 'Otac',
    guardian: 'Staratelj (ako je primjenjivo)',
    phone: 'Telefon',
    profession: 'Zanimanje',
    
    // Visit details
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
    visitNotes: 'Bilješke o posjeti',
    
    // Enrollment assessment
    enrollmentAssessment: 'Procjena upisa',
    enrollmentDecision: 'Odluka',
    selectDecision: 'Odaberite odluku',
    approved: 'Odobreno',
    conditional: 'Uslovno',
    decisionRejected: 'Odbijeno',
    pendingReview: 'U razmatranju',
    decisionNotes: 'Bilješke o odluci',
    decisionNotesPlaceholder: 'Bilješke o odluci o upisu...',
    
    // Financial
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
    
    // Discounts
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
    
    // Fee summary
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
  },
};

export function t(key: keyof TranslationStrings, language: Language = 'EN'): string {
  return translations[language][key] || key;
}

export function getAvailableLanguages(): { code: Language; name: string }[] {
  return [
    { code: 'EN', name: 'English' },
    { code: 'BS', name: 'Bosanski' },
  ];
}
