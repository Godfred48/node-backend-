 import { getAllProjects } from '../models/projects.js';
 import { getUpcomingProjects } from '../models/projects.js';
 import { getProjectsDetails } from '../models/projects.js';
 import { getCategoriesByServiceProjectId } from '../models/categories.js';
 import { createProject } from '../models/projects.js';
 import { getAllOrganizations } from '../models/organizations.js';
 import { body , validationResult } from 'express-validator'; //imported from express to validate for before processing 
 import { updateProject } from '../models/projects.js';

 //define validation and sanitation rules for new project form
 const projectValidation = [
   body('title')
       .trim()
       .notEmpty().withMessage('Title is required')
       .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
   body('description')
       .trim()
       .notEmpty().withMessage('Description is required')
       .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
   body('location')
       .trim()
       .notEmpty().withMessage('Location is required')
       .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
   body('date')
       .notEmpty().withMessage('Date is required')
       .isISO8601().withMessage('Date must be a valid date format'),
   body('organizationId')
       .notEmpty().withMessage('Organization is required')
       .isInt().withMessage('Organization must be a valid integer')
];

 //ffunction to display the number of projects.
 const showProjectsPage = async (req, res) => {
    const NUMBER_OF_UPCOMING_PROJECTS = 5;
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = 'Upcoming Service Projects';
  res.render('projects', {title, projects});
 };

//function controller that display details of a given project based on Id 
 const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectsDetails(projectId);
    const categories = await getCategoriesByServiceProjectId(projectId);
    res.render('project', { title: project.title, project, categories });
 };

 //function controller for creating a new project
const showNewProjectForm = async (req, res) => {
   const organizations = await getAllOrganizations();

   const title = 'New Service Project';
   res.render('new-project', {title, organizations});
};

//function controller for processing the new project form
const processNewProjectForm = async (req, res) => {
   // Extract form data from req.body
   const { title, description, location, date, organizationId } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

   try {
       // Create the new project in the database
       const newProjectId = await createProject(title, description, location, date, organizationId);

       req.flash('success', 'New service project created successfully!');
       res.redirect(`/project/${newProjectId}`);
   } catch (error) {
       console.error('Error creating new project:', error);
       req.flash('error', 'There was an error creating the service project.');
       res.redirect('/new-project');
   }
}

//controller to show edit project form
const showEditProjectForm = async (req, res) => {
   const projectId = req.params.id;
   const organizationId = req.params.organizationId;
   const projectDetails = await getProjectsDetails(projectId);
   const organizations = await getAllOrganizations(organizationId)

   const title = 'Edit Service Project';
   res.render('edit-project', {title, projectDetails, organizations});
};

//controller to proceess the edit project forrm
const processEditProjectForm = async(req, res) =>{
   console.log(req.body);   // temporary: remove after testing
   const projectId = req.params.id;

   //check for validation
   const results = validationResult(req);
   if (!results.isEmpty()){
      // Validation failed - loop through errors
      results.array().forEach((error)=>{
         req.flash('error', error.msg);
      });

      // Redirect back to the edit project form
    return res.redirect('/edit-project/' + req.params.id);

   }
   const { title, description, location, date, organizationId} = req.body;
   await updateProject(title, description, location, date, organizationId, projectId,);
      
  //set flash message
  req.flash( 'success', 'Service project updated successfully');
  //redirect to project dedtail page 
  res.redirect(`/project/${projectId}`);
}

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, showEditProjectForm ,projectValidation, processNewProjectForm , processEditProjectForm};
