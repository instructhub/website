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

const stepNameSchema = z.object({
  name: z
    .string()
    .min(5, "Step name must be at least 5 characters long")
    .max(100, "Step name must not exceed 50 characters"),
});

type stepNameForm = z.infer<typeof stepNameSchema>;

interface StepListProps {
  course: Course;
  setCourse: (updatedCourse: Course) => void;
  step: CourseStep;
  stepIndex: number;
  moduleIndex: number;
}

export function StepList({
  course,
  setCourse,
  step,
  stepIndex,
  moduleIndex,
}: StepListProps) {
  const params = useParams<{
    courseID: string;
    moduleIndex: string;
    stepIndex: string;
  }>();
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<stepNameForm>({
    resolver: zodResolver(stepNameSchema),
  });

  const MoveStepUp = () => {
    // Ensure course.courseModules and courseSteps exist for the given module and step indices
    if (
      course.courseModules &&
      course.courseModules[moduleIndex] &&
      course.courseModules[moduleIndex].courseSteps &&
      stepIndex > 0 // Ensure the step is not already at the top
    ) {
      const updatedCourseModules = [...course.courseModules]; // Create a copy of courseModules
      const courseSteps = [...updatedCourseModules[moduleIndex].courseSteps!]; // Copy courseSteps for the module

      // Swap the current step with the previous one
      const temp = courseSteps[stepIndex];
      courseSteps[stepIndex] = courseSteps[stepIndex - 1];
      courseSteps[stepIndex - 1] = temp;

      // Update positions for the swapped steps
      courseSteps[stepIndex].position = stepIndex + 1;
      courseSteps[stepIndex - 1].position = stepIndex;

      // Update the specific courseModule with the reordered steps
      updatedCourseModules[moduleIndex] = {
        ...updatedCourseModules[moduleIndex],
        courseSteps,
      };

      // Update the course state
      setCourse({
        ...course,
        courseModules: updatedCourseModules,
      });
    }
  };

  const MoveStepDown = () => {
    // Ensure courseModules and courseSteps exist, and stepIndex is valid
    if (
      course.courseModules &&
      course.courseModules[moduleIndex] &&
      course.courseModules[moduleIndex].courseSteps &&
      stepIndex < course.courseModules[moduleIndex].courseSteps!.length - 1
    ) {
      const updatedCourseModules = [...course.courseModules]; // Create a copy of courseModules
      const updatedCourseSteps = [
        ...(updatedCourseModules[moduleIndex].courseSteps || []),
      ]; // Copy courseSteps

      // Swap the current step with the next one
      const temp = updatedCourseSteps[stepIndex];
      updatedCourseSteps[stepIndex] = updatedCourseSteps[stepIndex + 1];
      updatedCourseSteps[stepIndex + 1] = temp;

      // Update the course module
      updatedCourseModules[moduleIndex] = {
        ...updatedCourseModules[moduleIndex],
        courseSteps: updatedCourseSteps,
      };

      // Update the course state
      setCourse({
        ...course,
        courseModules: updatedCourseModules,
      });
    }
  };

  const DeleteStep = () => {
    // Ensure courseModules and courseSteps exist
    if (
      course.courseModules &&
      course.courseModules[moduleIndex] &&
      course.courseModules[moduleIndex].courseSteps &&
      stepIndex >= 0 &&
      stepIndex < course.courseModules[moduleIndex].courseSteps!.length
    ) {
      const updatedCourseModules = [...course.courseModules]; // Create a copy of courseModules
      const updatedCourseSteps = [
        ...(updatedCourseModules[moduleIndex].courseSteps || []),
      ]; // Copy courseSteps

      // Remove the step at the specified index
      updatedCourseSteps.splice(stepIndex, 1);

      // Update the course module
      updatedCourseModules[moduleIndex] = {
        ...updatedCourseModules[moduleIndex],
        courseSteps: updatedCourseSteps,
      };

      // Update the course state
      setCourse({
        ...course,
        courseModules: updatedCourseModules,
      });
    }
  };

  const RenameStep = (data: { name: string }) => {
    // Ensure courseModules and courseSteps exist
    if (
      course.courseModules &&
      course.courseModules[moduleIndex] &&
      course.courseModules[moduleIndex].courseSteps &&
      stepIndex >= 0 &&
      stepIndex < course.courseModules[moduleIndex].courseSteps!.length
    ) {
      const updatedCourseModules = [...course.courseModules]; // Create a copy of courseModules
      const updatedCourseSteps = [
        ...(updatedCourseModules[moduleIndex].courseSteps || []),
      ]; // Copy courseSteps

      // Update the name of the step at the specified index
      updatedCourseSteps[stepIndex] = {
        ...updatedCourseSteps[stepIndex],
        name: data.name,
      };

      // Update the course module
      updatedCourseModules[moduleIndex] = {
        ...updatedCourseModules[moduleIndex],
        courseSteps: updatedCourseSteps,
      };
      // Update the course state
      setCourse({
        ...course,
        courseModules: updatedCourseModules,
      });
      setRenameModal(false);
    }
  };

  const changeParams = () => {
    router.push(`/courses/manage/${course.id}/edit/${moduleIndex}/${stepIndex}`);
  };

  return (
    <div
      className={cn(
        "flex justify-between steps-start hover:bg-base hover:border-l-4 hover:border-base border-l-4 border-crust rounded-md transition-colors duration-300 ease-in-out",
        {
          "bg-base border-l-4 border-lavender hover:border-lavender":
            Number(params.moduleIndex) === moduleIndex &&
            Number(params.stepIndex) === stepIndex,
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
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none mt-2 mr-1 hover:text-lavender hover:cursor-pointer">
          <Icon icon="lucide:more-vertical" className="w-4 h-4 text-text" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={stepIndex === 0}
            onClick={() => MoveStepUp()}
          >
            <div className="flex space-x-1 items-center text-text">
              <Icon icon="lucide:arrow-up" />
              <p>Move up</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              course.courseModules?.[moduleIndex].courseSteps?.length ===
              stepIndex + 1
            }
            onClick={() => MoveStepDown()}
          >
            <div className="flex space-x-1 items-center text-text">
              <Icon icon="lucide:arrow-down" />
              <p>Move down</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRenameModal(true)}>
            <div className="flex space-x-1 items-center text-yellow">
              <Icon icon="lucide:edit" />
              <p>Rename</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setDeleteModal(true)}>
            <div className="flex space-x-1 items-center text-red">
              <Icon icon="lucide:trash-2" />
              <p>Delete</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Dialog for rename */}
      <Dialog open={renameModal} onOpenChange={setRenameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Rename step</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(RenameStep)}>
            <div className="w-full flex flex-col space-y-2 mb-5">
              <div className="space-y-5 flex flex-col">
                <div className="space-y-2">
                  <label className="text-md font-semibold" htmlFor="module-name">
                    Module name
                  </label>
                  <Input
                    {...register("name")}
                    autoFocus
                    defaultValue={step.name}
                    id="step-name"
                    placeholder="Enter step name"
                  />
                  {errors.name && (
                    <p className="pt-1 text-red text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" size="sm">
                Rename
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setRenameModal(false)} // Close the dialog manually
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Confirm Dialog for delete step */}
      <Dialog open={deleteModal} onOpenChange={() => setDeleteModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone in this edition. This will
              permanently delete your account and remove your data from this
              edition.
            </DialogDescription>
            <DialogFooter>
              <Button variant="destructive" onClick={() => DeleteStep()}>
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setDeleteModal(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
