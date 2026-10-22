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

const getProjectByOrganizationId = async(organizationId)=>{
  const query=  `
    SELECT 
    project_id,
    organization_id,
    title,
    description,
    project_location ,
    project_date
    FROM service_projects
    WHERE organization_id = $1
    ORDER BY project_date;
    `
    const queryParams = [organizationId];
    const results = await db.query(query, queryParams);

    return results.rows//.length > 0  ? results.rows[0] : null;
}

export { getAllProjects, getProjectByOrganizationId }