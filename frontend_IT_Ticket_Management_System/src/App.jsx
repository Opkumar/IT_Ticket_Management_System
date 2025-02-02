import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'


function App() {
  return (
    <>
     <Header />
     <Outlet  />
     <Footer />
    </>
  )
}

export default App































// src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import SignUp from './components/Main/SignUp';
// import Login from './components/Main/Login';


// const App = () => {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;


