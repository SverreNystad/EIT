import React from "react";

export const Applegoogle = () => {
  return (
    <div className="flex flex-col gap-4"> 
      {/* Apple App Store badge link */}
      <a
        href="https://www.apple.com/no/app-store/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="apple.png"
          alt="Download on the App Store"
          className="h-12"
        />
      </a>

      {/* Google Play badge link */}
      <a
        href="https://play.google.com/store/games"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="googleplay.png"
          alt="Get it on Google Play"
          className="h-12"
        />
      </a>
    </div>
  );
}
