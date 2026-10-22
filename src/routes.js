import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showCategoriesPage } from './controllers/categories.js';
import { showOrganizationsPage } from './controllers/organization.js';
import { showProjectsPage } from './controllers/projects.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router(); //assign router from express as router


router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;