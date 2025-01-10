import decamelizeKeys from "decamelize-keys";
import { Base64 } from "js-base64";
import { z } from "zod";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import API_URLS from "@/lib/api-urls";
import { Course, CourseModule, CourseType } from "@/types/courses";

import { Module } from "./modules";

interface CourseData {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}

export function AppSidebar({ course, setCourse }: CourseData) {
  return (
    <Sidebar className="top-14 bg-crust h-[100%-3.5rem]">
      <SidebarHeader className="bg-crust text-xl font-bold truncate">
        {course.name}
      </SidebarHeader>
      <SidebarContent className="bg-crust p-2 pl-6">
        <Accordion type="multiple" defaultValue={[`item-1`]}>
          {course.courseModules?.map((module, moduleIndex) => (
            <Module
              module={module}
              moduleIndex={moduleIndex}
              course={course}
              setCourse={setCourse}
              key={module.position}
            ></Module>
          ))}
        </Accordion>

        <AddNewModuleButton course={course} setCourse={setCourse} />
      </SidebarContent>
      <SidebarFooter className="bg-crust">
        <SaveButton course={course} setCourse={setCourse} />
      </SidebarFooter>
    </Sidebar>
  );
}

const moduleNameSchema = z.object({
  name: z
    .string()
    .min(2, "Module name must be at least 2 characters long")
    .max(50, "Module name must not exceed 50 characters"),
});

type moduleNameForm = z.infer<typeof moduleNameSchema>;

interface AddNewModuleButtonProps {
  course: Course;
  setCourse: (updatedCourse: Course) => void;
}

// FIXME: need to limit the maxlength
export function AddNewModuleButton({
  course,
  setCourse,
}: AddNewModuleButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<moduleNameForm>({
    resolver: zodResolver(moduleNameSchema),
  });

  const createNewModule = (data: { name: string }) => {
    // Create a new course module
    const newCourseModule: CourseModule = {
      courseId: course.id,
      name: data.name, // Use the name entered by the user
      position: (course.courseModules?.length || 0) + 1, // Set the position
      courseSteps: [], // Initialize with an empty array
    };

    // Update the course modules
    const updatedCourseModules = [
      ...(course.courseModules || []),
      newCourseModule,
    ];

    // Update the course state
    setCourse({
      ...course,
      courseModules: updatedCourseModules,
    });

    // Reset form, close dialog, and stop loading
    reset();
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        className="rounded-md border-dashed border-2 justify-center items-center p-2 ml-1 transition-transform duration-200 hover:-translate-y-1"
        onClick={() => setIsDialogOpen(true)} // Open the dialog
      >
        <div className="flex space-x-2 items-center justify-center text-overlay0">
          <Icon icon="lucide:square-plus" className="w-4 h-4" />
          <div className="font-bold text-sm">New module</div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Create new module</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(createNewModule)}>
          <div className="w-full flex flex-col space-y-2 mb-5">
            <div className="space-y-5 flex flex-col">
              <div className="space-y-2">
                <label className="text-md font-semibold" htmlFor="module-name">
                  Module name
                </label>
                <Input
                  {...register("name")}
                  id="module-name"
                  placeholder="Enter module name"
                />
                <p className="text-sm text-subtext0">
                  Module names should be clear and unique to make them easy to
                  identify.
                </p>
                {errors.name && (
                  <p className="pt-1 text-red text-sm">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" size="sm">
              Create
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)} // Close the dialog manually
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const revisionSchema = z.object({
  description: z
    .string()
    .min(2, "Description must be at least 2 characters long")
    .max(100, "Description must not exceed 100 characters"),
  verifyContent: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
});

type revisionSchemaForm = z.infer<typeof revisionSchema>;

interface AddNewModuleButtonProps {
  course: Course;
  setCourse: (updatedCourse: Course) => void;
}

function SaveButton({ course, setCourse }: CourseData) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<revisionSchemaForm>({
    resolver: zodResolver(revisionSchema),
  });

  const createNewRevision = async (data: revisionSchemaForm) => {
    setIsLoading(true);
    const updatedModules = course.courseModules?.map((module) => ({
      ...module,
      courseSteps: module.courseSteps?.map((step) => ({
        ...step,
        content: step.content ? Base64.encode(step.content) : null
      })),
    }));

    if (!updatedModules) {
      return;
    }

    const payload = {
      description: data.description,
      modules: updatedModules,
    };
    const snakeCasePayload = decamelizeKeys(payload, { deep: true });

    try {
      const response = await fetch(
        API_URLS.COURSES.CREATE_REVISION(course.id),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(snakeCasePayload),
        },
      );

      if (!response.ok) {
        setIsLoading(false);
        setIsDialogOpen(false);
        // TODO: need to change to a more clear warn alert
        throw new Error(`Failed to save revision: ${response.statusText}`);
      }

      const result = await response.json();

      const updatedModules = course.courseModules?.map((module) => ({
        ...module,
        courseSteps: module.courseSteps?.map((step) => ({
          ...step,
          updated: false,
        })),
      }));

      setCourse({ ...course, courseModules: updatedModules });
      reset();
      setIsLoading(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving revision:", error);
    }
  };

  return (
    <div className="bg-surface0 flex flex-col p-2 border rounded-xl">
      <div className="font-semibold text-sm inline-flex flex-wrap items-center">
        Remember to commit your edit! Once you leave, all your data will be
        gone!
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button
          className="m-2 grow font-bold flex"
          onClick={() => setIsDialogOpen(true)} // Open the dialog
        >
          <Icon icon="lucide:save" width="24" height="24" />
          Save
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Craete a new revision</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(createNewRevision)}>
            <div className="w-full flex flex-col space-y-2 mb-5">
              <div className="space-y-5 flex flex-col">
                <div className="space-y-2">
                  <div className="space-y-2">
                    <label
                      className="text-md font-semibold"
                      htmlFor="module-name"
                    >
                      Revision description
                    </label>
                    <Input
                      {...register("description")}
                      id="module-name"
                      placeholder="Enter revision description"
                    />
                    <p className="text-sm text-subtext0">
                      The description should clearly describe what has been
                      changed in this revision.
                    </p>
                    {errors.description && (
                      <p className="pt-1 text-red text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="items-top flex space-x-2">
                    <Controller
                      name="verifyContent"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox
                          className="duration-300 ease-in-out"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                          id="verifyContent"
                        />
                      )}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Have you reviewed everything you changed?
                      </label>
                      {errors.verifyContent && (
                        <p className="pt-1 text-red text-sm">
                          {errors.verifyContent.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading && (
                  <Icon icon="lucide:loader-circle" className="animate-spin" />
                )}
                Commit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setIsDialogOpen(false)} // Close the dialog manually
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
