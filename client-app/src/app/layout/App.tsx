import React, { useEffect, useContext } from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={"loading..."} />;

  return (
    <React.Fragment>
      <NavBar />
      <Container>
        <ActivityDashboard />
      </Container>
      <ul></ul>
    </React.Fragment>
  );
};
export default observer(App);
