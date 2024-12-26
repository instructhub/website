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
    stageIndex: string;
    itemIndex: string;
  }>();

  const context = useContext(CourseContext);
  if (!context) {
    notFound();
  }

  const { course, setCourse } = context;

  const stageIndex = Number(params.stageIndex);
  const itemIndex = Number(params.itemIndex);

  const item = course.courseStages?.[stageIndex]?.courseItems?.[itemIndex];
  if (!item) {
    notFound();
  }

  const { data, error, isLoading } = useSWR(
    item?.id && item?.content == null
      ? API_URLS.COURSES.GET_ITEM(params.courseID, item.id)
      : null,
    fetcher,
  );

  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [editorValue, setEditorValue] = useState(item.content || ""); // Use state to control the value
  const [orginalContent, setOrginalContent] = useState(""); // Make it a state

  // Fetch and update course content if needed
  useEffect(() => {
    if (data && !item.content && !isContentUpdated) {
      const decodedContent = Base64.decode(data.result);
      const updatedStages = [...(course.courseStages || [])];

      if (
        updatedStages[stageIndex] &&
        updatedStages[stageIndex].courseItems &&
        updatedStages[stageIndex].courseItems![itemIndex]
      ) {
        const updatedItems = [...updatedStages[stageIndex].courseItems!];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          content: decodedContent,
        };

        updatedStages[stageIndex] = {
          ...updatedStages[stageIndex],
          courseItems: updatedItems,
        };

        setCourse({
          ...course,
          courseStages: updatedStages,
        });

        setIsContentUpdated(true);
        setEditorValue(decodedContent); // Set content to editorValue after fetching
        setOrginalContent(decodedContent); // Set original content here
      }
    }
  }, [
    data,
    item.content,
    course,
    setCourse,
    stageIndex,
    itemIndex,
    isContentUpdated,
  ]);

  // Handle editor content update
  const handleEditorUpdate = (newContent: string) => {
    setEditorValue(newContent); // Update local state with the new content

    const updatedStages = [...(course.courseStages || [])];
    if (
      updatedStages[stageIndex] &&
      updatedStages[stageIndex].courseItems &&
      updatedStages[stageIndex].courseItems![itemIndex]
    ) {
      const updatedItems = [...updatedStages[stageIndex].courseItems!];
      const oldUpdated = updatedItems[itemIndex].updated;
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        content: newContent,
        updated: orginalContent !== newContent, // Compare with the state version of orginalContent
      };

      updatedStages[stageIndex] = {
        ...updatedStages[stageIndex],
        courseItems: updatedItems,
      };
      setCourse({
        ...course,
        courseStages: updatedStages,
      });
    }
  };

  if ((isLoading || !editorValue) && item.id !== undefined) {
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
      <h1 className="font-bold text-3xl border-b-2">{item.name}</h1>
      <TiptapEditor
        content={editorValue} // Pass the controlled value
        onUpdate={handleEditorUpdate} // Pass the update handler to update content
      />
    </div>
  );
}
