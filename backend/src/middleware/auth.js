import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next){
  try{
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if(!token) return res.status(401).json({ error: 'Missing token' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, role: payload.role }
    next()
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireAdmin(req, res, next){
  if(req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  next()
}


