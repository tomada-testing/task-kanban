"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult, Task, TaskFormData, TaskRow } from "@/lib/types";
import { toTask } from "@/lib/types";

export async function fetchTasks(): Promise<ActionResult<Task[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: (data as TaskRow[]).map(toTask) };
}

export async function createTask(
  formData: TaskFormData,
): Promise<ActionResult<Task>> {
  if (!formData.title.trim()) {
    return { success: false, error: "タイトルは必須です" };
  }
  if (formData.title.length > 255) {
    return { success: false, error: "タイトルは255文字以内で入力してください" };
  }

  const supabase = await createClient();

  const { data: maxPosData } = await supabase
    .from("tasks")
    .select("position")
    .eq("status", formData.status)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition =
    maxPosData && maxPosData.length > 0 ? maxPosData[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  return { success: true, data: toTask(data as TaskRow) };
}

export async function updateTask(
  id: string,
  formData: TaskFormData,
): Promise<ActionResult<Task>> {
  if (!formData.title.trim()) {
    return { success: false, error: "タイトルは必須です" };
  }
  if (formData.title.length > 255) {
    return { success: false, error: "タイトルは255文字以内で入力してください" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  return { success: true, data: toTask(data as TaskRow) };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  return { success: true };
}
