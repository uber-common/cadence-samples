import {
  Route,
  Switch,
} from 'react-router-dom';
import {
  SimpleNavigationPage,
} from './components';
import {
  CreateProductPage,
  ProductSplitViewPage,
} from './routes';
import './App.css';

const App = () => (
  <div className="App">
    <div className="App-header">
      <Switch>
        <Route exact path="/products/:productName">
          <ProductSplitViewPage />
        </Route>
        <Route exact path="/products">
          <CreateProductPage />
        </Route>
        <Route exact path="/">
          <SimpleNavigationPage
            linkText="Create a new product"
            linkTo="/products"
            title="Product home page"
          />
        </Route>
        <Route>
          <SimpleNavigationPage
            title="Oops, couldn't find that page."
          />
        </Route>
      </Switch>
    </div>
  </div>
);

export default App;
