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
import { Course, CourseItem } from "@/types/courses";

const itemNameSchema = z.object({
  name: z
    .string()
    .min(5, "Item name must be at least 5 characters long")
    .max(100, "Item name must not exceed 50 characters"),
});

type itemNameForm = z.infer<typeof itemNameSchema>;

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
  const params = useParams<{
    courseID: string;
    stageIndex: string;
    itemIndex: string;
  }>();
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<itemNameForm>({
    resolver: zodResolver(itemNameSchema),
  });

  const MoveItemUp = () => {
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

  const MoveItemDown = () => {
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

  const DeleteItem = () => {
    // Ensure courseStages and courseItems exist
    if (
      course.courseStages &&
      course.courseStages[stageIndex] &&
      course.courseStages[stageIndex].courseItems &&
      itemIndex >= 0 &&
      itemIndex < course.courseStages[stageIndex].courseItems!.length
    ) {
      const updatedCourseStages = [...course.courseStages]; // Create a copy of courseStages
      const updatedCourseItems = [
        ...(updatedCourseStages[stageIndex].courseItems || []),
      ]; // Copy courseItems

      // Remove the item at the specified index
      updatedCourseItems.splice(itemIndex, 1);

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

  const RenameItem = (data: { name: string }) => {
    // Ensure courseStages and courseItems exist
    if (
      course.courseStages &&
      course.courseStages[stageIndex] &&
      course.courseStages[stageIndex].courseItems &&
      itemIndex >= 0 &&
      itemIndex < course.courseStages[stageIndex].courseItems!.length
    ) {
      const updatedCourseStages = [...course.courseStages]; // Create a copy of courseStages
      const updatedCourseItems = [
        ...(updatedCourseStages[stageIndex].courseItems || []),
      ]; // Copy courseItems

      // Update the name of the item at the specified index
      updatedCourseItems[itemIndex] = {
        ...updatedCourseItems[itemIndex],
        name: data.name,
      };

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
      setRenameModal(false);
    }
  };

  const changeParams = () => {
    router.push(`/courses/manage/${course.id}/edit/${stageIndex}/${itemIndex}`);
  };

  return (
    <div
      className={cn(
        "flex justify-between items-start hover:bg-base hover:border-l-4 hover:border-base border-l-4 border-crust rounded-md transition-colors duration-300 ease-in-out",
        {
          "bg-base border-l-4 border-lavender hover:border-lavender":
            Number(params.stageIndex) === stageIndex &&
            Number(params.itemIndex) === itemIndex,
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
            onClick={() => MoveItemUp()}
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
            onClick={() => MoveItemDown()}
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
            <DialogTitle className="text-xl">Rename item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(RenameItem)}>
            <div className="w-full flex flex-col space-y-2 mb-5">
              <div className="space-y-5 flex flex-col">
                <div className="space-y-2">
                  <label className="text-md font-semibold" htmlFor="stage-name">
                    Stage name
                  </label>
                  <Input
                    {...register("name")}
                    autoFocus
                    defaultValue={item.name}
                    id="item-name"
                    placeholder="Enter item name"
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
      {/* Confirm Dialog for delete item */}
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
              <Button variant="destructive" onClick={() => DeleteItem()}>
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
