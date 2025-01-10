"use client";

import { useParams, useRouter } from "next/navigation";
import { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Course, CourseStep } from "@/types/courses";

interface StepListProps {
  course: Course;
  setCourse: (updatedCourse: Course) => void;
  step: CourseStep;
  moduleID: string;
}

export function StepList({
  course,
  step,
  moduleID,
}: StepListProps) {
  const params = useParams<{
    courseID: string;
    moduleID: string;
    stepID: string;
  }>();
  const router = useRouter();

  const changeParams = () => {
    router.push(
      `/courses/${course.id}/${moduleID}/${step.id}`,
    );
  };

  return (
    <div
      className={cn(
        "flex justify-between steps-start hover:bg-base hover:border-l-4 hover:border-base border-l-4 border-crust rounded-md transition-colors duration-300 ease-in-out",
        {
          "bg-base border-l-4 border-lavender hover:border-lavender":
            params.moduleID === moduleID &&
            params.stepID === step.id,
        },
      )}
    >
      <div
        className="pl-5 p-2 rounded-md space-y-1 grow select-none cursor-pointer"
        onClick={() => changeParams()}
      >
        <div className="text-text flex space-x-2">
          <Icon
            icon="lucide:book-open"
            width="1rem"
            height="1rem"
            className="shrink-0 mt-0.5"
          />
          <div className="text-wrap flex-1">{step.name}</div>
        </div>
        <p className="text-subtext0 text-xs">2 mins</p>
      </div>
    </div>
  );
}
