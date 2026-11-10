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

//cretating a function for creating a new project 
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
    INSERT INTO service_projects (title, description, project_location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
    `
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0){
        throw new Error ("Failed to create project");
    }
    
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};


//function to update service project
const updateProject = async (title, description, projectLocation, projectDate, organizationId, projectId) => {
    const query = `
    UPDATE service_projects 
    SET title =  $1, description = $2, project_location = $3, project_date = $4, organization_id = $5
    WHERE project_id = $6 
    RETURNING project_id ;
    `;
    //note that the id you are returning  should be last
    const queryParams = [ title, description, projectLocation, projectDate, organizationId, projectId,];
    const results = await db.query(query, queryParams);

    if ( results.rows.length === 0 ){
        throw new Error("Project not found");
    };

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated organization with ID:', projectId);
      };

    return results.rows[0].project_id;

}

export { getAllProjects, getProjectByOrganizationId, getUpcomingProjects,
     getProjectsDetails, getProjectsByCategoryId, createProject, updateProject}