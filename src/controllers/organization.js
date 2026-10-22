import { getAllOrganizations } from '../models/organizations.js';

const showOrganizationsPage =  async(req, res) => {
    const organizations = await getAllOrganizations();
  console.log(organizations);

  const title = 'Our partner organizations';
  res.render('organizations', {title, organizations});
};

export { showOrganizationsPage }