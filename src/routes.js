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
import { showUserRegistrationForm, processUserRegistrationForm ,showLoginForm,processLoginForm, processLogout, requireLogin, showDashboard, requireRole ,showUsersPage} from './controllers/user.js';


const router = express.Router(); //assign Router from express as router


router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage)
router.get('/new-organization', requireRole('admin') ,showNewOrganizationForm);
router.post('/new-organization',requireRole('admin'),organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'),showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'),organizationValidation, processEditOrganizationForm);
router.get('/new-project', requireRole('admin'),showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId',requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'),processAssignCategoriesForm);
router.get( '/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'),projectValidation, processEditProjectForm);
router.get('/new-category', requireRole('admin'),showNewCategoryForm);
router.post('/new-category', requireRole('admin'),categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'),showUpdateCategoryForm);
router.post('/edit-category/:id', requireRole('admin'),categoryValidation, processUpdateCategoryForm);
router.get('/users', requireRole('admin'), showUsersPage);
// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);
// error-handling routes
router.get('/test-error', testErrorPage);

export default router;