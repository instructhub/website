"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Toolbar from "./toolbar";

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Write something interesting for learners!",
      }),
    ],
    content: "<p>Welcome to Tiptap</p>",
    editorProps: {
      attributes: {
        class:
          "relative focus:outline-none p-6 rounded-md min-h-36",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="container">
        <div className="max-w-screen-lg mx-auto border-2 border-overlay0 rounded-md">
          {/* Editor container with toolbar */}
          <div className="relative rounded-md overflow-hidden border-overlay0">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 bg-base shadow-sm">
            <Toolbar editor={editor} />
            </div>

            {/* Editor */}
            <EditorContent
              editor={editor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
