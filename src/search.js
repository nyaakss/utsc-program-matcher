export function searchCourses(query, courses, limit = 8){
    const q = query.trim().toLowerCase();
    if(q.length < 2) return [];
    return courses.filter().sort().slice(0, limit);//TODO:will complete
}