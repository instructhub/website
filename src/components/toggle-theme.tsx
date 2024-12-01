"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";

export function ToggleTheme() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      className="w-6 h-6"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? (
        <Icon icon="lucide:moon" className="w-6 h-6 text-peach" />
      ) : (
        <Icon icon="lucide:sun" className="w-6 h-6 text-peach" />
      )}
    </button>
  );
}
