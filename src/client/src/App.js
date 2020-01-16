import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/home/Home";
import Navbar from "./components/layouts/navbar/Navbar";
import Footer from "./components/layouts/footer/Footer";
import Admin from "./components/admin/Admin";
import SearchPage from "./components/searchPage/SearchPage";
import Property from "./components/property/Property";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <section className="container-box container-fluid">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/property/:id" component={Property} />
          </Switch>
        </section>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
