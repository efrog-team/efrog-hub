import { json } from "@sveltejs/kit";

export async function PUT({cookies}) {
    cookies.delete("token", { path: '/' });
    return json(1);
}