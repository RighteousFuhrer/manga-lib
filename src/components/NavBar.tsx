import React, { useEffect, useState } from "react";
import "./NavBar.scss";

export default function NavBar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    setVisible(prevScrollPos > currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <div
      style={{
        position: "fixed",
        height: "60px",
        width: "100%",
        margin: "0 auto",
        backgroundColor: "grey",
        textAlign: "center",
        transition: "top 0.4s",
        zIndex: 2,
        top: visible ? "0" : "-60px",
      }}
    >
      Some Company Inc.
    </div>
  );
}
