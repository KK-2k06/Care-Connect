import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

function createToken(user){
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords must match')
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    const existing = await User.findOne({ email })
    if(existing) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await User.hashPassword(password)
    const user = await User.create({ email, passwordHash, role: 'user' })
    const token = createToken(user)
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } })
  }
)

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await user.verifyPassword(password)
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = createToken(user)
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } })
  }
)

router.post(
  '/admin-login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
    body('adminCode').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password, adminCode } = req.body
    if(adminCode !== process.env.ADMIN_CODE) return res.status(401).json({ error: 'Invalid admin code' })
    const user = await User.findOne({ email })
    if(!user) return res.status(401).json({ error: 'Invalid credentials' })
    if(user.role !== 'admin') return res.status(403).json({ error: 'Not an admin account' })
    const ok = await user.verifyPassword(password)
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = createToken(user)
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } })
  }
)

export default router


