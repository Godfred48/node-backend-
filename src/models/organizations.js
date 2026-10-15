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

export {getAllOrganizations}