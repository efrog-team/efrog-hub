/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    const username = cookies.get("user");
    const userId = cookies.get("userId");
    return {username, userId}
}