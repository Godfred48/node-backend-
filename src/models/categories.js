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
    const results = db.query(query, queryParams)

    return results.rows;

}

export { getAllCategories, getCategoryById, getCategoriesByServiceProjectId};