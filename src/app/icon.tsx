import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

// Next.js App Router icon convention — replaces favicon.ico
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public/assets/img/logo/logo.png"),
  );
  const base64 = logoBuffer.toString("base64");
  const dataUrl = `data:image/png;base64,${base64}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} width={512} height={512} alt="Meo Decor" />,
    { width: 512, height: 512 },
  );
}
