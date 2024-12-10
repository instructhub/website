import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { Editor } from "@tiptap/react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { ToggleGroup } from "../ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ToolbarProps {
  editor: Editor;
}

export default function Toolbar({ editor }: ToolbarProps) {
  return (
    <div className="p-2 bg-surface0 flex items-center space-x-2">
      <ToggleGroup
        type="multiple"
        className="space-x-1 flex flex-wrap min-h-full"
      >
        {/* Undo */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="disabled:text-overlay0 disabled:cursor-not-allowed"
            >
              <Icon icon="lucide:undo" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Redo */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="disabled:text-overlay0 disabled:cursor-not-allowed"
            >
              <Icon icon="lucide:redo" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-overlay0 h-4 w-0.5" />

        {/* paragraph */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`p-1 rounded-md  ${
                editor.isActive("paragraph")
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:pilcrow" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Paragraph</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* H1 */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 1 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:heading-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 1</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* H2 */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 2 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:heading-2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 2</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* H3 */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 3 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:heading-3" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 3</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-overlay0 h-4 w-0.5" />

        {/* Bold */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded-md  ${
                editor.isActive("bold") ? "text-blue bg-overlay0" : "text-text"
              }`}
            >
              <Icon icon="lucide:bold" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Italic */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded-md  ${
                editor.isActive("italic")
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:italic" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Underline */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded-md  ${
                editor.isActive("underline")
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:underline" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Code */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1 rounded-md  ${
                editor.isActive("code") ? "text-blue bg-overlay0" : "text-text"
              }`}
            >
              <Icon icon="lucide:code" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* quote */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded-md  ${
                editor.isActive("blockquote")
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:quote" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Quote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-overlay0 h-4 w-0.5" />

        {/* Bullet List */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded-md ${
                editor.isActive("bulletList")
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:list" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Ordered List */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded-md ${
                editor.isActive("orderedList")
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:list-ordered" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Ordered List</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-overlay0 h-4 w-0.5" />

        {/* Image */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Icon icon="lucide:file-image" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Video */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Icon icon="lucide:file-video" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Video</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Code block */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1 rounded-md  ${
                editor.isActive("codeBlock")
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:file-code" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Code block</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Link */}
        <Link editor={editor} />

        {/* Divider */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Icon icon="pepicons-pop:line-x" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Divider</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ToggleGroup>
    </div>
  );
}

function Link({ editor }: ToolbarProps) {
  const [link, setLink] = useState("");

  const changeLinkValue = () => {
    const { from } = editor.view.state.selection;
    const linkNode = editor.state.doc.nodeAt(from);
    setLink(linkNode?.marks[0]?.attrs?.href || "");
  };

  return (
    <DropdownMenu onOpenChange={() => changeLinkValue()}>
      <DropdownMenuTrigger
        className={`p-1 rounded-md focus:outline-none  ${
          editor.isActive("link", { level: 4 })
            ? "text-blue bg-overlay0"
            : "text-text"
        }`}
      >
        <Icon icon="lucide:link-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <Input
          startAdornment={<Icon icon="lucide:link" />}
          onChange={(e) => setLink(e.target.value)}
          value={link}
          placeholder="Please enter link"
        />
        <div className="pt-2 flex justify-end space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              editor.commands.unsetLink();
              setLink("");
            }}
          >
            Remove
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              editor.commands.setLink({ href: link, target: "_blank" });
            }}
          >
            Insert
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ImageUpload({ editor }: ToolbarProps) {
  
}
