import express from "express";
import {getIndexPage, getAboutPage, getLoginPage, getRegisterPage, getLogout,getContactPage,sendMail} from '../controllers/pageController.js'

const router = express.Router();

router.route('/').get(getIndexPage);
router.route('/about').get(getAboutPage);

router.route('/login').get(getLoginPage);
router.route('/register').get(getRegisterPage);

router.route('/logout').get(getLogout)
router.route('/contact').get(getContactPage)
router.route('/contact').post(sendMail)

export default router;