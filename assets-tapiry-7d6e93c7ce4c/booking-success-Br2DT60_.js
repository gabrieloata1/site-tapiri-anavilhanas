import { c as icon, j as e, r as React, L as Link } from "./index-C3h-ONy_.js";
import { L as Language, u as useLanguage, N as Header, F as Footer } from "./Footer-DPiwKGLl.js";
import { B as Button } from "./button-B35Yg_vj.js";
import { s as supabase } from "./client-Bb0sVERf.js";
import { L as Loader } from "./loader-circle-DRqH-0nE.js";

const Check = icon("CircleCheckBig", [["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "a" }], ["path", { d: "m9 11 3 3L22 4", key: "b" }]]);
function Confirmation() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [state, setState] = React.useState("loading");
  const [retry, setRetry] = React.useState(0);
  React.useEffect(() => {
    let active = true, timer, attempts = 0;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("token") || params.get("session_id");
    async function check() {
      if (!orderId) { setState("missing"); return; }
      try {
        const { data, error } = await supabase.functions.invoke("capture-stripe-order", { body: { orderId } });
        if (error) throw error;
        if (!active) return;
        if (data?.success) {
          setState("paid");
          const key = "tapiry-purchase:" + data.orderId;
          let sent = false;
          try { sent = localStorage.getItem(key) === "1"; } catch {}
          if (window.gtag && !sent) {
            const common = { value: Number(data.capturedAmount), currency: data.capturedCurrency, transaction_id: data.orderId };
            window.gtag("event", "purchase", { send_to: "AW-17782148483", ...common });
            window.gtag("event", "conversion", { send_to: "AW-18234571113/AsT_CM7nrsAcEOny9fZD", ...common });
            try { localStorage.setItem(key, "1"); } catch {}
          }
        } else if (data?.status === "pending") {
          setState("pending");
          if (++attempts < 12) timer = setTimeout(check, 5000);
        } else if (data?.status === "expired") setState("expired");
        else setState("error");
      } catch { if (active) setState("error"); }
    }
    setState("loading");
    check();
    return () => { active = false; clearTimeout(timer); };
  }, [retry]);
  const titles = pt ? {
    loading: "Confirmando pagamento…", paid: "Reserva confirmada!", pending: "Pagamento aguardando confirmação",
    expired: "Sessão de pagamento expirada", error: "Confirmação indisponível", missing: "Sessão não encontrada",
  } : {
    loading: "Confirming payment…", paid: "Booking confirmed!", pending: "Payment awaiting confirmation",
    expired: "Payment session expired", error: "Confirmation unavailable", missing: "Session not found",
  };
  const messages = pt ? {
    loading: "Aguarde enquanto verificamos seu pagamento.", paid: "Seu pagamento foi confirmado e sua reserva foi registrada. Para mais detalhes, fale com a equipe.",
    pending: "A reserva será confirmada após a compensação do pagamento. Boletos podem levar alguns dias úteis. Você pode voltar a esta página para consultar o status.",
    expired: "Esta sessão expirou sem confirmação de pagamento. Volte aos pacotes para iniciar outra reserva.",
    error: "Não conseguimos consultar sua reserva agora. Verifique novamente ou fale com a equipe antes de realizar outro pagamento.",
    missing: "Abra o link de confirmação do seu pagamento ou fale com a equipe.",
  } : {
    loading: "Please wait while we verify your payment.", paid: "Your payment is confirmed and your booking has been recorded. Contact our team for further details.",
    pending: "Your booking will be confirmed when payment clears. Boleto payments can take a few business days. Return to this page to check the status.",
    expired: "This session expired without payment confirmation. Return to the packages to start another booking.",
    error: "We cannot check your booking right now. Check again or contact our team before making another payment.",
    missing: "Open your payment confirmation link or contact our team.",
  };
  return e.jsxs("div", { className: "min-h-screen bg-background", children: [e.jsx(Header, {}),
    e.jsx("main", { className: "container mx-auto px-4 py-24", children: e.jsxs("div", { className: "max-w-md mx-auto text-center", children: [
      state === "loading" && e.jsx(Loader, { className: "w-16 h-16 mx-auto text-primary animate-spin mb-6" }),
      state === "paid" && e.jsx(Check, { className: "w-16 h-16 mx-auto text-green-500 mb-6" }),
      e.jsx("h1", { className: "text-2xl font-display font-bold text-foreground mb-4", children: titles[state] }),
      e.jsx("p", { role: "status", className: "text-muted-foreground mb-8", children: messages[state] }),
      e.jsxs("div", { className: "space-y-4", children: [
        ["pending", "error"].includes(state) && e.jsx(Button, { className: "w-full", onClick: () => setRetry(x => x + 1), children: pt ? "Verificar novamente" : "Check again" }),
        e.jsx(Link, { to: "/", children: e.jsx(Button, { variant: "outline", className: "w-full", children: pt ? "Voltar ao início" : "Back to home" }) }),
        e.jsx("a", { href: "https://wa.me/5592994287762", target: "_blank", rel: "noopener noreferrer", className: "block", children: e.jsx(Button, { variant: "outline", className: "w-full", children: pt ? "Falar com a equipe" : "Contact our team" }) }),
      ] }),
    ] }) }), e.jsx(Footer, {}),
  ] });
}
export const component = () => e.jsx(Language, { children: e.jsx(Confirmation, {}) });
