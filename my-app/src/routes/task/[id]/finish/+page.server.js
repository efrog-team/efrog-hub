/** @type {import('./$types').LayoutServerLoad} */
export async function load({params }) {
    const task_id = params.id;
    return {task_id};
}