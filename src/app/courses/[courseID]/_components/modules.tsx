import { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Course, CourseModule } from "@/types/courses";

import { StepList } from "./steps";

interface ModuleProps {
  module: CourseModule;
  course: Course;
  setCourse: (course: Course) => void;
}

export function Module({
  module,
  course,
  setCourse,
}: ModuleProps) {
  return (
    <AccordionItem
      key={module.position}
      value={`step-${module.position}`}
      className="my-2"
    >
      <div className="flex w-full grow">
        <AccordionTrigger className="hover:no-underline py-0 px-3 hover:bg-base text-left rounded-md w-full mb-2">
          <p className="px-3 py-1 text-left rounded-md text-md font-bold mr-1">
            {module.name}
          </p>
        </AccordionTrigger>
      </div>

      <AccordionContent className="pl-4 flex-col pb-0 space-y-2">
        {module.courseSteps?.map((step, stepID) => (
          <StepList
            course={course}
            setCourse={setCourse}
            step={step}
            moduleID={module.id || ""}
            key={step.id}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
