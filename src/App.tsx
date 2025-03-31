import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { View, Authenticator } from "@aws-amplify/ui-react";
import { Navbar } from "./components/Navbar";
import { TodosView } from "./views/TodosView";
import { DataSourceView } from "./views/DataSourceView";
import { ApiKeysView } from "./views/ApiKeysView";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from '@aws-amplify/ui-react';
import theme from './theme';

// Ensure Amplify v2 configuration
Amplify.configure({
  // ...existing Amplify configuration...
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
                  <Route path="/apikeys" element={<ApiKeysView />} />
                  <Route path="*" element={<Navigate to="/todos" />} />
                </Routes>
              </View>
            </Router>
          )
        }
        }
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;