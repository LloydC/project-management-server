const router = require("express").Router();
const mongoose = require("mongoose");
const Project = require('../models/Project.model');
// const Task = require('../models/Task.model');
router.get('/projects', (req, res) => {
    Project.find()
            .populate('tasks')
            .then(projects => res.json(projects))
            .catch(err => console.log(err))
})
 
//  POST /api/projects  -  Creates a new project
router.post('/projects', (req, res) => {
  const { title, description } = req.body;
 
  Project.create({ title, description, tasks: [] })
    .then(response => res.json(response))
    .catch(err => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get('/projects/:projectId', (req, res) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    // Each Project document has `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Project.findById(projectId)
      .populate('tasks')
      .then(project => res.status(200).json(project))
      .catch(error => res.json(error));
  });

  // PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put('/projects/:projectId', (req, res) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Project.findByIdAndUpdate(projectId, req.body, { new: true }) // req.body --> {title: "...", description: "..."}
      .then((updatedProject) => res.json(updatedProject))
      .catch(error => res.json(error));
  });

  // DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete('/projects/:projectId', (req, res) => {
    const { projectId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Project.findByIdAndRemove(projectId)
      .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
      .catch(error => res.json(error));
  });


module.exports = router;