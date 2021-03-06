/**
 * @desc front api map
 * @author Jooger <iamjooger@gmail.com>
 * @date 25 Sep 2017
 */

'use strict'

const router = require('koa-router')()
const {
	article,
	category,
	tag,
	comment,
	music,
	option,
	user,
	auth,
	moment
} = require('../controller')

// Article
router.get('/articles', article.list)
router.get('/articles/hot', article.hot)
router.get('/articles/archives', article.archives)
router.get('/articles/:id', article.item)
router.post('/articles/:id/like', article.like)

// Comment
router.get('/comments', comment.list)
router.get('/comments/:id', comment.item)
router.post('/comments', comment.create)
router.post('/comments/:id/like', comment.like)

// Tag
router.get('/tags', tag.list)
router.get('/tags/:id', tag.item)

// Category
router.get('/categories', category.list)
router.get('/categories/:id', category.item)

// Music
router.get('/music/songs', music.list)
router.get('/music/songs/:song_id', music.item)
router.get('/music/songs/:song_id/url', music.url)
router.get('/music/songs/:song_id/lyric', music.lyric)

// Option
router.get('/options', option.data)

// User
router.get('/users/blogger', user.blogger)
router.get('/users/guests', user.guests)
router.get('/users/:id', user.item)

// Auth
router.get('/auth/github/token', auth.fetchGithubToken)
router.get('/auth/github/user', auth.fetchGithubUser)

// Moment
router.get('/moments', moment.list)

module.exports = router
