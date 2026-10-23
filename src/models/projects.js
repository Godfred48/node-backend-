import db from './db.js';

//function to get all projects from database 
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

//function to get projects based on organization
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

//function for upcomming projects 
const getUpcomingProjects= async(number_of_projects) => {
    const query = `
    SELECT 
    sp.project_id,
    sp.title,
    sp.description,
    sp.project_date,
    sp.project_location,
    o.organization_name,
    sp.organization_id
    FROM service_projects sp
    JOIN organization o ON sp.organization_id = o.organization_id
    WHERE sp.project_date >= CURRENT_DATE
    ORDER BY sp.project_date ASC
        LIMIT $1;  ---represents the number onf projects to be displayed
    `
    const results = await db.query(query, [number_of_projects]);
    return results.rows
}

//function to get project detaiils 
const getProjectsDetails = async(id)=>{ 
    const query = 
    `
    SELECT 
    sp.project_id,
    sp.title,
    sp.description,
    sp.project_date,
    sp.project_location,
    sp.organization_id,
    o.organization_name
    FROM service_projects sp
    JOIN organization o ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1;
    `
    const queryParams = [id];
    const results = await db.query(query, queryParams);

    return results.rows[0];
}


// 3. Retrieve all service projects for a given category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date,
            sp.project_location ,
            sp.organization_id,
            o.organization_name
        FROM service_projects sp
        JOIN project_categories pc
            ON sp.project_id = pc.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date ASC;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};
export { getAllProjects, getProjectByOrganizationId, getUpcomingProjects, getProjectsDetails, getProjectsByCategoryId}