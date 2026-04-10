const fs = require('fs');
const html = fs.readFileSync('layout.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

let finalHtml = html.replace('/* CSS_INJECT_HERE */', css);
finalHtml = finalHtml.replace('/* JS_INJECT_HERE */', js);

fs.writeFileSync('index.html', finalHtml);
console.log('Successfully built single-file HavenOS index.html');
