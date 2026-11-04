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


//inserting new organization to database \
/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */

const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
    INSERT INTO organization (organization_name, description, contact_email, logo_filename)
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id ----after inserting the database will auto provide the id 
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    //create condition(explicitly create an error) if the was no result
    if (result.rows.lenght === 0){
        throw new Error('Failed too create organization')
    }

    //display in terminal if in development mode 
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;//return organization id after insertion is done successfully
}

//creating function to edit organization
const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
    const query = `
        UPDATE organization 
        SET organization_name = $1, description = $2 ,contact_email = $3, logo_Filename = $4
        WHERE organization_id = $5
        RETURNING organization_id ;
    `;

    const queryParams = [ name, description, contactEmail, logoFilename, organizationId];
    const results = await db.query(query, queryParams);

    if( results.rows.length === 0){
        throw new Error("Organization not found");
    };
    //to display id in terminal during developmemnt 
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated organization with ID:', organizationId);
      }

      //return organization id
    return results.rows[0].organization_id;
}
export {getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization}