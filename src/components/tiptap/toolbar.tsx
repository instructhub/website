import { Icon } from "@iconify/react";
import { Editor } from "@tiptap/react";

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
        {/* paragraph */}
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
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 3 })
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
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 3 })
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

        {/* H4 */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:heading-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-overlay0 h-4 w-0.5" />

        {/* Bold */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:bold" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Italic */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:italic" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Underline */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:underline" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Code */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:code" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-overlay0 h-4 w-0.5" />

        {/* Color */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:baseline" />{" "}
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Code */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:code" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Code */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:code" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Code */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded-md  ${
                editor.isActive("heading", { level: 4 })
                  ? "text-blue bg-overlay0"
                  : "text-text"
              }`}
            >
              <Icon icon="lucide:code" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Header 4</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ToggleGroup>
    </div>
  );
}
