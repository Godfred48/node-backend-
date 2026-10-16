---create organization table 
CREATE TABLE organization(
organization_id SERIAL PRIMARY KEY,
organization_name VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
contact_email VARCHAR(225) NOT NULL,
logo_filename VARCHAR(225) 
);

INSERT INTO organization( organization_name, description,contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT * FROM organization;

---create service project table
CREATE TABLE service_projects (
  project_id SERIAL PRIMARY KEY,
  organization_id  INTEGER,
  title           VARCHAR(150) NOT NULL,
  description     TEXT NOT NULL,
  project_location VARCHAR(255) NOT NULL,
  project_date    DATE NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

INSERT INTO service_projects (organization_id, title, description, project_location, project_date) VALUES
-- Organization 1
(1, 'Community Beach Cleanup', 'Volunteers collect plastic and waste along the shoreline.', 'Labadi Beach, Accra', '2026-11-07'),
(1, 'School Painting Day', 'Repaint classrooms and fences at a public primary school.', 'Madina, Accra', '2026-11-21'),
(1, 'Tree Planting Drive', 'Plant 200 seedlings to restore a degraded green space.', 'Aburi, Eastern Region', '2026-12-05'),
(1, 'Food Drive', 'Collect and distribute food packages to families in need.', 'Nima, Accra', '2026-12-12'),
(1, 'Neighborhood Clean-Up', 'Clear drains and sweep streets in the community.', 'Kaneshie, Accra', '2027-01-16');

INSERT INTO service_projects (organization_id, title, description, project_location, project_date) VALUES
-- Organization 2
(2, 'Free Health Screening', 'Basic blood pressure and sugar checks for residents.', 'Tema Community 4', '2026-11-14'),
(2, 'Coding Workshop for Teens', 'Introductory HTML and CSS class for high school students.', 'Osu, Accra', '2026-11-28'),
(2, 'Library Book Donation', 'Collect and deliver books to a rural school library.', 'Ho, Volta Region', '2026-12-09'),
(2, 'Senior Care Visit', 'Spend time with and assist elderly residents at a care home.', 'East Legon, Accra', '2027-01-09'),
(2, 'Blood Donation Drive', 'Partner with the hospital to collect blood donations.', 'Korle Bu, Accra', '2027-01-30');

INSERT INTO service_projects (organization_id, title, description, project_location, project_date) VALUES
-- Organization 3
(3, 'Clothing Giveaway', 'Distribute gently used clothing to families.', 'Ashaiman', '2026-11-10'),
(3, 'Water Well Repair', 'Help repair a community borehole and train residents on upkeep.', 'Kpando, Volta Region', '2026-11-26'),
(3, 'Youth Mentorship Day', 'Professionals mentor students on career paths.', 'Legon, Accra', '2026-12-17'),
(3, 'Market Waste Sorting', 'Set up recycling bins and teach sorting at a local market.', 'Makola Market, Accra', '2027-01-23'),
(3, 'Park Renovation', 'Fix benches and repaint playground equipment.', 'Adenta, Accra', '2027-02-06');


-- SELECT title,project_location,project_date 
-- FROM service_projects
-- WHERE organization_id = 2

 

--categories page
CREATE TABLE categories(
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(150) NOT NULL
);

INSERT INTO categories(category_name)
VALUES  
('Environmental'),
('Education'),
('Health'),
('Community Support'),
('Infrastructure');

SELECT * FROM categories 


--joint table from service _project and categories (many to many)
CREATE TABLE project_categories(
	project_id INT,
	category_id INT,
	PRIMARY KEY (project_id, category_id),
	FOREIGN KEY (project_id) REFERENCES service_projects (project_id),
	FOREIGN KEY (category_id) REFERENCES categories (category_id)
	);


INSERT INTO project_categories (project_id, category_id) VALUES
-- BrightFuture Builders
(1, 1),   -- Community Beach Cleanup: Environmental
(2, 2),   -- School Painting Day: Education
(2, 5),   -- School Painting Day: Infrastructure
(3, 1),   -- Tree Planting Drive: Environmental
(4, 4),   -- Food Drive: Community Support
(5, 1),   -- Neighborhood Clean-Up: Environmental
(5, 5),   -- Neighborhood Clean-Up: Infrastructure

-- GreenHarvest Growers
(6, 3),   -- Free Health Screening: Health
(7, 2),   -- Coding Workshop for Teens: Education
(8, 2),   -- Library Book Donation: Education
(8, 4),   -- Library Book Donation: Community Support
(9, 3),   -- Senior Care Visit: Health
(9, 4),   -- Senior Care Visit: Community Support
(10, 3),  -- Blood Donation Drive: Health

-- UnityServe Volunteers
(11, 4),  -- Clothing Giveaway: Community Support
(12, 5),  -- Water Well Repair: Infrastructure
(12, 3),  -- Water Well Repair: Health
(13, 2),  -- Youth Mentorship Day: Education
(14, 1),  -- Market Waste Sorting: Environmental
(15, 5),  -- Park Renovation: Infrastructure
(15, 1);  -- Park Renovation: Environmental

SELECT * FROM project_categories;


