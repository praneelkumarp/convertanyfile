import JSZip from "jszip";

export async function extractZip(file: File) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());

  const resultFiles: { blob: Blob; name: string }[] = [];

  for (const filename of Object.keys(zip.files)) {
    const entry = zip.files[filename];

    if (!entry.dir) {
      const blob = await entry.async("blob");
      resultFiles.push({ blob, name: filename });
    }
  }

  return {
    success: true,
    files: resultFiles,
  };
}
