import { useState } from "react";
import { useForm } from "react-hook-form";

import { Icon } from "@iconify/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Course, CourseItem, CourseStage, CourseType } from "@/types/courses";

interface CourseData {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}

export function AppSidebar({ course, setCourse }: CourseData) {
  const createNewItem = (stageIndex: number) => {
    const courseItem: CourseItem = {
      name: "Item Name",
      position:
        (course.courseStages?.[stageIndex].courseItems?.length || 0) + 1,
      type: CourseType.TextContent,
    };

    // Ensure course.courseStages is defined and courseItems exists for the stage
    if (course.courseStages && course.courseStages[stageIndex]) {
      const updatedCourseStages = [...course.courseStages]; // Create a copy of the courseStages array
      const updatedCourseItems = [
        ...(course.courseStages[stageIndex].courseItems || []), // Use empty array if courseItems is undefined
        courseItem, // Add the new item
      ];

      // Update the specific course stage
      updatedCourseStages[stageIndex] = {
        ...updatedCourseStages[stageIndex], // Copy the existing properties
        courseItems: updatedCourseItems, // Replace courseItems with the updated array
      };

      // Update the course state
      setCourse({
        ...course, // Keep other properties of course unchanged
        courseStages: updatedCourseStages, // Replace the updated courseStages
      });
    }
  };

  return (
    <Sidebar className="top-14 bg-mantle">
      <SidebarHeader className="bg-crust text-xl font-bold">
        Stages
      </SidebarHeader>
      <SidebarContent className="bg-crust p-2 pl-6">
        <Accordion type="multiple" defaultValue={[`item-1`]}>
          {course.courseStages?.map((stage, stageIndex) => (
            <AccordionItem
              key={stage.position}
              value={`item-${stage.position}`}
            >
<div className="flex w-full">
    <AccordionTrigger className="hover:no-underline py-0 px-3 hover:bg-base text-left rounded-md">
        <p className="grow px-3 py-1 text-left rounded-md text-md font-bold mr-1">
            {stage.name}
        </p>
    </AccordionTrigger>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex-none focus:outline-none mt-2 mr-1 hover:text-lavender hover:cursor-pointer">
                    <Icon
                      icon="lucide:more-vertical"
                      className="w-4 h-4 text-text"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem disabled={stageIndex === 0}>
                      <div className="flex space-x-1 items-center text-text">
                        <Icon icon="lucide:arrow-up" />
                        <p>Move up</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={course.courseStages?.length === stageIndex + 1}
                    >
                      <div className="flex space-x-1 items-center text-text">
                        <Icon icon="lucide:arrow-down" />
                        <p>Move down</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex space-x-1 items-center text-yellow">
                        <Icon icon="lucide:edit" />
                        <p>Rename</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <div className="flex space-x-1 items-center text-red">
                        <Icon icon="lucide:trash-2" />
                        <p>Delete</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <AccordionContent className="pl-4 flex-col pb-0">
                {stage.courseItems?.map((item, itemIndex) => (
                  <ItemList
                    course={course}
                    setCourse={setCourse}
                    item={item}
                    itemIndex={itemIndex}
                    stageIndex={stageIndex}
                    key={item.position}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <AddNewStageButton course={course} setCourse={setCourse} />
      </SidebarContent>
    </Sidebar>
  );
}

interface ItemListProps {
  course: Course;
  setCourse: (updatedCourse: Course) => void;
  item: CourseItem;
  itemIndex: number;
  stageIndex: number;
}

export function ItemList({
  course,
  setCourse,
  item,
  itemIndex,
  stageIndex,
}: ItemListProps) {
  const MoveItemUp = (stageIndex: number, itemIndex: number) => {
    // Ensure course.courseStages and courseItems exist for the given stage and item indices
    if (
      course.courseStages &&
      course.courseStages[stageIndex] &&
      course.courseStages[stageIndex].courseItems &&
      itemIndex > 0 // Ensure the item is not already at the top
    ) {
      const updatedCourseStages = [...course.courseStages]; // Create a copy of courseStages
      const courseItems = [...updatedCourseStages[stageIndex].courseItems!]; // Copy courseItems for the stage

      // Swap the current item with the previous one
      const temp = courseItems[itemIndex];
      courseItems[itemIndex] = courseItems[itemIndex - 1];
      courseItems[itemIndex - 1] = temp;

      // Update positions for the swapped items
      courseItems[itemIndex].position = itemIndex + 1;
      courseItems[itemIndex - 1].position = itemIndex;

      // Update the specific courseStage with the reordered items
      updatedCourseStages[stageIndex] = {
        ...updatedCourseStages[stageIndex],
        courseItems,
      };

      // Update the course state
      setCourse({
        ...course,
        courseStages: updatedCourseStages,
      });
    }
  };

  const MoveItemDown = (stageIndex: number, itemIndex: number) => {
    // Ensure courseStages and courseItems exist, and itemIndex is valid
    if (
      course.courseStages &&
      course.courseStages[stageIndex] &&
      course.courseStages[stageIndex].courseItems &&
      itemIndex < course.courseStages[stageIndex].courseItems!.length - 1
    ) {
      const updatedCourseStages = [...course.courseStages]; // Create a copy of courseStages
      const updatedCourseItems = [
        ...(updatedCourseStages[stageIndex].courseItems || []),
      ]; // Copy courseItems

      // Swap the current item with the next one
      const temp = updatedCourseItems[itemIndex];
      updatedCourseItems[itemIndex] = updatedCourseItems[itemIndex + 1];
      updatedCourseItems[itemIndex + 1] = temp;

      // Update the course stage
      updatedCourseStages[stageIndex] = {
        ...updatedCourseStages[stageIndex],
        courseItems: updatedCourseItems,
      };

      // Update the course state
      setCourse({
        ...course,
        courseStages: updatedCourseStages,
      });
    }
  };

  return (
    <div className="flex justify-between items-start hover:bg-base hover:border-l-4 hover:border-lavender border-l-4 border-crust rounded-md">
      <div className="pl-5 p-2 rounded-md space-y-1 grow">
        <div className="text-text flex space-x-2">
          <Icon
            icon="lucide:book-open"
            width="1rem"
            height="1rem"
            className="shrink-0 mt-0.5"
          />
          <div className="text-wrap flex-1">{item.name}</div>
        </div>
        <p className="text-subtext0 text-xs">2 mins</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none mt-2 mr-1 hover:text-lavender hover:cursor-pointer">
          <Icon icon="lucide:more-vertical" className="w-4 h-4 text-text" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={itemIndex === 0}
            onClick={() => MoveItemUp(stageIndex, itemIndex)}
          >
            <div className="flex space-x-1 items-center text-text">
              <Icon icon="lucide:arrow-up" />
              <p>Move up</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              course.courseStages?.[stageIndex].courseItems?.length ===
              itemIndex + 1
            }
            onClick={() => MoveItemDown(stageIndex, itemIndex)}
          >
            <div className="flex space-x-1 items-center text-text">
              <Icon icon="lucide:arrow-down" />
              <p>Move down</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex space-x-1 items-center text-yellow">
              <Icon icon="lucide:edit" />
              <p>Rename</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <div className="flex space-x-1 items-center text-red">
              <Icon icon="lucide:trash-2" />
              <p>Delete</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

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
  } = useForm<{ name: string }>({
    defaultValues: { name: "" },
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
                  {...register("name", { required: "Stage name is required" })}
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
              Create new stage
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
