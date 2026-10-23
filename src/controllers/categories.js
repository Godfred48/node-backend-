import { getAllCategories } from '../models/categories.js'
import { getProjectsByCategoryId } from '../models/projects.js';
import { getCategoryById } from '../models/categories.js';
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
export { showCategoriesPage, showCategoryDetailsPage }