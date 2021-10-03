import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

const About = React.lazy(() => import(/* webpackChunkName:'about', webpackPrefetch: true */ './about'));
const My = React.lazy(() => import(/* webpackChunkName:'my' */ './my'));
const Home = React.lazy(() => import(/* webpackChunkName:'home' */ './home'));


const App = () => (
  <BrowserRouter>
    <Suspense fallback={null}>
      <Switch>
        <Route path='/home' component={Home}/>
        <Route path='/about' component={About}/>
        <Route path='/my' component={My}/>
        <Redirect from='/' to='/home' />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default App;
