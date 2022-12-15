import Router from 'express'
const router = new Router()
import userController from '../controller/user.controller.js'
import pageController from "../controller/page.controller.js";

router.post('/auth', userController.authUser)
router.get('/auth/check', userController.checkUser)
router.post('/register', userController.createUser)
router.get('/user', userController.getUser)
router.put('/user', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)

export default router;