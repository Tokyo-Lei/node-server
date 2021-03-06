/**
 * @desc Auth middleware
 * @author Jooger <iamjooger@gmail.com>
 * @date 25 Sep 2017
 */

'use strict'

const compose = require('koa-compose')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { userProxy } = require('../proxy')
const debug = require('../util').getDebug('Auth')
const redirectReg = /auth\/github\/login(.*?)/

// 验证本地登录token
function verifyToken () {
	return async (ctx, next) => {
		ctx.session._verify = false
		const token = ctx.cookies.get(config.auth.session.key)

		if (token) {
			let decodedToken = null
			try {
				decodedToken = await jwt.verify(token, config.auth.secrets)
			} catch (err) {
				debug.error('本地登录Token校验出错，错误：', err.message)
				if (redirectReg.test(ctx.originalUrl)) {
					return ctx.redirect(ctx.query.redirectUrl || config.site)
				}
				return ctx.fail(401)
			}

			if (decodedToken && decodedToken.exp > Math.floor(Date.now() / 1000)) {
				// 已校验权限
				ctx.session._verify = true
				ctx.session._token = token
				debug.success('本地登录Token校验成功')
			}
		}
		await next()
	}
}

// 本地登录验证
exports.isAuthenticated = () => {
	return compose([
		verifyToken(),
		async (ctx, next) => {
			if (!ctx.session._verify) {
				return ctx.fail(401)
			}

			const userId = ctx.cookies.get(config.auth.userCookieKey, { signed: false })
			const user = await userProxy.getById(userId).exec().catch(err => {
				debug.error('token验证时用户查找失败, 错误：', err.message)
				ctx.log.error(err.message)
				return null
			})
			if (!user) {
				return ctx.fail(401, '用户不存在')
			}
			ctx._user = user.toObject()
			ctx._isAuthenticated = true
			await next()
		}
	])
}
