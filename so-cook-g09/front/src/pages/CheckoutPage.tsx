import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [paid, setPaid] = useState(false);
  const [touched, setTouched] = useState<{[k: string]: boolean}>({});
  const navigate = useNavigate();

  // Validation helpers
  const isCardNumberValid = /^\d{16}$/.test(cardNumber.replace(/\s/g, ""));
  const isExpiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
  const isCvcValid = /^\d{3}$/.test(cvc);
  const isNameValid = /^[A-Za-zÀ-ÿ '-]{2,}$/.test(name.trim());
  const isFormValid = isCardNumberValid && isExpiryValid && isCvcValid && isNameValid;

  const getCardNumberError = () => {
    if (!touched.cardNumber) return "";
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) return "Le numéro doit comporter 16 chiffres.";
    return "";
  };
  const getExpiryError = () => {
    if (!touched.expiry) return "";
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) return "Format MM/AA, mois valide.";
    return "";
  };
  const getCvcError = () => {
    if (!touched.cvc) return "";
    if (!/^\d{3}$/.test(cvc)) return "Le CVC doit comporter 3 chiffres.";
    return "";
  };
  const getNameError = () => {
    if (!touched.name) return "";
    if (!/^[A-Za-zÀ-ÿ '-]{2,}$/.test(name.trim())) return "Nom invalide (lettres uniquement, min 2).";
    return "";
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setPaid(true);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Paiement sécurisé</h1>
        {/* Fake card preview */}
        <div className="mb-8 flex justify-center">
          <div className="w-80 h-44 rounded-xl bg-gradient-to-tr from-green-400 to-green-700 shadow-lg flex flex-col justify-between p-5 text-white relative">
            <span className="text-xs tracking-widest uppercase">Carte bancaire</span>
            <span className="text-lg font-mono tracking-widest">{cardNumber ? cardNumber.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}</span>
            <div className="flex justify-between items-end">
              <span className="text-xs">Exp: {expiry || "••/••"}</span>
              <span className="text-xs">CVC: {cvc || "•••"}</span>
            </div>
            <span className="text-sm font-semibold mt-2">{name || "NOM DU TITULAIRE"}</span>
          </div>
        </div>
        {paid ? (
          <>
            <div className="text-center text-green-700 font-semibold text-lg">
              Paiement effectué avec succès !<br />Merci pour votre achat.
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-6 py-2 border-2 border-green-600 text-green-700 rounded-full font-semibold hover:bg-green-50 transition mx-auto block"
            >
              Revenir à l'accueil
            </button>
          </>
        ) : (
          <form className="space-y-5" onSubmit={handlePay}>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="cardNumber">Numéro de carte</label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={19}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition text-lg font-mono ${touched.cardNumber && !isCardNumberValid ? 'border-red-400' : ''}`}
                placeholder="1234 5678 9012 3456"
                value={cardNumber.replace(/(.{4})/g, "$1 ").trim()}
                onChange={e => {
                  setCardNumber(e.target.value.replace(/[^0-9]/g, "").slice(0,16));
                }}
                onBlur={() => setTouched(t => ({...t, cardNumber: true}))}
                required
              />
              {getCardNumberError() && (
                <div className="text-red-500 text-xs mt-1">{getCardNumberError()}</div>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-1" htmlFor="expiry">Expiration</label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  maxLength={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition text-lg font-mono ${touched.expiry && !isExpiryValid ? 'border-red-400' : ''}`}
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={e => {
                    let v = e.target.value.replace(/[^0-9/]/g, "");
                    if (v.length === 2 && expiry.length === 1) v += "/";
                    setExpiry(v.slice(0,5));
                  }}
                  onBlur={() => setTouched(t => ({...t, expiry: true}))}
                  required
                />
                {getExpiryError() && (
                  <div className="text-red-500 text-xs mt-1">{getExpiryError()}</div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-1" htmlFor="cvc">CVC</label>
                <input
                  id="cvc"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition text-lg font-mono ${touched.cvc && !isCvcValid ? 'border-red-400' : ''}`}
                  placeholder="123"
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, "").slice(0,3))}
                  onBlur={() => setTouched(t => ({...t, cvc: true}))}
                  required
                />
                {getCvcError() && (
                  <div className="text-red-500 text-xs mt-1">{getCvcError()}</div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="name">Nom du titulaire</label>
              <input
                id="name"
                type="text"
                autoComplete="cc-name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition text-base ${touched.name && !isNameValid ? 'border-red-400' : ''}`}
                placeholder="Nom Prénom"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setTouched(t => ({...t, name: true}))}
                required
              />
              {getNameError() && (
                <div className="text-red-500 text-xs mt-1">{getNameError()}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
            >
              Payer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}