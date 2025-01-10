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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Course, CourseStep, CourseModule, CourseType } from "@/types/courses";

import { StepList } from "./steps";

const moduleNameSchema = z.object({
  name: z
    .string()
    .min(2, "Module name must be at least 2 characters long")
    .max(50, "Module name must not exceed 50 characters"),
});

type moduleNameForm = z.infer<typeof moduleNameSchema>;

interface ModuleProps {
  module: CourseModule;
  moduleIndex: number;
  course: Course;
  setCourse: (course: Course) => void;
}

export function Module({ module, moduleIndex, course, setCourse }: ModuleProps) {
  const [newStepModal, setNewStepModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<moduleNameForm>({ resolver: zodResolver(moduleNameSchema) });

  // Helper function for module operations
  const updateModules = (
    updateFn: (modules: CourseModule[]) => CourseModule[],
    validator?: () => boolean,
  ) => {
    if (!course?.courseModules || (validator && !validator())) return;
    setCourse({
      ...course,
      courseModules: updateFn([...course.courseModules]),
    });
  };

  // Move module up
  const moveModuleUp = () => {
    updateModules(
      (modules) => {
        [modules[moduleIndex], modules[moduleIndex - 1]] = [
          modules[moduleIndex - 1],
          modules[moduleIndex],
        ];
        return modules;
      },
      () => moduleIndex > 0,
    );
  };

  // Move module down
  const moveModuleDown = () => {
    updateModules(
      (modules) => {
        [modules[moduleIndex], modules[moduleIndex + 1]] = [
          modules[moduleIndex + 1],
          modules[moduleIndex],
        ];
        return modules;
      },
      () => moduleIndex < (course?.courseModules?.length ?? 0) - 1,
    );
  };

  // Create new step
  const createNewStep = (data: { name: string }) => {
    updateModules((modules) => {
      const newStep: CourseStep = {
        name: data.name,
        position: (modules[moduleIndex].courseSteps?.length || 0) + 1,
        type: CourseType.TextContent,
      };

      modules[moduleIndex] = {
        ...modules[moduleIndex],
        courseSteps: [...(modules[moduleIndex].courseSteps || []), newStep],
      };
      return modules;
    });
    setNewStepModal(false);
  };

  // Rename module
  const renameModule = (data: { name: string }) => {
    updateModules((modules) => {
      modules[moduleIndex] = {
        ...modules[moduleIndex],
        name: data.name,
      };
      return modules;
    });
    setRenameModal(false);
  };

  // Delete module
  const deleteModule = () => {
    updateModules((modules) => modules.filter((_, index) => index !== moduleIndex));
    setDeleteModal(false);
  };

  return (
    <AccordionItem key={module.position} value={`step-${module.position}`} className="my-2">
      <div className="flex w-full grow">
        <AccordionTrigger className="hover:no-underline py-0 px-3 hover:bg-base text-left rounded-md w-full mb-2">
          <p className="px-3 py-1 text-left rounded-md text-md font-bold mr-1">
            {module.name}
          </p>
        </AccordionTrigger>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex-none focus:outline-none mr-1 hover:text-lavender hover:cursor-pointer justify-center steps-center">
            <Icon icon="lucide:more-vertical" className="w-4 h-4 text-text" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setNewStepModal(true)}>
              <div className="flex space-x-1 items-center text-green">
                <Icon icon="lucide:copy-plus" />
                <p>New step</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={moduleIndex === 0} onClick={moveModuleUp}>
              <div className="flex space-x-1 items-center text-text">
                <Icon icon="lucide:arrow-up" />
                <p>Move up</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={course.courseModules?.length === moduleIndex + 1}
              onClick={moveModuleDown}
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
      </div>

      <AccordionContent className="pl-4 flex-col pb-0 space-y-2">
        {module.courseSteps?.map((step, stepIndex) => (
          <StepList
            course={course}
            setCourse={setCourse}
            step={step}
            stepIndex={stepIndex}
            moduleIndex={moduleIndex}
            key={step.position}
          />
        ))}
      </AccordionContent>

      {/* TODO: insert new step */}
      <NewStep
        module={module}
        moduleIndex={moduleIndex}
        course={course}
        setCourse={setCourse}
        newStepModal={newStepModal}
        setNewStepModal={setNewStepModal}
      />
      {/* Rename Dialog */}
      <Dialog open={renameModal} onOpenChange={setRenameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename module</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(renameModule)}>
            <div className="w-full flex flex-col space-y-2 mb-5">
              <div className="space-y-2">
                <label className="text-md font-semibold" htmlFor="module-name">
                  Module name
                </label>
                <Input
                  {...register("name")}
                  defaultValue={module.name}
                  id="module-name"
                  placeholder="Enter module name"
                />
                {errors.name && (
                  <p className="pt-1 text-red text-sm">{errors.name.message}</p>
                )}
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
                onClick={() => setRenameModal(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete module</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>
              Are you sure you want to delete this module? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={deleteModule} variant="destructive" size="sm">
              Delete
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
}

const newStepSchema = z.object({
  name: z
    .string()
    .min(2, "New step must be at least 2 characters long")
    .max(50, "New step must not exceed 50 characters"),
});

type newStepForm = z.infer<typeof newStepSchema>;

interface NewStepProps {
  module: CourseModule;
  moduleIndex: number;
  course: Course;
  setCourse: (course: Course) => void;
  setNewStepModal: (newStepModal: boolean) => void;
  newStepModal: boolean;
}

function NewStep({
  module,
  moduleIndex,
  course,
  setCourse,
  setNewStepModal,
  newStepModal,
}: NewStepProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<newStepForm>({ resolver: zodResolver(newStepSchema) });

  const createNewStep = (data: { name: string }) => {
    const newStep: CourseStep = {
      name: data.name,
      position: (module.courseSteps?.length || 0) + 1,
      type: CourseType.TextContent,
    };

    const updatedModules = [...(course.courseModules || [])];
    updatedModules[moduleIndex] = {
      ...module,
      courseSteps: [...(module.courseSteps || []), newStep],
    };

    setCourse({ ...course, courseModules: updatedModules });
    reset()
    setNewStepModal(false);
  };

  return (
    <Dialog open={newStepModal} onOpenChange={setNewStepModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Step</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(createNewStep)}>
          <div className="w-full flex flex-col space-y-2 mb-5">
            <div className="space-y-2">
              <label className="text-md font-semibold" htmlFor="step-name">
                Step name
              </label>
              <Input
                {...register("name")}
                id="step-name"
                placeholder="Enter step name"
              />
              {errors.name && (
                <p className="pt-1 text-red text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" size="sm">
              Create Step
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setNewStepModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
