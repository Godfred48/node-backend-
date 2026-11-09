import db from './db.js'
//function to retrieve all categories frrom database 
const getAllCategories = async ()=>{
    const query = `
    SELECT category_name,category_id
    FROM categories;`
    ;

    const result = await db.query(query);
    return result.rows;
}

//function that retrieves a single category by id
const getCategoryById = async(categoryId) =>{
    const query = `
    SELECT category_id, category_name 
    FROM categories
    WHERE category_id = $1;
    `
    const queryParams = [categoryId];
    const results = await db.query(query, queryParams);
    return results.rows[0]; //return the first row of the results
}

//function that provides the categories based on the service project ID
const getCategoriesByServiceProjectId = async(projectId) => {
    const query = `
    SELECT c.category_id, c.category_name
    FROM categories c
    JOIN project_categories pc
    ON c.category_id = pc.category_id
    WHERE project_id = $1
    ORDER BY c.category_name ASC;
    `
    const queryParams = [projectId];
    const results = await db.query(query, queryParams)

    return results.rows;

}

//function to assign category to project
const assignCategoryToProject = async(projectId, categoryId) => {
    const query = `
        INSERT INTO project_categories (project_id, category_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [projectId, categoryId]);
}

//functon to update the category assigned 
const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
}

export { getAllCategories, getCategoryById, getCategoriesByServiceProjectId, updateCategoryAssignments};