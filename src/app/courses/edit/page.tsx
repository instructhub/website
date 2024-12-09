"use client";

import TiptapEditor from "@/components/tiptap/editor";


export default function CoursesHomePage() {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="container">
        <div className="max-w-screen-lg mx-auto">
          <TiptapEditor />
        </div>
      </div>
    </div>
  );
}
