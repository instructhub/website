"use client";

import TiptapEditor from "@/components/tiptap/editor";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./edit-sidebar";

export default function CoursesHomePage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <div className="w-full flex justify-center mt-10">
        <div className="container p-2">
          <div className="max-w-screen-lg mx-auto">
            <div>
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
                Stage title name
              </h2>
              <Input placeholder="Enter stage title.." />
            </div>
            <TiptapEditor />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
