const cfg = window.SHOPLINK_CONFIG || {};
const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.startsWith("YOUR_");
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const $ = (id) => document.getElementById(id);
const formIn = $("form-in"), formUp = $("form-up");
const tabIn = $("tab-in"), tabUp = $("tab-up");

function showTab(signIn) {
  formIn.hidden = !signIn;
  formUp.hidden = signIn;
  tabIn.setAttribute("aria-selected", String(signIn));
  tabUp.setAttribute("aria-selected", String(!signIn));
}
tabIn.addEventListener("click", () => showTab(true));
tabUp.addEventListener("click", () => showTab(false));

function say(el, text, type) {
  el.textContent = text;
  el.className = "msg " + type;
  el.hidden = false;
}

function notReady(el) {
  say(el, "The app is not connected yet. Add your Supabase details in config.js.", "error");
}

async function run(form, msgEl, action) {
  const btn = form.querySelector("button[type=submit]");
  msgEl.hidden = true;
  if (!sb) return notReady(msgEl);
  btn.disabled = true;
  try { await action(); }
  catch (err) { say(msgEl, err.message || "Something went wrong. Try again.", "error"); }
  btn.disabled = false;
}

formIn.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(formIn);
  run(formIn, $("msg-in"), async () => {
    const { error } = await sb.auth.signInWithPassword({ email: f.get("email").trim(), password: f.get("password") });
    if (error) throw error;
    location.href = "dashboard.html";
  });
});

formUp.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(formUp);
  const whatsapp = String(f.get("whatsapp")).replace(/\D/g, "");
  if (whatsapp.length < 8) return say($("msg-up"), "Enter your WhatsApp number with the country code.", "error");
  run(formUp, $("msg-up"), async () => {
    const { error } = await sb.auth.signUp({
      email: f.get("email").trim(),
      password: f.get("password"),
      options: { data: { full_name: f.get("full_name").trim(), shop_name: f.get("shop_name").trim(), whatsapp } }
    });
    if (error) throw error;
    formUp.reset();
    say($("msg-up"), "Account created. Pay the subscription fee, and the admin will activate your account. You can sign in once it is active.", "ok");
  });
});

if (sb) {
  sb.auth.getSession().then(({ data }) => { if (data.session) location.href = "dashboard.html"; });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
