﻿var News = require('./../model/news.model');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var Archive = require('./../model/archive.model');
var Category = require('./../model/category.model');
var async = require('async');

module.exports = {
  createNews: createNews,
  getAllNews: getAllNews,
  getNewsById: getNewsById,
  updateNews: updateNews,
  deleteNews: deleteNews,
  addNews: addNews,
  activeNews: activeNews,
  deActiveNews: deActiveNews,
  getNewsHome: getNewsHome,
  getNewsNearest: getNewsNearest,
  getNewsMostPopular: getNewsMostPopular,
  getNewsArchive: getNewsArchive
};

function addNews(request) {
  var news = new News({
    title: request.title,
    description: request.description,
    content: request.content,
    image: request.image,
    author: request.author,
    originalLink: request.originaLink,
    spiderId: request.spiderId,
    categoryId: request.categoryId,
    createDate: request.createDate,
    updateDate: Date.now()
  });
  return News.findOne({
    title: request.title
  }).exec().then(function (New) {
    if (New !== null) {
      return;
    }
    news.save().then(function () {
      return Promise.resolve();
    })
  });
}

function createNews(request) {
  var news = new News({
    title: request.title,
    description: request.description,
    content: request.content,
    image: request.image,
    author: request.author,
    originalLink: request.originaLink,
    spiderId: request.spiderId,
    categoryId: request.categoryId,
    createDate: request.createDate,
    updateDate: Date.now()
  });
  return News.findOne({
    title: request.title
  }).exec().then(function (New) {
    if (New !== null) {
      return Promise.reject({
        message: failMessage.news.dupplicate
      });
    }
    return news.save().then(function (err) {
      return Promise.resolve({
        message: successMessage.news.create
      });
    });
  });
}

function getAllNews() {
  return News.find().exec()
    .then(function (newss) {
      if (newss.length === 0) {
        return Promise.reject({
          message: failMessage.news.notFound
        });
      }
      return Promise.resolve({
        message: successMessage.news.getAll,
        news: newss
      });
    });
}

function getNewsById(request) {
  return News.findOne({
    _id: request.id
  }).exec().then(function (news) {
    if (news === null) {
      return Promise.reject({
        message: failMessage.news.notFound
      });
    }
    return Promise.resolve({
      message: successMessage.news.get,
      news: news
    });
  });
}

function updateNews(request) {
  return News.findById({
    _id: request.id
  }).exec().then(function (news) {
    if (news === null) {
      return Promise.reject({
        message: failMessage.news.notFound
      });
    }
    if (request.title !== undefined && request.title !== '') {
      news.title = request.title;
    }
    if (request.description !== undefined && request.description !== '') {
      news.description = request.description;
    }
    if (request.content !== undefined && request.content !== '') {
      news.content = request.content;
    }
    if (request.image !== undefined && request.image !== '') {
      news.image = request.image;
    }
    if (request.author !== undefined && request.author !== '') {
      news.author = request.author;
    }
    if (request.originalLink !== undefined && request.originalLink !== '') {
      news.originalLink = request.originalLink;
    }
    if (request.spiderId !== undefined && request.spiderId !== '') {
      news.spiderId = request.spiderId;
    }
    if (request.categoryId !== undefined && request.categoryId !== '') {
      news.categoryId = request.categoryId;
    }
    news.updateDate = Date.now();
    return News.findOne({
      title: request.title,
      _id: {
        $ne: request.id
      }
    }).exec().then(function (New) {
      if (New !== null) {
        return Promise.reject({
          message: failMessage.news.dupplicate
        });
      }
      return news.save().then(function (err) {
        return Promise.resolve({
          message: successMessage.news.update,
          news: news
        });
      });
    });
  });
}

function deleteNews(request) {
  return News.findByIdAndRemove({
    _id: request.id
  }).exec().then(function (err) {
    if (!err) {
      return Promise.reject({
        message: failMessage.news.notFound
      });
    }
    return Promise.resolve({
      message: successMessage.news.delete
    });
  });
}

function activeNews(request) {
  request.newsId.forEach(function (Id) {
    console.log(Id);
    News.findById({
      _id: Id
    }).exec().then(function (upNews) {
      upNews.active = true;
      upNews.save().then(function (err) {
        if (err) {
          return Promise.reject({
            message: failMessage.news.active
          });
        }
      });

    }).catch(function (err) {
      if (err) {
        return Promise.reject({
          message: failMessage.news.active
        });
      }
    })
  });
  return Promise.resolve({
    message: successMessage.news.active
  });
}

function deActiveNews(request) {
  request.newsId.forEach(function (Id) {
    console.log(Id);
    News.findById({
      _id: Id
    }).exec().then(function (upNews) {
      upNews.active = false;
      upNews.save().then(function (err) {
        if (err) {
          return Promise.reject({
            message: failMessage.news.deActive
          });
        }
      });

    }).catch(function (err) {
      if (err) {
        return Promise.reject({
          message: failMessage.news.deActive
        });
      }
    })
  });
  return Promise.resolve({
    message: successMessage.news.deActive
  });
}

function getNewsHome() {
  return News.find({
      active: true
    }).limit(5).exec()
    .then(function (newss) {
      if (newss.length === 0) {
        return Promise.reject({
          message: failMessage.news.notFound
        });
      }
      return Promise.resolve({
        message: successMessage.news.getAll,
        news: newss
      });
    });
}

//getNewsNearest
function getNewsNearest() {
  return News.find({
      active: true
    }).limit(5).exec()
    .then(function (newss) {
      if (newss.length === 0) {
        return Promise.reject({
          message: failMessage.news.notFound
        });
      }
      newss.sort(function (a, b) {
        var dateA = new Date(a.createDate),
          dateB = new Date(b.createDate);
        return dateB - dateA;
      });
      return Promise.resolve({
        message: successMessage.news.getAll,
        news: newss
      });
    });
}

//getNewsMostPopular
function getNewsMostPopular() {
  return News.find({
      active: true
    }).limit(20).exec()
    .then(function (newss) {
      if (newss.length === 0) {
        return Promise.reject({
          message: failMessage.news.notFound
        });
      }

      newss.sort(function (a, b) {
        return b.views - a.views;
      });

      return Promise.resolve({
        message: successMessage.news.getAll,
        news: newss
      })
    })
}

//getNewsArchive
function getNewsArchive(request) {
  console.log(request);
  return Archive.findOne({
    path: request.path
  }).exec().then(function (list_archive) {
    console.log(list_archive);
    if (list_archive === null) {
      return Promise.reject({
        message: failMessage.news.notFound
      });
    }
    var count = 0;
    var list_length = list_archive.listCategory.length;
    console.log(count + " " + list_length);
    async.whilst(function () {
      return count < list_length
    }, function (next) {
      console.log('logg ' + list_archive.listCategory[count]);
      count++;
      next();
    }, function (err) {

    });
    return Promise.resolve({
      message: successMessage.news.getAll
    });
  });
}
