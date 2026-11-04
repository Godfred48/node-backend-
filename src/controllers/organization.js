import { getAllOrganizations } from '../models/organizations.js';
import { getOrganizationDetails } from '../models/organizations.js';
import { getProjectByOrganizationId } from '../models/projects.js';
import { createOrganization } from '../models/organizations.js'
import { body , validationResult } from 'express-validator';

//define validation and sanitation rules for organization form
const organizationValidation = [
  body('name')
      .trim()//take off all white space before and after 
      .notEmpty() //make sure the name field is not empty
      .withMessage('Organiztion name is required')//message to appear if the notEmpty ins false 
      .isLength({min: 3, max: 150 }) //determines the length of name 
      .withMessage('Organization name must be between 3 to 150 characters'),//message when isLength is false 

  body('description')
      .trim()
      .notEmpty()
      .withMessage('Organization description is required')
      .isLength({ max: 500 })
      .withMessage('Organizaztion description can not exceed 500 characters'),
  body('contactEmail')
      .trim()
      .notEmpty().withMessage('Contact Email is required')//checks if email is empty
      .isEmail().withMessage('Please provide  a valid email address')
      .normalizeEmail()  //sanitizes the email to make it a standard
];

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
const processNewOrganizationForm = async (req, res) => {
  //check for validation 
  const results = validationResult(req); //serves an array where errors are pushed to
  if (!results.isEmpty()) { //detemin if the array is empty if not loop through for flash to display
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    //Redirect back to the new organization form 
   return res.redirect('/new-organization');
  }

  const {name, description, contactEmail} = req.body;
  const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
  //set a success flash message 
  req.flash( 'success', 'Organization added successfully!');
  res.redirect(`/organization/${organizationId}`)  //we redirect to a different page automatically after the organization is created and id is generated
};

export { showOrganizationsPage, showOrganizationDetailsPage,
   showNewOrganizationForm,processNewOrganizationForm, organizationValidation}