import { json } from '@sveltejs/kit';
import { execSync } from 'child_process';
import fs from 'fs'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {text} = await request.json();
    let outputDir = 'C:/Users/vikin/OneDrive/Документы/GitHub/qualification-work/efrog-hub/my-app/static/'
    let inputFilePath = 'C:/Users/vikin/OneDrive/Документы/GitHub/qualification-work/efrog-hub/my-app/input.tex'
    fs.writeFileSync('input.tex', text);
    execSync(`pdflatex -output-directory=${outputDir} ${inputFilePath}`);
    return json("Зміни збережені");
}


