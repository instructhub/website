"use client";

import TiptapEditor from "@/components/tiptap/editor";
import { Input } from "@/components/ui/input";


export default function CoursesHomePage() {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="container p-2">
        <div className="max-w-screen-lg mx-auto">
          <TiptapEditor />
        </div>
      </div>
    </div>
  );
}
