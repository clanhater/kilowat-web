// Web/js/config.js
const CONFIG = {
    SUPABASE_URL: "https://uncrcxoaerxsqqbumxtv.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3JjeG9hZXJ4c3FxYnVteHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMTEzMTEsImV4cCI6MjEwNTU4NzMxMX0.AGtx7A1PGvFjXT-ZaCcsZXpUxrKPds3vFKTh5yLjRio",
    
    // CAMBIA ESTE NÚMERO POR TU TARJETA BANCARIA REAL
    CARD_NUMBER: "9204-1299-7982-2899",
	PHONE_NUMBER: "53523128",
    
    WHATSAPP_SUPPORT: "5356471292",
    GITHUB_RELEASES_URL: "https://github.com/mariaelenabernia3-jpg/kilowat-game/releases/latest"
};

// Inicialización del cliente Supabase
const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);