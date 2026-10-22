 import { getAllProjects } from '../models/projects.js';
 import { getUpcomingProjects } from '../models/projects.js';
 import { getProjectsDetails } from '../models/projects.js';

 //ffunction to display the number of projects.
 const showProjectsPage = async (req, res) => {
    const NUMBER_OF_UPCOMING_PROJECTS = 5;
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = 'Upcoming Service Projects';
  res.render('projects', {title, projects});
 };


 const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectsDetails(projectId);
    res.render('project', {title: project.title, project});
 };


 export { showProjectsPage, showProjectDetailsPage};
