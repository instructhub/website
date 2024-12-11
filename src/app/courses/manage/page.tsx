"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { DialogTrigger } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import API_URLS from "@/lib/api-urls";

export default function CoursesHomePage() {
  return <CraeteNewCourses />;
}

const createCourseSchema = z.object({
  name: z
    .string()
    .min(5, "Course name must be at least 5 characters long")
    .max(50, "Course name must not exceed 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(200, "Description must not exceed 200 characters"),
});

type createCourseForm = z.infer<typeof createCourseSchema>;

function CraeteNewCourses() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<createCourseForm>({
    resolver: zodResolver(createCourseSchema),
  });

  const handleCreateCourse: SubmitHandler<createCourseForm> = async (
    values,
  ) => {
    try {
      setLoading(true);
      const response = await fetch(API_URLS.COURSES.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      setLoading(false);

      const data = await response.json();

      if (response.ok) {
        toast.success("Sucessful create new courses", {
          description: <p>Successful create new courses, redirecting...</p>,
        });
        setOpen(false)
      } else {
        toast.error(t("Global.error.unexpected_error"), {
          description: <p>{data.message}</p>,
        });
      }

    } catch (error) {
      toast.error(t("Global.error.unexpected_error"), {
        description: (
          <div>
            <pre className="bg-crust text-text p-2 rounded-lg">
              <code>{`${error}`}</code>
            </pre>
          </div>
        ),
      });
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogTrigger>New course</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Craete your new courses</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreateCourse)}>
          <div className="w-full flex flex-col space-y-2 mb-5">
            <div className="space-y-5 flex flex-col">
              <div className="space-y-2">
                <label className="text-md font-semibold" htmlFor="course-name">
                  Course name
                </label>
                <Input
                  {...register("name")}
                  id="course-name"
                  placeholder="Example: Learn Golang by building a webapp"
                />
                <p className="text-sm text-subtext0">
                  Course names should be eye-catching, clear, easy to find, and
                  should not overlap with other course names.
                </p>
                {errors.name && (
                  <p className="pt-1 text-red text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-md font-semibold" htmlFor="description">
                  Description
                </label>
                <Textarea
                  {...register("description")}
                  className="resize-none"
                  id="description"
                  placeholder="Example: In this course, you will learn how to use Golang to create a fully functional webapp"
                />
                <p className="text-sm text-subtext0">
                  The description should be short and readable within 10
                  seconds.
                </p>
                {errors.description && (
                  <p className="pt-1 text-red text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" size="sm" disabled={loading}>
              {loading && (
                <Icon icon="lucide:loader-circle" className="animate-spin" />
              )}
              Create new courses
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
