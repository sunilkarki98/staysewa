import { cookies } from "next/headers";

export async function getTheme() {
    return (await cookies()).get("theme")?.value ?? "light";
}
