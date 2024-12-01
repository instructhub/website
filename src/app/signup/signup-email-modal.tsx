"use client";

import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";

const EmailSignupSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Auth.error.username_too_short" })
      .max(30, { message: "Auth.error.username_too_long" })
      .regex(/^[a-zA-Z0-9._]+$/, { message: "Auth.error.username_not_valid" }),
    email: z.string().email({ message: "Auth.error.email_not_valid" }),
    password: z.string().min(8, { message: "Auth.error.password_min_length" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Auth.error.password_do_not_match",
    path: ["confirmPassword"],
  });

type EmailSignupForm = z.infer<typeof EmailSignupSchema>;

const SignupEmailModal = () => {
  const [stage, setStage] = useQueryState("stage");

  const [signupLoading, setSignupLoading] = useState(false);
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailSignupForm>({
    resolver: zodResolver(EmailSignupSchema),
  });

  const handleSignup = async (values: EmailSignupForm) => {
    try {
      setSignupLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASEURL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      setSignupLoading(false);

      const data = await response.json();

      if (response.ok) {
        setStage("verifymodal");
        return;
      } else if (response.status > 500) {
        throw new Error(data.message);
      }

      if (data.message === "Email already been used") {
        setError("email", { message: "Auth.error.email_already_been_used" });
      } else if (data.message === "Username already been used") {
        setError("username", {
          message: "Auth.error.username_already_been_used",
        });
      }
    } catch (error) {
      toast(t("Global.error.unexpected_error"), {
        description: (
          <div>
            <pre className="bg-crust text-text p-2 rounded-lg">
              <code>{`${error}`}</code>
            </pre>
          </div>
        ),
      });
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-crust pt-5 px-6 shadow-lg h-fit rounded-3xl w-full pb-5">
        <div className="text-title text-center mb-5 font-bold text-2xl">
          {t("Auth.signup.create_new_account")}
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit(handleSignup)}>
          <div>
            <Input
              {...register("username")}
              placeholder={t("Auth.username")}
              className="font-semibold"
              startAdornment={
                <Icon icon="lucide:user-round" className="text-text w-5 h-5" />
              }
              type="text"
            />
            {errors.username && (
              <p className="pt-1 text-red text-sm">
                {t(errors.username.message)}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("email")}
              placeholder={t("Auth.email")}
              className="font-semibold"
              startAdornment={
                <Icon icon="lucide:mail" className="text-text w-5 h-5" />
              }
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
              className="font-semibold"
              startAdornment={
                <Icon
                  icon="lucide:lock-keyhole"
                  className="text-text w-5 h-5"
                />
              }
              type="password"
            />
            {errors.password && (
              <p className="pt-1 text-red text-sm">
                {t(errors.password.message)}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("confirmPassword")}
              placeholder={t("Auth.confirm_password")}
              className="font-semibold"
              startAdornment={
                <Icon
                  icon="lucide:lock-keyhole"
                  className="text-text w-5 h-5"
                />
              }
              type="password"
            />
            {errors.confirmPassword && (
              <p className="pt-1 text-red text-sm">
                {t(errors.confirmPassword.message)}
              </p>
            )}
          </div>

          {/*line*/}
          <div className="mx-[4px] h-[1px] bg-text my-4" />

          <button
            type="submit"
            className="w-full h-10 flex justify-center items-center gap-2 rounded-lg cursor-pointer font-bold text-surface0 bg-green hover:bg-green/80 disabled:cursor-not-allowed"
            disabled={signupLoading}
          >
            {signupLoading ? (
              <Icon
                icon="lucide:loader"
                className="text-xl animate-loading text-surface0"
              />
            ) : (
              <Icon icon="lucide:log-in" className="text-xl" />
            )}
            <span>{t("Auth.signup.signup")}</span>
          </button>
        </form>
      </div>
      <a
        className="mt-4 text-center text-blue font-bold"
        onClick={() => setStage("index")}
      >
        {t("Auth.signup.email.other_option")}
      </a>
    </div>
  );
};

export default SignupEmailModal;
