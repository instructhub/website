import { SidebarProvider } from "@/components/ui/sidebar";
import API_URLS from "@/lib/api-urls";
import { Course, mapCourse } from "@/types/courses";

import CourseClientPage from "./edit-page";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseID: string }>;
}) {
  const courseID = (await params).courseID;

  console.log(courseID);
  let response = await fetch(API_URLS.COURSES.GET(courseID), {
    method: "GET",
    credentials: "include",
  });

  const rawData = await response.json();
  console.log(rawData)
  if (!rawData.result) {
    throw new Error("No course data found");
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
      <CourseClientPage courseData={courseData} />
    </SidebarProvider>
  );
}
