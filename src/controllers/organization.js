import { getAllOrganizations } from '../models/organizations.js';
import { getOrganizationDetails } from '../models/organizations.js';
import { getProjectByOrganizationId } from '../models/projects.js';
import { createOrganization } from '../models/organizations.js';

const showOrganizationsPage =  async(req, res) => {
    const organizations = await getAllOrganizations();
  console.log(organizations);

  const title = 'Our partner organizations';
  res.render('organizations', {title, organizations});
};

const showOrganizationDetailsPage = async(req, res)=>{
  const organizationId = req.params.id; //this helps get the details provided via the given id
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectByOrganizationId(organizationId);
  const title = 'Organization Details';

  res.render('organization', {title, organizationDetails, projects})

}

const showNewOrganizationForm = (req, res)=> {
  const title = 'New Organizatioion Page';

  res.render('new-organization', {title});
}

//FUNCTION RESPONSIBLE FOR PROCESSING THE NE ORGANIZATION FOR WHEN SUBMITTED
const processNeworganizationForm = async (req, res) => {
  const {name, description, contactEmail} = req.body;
  const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
  res.redirect(`/organization/${organizationId}`)  //we redirect to a different page automatically after the organization is created and id is generated
}

export { showOrganizationsPage, showOrganizationDetailsPage,
   showNewOrganizationForm,processNeworganizationForm }