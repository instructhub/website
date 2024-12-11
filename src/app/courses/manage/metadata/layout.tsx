import { Icon } from "@iconify/react";

import TiptapEditor from "@/components/tiptap/editor";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function CoursesMetadata({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="container p-2 flex">
        <div>
          <div className="flex-col space-y-1 w-52">
            <p className="font-bold text-lg text-text">Course infomation</p>
            <button className="p-2 pl-3 flex space-x-2 items-center hover:border-l-4 hover:border-lavender border-l-4 border-base">
              <Icon icon="lucide:circle" className="text-lg" />
              <p className="text-md text-text">Overview</p>
            </button>
            <button className="p-2 pl-3 flex space-x-2 items-center hover:border-l-4 hover:border-lavender border-l-4 border-base">
              <Icon icon="lucide:circle" className="text-lg" />
              <p className="text-md text-text">Target learners</p>
            </button>

            <button className="p-2 pl-3 flex space-x-2 items-center hover:border-l-4 hover:border-lavender border-l-4 border-base">
              <Icon icon="lucide:circle" className="text-lg" />
              <p className="text-md text-text">Detail</p>
            </button>
            <button className="p-2 pl-3 flex space-x-2 items-center hover:border-l-4 hover:border-lavender border-l-4 border-base">
              <Icon icon="lucide:circle" className="text-lg" />
              <p className="text-md text-text">Landing page</p>
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
