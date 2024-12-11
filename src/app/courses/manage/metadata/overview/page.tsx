"use client";

import { Icon } from "@iconify/react";

import TiptapEditor from "@/components/tiptap/editor";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function CoursesHomePage() {
  return (
    <div className="grow flex-col flex">
      <div className="bg-mantle rounded-md p-5">
        <div className="w-full flex-col sapce-y-2">
          <p className="text-3xl font-bold">Overview</p>
          <Separator className="mb-5" />
          <div className="space-y-5 flex flex-col">
            <div className="space-y-2">
              <p className="text-md font-semibold">Course name</p>

              <Input placeholder="Example: Learn golang by build a webapp" />
              <p className="text-md text-subtext0">
                Course names should be eye-catching, clear, easy to find, and
                should try not to overlap with other course names.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-md font-semibold">Description</p>
              <Input placeholder="Example: In this course your will learn about how to use golang to create a fully functional webapp" />

              <p className="text-md text-subtext0">
                The description should be sort and can read in 10 seconds
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex "></div>
    </div>
  );
}
