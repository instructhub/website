// Course type
export interface Course {
  id: string; // uint64 -> number
  creator: string; // uint64 -> number
  name: string; // string remains the same
  description?: string; // string | undefined for optional fields
  courseModules?: CourseModule[]; // Foreign key relationship
}

// CourseModule type
export interface CourseModule {
  id?: string; // uint64 -> number
  courseId: string; // uint64 -> number
  position: number; // int -> number
  name: string; // string remains the same
  active?: boolean; // *bool -> boolean | undefined
  course?: Course; // Foreign key relationship
  courseSteps?: CourseStep[]; // Foreign key relationship
}

// CourseType enum
export enum CourseType {
  TextContent = 0, // CourseTextContent = iota -> 0
  VideoContent = 1, // 1
  QuestionContent = 2, // 2
}

// Helper for mapping string to CourseType
export const courseTypeMap: Record<string, CourseType> = {
  text: CourseType.TextContent,
  video: CourseType.VideoContent,
  question: CourseType.QuestionContent,
};

// CourseStep type
export interface CourseStep {
  id?: string;
  moduleId?: string;
  position: number;
  type: CourseType;
  name: string;
  active?: boolean;
  content?: string;
  updated?: boolean;
}

// CourseImage type
export interface CourseImage {
  id: string; // uint64 -> number
  imageLink: string; // string remains the same
  creator: number; // uint64 -> number
  createdAt: Date; // time.Time -> Date
}



export function mapCourse(json: any): Course {
  return {
    id: json.id,
    creator: json.creator,
    name: json.name,
    description: json.description,
    courseModules: json.course_modules?.map(mapCourseModule),
  };
}

function mapCourseModule(json: any): CourseModule {
  return {
    id: json.id,
    courseId: json.course_id,
    position: json.position,
    name: json.name,
    active: json.active,
    courseSteps: json.course_steps?.map(mapCourseStep),
  };
}

function mapCourseStep(json: any): CourseStep {
  return {
    id: json.id,
    moduleId: json.module_id,
    position: json.position,
    type: courseTypeMap[json.type] || CourseType.TextContent,
    name: json.name,
    active: json.active,
  };
}