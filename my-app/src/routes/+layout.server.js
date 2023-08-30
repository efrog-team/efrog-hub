
/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    const username = cookies.get("user")
    return {username}
}