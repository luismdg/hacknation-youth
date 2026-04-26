import { createFileRoute } from "@tanstack/react-router";
import { StudentHome } from "@/panels/student/sections/Home";
export const Route = createFileRoute("/student/")({ component: StudentHome });
