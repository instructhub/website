// Course type
export interface Course {
  id: string; // uint64 -> number
  creator: string; // uint64 -> number
  name: string; // string remains the same
  description?: string; // string | undefined for optional fields
  courseStages?: CourseStage[]; // Foreign key relationship
}

// CourseStage type
export interface CourseStage {
  id?: string; // uint64 -> number
  courseId: string; // uint64 -> number
  position: number; // int -> number
  name: string; // string remains the same
  active?: boolean; // *bool -> boolean | undefined
  course?: Course; // Foreign key relationship
  courseItems?: CourseItem[]; // Foreign key relationship
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

// CourseItem type
export interface CourseItem {
  id?: string;
  stageId?: string;
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
    courseStages: json.course_stages?.map(mapCourseStage),
  };
}

function mapCourseStage(json: any): CourseStage {
  return {
    id: json.id,
    courseId: json.course_id,
    position: json.position,
    name: json.name,
    active: json.active,
    courseItems: json.course_items?.map(mapCourseItem),
  };
}

function mapCourseItem(json: any): CourseItem {
  return {
    id: json.id,
    stageId: json.stage_id,
    position: json.position,
    type: courseTypeMap[json.type] || CourseType.TextContent,
    name: json.name,
    active: json.active,
  };
}