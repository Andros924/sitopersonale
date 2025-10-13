import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ChiSiamo from "./pages/ChiSiamo";
import Servizi from "./pages/Servizi";
import Blog from "./pages/Blog";
import DettaglioArticolo from "./pages/DettaglioArticolo";
import Contatti from "./pages/Contatti";
import Pubblicazioni from "./pages/Pubblicazioni";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/Privacy";
import TermsConditions from "./pages/Terms";
import RegistrazionePreliminare from "./pages/RegistrazionePreliminare";
import SuccessioniServizio from "./pages/SuccessioniServizio";
import ConsulenzaFiscale from "./pages/ConsulenzaFiscale";
import DichiarazioneRedditi from "./pages/DichiarazioneRedditi";
import PianificazioneFiscale from "./pages/PianificazioneFiscale";
import ContabilitaFiscale from "./pages/ContabilitaFiscale";
import AssistenzaControlliFiscali from "./pages/AssistenzaControlliFiscali";
import ContrattoLocazione from "./pages/ContrattoLocazione";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminEditor from "./pages/AdminEditor";
import MigrateArticles from "./pages/MigrateArticles";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/servizi" element={<Servizi />} />
        <Route path="/blog/*" element={<Blog />} />
        <Route path="/blog/:slug" element={<DettaglioArticolo />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="/pubblicazioni" element={<Pubblicazioni />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route
          path="/registrazione-preliminare"
          element={<RegistrazionePreliminare />}
        />
        <Route path="/successioni-servizio" element={<SuccessioniServizio />} />
        <Route path="/consulenza-fiscale" element={<ConsulenzaFiscale />} />
        <Route
          path="/dichiarazione-redditi"
          element={<DichiarazioneRedditi />}
        />
        <Route
          path="/pianificazione-fiscale"
          element={<PianificazioneFiscale />}
        />
        <Route path="/contabilita-aziendale" element={<ContabilitaFiscale />} />
        <Route
          path="/assistenza-controlli"
          element={<AssistenzaControlliFiscali />}
        />
        <Route path="/contratto-locazione" element={<ContrattoLocazione />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/editor" element={<AdminEditor />} />
        <Route path="/admin/editor/:id" element={<AdminEditor />} />
        <Route path="/admin/migrate" element={<MigrateArticles />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;