"use client";

import { Base64 } from "js-base64";
import { notFound, useParams } from "next/navigation";
import useSWR from "swr";

import { useContext, useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import TiptapEditor from "@/components/tiptap/editor";
import API_URLS from "@/lib/api-urls";

import { CourseContext } from "../../_components/edit-page";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export default function CoursePage() {
  const params = useParams<{
    courseID: string;
    moduleIndex: string;
    stepIndex: string;
  }>();

  const context = useContext(CourseContext);
  if (!context) {
    notFound();
  }

  const { course, setCourse } = context;

  const moduleIndex = Number(params.moduleIndex);
  const stepIndex = Number(params.stepIndex);

  const step = course.courseModules?.[moduleIndex]?.courseSteps?.[stepIndex];
  if (!step) {
    notFound();
  }

  const { data, error, isLoading } = useSWR(
    step?.id && step?.content == null
      ? API_URLS.COURSES.GET_ITEM(params.courseID, step.id)
      : null,
    fetcher,
  );

  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [editorValue, setEditorValue] = useState(step.content || ""); // Use state to control the value
  const [orginalContent, setOrginalContent] = useState(""); // Make it a state

  // Fetch and update course content if needed
  useEffect(() => {
    if (data && !step.content && !isContentUpdated) {
      const decodedContent = Base64.decode(data.result);
      const updatedModules = [...(course.courseModules || [])];

      if (
        updatedModules[moduleIndex] &&
        updatedModules[moduleIndex].courseSteps &&
        updatedModules[moduleIndex].courseSteps![stepIndex]
      ) {
        const updatedSteps = [...updatedModules[moduleIndex].courseSteps!];
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          content: decodedContent,
        };

        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          courseSteps: updatedSteps,
        };

        setCourse({
          ...course,
          courseModules: updatedModules,
        });

        setIsContentUpdated(true);
        setEditorValue(decodedContent); // Set content to editorValue after fetching
        setOrginalContent(decodedContent); // Set original content here
      }
    }
  }, [
    data,
    step.content,
    course,
    setCourse,
    moduleIndex,
    stepIndex,
    isContentUpdated,
  ]);

  // Handle editor content update
  const handleEditorUpdate = (newContent: string) => {
    setEditorValue(newContent); // Update local state with the new content

    const updatedModules = [...(course.courseModules || [])];
    if (
      updatedModules[moduleIndex] &&
      updatedModules[moduleIndex].courseSteps &&
      updatedModules[moduleIndex].courseSteps![stepIndex]
    ) {
      const updatedSteps = [...updatedModules[moduleIndex].courseSteps!];
      const oldUpdated = updatedSteps[stepIndex].updated;
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        content: newContent,
        updated: orginalContent !== newContent, // Compare with the state version of orginalContent
      };

      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        courseSteps: updatedSteps,
      };
      setCourse({
        ...course,
        courseModules: updatedModules,
      });
    }
  };

  if ((isLoading || !editorValue) && step.id !== undefined) {
    return (
      <div className="flex flex-col space-y-2  w-full min-h-screen">
        <div className="w-full min-h-14 justify-center items-center flex animate-pulse bg-surface0 rounded-md" />
        <div className="w-full min-h-56 justify-center items-center flex animate-pulse bg-surface0 rounded-md" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-3xl border-b-2">{step.name}</h1>
      <TiptapEditor
        content={editorValue} // Pass the controlled value
        onUpdate={handleEditorUpdate} // Pass the update handler to update content
      />
    </div>
  );
}
