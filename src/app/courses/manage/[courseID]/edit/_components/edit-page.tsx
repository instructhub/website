"use client";

import { useParams } from "next/navigation";

import { createContext, useState } from "react";

import { Course } from "@/types/courses";

import { AppSidebar } from "./edit-sidebar";

interface CoursePageProps {
  courseData: Course;
  children: React.ReactNode;
}

interface CourseContext {
  course: Course;
  setCourse: (course: Course) => void;
}

export const CourseContext = createContext<CourseContext | undefined>(
  undefined,
);

export default function CourseClientPage({
  courseData,
  children,
}: CoursePageProps) {
  const [course, setCourse] = useState<Course>(courseData);

  return (
    <>
      <AppSidebar course={course} setCourse={setCourse} />
      <div className="w-full flex justify-center mt-10">
        <div className="container p-2">
          <div className="max-w-screen-lg mx-auto">
            <CourseContext.Provider
              value={{ course: course, setCourse: setCourse }}
            >
              {children}
            </CourseContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}
