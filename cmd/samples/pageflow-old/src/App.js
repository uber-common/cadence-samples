import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import {
  CreateProduct,
  Home,
  ProductPage,
  ProductSuccess,
  ReviewSplitView,
} from './routes';
import './App.css';

const App = () => (
  <div class="App">
    <div class="App-header">
      <Switch>
        <Route exact path="/product/abc/review">
          <ReviewSplitView />
        </Route>
        <Route exact path="/product/abc/success">
          <ProductSuccess />
        </Route>
        <Route exact path="/product/abc">
          <ProductPage />
        </Route>
        <Route exact path="/product">
          <CreateProduct />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  </div>
);

export default App;
