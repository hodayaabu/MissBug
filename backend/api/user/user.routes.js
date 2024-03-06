import express from 'express'
import { addUser, getUserBugs, getUsers, removeUser, updateUser } from './user.controller.js'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', requireAdmin, getUsers)
router.get('/:userId', requireAuth, getUserBugs)
router.delete('/:userId', requireAdmin, removeUser)
router.post('/', addUser)
router.put('/', requireAdmin, updateUser)



export const userRoutes = router