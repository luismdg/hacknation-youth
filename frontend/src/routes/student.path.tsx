import { createFileRoute } from "@tanstack/react-router";
import { StudentMyPath } from "@/panels/student/sections/MyPath";
export const Route = createFileRoute("/student/path")({ component: StudentMyPath });
