import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {
  CreateProduct,
  Home,
  ProductPage,
  ProductSuccess,
  ReviewSplitView,
} from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <div class="App">
        <div class="App-header">
          <Switch>
            <Route path="/product/abc/review">
              <ReviewSplitView />
            </Route>
            <Route path="/product/abc/success">
              <ProductSuccess />
            </Route>
            <Route path="/product/abc">
              <ProductPage />
            </Route>
            <Route path="/product">
              <CreateProduct />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
