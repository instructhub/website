"use client";

import { useTranslations } from "next-intl";
import { redirect, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { z } from "zod";

import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";

interface LoginButton {
  href: string;
  message: string;
  class: string;
  icon: JSX.Element;
}

const LoginButtonData: LoginButton[] = [
  {
    href: "google",
    message: "Auth.google",
    class: "bg-google hover:bg-google/80",
    icon: <Icon icon="cib:google" className="text-lg" />,
  },
  {
    href: "github",

    message: "Auth.github",
    class: "bg-github hover:bg-github/80",
    icon: <Icon icon="cib:github" className="text-lg" />,
  },
  {
    href: "gitlab",
    message: "Auth.gitlab",
    class: "bg-gitlab hover:bg-[#E2432A]/80",
    icon: <Icon icon="cib:gitlab" className="text-lg" />,
  },
];

const LoginSchema = z.object({
  email: z.string().email("Auth.error.email_not_valid"),
  password: z.string().min(8, "Auth.error.password_min_length"),
});

type LoginForm = z.infer<typeof LoginSchema>;

const LoginModal = () => {
  const t = useTranslations();
  const [verify, setVerify] = useQueryState("verify");
  const router = useRouter();

  const [loginLoading, setLoginLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (verify === "true") {
      setTimeout(() => {
        toast.success(t("Auth.login.verify_successful"), {
          description: t("Auth.login.verify_successful_content"),
        });
      }, 100);
    } else if (verify === "false") {
      setTimeout(() => {
        toast.error(t("Auth.error.verify_error"), {
          description: t("Auth.error.verify_error_content"),
        });
      }, 100);
    }
    // TODO: Check if already logged in
  }, [verify, t]);

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
            router.push("/");
          }
        }
      } catch (e) {}
    }, 100);
  };

  const handleLogin: SubmitHandler<LoginForm> = async (values) => {
    try {
      setLoginLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASEURL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      setLoginLoading(false);

      const data = await response.json();

      if (response.ok) {
        // Check if cookie are set and redirect
        const accessToken = getCookie("access_token");
        if (accessToken) {
          // TODO: redirect to browser page or personal page
          router.push("/");
        }
      } else if (response.status === 400) {
        setError("password", { message: "Auth.error.login_error" });
        setError("email", { message: "Auth.error.login_error" });
        return;
      } else if (response.status > 500) {
        throw new Error(data.message);
      }

      if (!data.result.verify) {
        window.location.href = "/signup?stage=verifymodal";
      }
    } catch (error) {
      toast.error(t("Global.error.unexpected_error"), {
        description: (
          <div>
            <pre className="bg-crust text-text p-2 rounded-lg">
              <code>{`${error}`}</code>
            </pre>
          </div>
        ),
      });
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-crust py-8 px-4 shadow-lg rounded-xl w-full">
        <h2 className="text-title text-center mb-6 font-bold text-xl">
          {t("Auth.login.title")}
        </h2>
        <div className="grid grid-flow-row gap-3 px-2">
          {LoginButtonData.map((button) => (
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

        <div className="flex justify-center items-center my-4">
          <div className="w-[40%] h-[1px] bg-text" />
          <span className="px-2 font-bold text-text">{t("Global.or")}</span>
          <div className="w-[40%] h-[1px] bg-text" />
        </div>

        <form
          className="flex flex-col gap-3 px-2"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div>
            <Input
              {...register("email")}
              placeholder={t("Auth.login.email")}
              startAdornment={
                <Icon icon="lucide:mail" className="text-text w-5 h-5" />
              }
              className="font-semibold"
              type="email"
            />
            {errors.email && (
              <p className="pt-1 text-red text-sm">{t(errors.email.message)}</p>
            )}
          </div>
          <div>
            <Input
              {...register("password")}
              placeholder={t("Auth.password")}
              startAdornment={
                <Icon
                  icon="lucide:lock-keyhole"
                  className="text-text w-5 h-5"
                />
              }
              className="font-semibold"
              type="password"
            />

            {errors.password && (
              <p className="pt-1 text-red text-sm">
                {t(errors.password.message)}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full h-10 flex justify-center items-center rounded-lg text-surface0 bg-green hover:bg-green/80 font-semibold"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <Icon icon="lucide:loader" className="animate-spin text-xl" />
            ) : (
              <Icon icon="lucide:log-in" className="text-xl" />
            )}
            <p className="pl-2">{t("Auth.login.login")}</p>
          </button>
        </form>
      </div>
      <a href="/forgot-password" className="mt-4 text-blue font-bold">
        {t("Auth.login.forgot_your_password")}
      </a>
    </div>
  );
};

export default LoginModal;
