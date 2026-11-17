import fs from 'fs/promises';
import { searchCourses } from '../src/search.js';

const courses = JSON.parse(await fs.readFile('data/courses.json', 'utf8'));
console.log(searchCourses('discrete', courses));