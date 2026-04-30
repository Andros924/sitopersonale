import React from "react";
import { Helmet } from "react-helmet";
import CalcoloPreliminare from "../components/CalcoloPreliminare";

const Home = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <html lang="it" />
        <title>Integra Finance | Consulente del Credito a Palermo</title>
        <meta
          name="description"
          content="Consulenza del credito a Palermo con Integra Finance: supporto professionale e calcolo preliminare online per la registrazione del compromesso immobiliare."
        />
        <meta
          name="keywords"
          content="consulente del credito Palermo, Integra Finance, calcolo preliminare, registrazione compromesso"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://studiofiscaleamoroso.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Integra Finance | Consulente del Credito a Palermo" />
        <meta
          property="og:description"
          content="Affidati a Integra Finance per la consulenza del credito e usa il calcolo preliminare direttamente in homepage."
        />
        <meta property="og:url" content="https://studiofiscaleamoroso.com/" />

        <meta name="geo.region" content="IT-PA" />
        <meta name="geo.placename" content="Palermo" />
        <meta name="geo.position" content="38.1157;13.3615" />
        <meta name="ICBM" content="38.1157, 13.3615" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: "Integra Finance - Consulenza del Credito",
            areaServed: "Palermo",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Palermo",
              addressCountry: "IT",
            },
            url: "https://studiofiscaleamoroso.com/",
          })}
        </script>
      </Helmet>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 text-center mb-4">
          Integra Finance – Consulenza del Credito
        </h1>
        <p className="text-center text-slate-700 text-lg md:text-xl max-w-3xl mx-auto mb-10">
          Benvenuto: questa homepage è dedicata al servizio di consulenza del
          credito e include direttamente il calcolo preliminare per la
          registrazione del compromesso.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 text-center mb-6">
            Calcolo preliminare
          </h2>
          <CalcoloPreliminare />
        </div>
      </section>
    </div>
  );
};

export default Home;
