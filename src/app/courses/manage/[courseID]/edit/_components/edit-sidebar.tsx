import { z } from "zod";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import {
  Accordion,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Course, CourseItem, CourseStage, CourseType } from "@/types/courses";

import { Stage } from "./stages";

interface CourseData {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}

export function AppSidebar({ course, setCourse }: CourseData) {

  return (
    <Sidebar className="top-14 bg-mantle h-[100%-3.5rem]">
      <SidebarHeader className="bg-crust text-xl font-bold">
        Stages
      </SidebarHeader>
      <SidebarContent className="bg-crust p-2 pl-6">
        <Accordion type="multiple" defaultValue={[`item-1`]}>
          {course.courseStages?.map((stage, stageIndex) => (
            <Stage
              stage={stage}
              stageIndex={stageIndex}
              course={course}
              setCourse={setCourse}
              key={stage.position}
            ></Stage>
          ))}
        </Accordion>

        <AddNewStageButton course={course} setCourse={setCourse} />
      </SidebarContent>
    </Sidebar>
  );
}

const stageNameSchema = z.object({
  name: z
    .string()
    .min(2, "Stage name must be at least 2 characters long")
    .max(50, "Stage name must not exceed 50 characters"),
});

type stageNameForm = z.infer<typeof stageNameSchema>;

interface AddNewStageButtonProps {
  course: Course;
  setCourse: (updatedCourse: Course) => void;
}

// FIXME: need to limit the maxlength
export function AddNewStageButton({
  course,
  setCourse,
}: AddNewStageButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<stageNameForm>({
    resolver: zodResolver(stageNameSchema),
  });

  const createNewStage = (data: { name: string }) => {
    // Create a new course stage
    const newCourseStage: CourseStage = {
      courseId: course.id,
      name: data.name, // Use the name entered by the user
      position: (course.courseStages?.length || 0) + 1, // Set the position
      courseItems: [], // Initialize with an empty array
    };

    // Update the course stages
    const updatedCourseStages = [
      ...(course.courseStages || []),
      newCourseStage,
    ];

    // Update the course state
    setCourse({
      ...course,
      courseStages: updatedCourseStages,
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
          <div className="font-bold text-sm">New stage</div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Create new stage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(createNewStage)}>
          <div className="w-full flex flex-col space-y-2 mb-5">
            <div className="space-y-5 flex flex-col">
              <div className="space-y-2">
                <label className="text-md font-semibold" htmlFor="stage-name">
                  Stage name
                </label>
                <Input
                  {...register("name")}
                  id="stage-name"
                  placeholder="Enter stage name"
                />
                <p className="text-sm text-subtext0">
                  Stage names should be clear and unique to make them easy to
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
