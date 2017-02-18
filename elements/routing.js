'use strict';

window.addEventListener('WebComponentsReady', function () {

  // We use Page.js for routing. This is a Micro
  // client-side router inspired by the Express router
  // More info: https://visionmedia.github.io/page.js/

  // Removes end / from app.baseUrl which page.base requires for production
  if (window.location.port === '') {
    // if production
    page.base(app.baseUrl.replace(/\/$/, ''));
  }

  // Middleware
  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();
  }

  function closeDrawer(ctx, next) {
    app.closeDrawer();
    next();
  }

  function setFocus(selected) {
    var routeSection = document.querySelector('section[data-route="' + selected + '"]');
    if (!routeSection) {
      return;
    }
    var pageTitle = routeSection.querySelector('.page-title');
    if (pageTitle) {
      pageTitle.focus();
    }
    var crntPageElement = routeSection.querySelector('[page-element]');
    app.set('crntPageElement', crntPageElement);
    app.set('crntPageHasRefresh', crntPageElement && typeof crntPageElement.refresh === 'function');
  }

  // Routes
  page('*', scrollToTop, closeDrawer, function (ctx, next) {
    next();
  });

  page('/', function () {
    app.route = 'home';
    setFocus(app.route);
  });

  page(app.baseUrl, function () {
    app.route = 'home';
    setFocus(app.route);
  });

  page('/search/:names', function (data) {
    app.route = 'search';
    app.params = data.params;
    setFocus(app.route);
  });

  page('/cities', function () {
    app.route = 'cities';
    setFocus(app.route);
  });

  page('/cities/:names', function (data) {
    app.route = 'city-details';
    app.params = data.params;
    setFocus(app.route);
  });

  // 404
  page('*', function () {
    app.$.toast.text = 'Can\'t find: ' + window.location.href + '. Redirected you to Home Page';
    app.$.toast.show();
    page.redirect(app.baseUrl);
  });

  // add #! before urls
  page({
    hashbang: true
  });

  app.page = page;
});