import express from "express";
import {createPhoto, getAllPhotos,getAPhoto,deletePhoto,updatePhoto} from "../controllers/photoController.js";

const router = express.Router();

router.route('/').get(getAllPhotos).post(createPhoto);

router.route('/:id').get(getAPhoto)
router.route('/:id').delete(deletePhoto)
router.route('/:id').put(updatePhoto)


export default router;