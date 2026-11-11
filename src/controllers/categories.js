import { getAllCategories } from '../models/categories.js'
import { getProjectsByCategoryId } from '../models/projects.js';
import { getCategoryById } from '../models/categories.js';
import { getProjectsDetails } from '../models/projects.js';
import { getCategoriesByServiceProjectId } from '../models/categories.js';
import { updateCategoryAssignments } from '../models/categories.js';
import { createNewCategory, updateCategories } from '../models/categories.js';
import { body, validationResult} from 'express-validator';

const categoryValidation = [
  body('categoryName')
      .trim()//take off all white space before and after 
      .notEmpty() //make sure the name field is not empty
      .withMessage('Category name is required')//message to appear if the notEmpty ins false 
      .isLength({min: 3, max: 100 }) //determines the length of name 
      .withMessage('Category name must be between 3 to 150 characters'),//message when isLength is false 
]


//controller for displaying results to the categories main page
const showCategoriesPage = async(req, res) => {
  const categories = await getAllCategories();
  const title = 'Project Categories';
  res.render('categories', {title, categories});
};

//controller for diplaying reults to category details page 
const showCategoryDetailsPage = async(req, res)=>{
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);

  res.render('category', {title: category.category_name, category, projects});
}

//function controller to display the assign Categories form page and details
const showAssignCategoriesForm = async (req, res) => {
  //retrieve projeect id 
  const projectId = req.params.projectId;
  const projectDetails = await getProjectsDetails(projectId);
  const categories = await getAllCategories();  // retrieve categories from categories model
  const assignedCategories = await getCategoriesByServiceProjectId(projectId); //retrieve categories from project model

  const title = 'Assign Categories to Project';

  res.render( 'assign-categories' , {title, projectId, projectDetails, categories, assignedCategories});

};


//function controller that process the assign cattegories form 
const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || []; //note that more than one categories can be selected 
                                                          //for a project so we fix the projects selected categories (their id in  an array. If none is seleted the array empty is selected)
  
   // Ensure selectedCategoryIds is an array
   const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
   await updateCategoryAssignments(projectId, categoryIdsArray); //update category funtion based on id 
   //display flash message 
   req.flash('success', 'Categories updated successfully.');
   res.redirect(`/project/${projectId}`);

}

const showNewCategoryForm = (req, res) => {
  const title = 'New Category Form';
  res.render('new-category', {title});

}

const processNewCategoryForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()){
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.redirect('/new-category');
  };

  const {categoryName} = req.body;
  const categoryId = await createNewCategory(categoryName);

   //set a success flash message 
   req.flash( 'success', 'Category created successfully!');
   res.redirect(`/category/${categoryId}`)  //we redirect to a different page automatically after the organization is created and id is generated
 

}

const showUpdateCategoryForm = async (req ,res) =>{
  const title = 'Update Category Page';
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  res.render('edit-category', {title, category})
}

const processUpdateCategoryForm = async(req, res) => {
  const categoryId = req.params.id;

  //check for validation
  const results = validationResult(req);
  if (!results.isEmpty()){
     // Validation failed - loop through errors
     results.array().forEach((error)=>{
        req.flash('error', error.msg);
     });

     // Redirect back to the edit category form
   return res.redirect('/edit-category/' + categoryId);

  }

  const { categoryName } = req.body;
  await updateCategories(categoryName, categoryId);

  req.flash('success', 'Category updated successfully!');
  res.redirect(`/category/${categoryId}`);
}
export { showCategoriesPage, showCategoryDetailsPage, 
  processAssignCategoriesForm, showAssignCategoriesForm, 
  categoryValidation, showNewCategoryForm, 
  processNewCategoryForm, showUpdateCategoryForm, 
  processUpdateCategoryForm}