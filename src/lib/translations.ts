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
