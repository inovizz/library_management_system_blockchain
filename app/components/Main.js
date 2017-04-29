import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from './Dashboard'

const Main = () => (
  <Switch>
    <Route exact path='/' component={Dashboard} />
  </Switch>
)

export default Main
