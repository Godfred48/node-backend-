import db from './db.js'

const getAllOrganizations = async ()=>{
    //assign query
    const query = `
    SELECT organization_id, organization_name, description, contact_email, logo_filename
    FROM public.organization;
    `;

    //return the results in rows
   const result = await db.query(query);
   return result.rows;
}

//retrieving organization details
const getOrganizationDetails = async(organizationId)=>{
    //query to retrieve organization details from database
    const query = `
    SELECT 
    organization_id,
    organization_name,
    description,
    contact_email,
    logo_filename
    FROM organization
    WHERE organization_id = $1
    `
    const queryParams = [organizationId] //enable get access to details of the id in question
    const result = await db.query(query, queryParams); //assign query result and id in question as one

    return result.rows.length > 0 ? result.rows[0] : null; // return result.

}
export {getAllOrganizations, getOrganizationDetails}