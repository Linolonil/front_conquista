import React from "react";

export default function Footer({ bg = "bg-light", text = "text-dark" }) {
  return (
    <footer className={` ${bg} ${text} text-center py-3`}>
      <p>&copy; Conquista Lanche & Grill 2023.</p>
    </footer>
  );
}
