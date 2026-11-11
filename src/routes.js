import express from 'express';

import { showHomePage } from './controllers/index.js';
import { categoryValidation, showCategoriesPage } from './controllers/categories.js';
import { showOrganizationsPage } from './controllers/organization.js';
import { showProjectsPage, showNewProjectForm, processNewProjectForm, projectValidation} from './controllers/projects.js';
import { testErrorPage } from './controllers/errors.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import {  showOrganizationDetailsPage ,showNewOrganizationForm, processNewOrganizationForm, organizationValidation} from './controllers/organization.js';
import { showEditOrganizationForm , processEditOrganizationForm } from './controllers/organization.js';
import { processAssignCategoriesForm, showAssignCategoriesForm } from './controllers/categories.js';
import { showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { showNewCategoryForm, processNewCategoryForm, showUpdateCategoryForm, processUpdateCategoryForm} from './controllers/categories.js';


const router = express.Router(); //assign Router from express as router


router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage)
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization',organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get( '/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', showUpdateCategoryForm);
router.post('/edit-category/:id', categoryValidation, processUpdateCategoryForm);
// error-handling routes
router.get('/test-error', testErrorPage);

export default router;