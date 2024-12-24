"use client";

import { notFound, useParams } from "next/navigation";

import { useContext, useEffect, useState } from "react";

import TiptapEditor from "@/components/tiptap/editor";
import API_URLS from "@/lib/api-urls";

import { CourseContext } from "../../_components/edit-page";

export default function CoursePage() {
  const params = useParams<{
    courseID: string;
    stageIndex: string;
    itemIndex: string;
  }>();

  const context = useContext(CourseContext);
  if (!context) {
    notFound();
  }

  const { course, setCourse } = context;

  const item =
    course.courseStages?.[Number(params.stageIndex)].courseItems?.[
      Number(params.itemIndex)
    ];
  if (!item) {
    notFound();
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      if (item?.id == null) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          API_URLS.COURSES.GET_ITEM(params.courseID, item.id),
        );
        if (!response.ok) {
          notFound();
        }
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (params.courseID && params.stageIndex && params.itemIndex) {
      fetchCourseData();
    }
  }, [params.courseID, setCourse]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{course.name}</h1>
      <TiptapEditor />
    </div>
  );
}
