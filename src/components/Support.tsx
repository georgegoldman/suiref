// src/pages/Support.tsx
import React from "react";

type FaqItem = { id: number; q: string; a: string };

const FAQS: FaqItem[] = [
  {
    id: 1,
    q: "How Do i generate my referral link?",
    a: "Your referral link is created once you sign up, connect your wallet.",
  },
  {
    id: 2,
    q: "How are points calculated",
    a: "Points are awarded for valid referrals, attendance verification, and special campaign bonuses.",
  },
  {
    id: 3,
    q: "What happens if my wallets is disconnected?",
    a: "Reconnect your wallet and re-authenticate. Your data and progress remain intact.",
  },
  {
    id: 4,
    q: "How do NFT rewards work?",
    a: "Eligible users can claim event-bound NFTs. They’re minted to your connected Sui address.",
  },
  {
    id: 5,
    q: "Wh can i connect for workshop issues?",
    a: "Contact the hub leads in your region or write us via the form on this page.",
  },
];

const Support: React.FC = () => {
  const [openId, setOpenId] = React.useState<number>(FAQS[0].id);

  // Contact form (client-side only demo)
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return alert("Please agree to the terms before sending.");
    setSending(true);
    try {
      // TODO: wire to your API / email service
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      setName("");
      setPhone("");
      setMessage("");
      setAgree(false);
      setTimeout(() => setSent(false), 2500);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top header */}
        <div className="space-y-1">
          <h1 className="text-black text-2xl sm:text-[28px] font-extrabold">
            Need Help? We got you covered.
          </h1>
          <p className="text-black/70 text-sm">
            Find answers, explore guides, or reach out directly for assistance with the SuiHub Referral System.
          </p>
        </div>

        {/* Frame */}
        <div className="rounded-2xl border border-black/10 p-4 sm:p-6 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ */}
            <section>
              <h2 className="text-black font-bold text-lg mb-4">FAQ</h2>

              <div className="space-y-3">
                {FAQS.map((f) => {
                  const isOpen = f.id === openId;
                  return (
                    <div
                      key={f.id}
                      className={`rounded-xl ring-1 transition-colors ${
                        isOpen ? "bg-black/5 ring-black/10" : "bg-white ring-black/10 hover:bg-gray-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? -1 : f.id)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                        aria-expanded={isOpen}
                      >
                        <span
                          className={`text-sm sm:text-[15px] font-semibold ${
                            isOpen ? "text-black" : "text-black/85"
                          }`}
                        >
                          {f.q}
                        </span>

                        {/* plus / close pill */}
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                            isOpen ? "bg-black text-white" : "bg-black/5 text-black"
                          }`}
                          aria-hidden="true"
                        >
                          {isOpen ? "✕" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 -mt-1">
                          <p className="text-black/85 text-sm leading-relaxed">
                            {f.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Contact us */}
            <section>
              <h2 className="text-black font-bold text-lg mb-1">Contact us</h2>
              <p className="text-black/70 text-sm mb-6">
                Our team is here to help, Send us a message.
              </p>

              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-white ring-1 ring-black/10 px-4 py-3 text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                  />
                </label>

                <label className="block">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-white ring-1 ring-black/10 px-4 py-3 text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                  />
                </label>

                <label className="block">
                  <textarea
                    placeholder="Enter your message here"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-y rounded-xl bg-white ring-1 ring-black/10 px-4 py-3 text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/20"
                    required
                  />
                </label>

                <label className="flex items-start gap-3 text-xs text-black/70">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="
                      mt-1 h-5 w-5
                      appearance-none                       /* remove default UI */
                      rounded-md
                      bg-transparent
                      ring-1 ring-black/20                  /* subtle outline */
                      border border-transparent             /* iOS/Safari fallback */
                      hover:ring-black/30
                      transition
                      focus:outline-none focus:ring-2 focus:ring-black/40

                      /* checked state (black fill + white vector tick) */
                      checked:bg-black
                      checked:ring-black
                      checked:[background-image:url('data:image/svg+xml;utf8,\
                <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22>\
                <path d=%22M5 13l4 4L19 7%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/>\
                </svg>')]
                      checked:bg-no-repeat
                      checked:bg-center
                      checked:bg-[length:14px_14px]
                    "
                  />

                  <span>
                    You agree to the terms of service and consent to the processing of your
                    personal data as outlined in our privacy policy.
                  </span>
                </label>


                <button
                  type="submit"
                  disabled={sending}
                  className="
                    w-full h-12 rounded-xl
                    bg-black hover:bg-black/80
                    text-white font-semibold
                    shadow-sm
                    disabled:opacity-70 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  {sending ? "Sending…" : sent ? "Sent ✓" : "Send"}
                </button>

                {/* Optional: social/link */}
                <div className="text-center">
                  <a
                    href="https://x.com/SuiHubAfrica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/70 hover:underline text-sm hover:text-black"
                  >
                    @SuiHubAfrica on X
                  </a>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
