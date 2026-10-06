"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp?: number;
};

const STORAGE_KEY = "travelly_cookie_consent";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 600);

      return () => clearTimeout(timer);
    }

  }, []);



  const saveConsent = (preferences: CookiePreferences) => {
    const data = {
      ...preferences,
      timestamp: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    setIsVisible(false);
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    });
  };

  const handleReject = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    });
  };

 

  if (!isVisible && !isModalOpen) return null;

  return (
    <>
      {isVisible && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Consentimiento de cookies"
          className="
            fixed
            inset-x-0
            bottom-0
            z-[9999]
            border-t
            border-line
            bg-paper
            px-4
            py-4
            text-ink
            shadow-[0_-8px_30px_rgba(0,0,0,0.06)]
            sm:px-6
            sm:py-5
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-[1100px]
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:gap-6
            "
          >
            <p
              className="
                min-w-0
                text-[13px]
                leading-relaxed
                text-soft
                sm:flex-1
                sm:text-sm
              "
            >
              Usamos cookies propias y de terceros para mejorar tu
              experiencia, analizar el uso del sitio y personalizar Travy.
              Puedes aceptar todas, rechazar las no esenciales o
              configurarlas.{" "}
              <Link
                to="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  whitespace-nowrap
                  text-ink
                  underline
                  underline-offset-2
                  hover:opacity-70
                "
              >
                Más información
              </Link>
            </p>

            <div
              className="
                grid
                w-full
                grid-cols-2
                gap-2
                sm:flex
                sm:w-auto
                sm:shrink-0
                sm:gap-3
              "
            >
              <button
                onClick={handleReject}
                className="
                  min-h-11
                  rounded-full
                  px-4
                  py-2.5
                  btn
                  sec2
                  text-sm
                  sm:px-5
                "
              >
                Rechazar
              </button>

              <button
                onClick={handleAcceptAll}
                className="
                  min-h-11
                  rounded-full
                  px-4
                  py-2.5
                  btn-primary
                  text-sm
                  sm:px-5
                "
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}