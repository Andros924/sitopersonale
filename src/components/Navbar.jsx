import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-900 p-4">
      <div className="container mx-auto flex justify-center items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Integra Finance | Consulente del Credito
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
