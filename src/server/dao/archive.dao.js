var Archive = require('./../model/archive.model');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var News = require('./../model/news.model');

module.exports = {
  createArchive: createArchive,
  getAllArchive: getAllArchive,
  getArchiveById: getArchiveById,
  updateArchive: updateArchive,
  deleteArchive: deleteArchive,
  addCategory: addCategory,
  removeCategory: removeCategory,
  getAllNewsByCate: getAllNewsByCate
};

function getAllNewsByCate(request) {
  console.log(request.limit);
  return Archive.findOne({
      _id: request.id,
    }).exec()
    .then(function (archive) {
      var listNews = [];
      var length = 0;
      return new Promise(function (resolve, reject) {
        archive.listCategory.forEach(element => {
          var t = new Promise(function (resolve, reject) {
            return News.find({
              categoryId: element
            }).exec().then(function (res) {
              res.forEach(x => {
                if (listNews.length < request.limit) {
                  console.log(listNews.length);
                  listNews.push(x);
                } else {
                  resolve(true);
                }
              });
              if (listNews.length === res.length) {
                resolve(true);
              }
            });
          });
          t.then(w => {
            length++;
            if (length === archive.listCategory.length) {
              return resolve({
                length: listNews.length,
                listNews: listNews
              });
            }
          });

        });
      });
    });
}

function removeCategory(request) {
  return Archive.findOne({
      _id: request.id,
    }).exec()
    .then(function (archive) {
      return Archive.findOne({
        _id: request.id
      }).exec().then(function (ar) {
        ar.listCategory.pull(request.CateId);
        return ar.save().then(function (err) {
          return Promise.resolve({
            message: successMessage.Archive.create
          });
        });
      });
    });
}

function addCategory(request) {
  console.log(request);
  return Archive.findOne({
      _id: request.id,
      "listCategory": request.CateId
    }).exec()
    .then(function (archive) {
      console.log(archive);
      if (archive !== null) {
        return Promise.reject({
          message: failMessage.Archive.dupplicate
        });
      }
      return Archive.findOne({
        _id: request.id
      }).exec().then(function (ar) {
        ar.listCategory.push(request.CateId);
        return ar.save().then(function (err) {
          return Promise.resolve({
            message: successMessage.Archive.create
          });
        });
      })

    });
}

function createArchive(request) {
  var newArchive = new Archive({
    name: request.name,
    path: request.path,
    listCategory: request.listCategory
  });
  return Archive.findOne({
      name: request.name
    }).exec()
    .then(function (Archive) {
      if (Archive != null) {
        return Promise.reject({
          message: failMessage.Archive.dupplicate
        });
      }
      return newArchive.save().then(function (err) {
        return Promise.resolve({
          message: successMessage.Archive.create
        });
      });
    });
}

function getAllArchive(request) {
  return Archive.find().exec()
    .then(function (Archives) {
      if (Archives.length === 0) {
        return Promise.reject({
          message: failMessage.Archive.notFound
        });
      }
      return Promise.resolve({
        message: successMessage.Archive.getAll,
        Archives: Archives
      });
    });
}

function getArchiveById(request) {
  return Archive.findOne({
    _id: request.id
  }).exec().then(function (Archive) {
    if (Archive === null) {
      return Promise.reject({
        message: failMessage.Archive.notFound
      });
    }
    return Promise.resolve({
      message: successMessage.Archive.get,
      Archive: Archive
    });
  });
}

function updateArchive(request) {
  return Archive.findById({
    _id: request.id
  }).exec().then(function (archive) {
    if (archive === null) {
      return Promise.reject({
        message: failMessage.Archive.notFound
      });
    }
    if (request.name !== undefined && request.name !== '') {
      archive.name = request.name;
    }
    if (request.path !== undefined && request.path !== '') {
      archive.path = request.path;
    }
    if (request.listCategory !== undefined && request.listCategory.length !== 0) {
      archive.listCategory = request.listCategory;
    }
    return Archive.findOne({
        name: request.name,
        _id: {
          $ne: request.id
        }
      }).exec()
      .then(function (archive2) {
        if (archive2 != null) {
          return Promise.reject({
            message: failMessage.Archive.dupplicate
          });
        }
        return archive.save().then(function (err) {
          return Promise.resolve({
            message: successMessage.Archive.create,
            archive: archive
          });
        });
      });
  });
}

function deleteArchive(request) {
  return Archive.findByIdAndRemove({
    _id: request.id
  }).exec().then(function (err) {
    if (!err) {
      return Promise.reject({
        message: failMessage.Archive.notFound
      });
    }
    return Promise.resolve({
      message: successMessage.Archive.delete
    });
  });
}
