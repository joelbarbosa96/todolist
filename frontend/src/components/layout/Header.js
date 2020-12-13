import React from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../auth/AuthOptions";

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <h1 className="header-title">EDirectInsure Todo List</h1>
      </Link>
      <AuthOptions></AuthOptions>
    </header>
  );
}

export default Header;
