import { getAllCategories } from '../models/categories.js'
import { getProjectsByCategoryId } from '../models/projects.js';
import { getCategoryById } from '../models/categories.js';
import { getProjectsDetails } from '../models/projects.js';
import { getCategoriesByServiceProjectId } from '../models/categories.js';
import { updateCategoryAssignments } from '../models/categories.js';
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

export { showCategoriesPage, showCategoryDetailsPage, processAssignCategoriesForm, showAssignCategoriesForm}