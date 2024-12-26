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
import { Course, CourseItem, CourseStage, CourseType } from "@/types/courses";

import { ItemList } from "./items";

const stageNameSchema = z.object({
  name: z
    .string()
    .min(2, "Stage name must be at least 2 characters long")
    .max(50, "Stage name must not exceed 50 characters"),
});

type stageNameForm = z.infer<typeof stageNameSchema>;

interface StageProps {
  stage: CourseStage;
  stageIndex: number;
  course: Course;
  setCourse: (course: Course) => void;
}

export function Stage({ stage, stageIndex, course, setCourse }: StageProps) {
  const [newItemModal, setNewItemModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<stageNameForm>({ resolver: zodResolver(stageNameSchema) });

  // Helper function for stage operations
  const updateStages = (
    updateFn: (stages: CourseStage[]) => CourseStage[],
    validator?: () => boolean,
  ) => {
    if (!course?.courseStages || (validator && !validator())) return;
    setCourse({
      ...course,
      courseStages: updateFn([...course.courseStages]),
    });
  };

  // Move stage up
  const moveStageUp = () => {
    updateStages(
      (stages) => {
        [stages[stageIndex], stages[stageIndex - 1]] = [
          stages[stageIndex - 1],
          stages[stageIndex],
        ];
        return stages;
      },
      () => stageIndex > 0,
    );
  };

  // Move stage down
  const moveStageDown = () => {
    updateStages(
      (stages) => {
        [stages[stageIndex], stages[stageIndex + 1]] = [
          stages[stageIndex + 1],
          stages[stageIndex],
        ];
        return stages;
      },
      () => stageIndex < (course?.courseStages?.length ?? 0) - 1,
    );
  };

  // Create new item
  const createNewItem = (data: { name: string }) => {
    updateStages((stages) => {
      const newItem: CourseItem = {
        name: data.name,
        position: (stages[stageIndex].courseItems?.length || 0) + 1,
        type: CourseType.TextContent,
      };

      stages[stageIndex] = {
        ...stages[stageIndex],
        courseItems: [...(stages[stageIndex].courseItems || []), newItem],
      };
      return stages;
    });
    setNewItemModal(false);
  };

  // Rename stage
  const renameStage = (data: { name: string }) => {
    updateStages((stages) => {
      stages[stageIndex] = {
        ...stages[stageIndex],
        name: data.name,
      };
      return stages;
    });
    setRenameModal(false);
  };

  // Delete stage
  const deleteStage = () => {
    updateStages((stages) => stages.filter((_, index) => index !== stageIndex));
    setDeleteModal(false);
  };

  return (
    <AccordionItem key={stage.position} value={`item-${stage.position}`} className="my-2">
      <div className="flex w-full grow">
        <AccordionTrigger className="hover:no-underline py-0 px-3 hover:bg-base text-left rounded-md w-full">
          <p className="px-3 py-1 text-left rounded-md text-md font-bold mr-1">
            {stage.name}
          </p>
        </AccordionTrigger>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex-none focus:outline-none mr-1 hover:text-lavender hover:cursor-pointer justify-center items-center">
            <Icon icon="lucide:more-vertical" className="w-4 h-4 text-text" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setNewItemModal(true)}>
              <div className="flex space-x-1 items-center text-green">
                <Icon icon="lucide:copy-plus" />
                <p>New item</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={stageIndex === 0} onClick={moveStageUp}>
              <div className="flex space-x-1 items-center text-text">
                <Icon icon="lucide:arrow-up" />
                <p>Move up</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={course.courseStages?.length === stageIndex + 1}
              onClick={moveStageDown}
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

      {/* TODO: insert new item */}
      <NewItem
        stage={stage}
        stageIndex={stageIndex}
        course={course}
        setCourse={setCourse}
        newItemModal={newItemModal}
        setNewItemModal={setNewItemModal}
      />
      {/* Rename Dialog */}
      <Dialog open={renameModal} onOpenChange={setRenameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename stage</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(renameStage)}>
            <div className="w-full flex flex-col space-y-2 mb-5">
              <div className="space-y-2">
                <label className="text-md font-semibold" htmlFor="stage-name">
                  Stage name
                </label>
                <Input
                  {...register("name")}
                  defaultValue={stage.name}
                  id="stage-name"
                  placeholder="Enter stage name"
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
            <DialogTitle>Delete stage</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>
              Are you sure you want to delete this stage? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={deleteStage} variant="destructive" size="sm">
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

const newItemSchema = z.object({
  name: z
    .string()
    .min(2, "New item must be at least 2 characters long")
    .max(50, "New item must not exceed 50 characters"),
});

type newItemForm = z.infer<typeof newItemSchema>;

interface NewItemProps {
  stage: CourseStage;
  stageIndex: number;
  course: Course;
  setCourse: (course: Course) => void;
  setNewItemModal: (newItemModal: boolean) => void;
  newItemModal: boolean;
}

function NewItem({
  stage,
  stageIndex,
  course,
  setCourse,
  setNewItemModal,
  newItemModal,
}: NewItemProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<newItemForm>({ resolver: zodResolver(newItemSchema) });

  const createNewItem = (data: { name: string }) => {
    const newItem: CourseItem = {
      name: data.name,
      position: (stage.courseItems?.length || 0) + 1,
      type: CourseType.TextContent,
    };

    const updatedStages = [...(course.courseStages || [])];
    updatedStages[stageIndex] = {
      ...stage,
      courseItems: [...(stage.courseItems || []), newItem],
    };

    setCourse({ ...course, courseStages: updatedStages });
    reset()
    setNewItemModal(false);
  };

  return (
    <Dialog open={newItemModal} onOpenChange={setNewItemModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(createNewItem)}>
          <div className="w-full flex flex-col space-y-2 mb-5">
            <div className="space-y-2">
              <label className="text-md font-semibold" htmlFor="item-name">
                Item name
              </label>
              <Input
                {...register("name")}
                id="item-name"
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="pt-1 text-red text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" size="sm">
              Create Item
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setNewItemModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
