// Supabase connection and local settings for ShopLink.
// The publishable key is safe to keep here. Security is handled by the database rules.
window.SHOPLINK_CONFIG = {
  SUPABASE_URL: "https://lfleqefodiqhmektbesc.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_iI6VtJd78bPQP6CFi7QH8w_VVWUwCVB",
  // Shown before every price
  CURRENCY: "GH₵",
  // Used to fix WhatsApp numbers typed without a country code (a leading 0 is replaced by this)
  COUNTRY_CODE: "233",
  // Shown to sellers under their picture count. Write your price for extra pictures here, for example:
  // "Extra pictures: GH₵ 10 for every 20 more."
  EXTRA_PICTURES_NOTE: ""
};
