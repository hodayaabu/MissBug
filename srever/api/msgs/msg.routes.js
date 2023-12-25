import express from 'express'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'

import { addMsg, getMsgs, deleteMsg } from './msg.controller.js'
const router = express.Router()

router.get('/', getMsgs)
router.post('/', requireAuth, addMsg)
router.delete('/:id', requireAdmin, deleteMsg)

export const msgRoutes = router