import { Component } from "solid-js";
import { I18nProvider } from "@amoutonbrady/solid-i18n";
import { Router, useRoutes } from "solid-app-router";
import { privateOnlyRoutes, publicOnlyRoutes, neutralRoutes } from "./routes";
import { dict } from "./translations";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import { Sidemenu } from "./components/Sidemenu/Sidemenu";
import { ToastContainer } from "./components/common/Toast/Toast";
import { HopeThemeConfig, HopeProvider } from "@hope-ui/solid";

// 2. Create a theme config to include custom colors, fonts, etc
const config: HopeThemeConfig = {
  lightTheme: {
    colors: {},
  },
};

const App: Component = () => {
  const Routes = useRoutes([...privateOnlyRoutes, ...publicOnlyRoutes, ...neutralRoutes]);

  return (
    <I18nProvider dict={dict} locale={"en"}>
      <HopeProvider config={config}>
        <Router>
          <AuthProvider>
            {useAuth()[0].user && <Sidemenu />}
            <Routes />
          </AuthProvider>
        </Router>
        <ToastContainer />
      </HopeProvider>
    </I18nProvider>
  );
};

export default App;
