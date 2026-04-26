import { createFileRoute } from "@tanstack/react-router";
import { StudentNetwork } from "@/panels/student/sections/Network";
export const Route = createFileRoute("/student/network")({ component: StudentNetwork });
