﻿var router = require('express').Router();
var spiderDao = require('./../dao/spider.dao');

module.exports = function () {
  router.post('/', createSpider);
  router.get('/', getAllSpider);
  router.get('/:id', getSpiderById);
  router.put('/:id', updateSpider);
  router.delete('/:id', deleteSpider);
  router.post('/:crawlingName', callSpider);
  router.post('/:crawlingName/update', updateNewsSpider);
  router.post('/:crawlingName/:catelogyId', callSpiderPath);
  router.post('/:crawlingName/:catelogyId/update', updateNewsSpiderUpdatePath)

  function createSpider(req, res, next) {
    var request = {
      urlId: req.body.urlId,
      name: req.body.name,
      crawlingName: req.body.crawlingName
    };
    spiderDao.createSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function getAllSpider(req, res, next) {
    spiderDao.getAllSpider()
      .then(function (spiders) {
        res.status(200).send(spiders).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function getSpiderById(req, res, next) {
    var request = {
      id: req.params.id
    }
    spiderDao.getSpiderById(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function updateSpider(req, res, next) {
    var request = {
      id: req.params.id,
      name: req.body.name,
      isSourceUpdated: req.body.isSourceUpdated,
      isActive: req.body.isActive,
      updateDate: Date.now(),
      crawlingName: req.body.crawlingName,
      urlId: req.body.urlId
    }
    spiderDao.updateSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function deleteSpider(req, res, next) {
    var request = {
      id: req.params.id
    }
    spiderDao.deleteSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //update all news in crawlingName
  function callSpider(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName
    }
    spiderDao.callSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //update all news in crawlingName
  function updateNewsSpider(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
    }
    spiderDao.updateNewsSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //call get all news in crawlingNews with catelogyId
  function callSpiderPath(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      catelogyId: req.params.catelogyId
    }
    spiderDao.callSpiderPath(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }



  // update all news in crawlingName with catelogyId
  function updateNewsSpiderUpdatePath(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      catelogyId: req.params.catelogyId
    }
    spiderDao.updateNewsSpiderUpdate(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }
  return router;
}
