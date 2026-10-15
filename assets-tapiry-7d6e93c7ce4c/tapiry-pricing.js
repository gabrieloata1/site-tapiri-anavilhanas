// This module is also compiled into the browser bundle by tools/tapiry/build.cjs.
// Preserve the lodge's existing displayed tariff, including the minimum seasonal
// price outside a range and the single-occupancy supplement rounded to reais.

export function minimumRate(rates) {
  const available = rates.filter(r => !r.is_blocked).map(r => Number(r.price_brl));
  return available.length ? Math.min(...available) : 0;
}
export function blockedDate(rates, date) {
  return rates.some(r => r.is_blocked && r.start_date && r.end_date && date >= r.start_date && date <= r.end_date);
}
export function quotePrice(rates, date, adults, children, fee = {}) {
  if (rates.some(r => !r.is_blocked && (!Number.isFinite(Number(r.price_brl)) || Number(r.price_brl) <= 0))) {
    throw new Error("Tabela de preços inválida.");
  }
  const ordered = [...rates].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || (a.id || "").localeCompare(b.id || ""));
  const match = date && ordered.find(r => r.start_date && r.end_date && date >= r.start_date && date <= r.end_date && !r.is_blocked);
  const rate = match ? Number(match.price_brl) : minimumRate(rates);
  const adultRate = adults === 1 ? Math.round(rate * 1.3596) : rate;
  const childRate = rate / 2;
  const reservationFee = fee.enabled ? Number(fee.amount_brl) : 0;
  if (!Number.isFinite(reservationFee) || reservationFee < 0) throw new Error("Taxa de reserva inválida.");
  const amountInCents = Math.round((adultRate * adults + childRate * children + reservationFee) * 100);
  const available = rate > 0 && (!date || !blockedDate(rates, date));
  return {
    rate,
    adultRate,
    childRate,
    reservationFee,
    amountInCents,
    total: amountInCents / 100,
    available
  };
}
export function previewPrice(...args) {
  try {
    return quotePrice(...args);
  } catch {
    return {
      rate: 0,
      adultRate: 0,
      childRate: 0,
      reservationFee: 0,
      amountInCents: 0,
      total: 0,
      available: false
    };
  }
}
