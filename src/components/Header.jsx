import React, { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div style={{display: "flex", alignItems: "center", gap: 12}}>
        <img src="https://i.imgur.com/t8UWYN3.png" alt="SignSense" style={{height: 36, borderRadius: 6}} />
        <a href="/" style={{fontSize: 20, color: "#fff", textDecoration: "none"}}>SignSense</a>
      </div>

      <nav style={{marginTop: 8}}>
        <a href="/" style={{marginRight: 12}}>Home</a>
        <a href="/contact.html">Contact</a>
      </nav>
    </header>
  );
}
