import React, { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const CustomCodeBlock = (props: NodeViewProps) => {
  const [copied, setCopied] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("");
  const { updateAttributes, extension, node } = props;
  const content = node.textContent || "auto";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <NodeViewWrapper className="code-block bg-crust rounded-md">
      <div className="relative p-4">
        {/* Top bar */}
        <div className="absolute m-3 top-0 right-0 flex space-x-1">
          <p className="text-subtext0 p-1 select-none text-sm">
            {currentLanguage}
          </p>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger
                onClick={copyToClipboard}
                className="text-md p-1 rounded-md hover:bg-surface0"
              >
                {copied ? (
                  <Icon icon="lucide:copy-check" className="text-green" />
                ) : (
                  <Icon icon="lucide:copy" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p> {copied ? "Copied" : "Copy"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Code block */}
        <pre>
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
};

export default CustomCodeBlock;
