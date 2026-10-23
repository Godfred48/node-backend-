 import { getAllProjects } from '../models/projects.js';
 import { getUpcomingProjects } from '../models/projects.js';
 import { getProjectsDetails } from '../models/projects.js';
 import { getCategoriesByServiceProjectId } from '../models/categories.js';

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


 export { showProjectsPage, showProjectDetailsPage};
