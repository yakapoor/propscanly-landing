import React from "react";
import SkylineAnimation from "./SkylineAnimation"; // Import the SkylineAnimation component
import logo from "./logo.png"; // Import logo from src folder

export default function LandingPage() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(to bottom, #3b82f6, #6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Logo at the top-left */}
      <img
        src={logo} // Use imported logo
        alt="Propscanly"
        style={{
          width: "400px", // Adjust logo size as needed
          zIndex: 30, // Ensure logo appears above other content
        }}
      />
      {/* Add the skyline animation */}
      <SkylineAnimation />
    </div>
  );
}
