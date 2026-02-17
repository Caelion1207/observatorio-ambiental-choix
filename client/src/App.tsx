import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Metodologia from "./pages/Metodologia";
import Investigaciones from "./pages/Investigaciones";
import InvestigacionDetalle from "./pages/InvestigacionDetalle";
import DatosAbiertos from "./pages/DatosAbiertos";
import Participacion from "./pages/Participacion";
import Agente from "./pages/Agente";

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/metodologia"} component={Metodologia} />
        <Route path={"/investigaciones"} component={Investigaciones} />
        <Route path={"/investigaciones/:slug"} component={InvestigacionDetalle} />
        <Route path={"/datos-abiertos"} component={DatosAbiertos} />
        <Route path={"/participacion"} component={Participacion} />
        <Route path={"/agente"} component={Agente} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
