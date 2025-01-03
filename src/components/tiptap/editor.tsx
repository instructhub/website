"use client";

import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  EditorContent,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "@/css/highlight.css";

import CustomCodeBlock from "./custom-block";
import Toolbar from "./toolbar";
import { useEffect } from "react";

const lowlight = createLowlight(all);

interface TiptapEditorProps {
  content?: string;  // Change defaultValue to value for controlled component
  onUpdate?: (content: string) => void;
}

export default function TiptapEditor({
  content = "",  // Default to empty string if no value is passed
  onUpdate,
}: TiptapEditorProps) {
  const codeBlockLowLight = CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CustomCodeBlock);
    },
  }).configure({
    lowlight: lowlight,
  });

  // Create the editor instance with value prop as initial content
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Write something interesting for learners!",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        inline: true,
      }),
      codeBlockLowLight,
      Underline,
    ],

    content: content, // Set the initial content to value from the parent
    editorProps: {
      attributes: {
        class: "relative focus:outline-none p-6 rounded-md min-h-36",
      },
    },
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      if (onUpdate) {
        const content = editor.getHTML();
        onUpdate(content);  // Notify the parent about the updated content
      }
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
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
