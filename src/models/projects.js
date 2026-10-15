import db from './db.js';

const getAllProjects = async() => {
    const query = `
       SELECT 
    sp.project_id,
    o.organization_name,
    sp.title,
    sp.project_location,
    sp.project_date,
    sp.description
FROM public.service_projects sp
JOIN public.organization o ON sp.organization_id = o.organization_id
ORDER BY sp.organization_id, sp.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

export { getAllProjects}