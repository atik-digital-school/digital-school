import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import KioskHome from "@/pages/kiosk-home";
import NavigatePage from "@/pages/navigate";
import NotFound from "@/pages/not-found";

function Router() {
    return (
        <Switch>
            <Route path="/" component={KioskHome} />
            <Route path="/navigate" component={NavigatePage} />
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Router />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
