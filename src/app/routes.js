import React, {Component} from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {App, onChangeRoute} from './app';

import AboutView from './view/AboutView';

var menuOpen = false;

var AppRouting = (
  <Router history={hashHistory} onUpdate={onChangeRoute}>
    <Route path="/" component={App}>
      <IndexRoute component={AboutView} />
      <Route path="about" component={AboutView}/>
    </Route>
  </Router>
);

export default AppRouting;
