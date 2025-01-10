import decamelizeKeys from "decamelize-keys";
import { Base64 } from "js-base64";
import { z } from "zod";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import API_URLS from "@/lib/api-urls";
import { Course, CourseModule, CourseType } from "@/types/courses";

import { Module } from "./modules";

interface CourseData {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}

export function AppSidebar({ course, setCourse }: CourseData) {
  return (
    <Sidebar className="top-14 bg-crust h-[100%-3.5rem]">
      <SidebarHeader className="bg-crust text-xl font-bold truncate">
        {course.name}
      </SidebarHeader>
      <SidebarContent className="bg-crust p-2 pl-6">
        <Accordion type="multiple" defaultValue={[`item-1`]}>
          {course.courseModules?.map((module, moduleID) => (
            <Module
              module={module}
              course={course}
              setCourse={setCourse}
              key={module.position}
            ></Module>
          ))}
        </Accordion>

      </SidebarContent>
    </Sidebar>
  );
}