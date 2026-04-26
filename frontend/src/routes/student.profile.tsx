import { createFileRoute } from "@tanstack/react-router";
import { StudentProfile } from "@/panels/student/sections/Profile";
export const Route = createFileRoute("/student/profile")({ component: StudentProfile });
