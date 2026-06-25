export function toFormData(
  data: Record<string, string | File | Blob | null | undefined>,
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value == null) continue;
    formData.append(key, value);
  }

  return formData;
}
