import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { View, Authenticator } from "@aws-amplify/ui-react";
import { Navbar } from "./components/Navbar";
import { TodosView } from "./views/TodosView";
import { DataSourceView } from "./views/DataSourceView";
import "@aws-amplify/ui-react/styles.css";

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        console.log("USER:", user);
        return (
          <Router>
            <View>
              <Navbar userPersona={user?.signInDetails?.loginId || "Unknown User"} onSignOut={signOut} />
              <Routes>
                <Route path="/todos" element={<TodosView />} />
                <Route path="/datasource" element={<DataSourceView />} />
                <Route path="*" element={<Navigate to="/todos" />} />
              </Routes>
            </View>
          </Router>
        )
      }
      }
    </Authenticator>
  );
}

export default App;