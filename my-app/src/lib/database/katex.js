import katex from 'katex';
export let generate_formula = (text) => {
    let generated;
    try{
        generated = katex.renderToString(text);
    }
    catch (e){
        return false;
    }
    return generated;
}