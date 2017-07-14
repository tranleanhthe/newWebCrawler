﻿var request = require("request");
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var News = require('./../model/news.model');
var async = require('async');

module.exports = {
  spiderTinNongNghiep: spiderTinNongNghiep,
  updateContentSpiderTinNongNghiep: updateContentSpiderTinNongNghiep
}


function spiderTinNongNghiep(urlId, spiderId) {
  console.log(urlId);
  console.log(urlId.path);

  urlId.path.forEach(url => {
    var disUrl = urlId.hostname + url.namePath;
    getPath_spiderTinNongNghiep(disUrl, spiderId, url.catelogyId);
  });

}

function updateContentSpiderTinNongNghiep() {
  News.find({}, function (err, news) {
    var page = 0;
    var lastPage = news.length;
    async.whilst(function () {
        return page < lastPage;
      },
      function (next) {
        if (news[page].title === undefined || news[page].title === "") {
          request(news[page].originalLink, function (err, res, body) {
            console.log(res.statusCode);
            if (!err && res.statusCode === 200) {
              var $ = cheerio.load(body);
              async.series({
                  title: function (callback) {
                    news[page].title = $('#main-content > div.content > article > div > h1 > span').text();
                    callback(null, news[page].title);
                  },
                  content: function (callback) {
                    news[page].content = $('#main-content > div.content > article > div > div.entry').html();
                    callback(null, news[page].content);
                  },
                  author: function (callback) {
                    news[page].author = $('#main-content > div.content > article > div > p > span:nth-child(1) > a').text();
                    callback(null, news[page].author);
                  },
                  createDate: function (callback) {
                    var date = new Date();
                    var dateF = $('#main-content > div.content > article > div > p > span:nth-child(2)').text().split('/');
                    date.setDate(dateF[0]);
                    date.setMonth(dateF[1]);
                    date.setFullYear(dateF[2]);
                    callback(null, date);
                  },
                  updateDate: function (callback) {
                    callback(null, Date.now());
                  }
                },
                function (err, result) {
                  news[page].title = result.title;
                  news[page].content = result.content;
                  news[page].author = result.author;
                  news[page].createDate = result.createDate;
                  news[page].updateDate = result.updateDate;
                  console.log(news[page].title);
                  console.log(news[page].createDate);
                  news[page].save(function (err) {
                    if (err) {
                      console.log('error');
                    }
                  });
                });
            } else {
              console.log('log die');
            }
            page++;
            next();
          });
        }
      },
      function (err) {
        // All things are done!
      });
  });
}

function getPath_spiderTinNongNghiep(path, spiderId, catelogyId) {
  if (path === undefined) {
    return;
  }
  request(path, function (error, response, body) {
    if (!error) {
      var $ = cheerio.load(body);
    }
    $('.post-listing .post-box-title a').each(function () {
      url = ($(this).attr('href'));
      var news = new News({
        originalLink: url,
        spiderId: spiderId,
        categoryId: catelogyId
      });
      News.findOne({
        originalLink: news.originalLink
      }, function (err, New) {
        if (New === null) {
          news.save();
        }
      });
    });
    gotoPage = $('#tie-next-page a').attr('href');
    if (gotoPage === undefined) {
      return;
    }
    getPath_spiderTinNongNghiep(gotoPage, spiderId, catelogyId);
  });
  return;
}
