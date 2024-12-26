import { SidebarProvider } from "@/components/ui/sidebar";
import API_URLS from "@/lib/api-urls";
import { Course, mapCourse } from "@/types/courses";

import CourseClientPage from "./_components/edit-page";
import { notFound } from "next/navigation";

interface CoursePageProps {
  params: Promise<{ courseID: string }>;
  children: React.ReactNode;
}

export default async function CoursePage({
  params,
  children,
}: CoursePageProps) {
  const courseID = (await params).courseID;

  let response = await fetch(API_URLS.COURSES.GET(courseID), {
    method: "GET",
    credentials: "include",
  });

  const rawData = await response.json();
  if (!rawData.result) {
    notFound()
  }

  const courseData: Course = mapCourse(rawData.result);
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <CourseClientPage courseData={courseData}>{children}</CourseClientPage>
    </SidebarProvider>
  );
}
