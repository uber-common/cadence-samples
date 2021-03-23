import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import {
  CreateProductPage,
  HomePage,
  ProductPage,
  ProductSuccessPage,
  ReviewSplitViewPage,
} from './routes';
import './App.css';

const App = () => (
  <div className="App">
    <div className="App-header">
      <Switch>
        <Route exact path="/products/:productId/review">
          <ReviewSplitViewPage />
        </Route>
        <Route exact path="/products/:productId/success">
          <ProductSuccessPage />
        </Route>
        <Route exact path="/products/:productId">
          <ProductPage />
        </Route>
        <Route exact path="/products">
          <CreateProductPage />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  </div>
);

export default App;
