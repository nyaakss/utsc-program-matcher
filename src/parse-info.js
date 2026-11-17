import fs from 'fs/promises'
import * as cheerio from 'cheerio'

async function parseInfo(){
    const html = await fs.readFile('data/raw/site.html', 'utf8');//await to make sure I get the file and 'utf8' to ensure text and not bytes
    const $ = cheerio.load(html);
    const programs = [];
    const courses = [];
    $('h3.js-views-accordion-group-header').each((index, element) => {
        const title = $(element).text().trim();
        if (title.includes('CO-OP')) return;
        const titleList = title.split(' - ');
        const progCode = titleList.pop();
        const name = titleList.join(' - ');
        const type = title.match(/^(SPECIALIST|MAJOR|MINOR)/i)?.[1];//i means case insensitive
        if(!type) {
            const m = title.match(/^([A-Z]{3}[A-D]\d{2}[HY]\d)\s+-\s+(.+)$/);
            if (m) courses.push({ code: m[1], title: m[2] });
             return;
        }
        const body = $(element).next().find('.views-field-field-completion-requirements');
        body.find('br').replaceWith('\n');
        body.find('p, li').append('\n');
        const lines = body.text().split('\n').map(l => l.trim()).filter(Boolean);
        const sects = [];
        for(const line of lines){
            if(/^\d+\./.test(line)){//.test() ret T/F
                sects.push([line]);
            } else if(sects.length > 0){
                sects.at(-1).push(line);
            }
        }
        const required = [];
        for(const sect of sects){
            const text = sect.join(' ');
            if(/from the following|choose from|at least/i.test(text)) continue;
            const codes = text.match(/[A-Z]{3}[A-D]\d{2}[HY]\d?/g) || [];//g means match all occurences, not just one;
            required.push(...codes)
        }
        const reqCourses = [...new Set(required)];
        programs.push({name, progCode, type, reqCourses});
    });
    console.log(`Found ${programs.length} programs`);
    await fs.writeFile('data/programs.json', JSON.stringify(programs, null, 2));
    await fs.writeFile('data/courses.json', JSON.stringify(courses, null, 2));

}
parseInfo();
