var express = require('express');
var router = express.Router();
var fs = require('graceful-fs');
var Util = require('../lib/util');
var WPAPI = require('wpapi');
var CONFIG = require('../global/config');

var wp = new WPAPI({ endpoint: CONFIG.blog_endpoint });

router.get('/get-by-slug/:slug', (req, res) => {
    var slug = req.params.slug;
    wp.categories().slug(slug)
        .then(function (cats) {
            var fictionCat = cats[0];
            wp.posts().categories(fictionCat.id).perPage(3)
                .then((posts) => {
                    var promises = [];
                    var result = [];
                    posts.forEach(function (post) {
                        var promise = wp.media().id(post.featured_media);
                        promises.push(promise);
                        result.push({
                            date: post.date,
                            link: post.link,
                            title: post.title.rendered,
                            content: post.content.rendered,
                            excerpt: post.excerpt.rendered,
                        })
                    }, this);
                    Promise.all(promises)
                        .then(media => {
                            for (var i = 0; i < media.length; i++){
                                result[i].featured_media = media[i].guid.rendered;
                            }
                            Util.responseHandler(res, true, '', result);
                        })
                        .catch(err => {
                            Util.responseHandler(res, true, 'Featured Image Not Set', result);
                        })
                })
        });
})

module.exports = router;