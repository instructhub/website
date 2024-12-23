"use client";

import { useState } from "react";

import TiptapEditor from "@/components/tiptap/editor";
import { Input } from "@/components/ui/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import API_URLS from "@/lib/api-urls";
import { Course } from "@/types/courses";

import { AppSidebar } from "./edit-sidebar";

interface CoursePageProps {
  courseData: Course;
}

export default function CourseClientPage({ courseData }: CoursePageProps) {
  const [course, setCourse] = useState<Course>(courseData);

  return (
    <>
      <AppSidebar course={course} setCourse={setCourse} />
      <div className="w-full flex justify-center mt-10">
        <div className="container p-2">
          <div className="max-w-screen-lg mx-auto">
            <TiptapEditor />
          </div>
        </div>
      </div>
    </>
  );
}
