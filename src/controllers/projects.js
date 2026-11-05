 import { getAllProjects } from '../models/projects.js';
 import { getUpcomingProjects } from '../models/projects.js';
 import { getProjectsDetails } from '../models/projects.js';
 import { getCategoriesByServiceProjectId } from '../models/categories.js';
 import { createProject } from '../models/projects.js';
 import { getAllOrganizations } from '../models/organizations.js';

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
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };
