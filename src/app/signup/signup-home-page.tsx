"use client";

import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useQueryState } from "nuqs";

import { getCookie } from "cookies-next/client";
import { useState } from "react";
import { ClassNameValue } from "tailwind-merge";

import { Icon } from "@iconify/react";

interface SignupButton {
  href: string;
  message: string;
  class: ClassNameValue;
  icon: JSX.Element;
}

const SignupButtonData: SignupButton[] = [
  {
    href: "google",
    message: "google",
    class: "bg-google hover:bg-google/80",
    icon: <Icon icon="cib:google" className="text-lg" />,
  },
  {
    href: "github",
    message: "github",
    class: "bg-github hover:bg-github/80",
    icon: <Icon icon="cib:github" className="text-lg" />,
  },
  {
    href: "gitlab",
    message: "gitlab",
    class: "bg-gitlab hover:bg-gitlab/80",
    icon: <Icon icon="cib:gitlab" className="text-lg" />,
  },
];

const SignupModal = () => {
  const [stage, setStage] = useQueryState("stage");
  const t = useTranslations("Auth");

  // Handle opening the popup for OAuth
  const openPopup = (authUrl: string) => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      authUrl,
      "Oauth",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    const checkConnect = setInterval(() => {
      try {
        if (popup?.location?.href.includes("callback")) {
          popup.close();
          // Check if cookie are set and redirect
          const accessToken = getCookie("access_token");
          if (accessToken) {
            // TODO: redirect to browser page or personal page
            redirect("/");
          }
          clearInterval(checkConnect);
        }
      } catch (e) {}
    }, 100);
  };

  // Handle redirect when email signup is clicked
  const handleEmailSignup = () => {
    setStage("emailmodal");
  };

  return (
    <div className="bg-crust py-8 px-4 shadow-lg h-fit rounded-xl w-full pb-5">
      <div className="text-title text-center mb-6 font-bold text-xl">
        {t("signup.title")}
      </div>

      {/* Use a map to render all third-party login methods */}
      <div className="grid grid-flow-row gap-3 px-2">
        {SignupButtonData.map((button) => (
          <button
            key={button.href}
            className={`w-full h-10 flex justify-center items-center gap-x-2 rounded-lg cursor-pointer font-bold text-white ${button.class}`}
            onClick={() =>
              openPopup(
                `${process.env.NEXT_PUBLIC_API_BASEURL}/auth/oauth/${button.href}`,
              )
            }
          >
            {button.icon}
            {t(button.message)}
          </button>
        ))}
      </div>

      {/* Line */}
      <div className="mx-[10px] h-[1px] bg-text my-4" />

      {/* Email Signup */}
      <div className="px-2">
        <button
          className="w-full h-10 flex justify-center items-center gap-x-2 rounded-lg cursor-pointer font-bold bg-surface1 hover:bg-surface1/80"
          onClick={handleEmailSignup}
        >
          <Icon icon="lucide:mail" className="text-lg" />
          {t("continue_email")}
        </button>
      </div>
    </div>
  );
};

export default SignupModal;
