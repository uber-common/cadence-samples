import {
  // Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import {
  CreateProductPage,
  ErrorPage,
  HomePage,
  ProductSplitViewPage,
} from './routes';
import './App.css';

const App = () => (
  <div className="App">
    <div className="App-header">
      <Switch>
        <Route exact path="/products/:productId">
          <ProductSplitViewPage />
        </Route>
        <Route exact path="/products">
          <CreateProductPage />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route>
          <ErrorPage />
        </Route>
      </Switch>
    </div>
  </div>
);

export default App;
