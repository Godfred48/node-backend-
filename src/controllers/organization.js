import { getAllOrganizations } from '../models/organizations.js';
import { getOrganizationDetails } from '../models/organizations.js';
import { getProjectByOrganizationId } from '../models/projects.js';

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

export { showOrganizationsPage, showOrganizationDetailsPage }