import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Integra Finance - Consulenza del Credito
        </p>
        <p className="text-xs md:text-sm mt-2">Palermo, Italia</p>
      </div>
    </footer>
  );
};

export default Footer;
