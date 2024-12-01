"use client";
import { Locale } from "@/i18n/config";
import { setUserLocale, getUserLocale } from "@/service/locale";
import { useState, useTransition } from "react";
import { Select, SelectContent, SelectTrigger, SelectItem } from "./ui/select";
import { Icon } from "@iconify/react";
import { useLocale } from "next-intl";

export default function SelectLanguage() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  function onChange(value: string) {
    const locale = value as Locale;
    console.log(locale);
    startTransition(() => {
      setUserLocale(locale);
    });
  }
  return (
    <Select onValueChange={(value) => onChange(value)} defaultValue={locale}>
      <SelectTrigger className="border-none w-6 h-6 p-0 bg-transparent select-none">
        <Icon
          icon="lucide:languages"
          className="w-6 h-6 text-green select-none "
        />
      </SelectTrigger>
      <SelectContent className="select-none">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="zh-tw">繁體中文</SelectItem>
      </SelectContent>
    </Select>
  );
}
