// components/AuthPageLayout.tsx
import { useTranslations } from "next-intl";
import Image from "next/image";

import React from "react";

// import SelectLanguage from "../select-language";
// import { ToggleTheme } from "../toggle-theme";

const Header: React.FC = () => {
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border flex justify-center">
      <div className="container justify-between flex">
        <div className="flex h-14 items-center px-4">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="InstructHub logo"
          />
        </div>
        <div className="flex h-14 items-center px-4 space-x-2">
          <a href="/login">
            <button className="px-4 py-1 rounded-lg bg-transparent border-surface1 border-2 hover:bg-surface1/50 font-bold transition-ease-in-out">
              {t("Auth.login.login")}
            </button>
          </a>
          <a href="/signup">
            <button className="px-4 py-1 rounded-lg bg-surface1 border-surface1 border-2 hover:bg-surface0 hover:border-surface0 font-bold transition-ease-in-out">
              {t("Auth.signup.signup")}
            </button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
