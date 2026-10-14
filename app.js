const cfg = window.SHOPLINK_CONFIG || {};
const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.startsWith("YOUR_");
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const $ = (id) => document.getElementById(id);
const formIn = $("form-in"), formUp = $("form-up"), formReset = $("form-reset"), formNew = $("form-new");
const tabIn = $("tab-in"), tabUp = $("tab-up"), tabs = $("tabs");

function showTab(signIn) {
  tabs.hidden = false;
  formReset.hidden = true;
  formNew.hidden = true;
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

/* ----- sign in ----- */
formIn.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(formIn);
  run(formIn, $("msg-in"), async () => {
    const { error } = await sb.auth.signInWithPassword({ email: f.get("email").trim(), password: f.get("password") });
    if (error) throw error;
    location.href = "dashboard.html";
  });
});

/* ----- create account ----- */
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

/* ----- forgot password: ask for the reset link ----- */
$("forgot").addEventListener("click", () => {
  tabs.hidden = true;
  formIn.hidden = true;
  formUp.hidden = true;
  formReset.hidden = false;
});
$("back").addEventListener("click", () => showTab(true));

formReset.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = new FormData(formReset).get("email").trim();
  const redirectTo = location.origin + location.pathname.replace(/index\.html$/, "");
  run(formReset, $("msg-reset"), async () => {
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    say($("msg-reset"), "If this email has an account, a reset link is on its way. Check your inbox and your spam folder.", "ok");
  });
});

/* ----- forgot password: set the new password (after tapping the email link) ----- */
function showNewPassword() {
  tabs.hidden = true;
  formIn.hidden = true;
  formUp.hidden = true;
  formReset.hidden = true;
  formNew.hidden = false;
}

formNew.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = new FormData(formNew).get("password");
  run(formNew, $("msg-new"), async () => {
    const { error } = await sb.auth.updateUser({ password });
    if (error) throw error;
    await sb.auth.signOut();
    history.replaceState(null, "", location.pathname);
    formNew.reset();
    showTab(true);
    say($("msg-in"), "Password changed. Sign in with your new password.", "ok");
  });
});

if (sb) {
  sb.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") showNewPassword(); });
  if (location.hash.includes("type=recovery")) {
    showNewPassword();
  } else {
    sb.auth.getSession().then(({ data }) => { if (data.session) location.href = "dashboard.html"; });
  }
}

/* ----- install button ----- */
let installEvent = null;
const installBtn = $("install");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installEvent = e;
  if (installBtn) installBtn.hidden = false;
});
if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    installEvent = null;
    installBtn.hidden = true;
  });
}
window.addEventListener("appinstalled", () => { if (installBtn) installBtn.hidden = true; });

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInstalled = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
if (isIOS && !isInstalled && $("ios-hint")) $("ios-hint").hidden = false;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
