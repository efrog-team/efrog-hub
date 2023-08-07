export async function PUT({cookies}) {
    cookies.delete("token", { path: '/' });
    return new Response(null, { status: 204 });
}