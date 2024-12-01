"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next/client';

const SignupVerifyModal = () => {
  const router = useRouter();
  const [reciprocal, setReciprocal] = useState(0);
  const [message, setMessage] = useState("");
  const t = useTranslations();

  const verify = async (endpoint: string): Promise<boolean> => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data.data.verify;
    } catch (error) {
      console.error("Verification failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setReciprocal((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const verifyInterval = setInterval(async () => {
      const userID = getCookie("userID");
      if (!userID) {
        clearInterval(interval);
        clearInterval(verifyInterval);
        setMessage(t("Auth.error.try_to_login_first") || "");
        return;
      }

      const isVerifiedNow = await verify(
        `${process.env.NEXT_PUBLIC_API_BASEURL}/auth/email/verify/check/${userID}`,
      );

      if (isVerifiedNow) {
        setMessage(t("Auth.signup.email.verify.successful_verify") || "");
        setTimeout(() => {
            router.push("/login?verify=true");
        }, 2000);
      }
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(verifyInterval);
      setMessage(t("Auth.error.error_check_email_verify") || "");
    };
  }, [router, t]);

  const handleResend = async () => {
    const userID = router.push("userID");
    const resendingToast = toast.loading(
      t("Auth.signup.email.verify.resending_title"),
    );

    try {
      setReciprocal(-1);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASEURL}/auth/email/verify/resend/${userID}`,
        { method: "POST" },
      );

      const data = await response.json();
      setReciprocal(60);

      if (response.ok) {
        toast.success(t("Auth.signup.email.verify.successful_resend"), {
            id: resendingToast
        });
        return;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(t("Global.error.unexpected_error"), {
        id: resendingToast,
        description: <pre>{`${error}`}</pre>,
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-crust pt-5 px-6 shadow-lg h-fit rounded-3xl w-full pb-5 flex flex-col gap-6">
        <div className="text-title text-center font-bold text-2xl">
          {t("Auth.signup.email.verify.verify_email")}
        </div>
        <div className="text-subtext0 text-center font-bold text-sm">
          {t("Auth.signup.email.verify.send")}
        </div>
        <div className="text-subtext0 text-center font-bold text-sm">
          {t("Auth.signup.email.verify.check")}
        </div>
        <div className="text-subtext0 text-center font-bold text-sm">
          {t("Auth.signup.email.verify.auto")}
        </div>
        <div className="flex flex-row gap-x-2 items-center justify-center">
          <div className="text-subtext0 text-center font-bold text-sm">
            {t("Auth.signup.email.verify.received")}
          </div>
          <button
            onClick={handleResend}
            disabled={reciprocal !== 0}
            className="text-blue text-center font-bold text-sm disabled:cursor-not-allowed"
          >
            {t("Auth.signup.email.verify.resend")}
          </button>
          {reciprocal > 0 && (
            <div className="text-subtext0 text-center font-bold text-xs">
              ({reciprocal} {t("Global.unit.sec")})
            </div>
          )}
        </div>

        {message === "" ? (
          <button className="w-full h-10 flex justify-center items-center gap-2 rounded-lg cursor-pointer font-bold text-surface0 bg-green hover:bg-green/80">
            <Icon
              icon="lucide:loader"
              className="text-xl animate-loading text-surface0"
            />
            <span>{t("Auth.signup.email.verify.pending")}</span>
          </button>
        ) : (
          <p className="flex justify-center items-center text-green font-bold text-md">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupVerifyModal;
