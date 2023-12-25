import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug, addBugMsg, removeBugMsg } from './bug.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', requireAuth, removeBug)
router.post('/', requireAuth, addBug)
router.put('/', requireAuth, updateBug)

router.post('/:bugId/msg', requireAuth, addBugMsg)
router.delete('/:bugId/msg/:msgId', requireAuth, removeBugMsg)

export const bugRoutes = router