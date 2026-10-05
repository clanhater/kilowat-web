// Web/js/config.js
const CONFIG = {
    SUPABASE_URL: "https://uncrcxoaerxsqqbumxtv.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3JjeG9hZXJ4c3FxYnVteHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMTEzMTEsImV4cCI6MjEwNTU4NzMxMX0.AGtx7A1PGvFjXT-ZaCcsZXpUxrKPds3vFKTh5yLjRio",
    
    // CAMBIA ESTE NÚMERO POR TU TARJETA BANCARIA REAL
    CARD_NUMBER: "9204-1299-7982-2899",
	PHONE_NUMBER: "53523128",
    
    WHATSAPP_SUPPORT: "5356471292",
    
	// ENLACES DIRECTOS DE DESCARGA (1 CLIC)
    // Apuntan a los instaladores base de tu release v1.0.0 en GitHub
    DOWNLOAD_APK_URL: "https://github.com/clanhater/kilowat-web/releases/download/v1.0.0/Kilowat.apk",
    DOWNLOAD_WINDOWS_URL: "https://github.com/clanhater/kilowat-web/releases/download/v1.0.0/Kilowat.exe"
};

// Inicialización del cliente Supabase
const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);